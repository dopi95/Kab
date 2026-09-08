import { Request, Response } from 'express';
import PricingPackage, { IPricingPackage } from '../models/PricingPackage';

// Default initial packages seeded if database is empty
const INITIAL_PACKAGES = [
  // 1. EVENT PACKAGES
  {
    name: 'Essential',
    category: 'event',
    price: '25,000',
    period: 'per event',
    currency: 'ETB',
    features: [
      '1 Shooter',
      'Full Event Coverage',
      'Unlimited Edited Soft-Copy Photos',
      'Basic Lighting Setup',
      '20 Printed Photos',
    ],
    accentColor: '#e85d54',
    isFeatured: false,
    order: 1,
  },
  {
    name: 'Standard',
    category: 'event',
    price: '35,000',
    period: 'per event',
    currency: 'ETB',
    features: [
      '2 Cameras & 2 Shooters',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Unlimited Edited Soft-Copy Photos',
      'Standard Lighting Setup',
      'Wireless Audio & Gimbal',
      '50 Printed Photos & Album',
    ],
    accentColor: '#1d8cf8',
    isFeatured: false,
    order: 2,
  },
  {
    name: 'Professional',
    category: 'event',
    price: '45,000',
    period: 'per event',
    currency: 'ETB',
    features: [
      '2 Cameras & 2 Shooters',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Optional Family & Friends Interviews',
      'Unlimited Edited Soft-Copy Photos',
      'Advanced Lighting Setup',
      'Wireless Audio & Gimbal',
      '100 Printed Photos & Album',
    ],
    accentColor: '#10b981',
    isFeatured: false,
    order: 3,
  },
  {
    name: 'Signature',
    category: 'event',
    price: '55,000',
    period: 'per event',
    currency: 'ETB',
    features: [
      '2 Cameras & 2 Shooters',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Family & Friends Interviews',
      'Unlimited Edited Soft-Copy Photos',
      'Premium Lighting Setup',
      'Wireless Audio & Gimbal',
      '100 Printed Photos & Premium Album',
    ],
    accentColor: '#8b5cf6',
    isFeatured: false,
    order: 4,
  },
  {
    name: 'Elite',
    category: 'event',
    subtitle: '3 CAMERAS (2 VIDEO + 1 PHOTO)',
    price: '69,000',
    period: 'per event',
    currency: 'ETB',
    features: [
      '3 Cameras & 3 Shooters',
      '2 Video + 1 Photo Dedicated',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Family & Friends Interviews',
      'Unlimited Edited Soft-Copy Photos',
      'Premium+ Lighting Setup',
      'Wireless Audio & Gimbal',
      '100 Printed Photos & Premium Album',
    ],
    accentColor: '#f59e0b',
    isFeatured: true,
    order: 5,
  },

  // 2. SOCIAL MEDIA PACKAGES
  {
    name: 'Basic',
    category: 'social_media',
    price: '14,700',
    period: 'per month',
    currency: 'ETB',
    features: [
      '8 edited videos',
      'Content Strategy & Planning',
    ],
    accentColor: '#e85d54',
    badgeColor: '#e85d54',
    isFeatured: false,
    order: 1,
  },
  {
    name: 'Standard',
    category: 'social_media',
    price: '27,900',
    period: 'per month',
    currency: 'ETB',
    features: [
      '12 edited videos',
      'Content Strategy & Planning',
      'Engaging Video Editing',
      'Community Engagement',
      'Monthly Performance Report',
    ],
    accentColor: '#1d8cf8',
    badgeColor: '#1d8cf8',
    isFeatured: true,
    order: 2,
  },
  {
    name: 'Premium',
    category: 'social_media',
    price: '50,000',
    period: 'per month',
    currency: 'ETB',
    features: [
      '20 edited videos',
      '2 Add on',
      '8 Graphics designed post',
      'Content Strategy & Planning',
      'Advanced Video Editing',
      'Full Community Engagement',
      'Monthly Performance Report',
    ],
    accentColor: '#f59e0b',
    badgeColor: '#f59e0b',
    isFeatured: false,
    order: 3,
  },
  {
    name: 'Add-on',
    category: 'social_media',
    price: 'Add-on',
    period: '',
    currency: '',
    features: [
      'Events',
      'V-log',
      'Documentary',
      'Interview',
      'Graphics',
    ],
    accentColor: '#00e676',
    badgeColor: '#e85d54',
    isAddon: true,
    isFeatured: false,
    order: 4,
  },
];

// Helper to seed if empty
const seedIfEmpty = async () => {
  const count = await PricingPackage.countDocuments();
  if (count === 0) {
    await PricingPackage.insertMany(INITIAL_PACKAGES);
  }
};

