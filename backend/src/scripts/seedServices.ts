import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service';

dotenv.config();

const services = [
  {
    title: 'Video Production',
    description: 'Professional video content that captures attention and drives engagement',
    icon: 'FaVideo',
    isActive: true,
    order: 1,
  },
  {
    title: 'Visual Branding',
    description: 'Distinctive brand identities that stand out in the market',
    icon: 'FaPalette',
    isActive: true,
    order: 2,
  },
  {
    title: 'AI Content',
    description: 'Smart content solutions powered by cutting-edge AI technology',
    icon: 'FaRobot',
    isActive: true,
    order: 3,
  },
  {
    title: 'Photography',
    description: 'Stunning visuals that tell your brand story perfectly',
    icon: 'FaCamera',
    isActive: true,
    order: 4,
  },
  {
    title: 'Marketing',
    description: 'Strategic campaigns that convert attention into results',
    icon: 'FaBullhorn',
    isActive: true,
    order: 5,
  },
  {
    title: 'Web Design',
    description: 'Modern, responsive websites that deliver exceptional experiences',
    icon: 'FaCode',
    isActive: true,
    order: 6,
  },
  {
    title: 'Video Editing',
    description: 'Expert video editing services to bring your vision to life',
    icon: 'FaVideo',
    isActive: true,
    order: 7,
  },
  {
    title: 'Social Media Management',
    description: 'Comprehensive social media strategy and content management',
    icon: 'FaChartLine',
    isActive: true,
    order: 8,
  },
  {
    title: 'Photoshop Services',
    description: 'Professional photo editing and graphic design with Photoshop',
    icon: 'FaPalette',
    isActive: true,
    order: 9,
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await Service.deleteMany({});
    console.log('Cleared existing services');

    await Service.insertMany(services);
    console.log('Services seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

seedServices();
