import { NextResponse } from "next/server";
import RefreshToken from "@/models/RefreshToken";
import { generateAccessToken, generateRefreshToken } from "@/utils/token";
import connectToDatabase from "@/config/db";

export const dynamic = "force-dynamic"; // Ensure dynamic API handling

export async function POST(req) {
  try {
    // Parse request body safely
    const body = await req.json();
    const { refreshToken, userId } = body;

    if (!refreshToken || !userId) {
      return NextResponse.json({ error: "Refresh token and user ID are required." }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Find refresh token in the database
    const storedToken = await RefreshToken.findOne({ token: refreshToken, userId });

    if (!storedToken) {
      return NextResponse.json({ error: "Invalid or expired refresh token." }, { status: 401 });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ userId });
    const newRefreshToken = generateRefreshToken(userId);

    // Update the refresh token in the database
    storedToken.token = newRefreshToken;
    await storedToken.save();

    // Return new tokens
    return NextResponse.json(
      { accessToken: newAccessToken, refreshToken: newRefreshToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}