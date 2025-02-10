import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    musicId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Auto-adds createdAt and updatedAt
);

commentSchema.index({ musicId: 1, createdAt: -1 }); // Optimized indexing

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
