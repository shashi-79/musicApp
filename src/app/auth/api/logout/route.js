import { NextResponse } from 'next/server';
import RefreshToken from '@/models/RefreshToken'; // Adjust the path based on your project structure
import dbConnect from '@/config/db'; // Ensure your database connection utility is included
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    await dbConnect();

    const { refreshToken, userId } = await req.json();

    if (!refreshToken || !userId) {
      return NextResponse.json({ message: 'Refresh token and userId are required.' }, { status: 401 });
    }

    const token = await RefreshToken.findOne({ token: refreshToken, userId });

    if (!token) {
      return NextResponse.json({ message: 'Not logged in or token not found.' }, { status: 200 });
    }

    const deleteResult = await RefreshToken.deleteOne({ token: refreshToken, userId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ message: 'Failed to log out.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Logged out successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
