import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Captcha from '@/models/Captcha';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { generateAccessToken, generateRefreshToken } from '@/utils/token';
import connectDB from '@/config/db';

export const dynamic = "force-dynamic";
export async function POST(req) {
  const { email, password, captchaInput, captchaId } = await req.json();
await connectDB();
  // Verify CAPTCHA
  const captchaRecord = await Captcha.findOne({ captchaId });
  if (!captchaRecord || captchaRecord.captchaCode !== captchaInput) {
    return NextResponse.json({ message: 'Invalid CAPTCHA' }, { status: 200 });
  }

  // Check if user exists and password matches
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 200 });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.userId);
  const refreshToken = generateRefreshToken(user.userId);

  // Store or update the refresh token in the database
   await RefreshToken.findOneAndUpdate(
    { userId: user.userId }, // Query to match the user
    { userId: user.userId, token: refreshToken },
    {
      new: true,        // Return the updated document
      upsert: true,     // Insert a new document if no match is found
      setDefaultsOnInsert: true, // Apply schema defaults for new documents
    }
  );

  // Return tokens in response
  return NextResponse.json({
    message: 'Login successful',
    userId: user.userId,
    refreshToken,
    accessToken,
  });
}
