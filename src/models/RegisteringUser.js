import mongoose from 'mongoose';

const registeringUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: 300, default: Date.now }, // You can add `expires: 600` if needed
});

// Check if the model already exists, if not, define it
const RegisteringUser = mongoose.models.RegisteringUser || mongoose.model('RegisteringUser', registeringUserSchema);

export default RegisteringUser;
