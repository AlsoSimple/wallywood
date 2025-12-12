import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllRatings = async (req: AuthRequest, res: Response) => {
  try {
    const ratings = await prisma.userRating.findMany({
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
          },
        },
      },
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ratings' });
  }
};

export const getRatingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rating = await prisma.userRating.findUnique({
      where: { id: Number(id) },
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
          },
        },
      },
    });

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rating' });
  }
};

export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, posterId, numStars } = req.body;

    // Validate numStars is between 1-5
    if (numStars < 1 || numStars > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const rating = await prisma.userRating.create({
      data: {
        userId: Number(userId),
        posterId: Number(posterId),
        numStars: Number(numStars),
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        poster: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Rating created successfully', rating });
  } catch (error) {
    res.status(500).json({ error: 'Error creating rating' });
  }
};

export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { numStars } = req.body;

    // Validate numStars is between 1-5
    if (numStars < 1 || numStars > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const rating = await prisma.userRating.update({
      where: { id: Number(id) },
      data: { numStars: Number(numStars) },
    });

    res.status(200).json({ message: 'Rating updated successfully', rating });
  } catch (error) {
    res.status(500).json({ error: 'Error updating rating' });
  }
};

export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.userRating.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting rating' });
  }
};
