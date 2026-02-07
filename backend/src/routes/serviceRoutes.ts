import express from 'express';
import { 
  getAllServices, 
  getActiveServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getActiveServices);
router.get('/all', protect, admin, getAllServices);
router.get('/:id', getServiceById);
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

export default router;
