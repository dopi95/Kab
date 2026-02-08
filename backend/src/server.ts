import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';
import aboutRoutes from './routes/aboutRoutes';
import serviceRoutes from './routes/serviceRoutes';
import projectRoutes from './routes/projectRoutes';
import contactRoutes from './routes/contactRoutes';
import faqRoutes from './routes/faqRoutes';
import assetRoutes from './routes/assetRoutes';
import founderRoutes from './routes/founderRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Kab Creative Lab API is running!' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/founder', founderRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});