import mongoose from 'mongoose';
import Music from './Music'; // Import the Music model

const likeSchema = new mongoose.Schema({
  musicId: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Track users who liked the music
  dislikedBy: [{ type: String }], // Track users who disliked the music
});

// Method to handle likes
likeSchema.methods.toggleLike = async function (userId) {
  let rankingChange = 0;

  if (this.likedBy.includes(userId)) {
    // Remove like
    this.likedBy = this.likedBy.filter((id) => id !== userId);
    this.likes -= 1;
    rankingChange -= 2;
  } else {
    // Add like
    if (this.dislikedBy.includes(userId)) {
      // Remove dislike if it exists
      this.dislikedBy = this.dislikedBy.filter((id) => id !== userId);
      this.dislikes -= 1;
      rankingChange += 2; // Undo dislike impact
    }
    this.likedBy.push(userId);
    this.likes += 1;
    rankingChange += 2;
  }

  await this.save();
  await this.updateMusicRanking(rankingChange);
};

// Method to handle dislikes
likeSchema.methods.toggleDislike = async function (userId) {
  let rankingChange = 0;

  if (this.dislikedBy.includes(userId)) {
    // Remove dislike
    this.dislikedBy = this.dislikedBy.filter((id) => id !== userId);
    this.dislikes -= 1;
    rankingChange += 2;
  } else {
    // Add dislike
    if (this.likedBy.includes(userId)) {
      // Remove like if it exists
      this.likedBy = this.likedBy.filter((id) => id !== userId);
      this.likes -= 1;
      rankingChange -= 2; // Undo like impact
    }
    this.dislikedBy.push(userId);
    this.dislikes += 1;
    rankingChange -= 2;
  }

  await this.save();
  await this.updateMusicRanking(rankingChange);
};

// Method to update the ranking in the Music schema
likeSchema.methods.updateMusicRanking = async function (rankingChange) {
  try {
    const music = await Music.findOne({ musicId: this.musicId });
    if (music) {
      music.ranking += rankingChange;
      await music.save();
    }
  } catch (error) {
    console.error('Error updating music ranking:', error);
  }
};

// Check if the model already exists, if not, define it
const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

export default Like;
