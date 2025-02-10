import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  token: { type: String, required: true },
});

// Check if the model already exists, if not, define it
const RefreshToken = mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
