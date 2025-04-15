import Movie from '../models/Movie.js';

// GET /api/movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().limit(100);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/movies/:id
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Film non trouvé" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/movies/search?title=...
export const searchMoviesByTitle = async (req, res) => {
  try {
    const title = req.query.title;
    const movies = await Movie.find({ title: new RegExp(title, "i") });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
};

// GET /api/movies/genre/:name
export const getMoviesByGenre = async (req, res) => {
  try {
    const genre = req.params.name;
    const movies = await Movie.find({ genres: genre });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du filtrage par genre" });
  }
};
