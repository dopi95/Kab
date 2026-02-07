import express from 'express';
import { getUsers, createUser, getProfile, updateProfile, changePassword } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

export default router;