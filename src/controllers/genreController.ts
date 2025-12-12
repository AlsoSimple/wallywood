import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllGenres = async (req: AuthRequest, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        posters: {
          include: {
            poster: true,
          },
        },
      },
    });
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching genres' });
  }
};

export const getGenreById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const genre = await prisma.genre.findUnique({
      where: { id: Number(id) },
      include: {
        posters: {
          include: {
            poster: true,
          },
        },
      },
    });

    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }

    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching genre' });
  }
};

export const createGenre = async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug } = req.body;

    const genre = await prisma.genre.create({
      data: { title, slug },
    });

    res.status(201).json({ message: 'Genre created successfully', genre });
  } catch (error) {
    res.status(500).json({ error: 'Error creating genre' });
  }
};

export const updateGenre = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug } = req.body;

    const genre = await prisma.genre.update({
      where: { id: Number(id) },
      data: { title, slug },
    });

    res.status(200).json({ message: 'Genre updated successfully', genre });
  } catch (error) {
    res.status(500).json({ error: 'Error updating genre' });
  }
};

export const deleteGenre = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.genre.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting genre' });
  }
};
