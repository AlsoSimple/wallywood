import { Router } from 'express';
import {
  getAllGenrePosterRels,
  createGenrePosterRel,
  deleteGenrePosterRel,
} from '../controllers/genrePosterRelController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllGenrePosterRels);

// Protected routes (ADMIN only)
router.post('/', authenticate, authorize('ADMIN'), createGenrePosterRel);
router.delete('/:genreId/:posterId', authenticate, authorize('ADMIN'), deleteGenrePosterRel);

export default router;
