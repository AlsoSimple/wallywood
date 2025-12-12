import { Router } from 'express';
import {
  getAllPosters,
  getPosterById,
  createPoster,
  updatePoster,
  deletePoster,
} from '../controllers/posterController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllPosters);
router.get('/:id', getPosterById);

// Protected routes (ADMIN only)
router.post('/', authenticate, authorize('ADMIN'), createPoster);
router.put('/:id', authenticate, authorize('ADMIN'), updatePoster);
router.delete('/:id', authenticate, authorize('ADMIN'), deletePoster);

export default router;
