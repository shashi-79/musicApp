import WebAuthUser from '@/models/WebAuthUser';
import generateChallenge from '@/utils/generateChallenge';
export const dynamic = "force-dynamic";
export async function POST(req) {
  const { userId } = await req.json();

  if (!userId) {
    return new Response(
      JSON.stringify({ message: 'UserId is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const user = await WebAuthUser.findOne({ userId });
  if (!user || user.credentials.length === 0) {
    return new Response(
      JSON.stringify({ message: 'User not found or not registered' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const challenge = generateChallenge();
  user.challenge = challenge;
  await user.save();

  return new Response(
    JSON.stringify({
      challenge,
      allowCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        type: 'public-key',
      })),
      timeout: 60000,
      rpId: 'localhost',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
