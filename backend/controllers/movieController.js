import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

// GET /api/movies → tous les films avec pagination
export const getAllMovies = async (req, res) => {
  try {
    // Récupérer les paramètres de pagination depuis la requête
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Compter le nombre total de films pour calculer le nombre total de pages
    const totalMovies = await Movie.countDocuments();
    
    // Récupérer les films pour la page demandée
    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .sort({ popularity: -1 }); // Trier par popularité
    
    // Renvoyer les films avec les métadonnées de pagination
    res.json({
      movies,
      pagination: {
        total: totalMovies,
        page,
        pages: Math.ceil(totalMovies / limit),
        limit
      }
    });
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

// GET /api/movies/search/:title → recherche par titre avec pagination
export const searchMoviesByTitle = async (req, res) => {
  const { title } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  try {
    const regex = new RegExp(title, 'i');
    
    // Compter le total de résultats pour la recherche
    const totalResults = await Movie.countDocuments({ title: regex });
    
    // Récupérer les résultats paginés
    const movies = await Movie.find({ title: regex })
      .skip(skip)
      .limit(limit)
      .sort({ popularity: -1 });
      
    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "Aucun film trouvé" });
    }
    
    res.json({
      movies,
      pagination: {
        total: totalResults,
        page,
        pages: Math.ceil(totalResults / limit),
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur de recherche", details: err.message });
  }
};

// GET /api/movies/genre/:name → films par genre avec pagination
export const getMoviesByGenre = async (req, res) => {
  try {
    const genre = req.params.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Compter le total de films pour ce genre
    const totalResults = await Movie.countDocuments({ genres: genre });
    
    // Récupérer les films paginés
    const movies = await Movie.find({ genres: genre })
      .skip(skip)
      .limit(limit)
      .sort({ popularity: -1 });
    
    res.json({
      movies,
      pagination: {
        total: totalResults,
        page,
        pages: Math.ceil(totalResults / limit),
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du filtrage par genre" });
  }
};