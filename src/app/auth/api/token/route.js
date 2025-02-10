import RefreshToken from "@/models/RefreshToken";
import { generateAccessToken, generateRefreshToken } from "@/utils/token";
import  connectToDatabase from "@/config/db";
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    // Parse the request body
    const { refreshToken, userId } = await req.json();

    // Validate input
    if (!refreshToken || !userId) {
      return new Response(JSON.stringify({ error: "Refresh token and user ID are required." }), {
        status: 400,
      });
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the refresh token exists in the database
    const storedToken = await RefreshToken.findOne({ token: refreshToken, userId });
    if (!storedToken) {
      return new Response(JSON.stringify({ error: "Invalid or expired refresh token." }), {
        status: 401,
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ userId });
    const newRefreshToken = generateRefreshToken(userId);

    // Update the refresh token in the database
    storedToken.token = newRefreshToken;
    await storedToken.save();

    // Return the new tokens
    return new Response(
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
