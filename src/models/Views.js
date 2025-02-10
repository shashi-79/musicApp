import mongoose from 'mongoose';
import Music from './Music'; 

const viewSchema = new mongoose.Schema({
  musicId: {
    type: String, required: true, unique: true
  },
  views: {
    type: Number, default: 0
    },
    viewedBy: [{
      type: String, required: true
    }]
  });

  viewSchema.methods.toggleView = async function(userId) {
    try{
      
    if (this.viewedBy.includes(userId)) {
      
    } else {
      this.views += 1;
      this.viewedBy.push(userId);
      await this.save();
      await this.updateMusicRankingAndView();
    }
    
    }catch(error){
      console.log(error)
    }
  }

  viewSchema.methods.updateMusicRankingAndView = async function () {
    try {
      const music = await Music.findOne({
        musicId: this.musicId
      });
      console.log(music)
      if (music) {
        music.ranking += 1;
        music.views += 1;
        await music.save();
      }
    } catch (error) {
      console.error('Error updating music ranking:', error);
    }
  };


  const Views = mongoose.models.Views || mongoose.model('Views', viewSchema);

  export default Views;