import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAbout);
router.put('/', protect, admin, updateAbout);

export default router;
