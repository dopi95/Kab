import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project';

dotenv.config();

const projects = [
  {
    title: 'Brand Campaign Video',
    description: 'A stunning brand campaign that increased engagement by 300%',
    category: 'video',
    type: 'youtube',
    mediaFiles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isActive: true,
    order: 1,
  },
  {
    title: 'Product Photography',
    description: 'Professional product photography for e-commerce excellence',
    category: 'photograph',
    type: 'image',
    mediaFiles: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    isActive: true,
    order: 2,
  },
  {
    title: 'Corporate Branding Design',
    description: 'Complete corporate identity and graphic design solution',
    category: 'branding',
    type: 'image',
    mediaFiles: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
    isActive: true,
    order: 3,
  },
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await Project.deleteMany({});
    console.log('Cleared existing projects');

    await Project.insertMany(projects);
    console.log('Projects seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
