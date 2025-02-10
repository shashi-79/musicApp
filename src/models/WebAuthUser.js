import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  counter: { type: Number, default: 0 },
});

const webAuthUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  challenge: { type: String, default: null },
  credentials: [credentialSchema],
});

// Check if the model already exists, if not, define it
const WebAuthUser = mongoose.models.WebAuthUser || mongoose.model('WebAuthUser', webAuthUserSchema);

export default WebAuthUser;
