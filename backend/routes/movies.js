import express from 'express';
import {
  getAllMovies,
  filterMovies,
  getMovieById,
  searchMoviesByTitle,
  getMoviesByGenre
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/filter', filterMovies);
router.get('/search/:title', searchMoviesByTitle);
router.get('/genre/:name', getMoviesByGenre);
router.get('/:id', getMovieById);

export default router;
