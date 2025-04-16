import express from 'express';
import { verifyToken } from '../config/auth.js';
import {
  getAllMovies,
  filterMovies,
  getMovieById,
  searchMoviesByTitle,
  getMoviesByGenre,
  addCommentToMovie,
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/filter', filterMovies);
router.get('/search/:title', searchMoviesByTitle);
router.get('/genre/:name', getMoviesByGenre);
router.post('/comments/:id', verifyToken, addCommentToMovie);
router.get('/:id', getMovieById); // doit être le dernier

export default router;
