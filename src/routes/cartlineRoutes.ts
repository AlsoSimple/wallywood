import { Router } from 'express';
import {
  getAllCartlines,
  getCartlinesByUserId,
  addToCart,
  updateCartline,
  removeFromCart,
  clearCart,
} from '../controllers/cartlineController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// ADMIN can see all carts
router.get('/', authenticate, authorize('ADMIN'), getAllCartlines);

// Users can manage their own cart
router.get('/user/:userId', authenticate, getCartlinesByUserId);
router.post('/', authenticate, addToCart);
router.put('/:userId/:posterId', authenticate, updateCartline);
router.delete('/:userId/:posterId', authenticate, removeFromCart);
router.delete('/user/:userId/clear', authenticate, clearCart);

export default router;
