'use client';

import React, { useState, useEffect } from 'react';
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaCheck,
  FaCheckDouble,
  FaTrash,
  FaFilter,
  FaSearch,
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaSync,
  FaBoxes,
  FaUser,
} from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';
import Spinner from '@/components/Spinner';

export interface BookingRecord {
  _id: string;
  packageName: string;
  packageCategory: 'event' | 'social_media';
  packagePrice: string;
  packageCurrency: string;
  clientName?: string;
  phone?: string;
  email?: string;
  eventDate?: {
    european?: string;
    ethiopianAmharic?: string;
    ethiopianEnglish?: string;
  };
  notes?: string;
  status: 'new' | 'read' | 'contacted' | 'completed';
  isRead: boolean;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'event' | 'social_media' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        showToast('Failed to load bookings', 'error');
      }
    } catch {
      showToast('Error loading bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleToggleRead = async (id: string, currentReadState: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentReadState ? 'new' : 'read',
        }),
      });
      if (res.ok) {
        showToast(currentReadState ? 'Marked as unread' : 'Marked as read', 'success');
        fetchBookings();
      }
    } catch {
      showToast('Failed to update booking status', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Status updated to ${newStatus}`, 'success');
        fetchBookings();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('All bookings marked as read', 'success');
        fetchBookings();
      }
    } catch {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const handleDeleteClick = (id: string, clientName: string) => {
    setDeletingBooking({ id, name: clientName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingBooking) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings/${deletingBooking.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Booking deleted successfully', 'success');
        fetchBookings();
      } else {
        showToast('Failed to delete booking', 'error');
      }
    } catch {
      showToast('Error deleting booking', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingBooking(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'event' && b.packageCategory !== 'event') return false;
    if (activeTab === 'social_media' && b.packageCategory !== 'social_media') return false;
    if (activeTab === 'unread' && b.isRead) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.clientName?.toLowerCase().includes(q);
      const matchPkg = b.packageName.toLowerCase().includes(q);
      const matchPhone = b.phone?.toLowerCase().includes(q);
      const matchEmail = b.email?.toLowerCase().includes(q);
      return matchName || matchPkg || matchPhone || matchEmail;
    }

    return true;
  });

  const unreadCount = bookings.filter((b) => !b.isRead).length;
  const eventCount = bookings.filter((b) => b.packageCategory === 'event').length;
  const socialCount = bookings.filter((b) => b.packageCategory === 'social_media').length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 min-h-screen">
        {/* Toast */}
        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaExclamationCircle className="text-xl" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A97E50] to-[#C4A86D] text-white flex items-center justify-center shadow-md">
                <FaCalendarCheck className="text-xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Package Bookings
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time bookings received from Event & Social Media package modals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchBookings}
              title="Refresh bookings"
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FaSync size={14} className={loading ? 'animate-spin' : ''} />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all active:scale-95"
              >
                <FaCheckDouble size={14} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border-l-4 border-[#A97E50]">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border-l-4 border-red-500">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">New / Unread</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{unreadCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border-l-4 border-blue-500">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Event Packages</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{eventCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border-l-4 border-purple-500">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Social Media</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{socialCount}</p>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#A97E50] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'unread'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'event'
                  ? 'bg-[#A97E50] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Event Packages ({eventCount})
            </button>
            <button
              onClick={() => setActiveTab('social_media')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'social_media'
                  ? 'bg-[#A97E50] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Social Media ({socialCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, package, phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
            />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <FaCalendarCheck className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              No bookings found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {searchQuery ? 'Try changing your search query.' : 'Bookings submitted from the website will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow border p-5 transition-all hover:shadow-md relative ${
                  !b.isRead
                    ? 'border-l-4 border-l-red-500 border-gray-200 dark:border-gray-700 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Side: Client & Package Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          b.packageCategory === 'event'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                        }`}
                      >
                        {b.packageCategory === 'event' ? 'Event Package' : 'Social Media Package'}
                      </span>

                      {!b.isRead && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> New
                        </span>
                      )}

                      <span className="text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {b.clientName || 'Client / Brand not specified'}
                      </h3>
                      <span className="text-sm font-semibold text-[#A97E50]">
                        {b.packageName} ({b.packagePrice} {b.packageCurrency})
                      </span>
                    </div>

                    {/* Date details for events */}
                    {b.eventDate?.european && (
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-300 pt-1">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-[#A97E50]" />
                          <span><strong>Date:</strong> {b.eventDate.european}</span>
                        </div>
                        {b.eventDate.ethiopianAmharic && (
                          <div className="text-[11px] text-[#845d35] dark:text-[#C4A86D] bg-[#A97E50]/10 px-2 py-0.5 rounded">
                            🇪🇹 {b.eventDate.ethiopianAmharic}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contact details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-1">
                      {b.phone && (
                        <a
                          href={`tel:${b.phone}`}
                          className="flex items-center gap-1.5 hover:text-[#A97E50] transition-colors"
                        >
                          <FaPhoneAlt size={11} className="text-green-600" />
                          <span>{b.phone}</span>
                        </a>
                      )}

                      {b.email && (
                        <a
                          href={`mailto:${b.email}`}
                          className="flex items-center gap-1.5 hover:text-[#A97E50] transition-colors"
                        >
                          <FaEnvelope size={11} className="text-blue-500" />
                          <span>{b.email}</span>
                        </a>
                      )}

                      {b.phone && (
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 hover:underline font-semibold"
                        >
                          <FaWhatsapp size={13} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Status selection & Actions */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase">Status:</span>
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#A97E50]"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(b._id, b.isRead)}
                        title={b.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          b.isRead
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200'
                        }`}
                      >
                        <FaCheck size={11} />
                        <span>{b.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(b._id, b.clientName || b.packageName)}
                        title="Delete Booking"
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                <FaTrash size={20} />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
                Delete Booking
              </h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete the booking for <span className="font-semibold text-gray-900 dark:text-white">"{deletingBooking?.name}"</span>?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
