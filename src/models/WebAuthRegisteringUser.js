import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  counter: { type: Number, default: 0 },
});

const WebAuthRegisteringUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: false },
  challenge: { type: String, default: '' },
  credentials: [credentialSchema],
  createdAt: { type: Date, expires: 300, default: Date.now },
});

// Check if the model already exists, if not, define it
const WebAuthRegisteringUser = mongoose.models.WebAuthRegisteringUser || mongoose.model('WebAuthRegisteringUser', WebAuthRegisteringUserSchema);

export default WebAuthRegisteringUser;
