import express from 'express';
import {
  getAllMovies,
  searchByIdOrTitle,
  getMoviesByGenre
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/search/:param', searchByIdOrTitle);
router.get('/genre/:name', getMoviesByGenre);

export default router;
