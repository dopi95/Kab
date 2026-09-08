import express from 'express';
import {
  getActivePricingPackages,
  getAllPricingPackages,
  getPricingPackageById,
  createPricingPackage,
  updatePricingPackage,
  deletePricingPackage,
} from '../controllers/pricingPackageController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getActivePricingPackages);
router.get('/all', protect, admin, getAllPricingPackages);
router.get('/:id', getPricingPackageById);
router.post('/', protect, admin, createPricingPackage);
router.put('/:id', protect, admin, updatePricingPackage);
router.delete('/:id', protect, admin, deletePricingPackage);

export default router;
