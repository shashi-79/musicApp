import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware to ensure `userId` is set during an upsert operation
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate(); // Get the update object
  const options = this.getOptions(); // Get the query options

  // Check if this is an upsert (insert if not found)
  if (options.upsert) {
    // Set `userId` only if not provided
    if (!update.userId) {
      update.userId = this.getQuery()?._id || new mongoose.Types.ObjectId().toString();
      this.setUpdate(update);
    }
  }

  next();
});

// Check if the model already exists, if not, define it
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
