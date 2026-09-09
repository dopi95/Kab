'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaUser, FaCheckCircle, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { toEthiopianDate, formatEuropeanDate, EthiopianDate } from '@/lib/ethiopianCalendar';

export interface SelectedPackage {
  id: string;
  name: string;
  price: string;
  badgeColor: string;
  accentBg: string;
  category?: 'event' | 'social_media';
}

interface PricingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: SelectedPackage | null;
}

export default function PricingBookingModal({
  isOpen,
  onClose,
  selectedPackage,
}: PricingBookingModalProps) {
  // Today formatted as YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const [dateStr, setDateStr] = useState<string>(todayStr);
  const [ethiopianDate, setEthiopianDate] = useState<EthiopianDate | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEvent = selectedPackage
    ? selectedPackage.category === 'event' ||
      selectedPackage.id.startsWith('event-') ||
      selectedPackage.name.toLowerCase().includes('event')
    : false;

  // Update Ethiopian date when dateStr changes
  useEffect(() => {
    if (dateStr) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(d.getTime())) {
          setEthiopianDate(toEthiopianDate(d));
          setError('');
          return;
        }
      }
    }
    setEthiopianDate(null);
  }, [dateStr]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDateStr(new Date().toISOString().split('T')[0]);
      setName('');
      setPhone('');
      setEmail('');
      setError('');
      setIsSubmitted(false);
    }
  }, [isOpen, selectedPackage]);

  if (!isOpen || !selectedPackage) return null;

  const currentGregorianDate = dateStr
    ? new Date(
        parseInt(dateStr.split('-')[0]),
        parseInt(dateStr.split('-')[1]) - 1,
        parseInt(dateStr.split('-')[2])
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEvent) {
      if (!dateStr || !ethiopianDate) {
        setError('Please select a date.');
        return;
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your Name or Brand.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Save to dedicated Bookings database collection
      const res = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          packageCategory: isEvent ? 'event' : 'social_media',
          packagePrice: selectedPackage.price,
          packageCurrency: 'ETB',
          clientName: name || 'Client',
          phone: phone || '',
          email: email || '',
          eventDate: isEvent ? {
            european: currentGregorianDate ? formatEuropeanDate(currentGregorianDate) : dateStr,
            ethiopianAmharic: ethiopianDate?.formattedAm || '',
            ethiopianEnglish: ethiopianDate?.formattedEn || '',
          } : undefined,
          notes: `Booked from website modal. Phone: ${phone || 'N/A'}, Email: ${email || 'N/A'}`,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error('Booking submission warning:', errJson);
      }

      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    let msg = `Hello KAB Creative Lab! I would like to book the *${selectedPackage.name}* package (${selectedPackage.price} ${isEvent ? 'ETB' : 'ETB/mo'}).\n\n`;
    if (isEvent) {
      msg += `📅 *European Date:* ${currentGregorianDate ? formatEuropeanDate(currentGregorianDate) : dateStr}\n` +
             `🇪🇹 *Ethiopian Date:* ${ethiopianDate?.formattedAm} (${ethiopianDate?.formattedEn})\n`;
    }
    if (name) msg += `👤 *Name / Brand:* ${name}\n`;
    if (phone) msg += `📞 *Phone:* ${phone}\n`;
    if (email) msg += `✉️ *Email:* ${email}\n`;
    return `https://wa.me/251983101000?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-900 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple Clean Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedPackage.badgeColor }}
            />
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{selectedPackage.name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-700">
                {selectedPackage.price} {isEvent ? 'ETB' : 'ETB/mo'}
              </span>
            </h3>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200/70 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                <FaCheckCircle />
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  Booking Request Received!
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  We have logged your request for the <strong>{selectedPackage.name}</strong> package.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800">
                {isEvent && (
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-2">
                    <span className="text-blue-600 font-semibold">
                      {currentGregorianDate ? formatEuropeanDate(currentGregorianDate) : dateStr}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <span>🇪🇹</span>
                      <span>{ethiopianDate?.formattedAm}</span>
                      <span className="text-gray-500 font-normal">
                        ({ethiopianDate?.formattedEn})
                      </span>
                    </span>
                  </div>
                )}
                <div className={`text-gray-600 text-[11px] flex flex-wrap justify-center gap-x-3 gap-y-0.5 ${isEvent ? 'pt-2 border-t border-gray-200' : ''}`}>
                  {name && <span><strong>Name / Brand:</strong> {name}</span>}
                  {phone && <span><strong>Phone:</strong> {phone}</span>}
                  {email && <span><strong>Email:</strong> {email}</span>}
                </div>
              </div>

              <div className="flex gap-2.5 justify-center pt-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <FaWhatsapp size={16} />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* EVENT ONLY: DATE SELECTION (REQUIRED) */}
              {isEvent && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <FaCalendarAlt className="text-gray-500 text-xs" />
                      <span>Select Date</span>
                      <span className="text-red-500 text-[11px] font-semibold">* Required</span>
                    </label>
                  </div>

                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  />

                  {/* Single Line Date Translation Text */}
                  <div className="pt-0.5 text-xs text-gray-700 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-blue-600 font-semibold">
                      {currentGregorianDate ? formatEuropeanDate(currentGregorianDate) : dateStr}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <span>🇪🇹</span>
                      <span>{ethiopianDate?.formattedAm}</span>
                      <span className="text-gray-500 font-normal">
                        ({ethiopianDate?.formattedEn})
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* NAME / BRAND FIELD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <FaUser className="text-gray-400 text-[10px]" /> Name or Brand
                    {!isEvent ? (
                      <span className="text-red-500 text-[11px] font-semibold">* Required</span>
                    ) : null}
                  </label>
                  {isEvent && <span className="text-[10px] text-gray-400">Optional</span>}
                </div>
                <input
                  type="text"
                  required={!isEvent}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe / Studio Brand"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs transition-all"
                />
              </div>

              {/* PHONE & EMAIL SIDE-BY-SIDE (OPTIONAL) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                {/* Phone */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <FaPhoneAlt className="text-gray-400 text-[10px]" /> Phone
                    </label>
                    <span className="text-[10px] text-gray-400">Optional</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 983 101 000"
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <FaEnvelope className="text-gray-400 text-[10px]" /> Email
                    </label>
                    <span className="text-[10px] text-gray-400">Optional</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-medium pt-0.5">
                  {error}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg font-bold text-white text-xs transition-all shadow-sm flex items-center gap-1.5"
                  style={{
                    backgroundColor: selectedPackage.badgeColor,
                  }}
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <FaArrowRight size={11} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
