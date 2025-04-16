import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

// GET /api/movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().limit(100);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/movies/search/:param → par ID ou titre
export const searchByIdOrTitle = async (req, res) => {
  const { param } = req.params;

  try {
    // Vérifie si le param est un ObjectId valide
    if (mongoose.Types.ObjectId.isValid(param)) {
      const movie = await Movie.findById(param);
      if (movie) {
        return res.json(movie); // trouvé par ID, on sort direct
      }
    }

    // Sinon, on cherche par titre (regex insensible à la casse)
    const regex = new RegExp(param, 'i');
    const movies = await Movie.find({ title: regex });

    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "Aucun film trouvé" });
    }

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche", details: err.message });
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
