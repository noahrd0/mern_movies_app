import Movie from '../models/Movie.js';
import User from '../models/UserModel.js';
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

// POST /api/movies/comments/:id → ajouter un commentaire
export const addCommentToMovie = async (req, res) => {
  const { id } = req.params;
  const { text, rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  if (!rating) {
    return res.status(400).json({ error: "Note requise" });
  }

  try {

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Si l'utilisateur a dejà commenté ce film, on met à jour le commentaire
    const existingComment = movie.comments.find(comment => comment.userId.toString() === userId);
    if (existingComment) {
      existingComment.content = text;
      existingComment.rating = rating;
    } else {
      // Sinon, on ajoute le commentaire
      movie.comments.push({ userId: userId, userName: user.name, content: text, rating });
    }
    await movie.save();

    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
};

// GET /api/movies/filter?search=&genre=&page=
export const filterMovies = async (req, res) => {
  const { search = '', genre = '', page = 1 } = req.query;
  const limit = 100;
  const skip = (parseInt(page) - 1) * limit;

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

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query).skip(skip).limit(limit);

    res.json({
      movies,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du filtrage", details: err.message });
  }
};

