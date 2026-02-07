import express from 'express';
import { getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', getFAQs);
router.get('/all', auth, getAllFAQs);
router.post('/', auth, createFAQ);
router.put('/:id', auth, updateFAQ);
router.delete('/:id', auth, deleteFAQ);

export default router;
