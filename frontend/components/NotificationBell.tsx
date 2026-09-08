'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaBell,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckDouble,
  FaArrowRight,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';

export interface BookingItem {
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

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousCountRef = useRef(0);
  const hasPlayedInitialSound = useRef(false);

  // Initialize Audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
      audioRef.current.volume = 0.45;
    }
  }, []);

  // Fetch unread count & recent bookings
  const fetchBookingsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;

      // 1. Fetch unread count
      const countRes = await fetch(`${apiUrl}/api/bookings/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        const newCount = countData.count || 0;

        // Sound chime on new arrival
        if (newCount > 0 && !hasPlayedInitialSound.current) {
          audioRef.current?.play().catch(() => {});
          hasPlayedInitialSound.current = true;
        } else if (newCount > previousCountRef.current && previousCountRef.current > 0) {
          audioRef.current?.play().catch(() => {});
        }

        previousCountRef.current = newCount;
        setUnreadCount(newCount);
      }

      // 2. Fetch recent bookings
      const bookingsRes = await fetch(`${apiUrl}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        if (Array.isArray(bookingsData)) {
          setRecentBookings(bookingsData.slice(0, 6));
        }
      }
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchBookingsData();
    const interval = setInterval(fetchBookingsData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchBookingsData();
      }
    } catch {
      // Silently fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/bookings/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchBookingsData();
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToBookings = () => {
    setIsOpen(false);
    router.push('/admin/bookings');
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div ref={dropdownRef} className="fixed top-4 right-4 sm:right-6 lg:right-8 z-40">
      {/* Fixed Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View Booking Notifications"
        className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl active:scale-95 ${
          unreadCount > 0
            ? 'bg-gradient-to-br from-[#09121d] to-[#1e293b] text-white border-2 border-[#C4A86D]'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-black dark:hover:text-white'
        }`}
      >
        <FaBell
          className={`text-lg transition-transform ${
            unreadCount > 0 ? 'text-[#C4A86D] animate-bounce' : 'text-gray-600 dark:text-gray-400'
          }`}
        />

        {/* Number Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn text-gray-900 dark:text-white">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#09121d] to-[#162232] text-white flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C4A86D]/20 text-[#C4A86D] flex items-center justify-center">
                <FaBell size={14} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Package Bookings</h4>
                <p className="text-[11px] text-gray-300">
                  {unreadCount} unread booking{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-[11px] font-semibold text-[#C4A86D] hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <FaCheckDouble size={11} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Bookings List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {recentBookings.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <FaBell className="text-3xl mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No bookings yet</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Bookings made on the website will appear here.
                </p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  onClick={handleNavigateToBookings}
                  className={`p-4 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 flex items-start gap-3 relative ${
                    !booking.isRead ? 'bg-amber-50/60 dark:bg-amber-950/20' : ''
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!booking.isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-4 left-2 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0 pl-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          booking.packageCategory === 'event'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                        }`}
                      >
                        {booking.packageCategory === 'event' ? 'Event' : 'Social Media'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {getTimeAgo(booking.createdAt)}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {booking.clientName || 'Unnamed Client'}
                    </div>

                    <div className="text-xs text-[#A97E50] font-semibold mt-0.5">
                      {booking.packageName} • {booking.packagePrice} {booking.packageCurrency || 'ETB'}
                    </div>

                    {/* Date info if available */}
                    {booking.eventDate?.european && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 mt-1">
                        <FaCalendarAlt size={10} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{booking.eventDate.european}</span>
                      </div>
                    )}

                    {/* Ethiopian Date */}
                    {booking.eventDate?.ethiopianAmharic && (
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        🇪🇹 {booking.eventDate.ethiopianAmharic}
                      </div>
                    )}

                    {/* Contact Info */}
                    {booking.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        <FaPhoneAlt size={10} className="text-gray-400 flex-shrink-0" />
                        <span>{booking.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Mark as read button */}
                  {!booking.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkAsRead(booking._id, e)}
                      title="Mark as read"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex-shrink-0"
                    >
                      <FaCheck size={11} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer View All */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-700 text-center">
            <button
              type="button"
              onClick={handleNavigateToBookings}
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] hover:from-[#967045] hover:to-[#b89b60] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>View All Bookings</span>
              <FaArrowRight size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
