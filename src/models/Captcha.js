import mongoose from 'mongoose';

const captchaSchema = new mongoose.Schema({
  captchaId: { type: String, unique: true },
  captchaCode: String,
  createdAt: { type: Date, expires: 300, default: Date.now }, // Expires in 5 minutes
});

// Check if the model already exists, if not, define it
const Captcha = mongoose.models.Captcha || mongoose.model('Captcha', captchaSchema);

export default Captcha;
