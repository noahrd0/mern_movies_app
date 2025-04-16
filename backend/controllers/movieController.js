import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

// GET /api/movies → tous les films
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().limit(100);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/movies/:id → film par ID
export const getMovieById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du film" });
  }
};

// GET /api/movies/search/:title → recherche par titre
export const searchMoviesByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const regex = new RegExp(title, 'i');
    const movies = await Movie.find({ title: regex });

    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "Aucun film trouvé" });
    }

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur de recherche", details: err.message });
  }
};

// GET /api/movies/genre/:name → films par genre
export const getMoviesByGenre = async (req, res) => {
  try {
    const genre = req.params.name;
    const movies = await Movie.find({ genres: genre });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du filtrage par genre" });
  }
};

// GET /api/movies/filter?search=&genre=
export const filterMovies = async (req, res) => {
  const { search = '', genre = '' } = req.query;

  try {
    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: regex },
        { director: regex }
      ];
    }

    if (genre) {
      query.genres = genre;
    }

    const movies = await Movie.find(query);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du filtrage", details: err.message });
  }
};