// @desc    Get active pricing packages (public) with optional ?category= filter
// @route   GET /api/pricing-packages
// @access  Public
export const getActivePricingPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    await seedIfEmpty();

    const { category } = req.query;
    const filter: Record<string, any> = { isActive: true };

    if (category && (category === 'event' || category === 'social_media')) {
      filter.category = category;
    }

    const packages = await PricingPackage.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json(packages);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching pricing packages', error: error.message });
  }
};

// @desc    Get all pricing packages (admin)
// @route   GET /api/pricing-packages/all
// @access  Private/Admin
export const getAllPricingPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    await seedIfEmpty();

    const { category } = req.query;
    const filter: Record<string, any> = {};

    if (category && (category === 'event' || category === 'social_media')) {
      filter.category = category;
    }

    const packages = await PricingPackage.find(filter).sort({ category: 1, order: 1, createdAt: 1 });
    res.status(200).json(packages);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching all pricing packages', error: error.message });
  }
};

// @desc    Get single pricing package by ID
// @route   GET /api/pricing-packages/:id
// @access  Public
export const getPricingPackageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg = await PricingPackage.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ message: 'Pricing package not found' });
      return;
    }
    res.status(200).json(pkg);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching pricing package', error: error.message });
  }
};

// @desc    Create a new pricing package
// @route   POST /api/pricing-packages
// @access  Private/Admin
export const createPricingPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      category,
      subtitle,
      price,
      period,
      currency,
      features,
      accentColor,
      badgeColor,
      isFeatured,
      isAddon,
      isActive,
      order,
      ctaText,
    } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ message: 'Name, price, and category are required' });
      return;
    }

    // Clean features list
    const cleanedFeatures = Array.isArray(features)
      ? features.map((f: any) => String(f).trim()).filter((f: string) => f.length > 0)
      : [];

    const newPackage = await PricingPackage.create({
      name: name.trim(),
      category,
      subtitle: subtitle ? subtitle.trim() : '',
      price: price.trim(),
      period: period !== undefined ? period.trim() : (category === 'event' ? 'per event' : 'per month'),
      currency: currency || 'ETB',
      features: cleanedFeatures,
      accentColor: accentColor || '#e85d54',
      badgeColor: badgeColor || '',
      isFeatured: !!isFeatured,
      isAddon: !!isAddon,
      isActive: isActive !== undefined ? !!isActive : true,
      order: typeof order === 'number' ? order : 0,
      ctaText: ctaText || 'SELECT',
    });

    res.status(201).json(newPackage);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating pricing package', error: error.message });
  }
};

// @desc    Update a pricing package
// @route   PUT /api/pricing-packages/:id
// @access  Private/Admin
export const updatePricingPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg = await PricingPackage.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ message: 'Pricing package not found' });
      return;
    }

    const {
      name,
      category,
      subtitle,
      price,
      period,
      currency,
      features,
      accentColor,
      badgeColor,
      isFeatured,
      isAddon,
      isActive,
      order,
      ctaText,
    } = req.body;

    if (name !== undefined) pkg.name = name.trim();
    if (category !== undefined) pkg.category = category;
    if (subtitle !== undefined) pkg.subtitle = subtitle.trim();
    if (price !== undefined) pkg.price = price.trim();
    if (period !== undefined) pkg.period = period.trim();
    if (currency !== undefined) pkg.currency = currency.trim();
    if (accentColor !== undefined) pkg.accentColor = accentColor.trim();
    if (badgeColor !== undefined) pkg.badgeColor = badgeColor.trim();
    if (isFeatured !== undefined) pkg.isFeatured = !!isFeatured;
    if (isAddon !== undefined) pkg.isAddon = !!isAddon;
    if (isActive !== undefined) pkg.isActive = !!isActive;
    if (order !== undefined) pkg.order = Number(order);
    if (ctaText !== undefined) pkg.ctaText = ctaText.trim();

    if (features !== undefined && Array.isArray(features)) {
      pkg.features = features.map((f: any) => String(f).trim()).filter((f: string) => f.length > 0);
    }

    const updatedPackage = await pkg.save();
    res.status(200).json(updatedPackage);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating pricing package', error: error.message });
  }
};

// @desc    Delete a pricing package
// @route   DELETE /api/pricing-packages/:id
// @access  Private/Admin
export const deletePricingPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg = await PricingPackage.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ message: 'Pricing package not found' });
      return;
    }

    await pkg.deleteOne();
    res.status(200).json({ message: 'Pricing package deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting pricing package', error: error.message });
  }
};
