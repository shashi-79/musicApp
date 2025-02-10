import WebAuthUser from '@/models/WebAuthUser';
import RefreshToken from '@/models/RefreshToken';
import { generateAccessToken, generateRefreshToken } from '@/utils/token';
export const dynamic = "force-dynamic";
export async function POST(req) {
  const { userId, data } = await req.json();

  if (!userId || !data) {
    return new Response(
      JSON.stringify({ message: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const user = await WebAuthUser.findOne({ userId });
  if (!user) {
    return new Response(
      JSON.stringify({ message: 'User not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const clientDataJSON = JSON.parse(
    Buffer.from(data.response.clientDataJSON, 'base64').toString()
  );

  if (clientDataJSON.challenge !== user.challenge) {
    return new Response(
      JSON.stringify({ message: 'Invalid challenge' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  user.challenge = null; // Clear challenge
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user.userId);
  const refreshToken = generateRefreshToken(user.userId);

  await RefreshToken.findOneAndUpdate(
    { userId: user.userId },
    { userId: user.userId, token: refreshToken },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return new Response(
    JSON.stringify({
      success: true,
      userId: user.userId,
      refreshToken,
      accessToken,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
