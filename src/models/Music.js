import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  musicId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  languages: [{ type: String }],
  logoPath: { type: String, required: true },
  manifestPath: { type: String, required: true },
  ranking: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  viewedBy:[{type:String,required:true}]
});

// Static method to fetch suggestions
musicSchema.statics.getSuggestions = async function (page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  return this.find({})
    .sort({ ranking: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Check if the model already exists, if not, define it
const Music = mongoose.models.Music || mongoose.model('Music', musicSchema);

export default Music;
