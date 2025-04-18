import Actor from '../models/Actror.js';
import mongoose from 'mongoose';

// GET /api/actors?page=1&limit=100
export const getAllActors = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
  
    try {
      const total = await Actor.countDocuments();
      const actors = await Actor.find().skip(skip).limit(limit);
  
      res.json({
        actors,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des acteurs" });
    }
  };
  

// GET /api/actors/:id → détail d’un acteur par ID
export const getActorById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const actor = await Actor.findById(id);
    if (!actor) {
      return res.status(404).json({ error: "Acteur non trouvé" });
    }
    res.json(actor);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l’acteur" });
  }
};

// GET /api/actors/search/:name → recherche par nom (regex)
export const searchActorsByName = async (req, res) => {
  const { name } = req.params;

  try {
    const regex = new RegExp(name, 'i');
    const actors = await Actor.find({ name: regex });

    if (!actors || actors.length === 0) {
      return res.status(404).json({ error: "Aucun acteur trouvé" });
    }

    res.json(actors);
  } catch (err) {
    res.status(500).json({ error: "Erreur de recherche", details: err.message });
  }
};

// GET /api/actors/:id/movies → liste des films de l’acteur
export const getActorMovies = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const actor = await Actor.findById(id);
    if (!actor) {
      return res.status(404).json({ error: "Acteur non trouvé" });
    }

    res.json(actor.movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des films" });
  }
};
