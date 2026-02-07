import express from 'express';
import { submitContact, getContacts, updateContactStatus, deleteContact, replyToContact, getUnreadCount } from '../controllers/contactController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', submitContact);
router.get('/unread-count', auth, getUnreadCount);
router.get('/', auth, getContacts);
router.put('/:id', auth, updateContactStatus);
router.delete('/:id', auth, deleteContact);
router.post('/:id/reply', auth, replyToContact);

export default router;
