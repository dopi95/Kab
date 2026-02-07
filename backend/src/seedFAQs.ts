import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FAQ from './models/FAQ';

dotenv.config();

const faqs = [
  {
    question: 'What services do you offer?',
    answer: 'Content creation, Video editing & production, branding visuals, and AI-assisted creative solutions.',
    order: 1,
    isActive: true,
  },
  {
    question: 'Who do you work with?',
    answer: 'Startups, creators, small businesses, and brands looking for premium creative output.',
    order: 2,
    isActive: true,
  },
  {
    question: 'Do you work remotely?',
    answer: 'Yes. We work with both local and international clients.',
    order: 3,
    isActive: true,
  },
  {
    question: 'How much do your services cost?',
    answer: 'Pricing depends on project scope and requirements. After a short discussion, a clear quote is provided.',
    order: 4,
    isActive: true,
  },
  {
    question: 'How long does a project take?',
    answer: 'Turnaround time varies by project, but most projects are delivered efficiently with agreed timelines upfront.',
    order: 5,
    isActive: true,
  },
  {
    question: 'Do you offer revisions?',
    answer: 'Yes. Revision terms are defined before the project starts to ensure clarity and efficiency.',
    order: 6,
    isActive: true,
  },
  {
    question: 'How do I get started?',
    answer: 'Call us @ +251 983 101 000, Contact us via WhatsApp +251 983 101 000 or email: Kabcreativelab@gmail.com with a brief description of your project, and we will take it from there.',
    order: 7,
    isActive: true,
  },
];

const seedFAQs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await FAQ.deleteMany({});
    console.log('Cleared existing FAQs');

    await FAQ.insertMany(faqs);
    console.log('FAQs seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
};

seedFAQs();
