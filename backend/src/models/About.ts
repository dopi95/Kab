import mongoose, { Document, Schema } from 'mongoose';

export interface IAbout extends Document {
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const aboutSchema = new Schema<IAbout>(
  {
    content: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAbout>('About', aboutSchema);
