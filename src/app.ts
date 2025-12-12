import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/userRoutes';
import posterRoutes from './routes/posterRoutes';
import genreRoutes from './routes/genreRoutes';
import authRoutes from './routes/authRoutes';
import ratingRoutes from './routes/ratingRoutes';
import cartlineRoutes from './routes/cartlineRoutes';
import genrePosterRelRoutes from './routes/genrePosterRelRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/cartlines', cartlineRoutes);
app.use('/api/genre-poster-rel', genrePosterRelRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Wallywood API is running' });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Wallywood API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      posters: '/api/posters',
      genres: '/api/genres',
      ratings: '/api/ratings',
      cartlines: '/api/cartlines',
      genrePosterRel: '/api/genre-poster-rel',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
