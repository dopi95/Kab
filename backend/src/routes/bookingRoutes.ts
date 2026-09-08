import express from 'express';
import {
  createBooking,
  getUnreadBookingsCount,
  getAllBookings,
  markBookingAsRead,
  markAllBookingsAsRead,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/', createBooking);
router.get('/unread-count', protect, admin, getUnreadBookingsCount);
router.get('/', protect, admin, getAllBookings);
router.put('/mark-all-read', protect, admin, markAllBookingsAsRead);
router.put('/:id/read', protect, admin, markBookingAsRead);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.delete('/:id', protect, admin, deleteBooking);

export default router;
