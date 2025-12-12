import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllPosters = async (req: AuthRequest, res: Response) => {
  try {
    const posters = await prisma.poster.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        ratings: true,
      },
    });
    res.status(200).json(posters);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posters' });
  }
};

export const getPosterById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const poster = await prisma.poster.findUnique({
      where: { id: Number(id) },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });

    if (!poster) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    res.status(200).json(poster);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching poster' });
  }
};

export const createPoster = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, image, width, height, price, stock } = req.body;

    const poster = await prisma.poster.create({
      data: {
        name,
        slug,
        description,
        image,
        width,
        height,
        price,
        stock,
      },
    });

    res.status(201).json({ message: 'Poster created successfully', poster });
  } catch (error) {
    res.status(500).json({ error: 'Error creating poster' });
  }
};

export const updatePoster = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, width, height, price, stock } = req.body;

    const poster = await prisma.poster.update({
      where: { id: Number(id) },
      data: { name, slug, description, image, width, height, price, stock },
    });

    res.status(200).json({ message: 'Poster updated successfully', poster });
  } catch (error) {
    res.status(500).json({ error: 'Error updating poster' });
  }
};

export const deletePoster = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.poster.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Poster deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting poster' });
  }
};
