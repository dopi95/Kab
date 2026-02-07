import express from 'express';
import { getUsers, createUser, getProfile, updateProfile, changePassword, uploadProfileImage, removeProfileImage } from '../controllers/userController';
import { auth } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.post('/profile-image', auth, upload.single('image'), uploadProfileImage);
router.delete('/profile-image', auth, removeProfileImage);

export default router;