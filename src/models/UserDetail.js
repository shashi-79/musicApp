import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  pic: String,
  banner: String,
  waterMark: String,
  contact: String,
  about: String,
});

// Check if the model already exists, if not, define it
const UserDetail = mongoose.models.UserDetail || mongoose.model('UserDetail', userSchema);

export default UserDetail;
