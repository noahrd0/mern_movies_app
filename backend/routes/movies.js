import express from 'express';
import {
  getAllMovies,
  getMovieById,
  searchMoviesByTitle,
  getMoviesByGenre
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.get('/search/title', searchMoviesByTitle);
router.get('/genre/:name', getMoviesByGenre);

export default router;
