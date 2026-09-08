import mongoose, { Document, Schema } from 'mongoose';

export interface IPackageBooking extends Document {
  packageName: string;
  packageCategory: 'event' | 'social_media';
  packagePrice: string;
  packageCurrency: string;
  clientName: string;
  phone: string;
  email: string;
  eventDate?: {
    european?: string;
    ethiopianAmharic?: string;
    ethiopianEnglish?: string;
  };
  notes?: string;
  status: 'new' | 'read' | 'contacted' | 'completed';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const packageBookingSchema = new Schema<IPackageBooking>(
  {
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    packageCategory: {
      type: String,
      required: true,
      enum: ['event', 'social_media'],
    },
    packagePrice: {
      type: String,
      required: true,
      trim: true,
    },
    packageCurrency: {
      type: String,
      default: 'ETB',
    },
    clientName: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    eventDate: {
      european: { type: String, default: '' },
      ethiopianAmharic: { type: String, default: '' },
      ethiopianEnglish: { type: String, default: '' },
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'contacted', 'completed'],
      default: 'new',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

packageBookingSchema.index({ isRead: 1, createdAt: -1 });
packageBookingSchema.index({ packageCategory: 1, createdAt: -1 });

export default mongoose.model<IPackageBooking>('PackageBooking', packageBookingSchema);
