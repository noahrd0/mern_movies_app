import mongoose from 'mongoose';

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
  popularity: Number
});

export default mongoose.model('Movie', movieSchema);
