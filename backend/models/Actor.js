import mongoose from 'mongoose';

const movieRefSchema = new mongoose.Schema({
  id_tmdb: Number,
  title: String,
  release_date: String,
  character: String
}, { _id: false });

const actorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  profile_path: String,
  movies: [movieRefSchema]
});

export default mongoose.model('Actor', actorSchema);
