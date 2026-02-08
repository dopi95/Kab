import express from 'express';
import { createOrUpdateFounder, getFounder, deleteFounder } from '../controllers/founderController';
import { auth, admin } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.array('images', 3), admin, createOrUpdateFounder);
router.get('/', getFounder);
router.delete('/', auth, admin, deleteFounder);

export default router;
