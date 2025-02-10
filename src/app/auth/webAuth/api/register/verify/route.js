import WebAuthUser from '@/models/WebAuthUser';
import WebAuthRegisteringUser from '@/models/WebAuthRegisteringUser';
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    const { userId, credential } = await req.json();

    if (!userId || !credential) {
      return new Response(
        JSON.stringify({ message: 'Invalid request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const registeringUser = await WebAuthRegisteringUser.findOne({ userId });
    if (!registeringUser) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const clientDataJSON = JSON.parse(
      Buffer.from(credential.response.clientDataJSON, 'base64').toString()
    );

    if (clientDataJSON.challenge !== registeringUser.challenge) {
      return new Response(
        JSON.stringify({ message: 'Invalid challenge' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const attestationObject = Buffer.from(credential.response.attestationObject, 'base64');
    const authData = attestationObject.slice(37);
    const publicKey = authData.slice(0, -2);

    registeringUser.credentials.push({
      id: credential.id,
      publicKey: publicKey.toString('base64'),
      counter: 0,
    });
    registeringUser.challenge = null;

    await registeringUser.save();

    const userObject = registeringUser.toObject();
    delete userObject._id;

    const user = new WebAuthUser(userObject);
    await user.save();

    await WebAuthRegisteringUser.deleteOne({ userId });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verifyRegistration:', error);
    return new Response(
      JSON.stringify({ message: 'Server error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
