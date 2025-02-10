import mongoose from "mongoose";
import Music from './Music';

const watchTimeSchema = new mongoose.Schema({
  musicId: {
    type: String, required: true
  }, // Music/Video being watched
  watchTime: {
    type: Number, default: 0
    }, // Total watch time in seconds
    lastUpdated: {
      type: Date, default: Date.now
    }, // Track when updated
  });

  watchTimeSchema.methods.toggleWatchTime = async function(userId) {
    try {

      this.watchTime += 10;
      this.lastUpdated = Date.now()
      await this.save();
      await this.updateMusicRanking();


    }catch(error) {
      console.log(error)
    }
  }

  watchTimeSchema.methods.updateMusicRanking = async function () {
    try {
      const music = await Music.findOne({
        musicId: this.musicId
      });
      
      if (music) {
        music.ranking += 0.01;
        await music.save();
      }
    } catch (error) {
      console.error('Error updating music ranking:', error);
    }
  };
  // Create a model
  const WatchTime = mongoose.models.WatchTime || mongoose.model("WatchTime", watchTimeSchema);

  export default WatchTime;