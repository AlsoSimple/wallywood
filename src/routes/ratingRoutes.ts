import { Router } from 'express';
import {
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deleteRating,
} from '../controllers/ratingController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllRatings);
router.get('/:id', getRatingById);

// Protected routes (authenticated users can create/update their own ratings)
router.post('/', authenticate, createRating);
router.put('/:id', authenticate, updateRating);

// ADMIN only
router.delete('/:id', authenticate, authorize('ADMIN'), deleteRating);

export default router;
