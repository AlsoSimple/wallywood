import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllCartlines = async (req: AuthRequest, res: Response) => {
  try {
    const cartlines = await prisma.cartline.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        poster: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            image: true,
          },
        },
      },
    });
    res.status(200).json(cartlines);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};

export const getCartlinesByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const cartlines = await prisma.cartline.findMany({
      where: { userId: Number(userId) },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            image: true,
            stock: true,
          },
        },
      },
    });

    res.status(200).json(cartlines);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, posterId, quantity } = req.body;

    // Check if item already exists in cart
    const existing = await prisma.cartline.findUnique({
      where: {
        userId_posterId: {
          userId: Number(userId),
          posterId: Number(posterId),
        },
      },
    });

    if (existing) {
      // Update quantity if already in cart
      const updated = await prisma.cartline.update({
        where: {
          userId_posterId: {
            userId: Number(userId),
            posterId: Number(posterId),
          },
        },
        data: { quantity: existing.quantity + Number(quantity) },
        include: {
          poster: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      });
      return res.status(200).json({ message: 'Cart updated', cartline: updated });
    }

    // Create new cart item
    const cartline = await prisma.cartline.create({
      data: {
        userId: Number(userId),
        posterId: Number(posterId),
        quantity: Number(quantity),
      },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Added to cart', cartline });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

export const updateCartline = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, posterId } = req.params;
    const { quantity } = req.body;

    const cartline = await prisma.cartline.update({
      where: {
        userId_posterId: {
          userId: Number(userId),
          posterId: Number(posterId),
        },
      },
      data: { quantity: Number(quantity) },
    });

    res.status(200).json({ message: 'Cart updated', cartline });
  } catch (error) {
    res.status(500).json({ error: 'Error updating cart' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, posterId } = req.params;

    await prisma.cartline.delete({
      where: {
        userId_posterId: {
          userId: Number(userId),
          posterId: Number(posterId),
        },
      },
    });

    res.status(200).json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing from cart' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    await prisma.cartline.deleteMany({
      where: { userId: Number(userId) },
    });

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing cart' });
  }
};
