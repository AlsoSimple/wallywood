import { Router } from 'express';
import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genreController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllGenres);
router.get('/:id', getGenreById);

// Protected routes (ADMIN only)
router.post('/', authenticate, authorize('ADMIN'), createGenre);
router.put('/:id', authenticate, authorize('ADMIN'), updateGenre);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteGenre);

export default router;
