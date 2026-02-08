import express from 'express';
import multer from 'multer';
import { getPortfolio, updateAbout, updateSkills, updateExperiences, addHeroImage, updateHeroImage, deleteHeroImage, addSampleWork, updateSampleWork, deleteSampleWork } from '../controllers/portfolioController';
import { auth, admin } from '../middleware/auth';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

router.get('/', getPortfolio);
router.put('/about', auth, admin, updateAbout);
router.put('/skills', auth, admin, updateSkills);
router.put('/experiences', auth, admin, updateExperiences);
router.post('/hero', auth, admin, upload.single('image'), addHeroImage);
router.put('/hero/:index', auth, admin, upload.single('image'), updateHeroImage);
router.delete('/hero/:index', auth, admin, deleteHeroImage);
router.post('/works', auth, admin, upload.array('media', 10), addSampleWork);
router.put('/works/:index', auth, admin, upload.array('media', 10), updateSampleWork);
router.delete('/works/:index', auth, admin, deleteSampleWork);

export default router;
