import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User'; // Adjust the import based on your project structure
import RefreshToken from '@/models/RefreshToken';
import dbConnect from '@/config/db'; // Ensure your database connection utility is included
export const dynamic = "force-dynamic";
export async function DELETE(req) {
  try {
    await dbConnect();

    const { refreshToken, userId } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token is required.' }, { status: 401 });
    }

    // Check if the refresh token exists
    const token = await RefreshToken.findOne({ token: refreshToken, userId });

    if (!token) {
      return NextResponse.json({ message: 'Not logged in.' }, { status: 401 });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ userId });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Delete the refresh token and user from the database
    await RefreshToken.deleteOne({ token: refreshToken, userId });
    await User.deleteOne({ userId });

    return NextResponse.json({ message: 'User account deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
