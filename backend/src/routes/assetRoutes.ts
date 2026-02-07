import express from 'express';
import { sendAsset, getUserAssets, deleteAsset, getUserAssetsByAdmin, updateAsset } from '../controllers/assetController';
import { auth, admin } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.array('photos', 10), admin, sendAsset);
router.get('/my-assets', auth, getUserAssets);
router.get('/user/:userId', auth, admin, getUserAssetsByAdmin);
router.put('/:id', auth, admin, updateAsset);
router.delete('/:id', auth, admin, deleteAsset);

export default router;
