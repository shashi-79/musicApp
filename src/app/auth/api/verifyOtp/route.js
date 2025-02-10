import RegisteringUser from '@/models/RegisteringUser';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { generateAccessToken, generateRefreshToken } from '@/utils/token';
import connectDB from '@/config/db';
export const dynamic = "force-dynamic";
export async function POST(req) {
  const { email, otp } = await req.json();

  try {
    await connectDB();
    // Find the registering user with the matching email and OTP
    const registeringUser = await RegisteringUser.findOne({ email, otp });

    if (!registeringUser) {
      return new Response(
        JSON.stringify({ message: 'Invalid or expired OTP', success: false }),
        { status: 200 }
      );
    }

    // Move the user from RegisteringUser to User
    const user = await User.findOneAndUpdate(
      { email }, // Query to match the email
      { email, password: registeringUser.password }, // Update fields
      {
        new: true,        // Return the updated document
        upsert: true,     // Insert a new document if no match is found
        setDefaultsOnInsert: true, // Apply schema defaults for new documents
      }
    );

    // Generate tokens
    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    // Save the refresh token
    await RefreshToken.findOneAndUpdate(
      { userId: user.userId },
      { userId: user.userId, token: refreshToken },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // Return tokens and success message
    return new Response(
      JSON.stringify({
        message: 'Email verified successfully',
        success: true,
        userId: user.userId,
        refreshToken,
        accessToken,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', success: false }),
      { status: 500 }
    );
  }
}
