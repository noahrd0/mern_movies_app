import express from 'express';
import {
  getAllActors,
  getActorById,
  searchActorsByName,
  getActorMovies
} from '../controllers/actorController.js';

const router = express.Router();

router.get('/', getAllActors);
router.get('/search/:name', searchActorsByName);
router.get('/:id/movies', getActorMovies);
router.get('/:id', getActorById); // 👈 placé en dernier pour ne pas bloquer /search

export default router;
