import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllGenrePosterRels = async (req: AuthRequest, res: Response) => {
  try {
    const relations = await prisma.genrePosterRel.findMany({
      include: {
        genre: true,
        poster: true,
      },
    });
    res.status(200).json(relations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching genre-poster relations' });
  }
};

export const createGenrePosterRel = async (req: AuthRequest, res: Response) => {
  try {
    const { genreId, posterId } = req.body;

    const relation = await prisma.genrePosterRel.create({
      data: {
        genreId: Number(genreId),
        posterId: Number(posterId),
      },
      include: {
        genre: true,
        poster: true,
      },
    });

    res.status(201).json({ message: 'Relation created successfully', relation });
  } catch (error) {
    res.status(500).json({ error: 'Error creating relation' });
  }
};

export const deleteGenrePosterRel = async (req: AuthRequest, res: Response) => {
  try {
    const { genreId, posterId } = req.params;

    await prisma.genrePosterRel.delete({
      where: {
        genreId_posterId: {
          genreId: Number(genreId),
          posterId: Number(posterId),
        },
      },
    });

    res.status(200).json({ message: 'Relation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting relation' });
  }
};
