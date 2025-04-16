import mongoose from 'mongoose';

const castSchema = new mongoose.Schema({
  id: Number,
  name: String,
  character: String,
  profile_path: String
}, { _id: false });

const movieSchema = new mongoose.Schema({
  id_tmdb: Number,
  title: String,
  original_title: String,
  overview: String,
  release_date: String,
  vote_average: Number,
  poster_path: String,
  genres: [String],
  language: String,
  runtime: Number,
  popularity: Number,
  cast: [castSchema]  // 👈 Ajout du casting
});

export default mongoose.model('Movie', movieSchema);
