import bcrypt from 'bcryptjs';
import Captcha from '@/models/Captcha';
import RegisteringUser from '@/models/RegisteringUser';
import User from '@/models/User';
import  transporter  from '@/config/mailer';
import connectDB from '@/config/db';

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
export const dynamic = "force-dynamic";
export async function POST(req) {
  const { email, password, captchaInput, captchaId } = await req.json();

await connectDB();
  try {
    // Verify CAPTCHA
    const captchaRecord = await Captcha.findOne({ captchaId });
    if (!captchaRecord || captchaRecord.captchaCode !== captchaInput) {
      return new Response(
        JSON.stringify({ message: 'Invalid CAPTCHA' }),
        { status: 200 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already registered' }),
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Update or create registering user
    await RegisteringUser.findOneAndUpdate(
      { email }, // Query to match the email
      {
        email,
        password: hashPassword,
        otp,
      },
      {
        new: true,        // Return the updated document
        upsert: true,     // Insert a new document if no match is found
        setDefaultsOnInsert: true, // Apply schema defaults for new documents
      }
    );

    // Send OTP via email
    const mailOptions = {
      from: 'verify01234@gmail.com',
      to: email,
      subject: 'OTP for Email Verification',
      text: `Your OTP code is ${otp}`,
    };

    try {
      const mailResponse = await (await transporter()).sendMail(mailOptions);
      console.log("Mail sent:", mailResponse);
    } catch (error) {
      console.error("Mail sending error:", error);
    }

    return new Response(
      JSON.stringify({ message: 'Please verify OTP', success: true }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
