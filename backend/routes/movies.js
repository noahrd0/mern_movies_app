import express from 'express';
import {
  getAllMovies,
  getMovieById,
  searchMoviesByTitle,
  getMoviesByGenre
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/search/:title', searchMoviesByTitle);
router.get('/genre/:name', getMoviesByGenre);
router.get('/:id', getMovieById); // ⚠️ doit être le dernier

export default router;
