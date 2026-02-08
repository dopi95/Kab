import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: 'video' | 'photograph' | 'branding';
  type: 'video' | 'image' | 'youtube';
  mediaFiles: string[];
  youtubeUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['video', 'photograph', 'branding'],
      required: true,
    },
    type: {
      type: String,
      enum: ['video', 'image', 'youtube'],
      required: true,
    },
    mediaFiles: {
      type: [String],
      default: [],
    },
    youtubeUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', projectSchema);
