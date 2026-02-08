import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  heroImages: string[];
  aboutText: string;
  experienceYears: string;
  skills: string[];
  experiences: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  sampleWorks: {
    title: string;
    description: string;
    type: 'image' | 'video' | 'youtube';
    mediaUrls?: string[];
    youtubeUrl?: string;
  }[];
}

const PortfolioSchema: Schema = new Schema(
  {
    heroImages: {
      type: [String],
      default: [],
      validate: [arrayLimit, 'Hero images must be exactly 3'],
    },
    aboutText: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: String,
      default: '10+',
    },
    skills: {
      type: [String],
      default: [],
    },
    experiences: {
      type: [
        {
          title: { type: String, required: true },
          company: { type: String, required: true },
          period: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      default: [],
    },
    sampleWorks: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          type: { type: String, enum: ['image', 'video', 'youtube'], required: true },
          mediaUrls: { type: [String], default: [] },
          youtubeUrl: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

function arrayLimit(val: string[]) {
  return val.length <= 3;
}

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
