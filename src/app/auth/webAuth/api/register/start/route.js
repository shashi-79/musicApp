import WebAuthUser from '@/models/WebAuthUser';
import WebAuthRegisteringUser from '@/models/WebAuthRegisteringUser';
import generateChallenge from '@/utils/generateChallenge';
import connectDB from '@/config/db';
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    const { userId } = await req.json();
    
    await connectDB();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'UserId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await WebAuthUser.findOne({ userId });
    if (user) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const challenge = generateChallenge();

    const registeringUser = new WebAuthRegisteringUser({
      userId,
      challenge,
      credentials: [],
    });

    await registeringUser.save();

    return new Response(
      JSON.stringify({
        userId,
        challenge,
        rp: { name: 'MusicApp', id: 'musicapp-5wv9.onrender.com' },
        user: {
          id: Buffer.from(userId).toString('base64'),
          name: userId,
          displayName: `User ${userId}`,
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        timeout: 60000,
        attestation: 'direct',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in startRegistration:', error);
    return new Response(
      JSON.stringify({ message: 'Server error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
