import { Request, Response } from 'express';
import PackageBooking from '../models/PackageBooking';
import { sendTelegramBookingNotification } from '../services/telegramService';

// @desc    Create a new package booking (Public - submitted from website modal)
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      packageName,
      packageCategory,
      packagePrice,
      packageCurrency,
      clientName,
      phone,
      email,
      eventDate,
      notes,
    } = req.body;

    if (!packageName || !packagePrice) {
      res.status(400).json({ message: 'Package name and price are required' });
      return;
    }

    const booking = await PackageBooking.create({
      packageName: String(packageName).trim(),
      packageCategory: packageCategory === 'event' ? 'event' : 'social_media',
      packagePrice: String(packagePrice).trim(),
      packageCurrency: packageCurrency || 'ETB',
      clientName: clientName ? String(clientName).trim() : '',
      phone: phone ? String(phone).trim() : '',
      email: email ? String(email).trim() : '',
      eventDate: eventDate || {},
      notes: notes ? String(notes).trim() : '',
      status: 'new',
      isRead: false,
    });

    // Send Telegram notification asynchronously
    sendTelegramBookingNotification({
      packageName: booking.packageName,
      packageCategory: booking.packageCategory,
      packagePrice: booking.packagePrice,
      packageCurrency: booking.packageCurrency,
      clientName: booking.clientName,
      phone: booking.phone,
      email: booking.email,
      eventDate: booking.eventDate,
      notes: booking.notes,
    }).catch((err) => console.error('Telegram notification error:', err));

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// @desc    Get unread bookings count
// @route   GET /api/bookings/unread-count
// @access  Private/Admin
export const getUnreadBookingsCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await PackageBooking.countDocuments({ isRead: false });
    res.status(200).json({ success: true, count });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: Record<string, any> = {};

    if (category && (category === 'event' || category === 'social_media')) {
      filter.packageCategory = category;
    }

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    const bookings = await PackageBooking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// @desc    Mark a booking as read
// @route   PUT /api/bookings/:id/read
// @access  Private/Admin
export const markBookingAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await PackageBooking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    booking.isRead = true;
    if (booking.status === 'new') {
      booking.status = 'read';
    }
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// @desc    Mark all bookings as read
// @route   PUT /api/bookings/mark-all-read
// @access  Private/Admin
export const markAllBookingsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await PackageBooking.updateMany({ isRead: false }, { isRead: true, status: 'read' });
    res.status(200).json({ success: true, message: 'All bookings marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error marking all as read', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const booking = await PackageBooking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (status) {
      booking.status = status;
      if (status !== 'new') {
        booking.isRead = true;
      }
    }
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await PackageBooking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};
