import mongoose, { Document, Schema } from 'mongoose';

export interface IPricingPackage extends Document {
  name: string;
  category: 'event' | 'social_media';
  subtitle?: string;
  price: string;
  period?: string;
  currency: string;
  features: string[];
  accentColor: string;
  badgeColor?: string;
  isFeatured: boolean;
  isAddon?: boolean;
  isActive: boolean;
  order: number;
  ctaText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pricingPackageSchema = new Schema<IPricingPackage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['event', 'social_media'],
      default: 'event',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      trim: true,
      default: '',
    },
    currency: {
      type: String,
      default: 'ETB',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    accentColor: {
      type: String,
      default: '#e85d54',
      trim: true,
    },
    badgeColor: {
      type: String,
      default: '',
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAddon: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    ctaText: {
      type: String,
      default: 'SELECT',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

pricingPackageSchema.index({ category: 1, order: 1, createdAt: 1 });

export default mongoose.model<IPricingPackage>('PricingPackage', pricingPackageSchema);
