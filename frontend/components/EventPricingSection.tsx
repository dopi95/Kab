'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaPhoneAlt, 
  FaTelegramPlane, 
  FaTimes, 
  FaWhatsapp, 
  FaBoxes 
} from 'react-icons/fa';
import PricingBookingModal, { SelectedPackage } from './PricingBookingModal';

// Thick green checkmark icon matching ssm.png graphic
function CheckIcon({ className = "w-5 h-5 text-[#2cb34a]" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z" 
      />
    </svg>
  );
}

interface EventPackageCard {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  accentColor: string;
  features: string[];
  isFeatured?: boolean;
}

const EVENT_CARDS: EventPackageCard[] = [
  {
    id: 'event-essential',
    name: 'Essential',
    price: '19,000',
    accentColor: '#e85d54',
    features: [
      '1 Camera',
      '1 Shooter',
      'Full Event Coverage',
      'Unlimited Edited Soft-Copy Photos',
      'Basic Lighting Setup',
      '20 Printed Photos',
    ],
  },
  {
    id: 'event-standard',
    name: 'Standard',
    price: '35,000',
    accentColor: '#1d8cf8',
    features: [
      '2 Cameras & 2 Shooters',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Unlimited Edited Soft-Copy Photos',
      'Standard Lighting Setup',
      'Wireless Audio & Gimbal',
      '50 Printed Photos & Album',
    ],
  },
  {
    id: 'event-professional',
    name: 'Professional',
    price: '45,000',
    accentColor: '#10b981',
    features: [
      '2 Cameras & 2 Shooters',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Optional Family & Friends Interviews',
      'Unlimited Edited Soft-Copy Photos',
      'Advanced Lighting Setup',
      'Wireless Audio & Gimbal',
      '100 Printed Photos & Album',
    ],
  },
  {
    id: 'event-signature',
    name: 'Signature',
    price: '55,000',
    accentColor: '#8b5cf6',
    features: [
      '2 Cameras & 2 Shooters',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Family & Friends Interviews',
      'Unlimited Edited Soft-Copy Photos',
      'Premium Lighting Setup',
      'Wireless Audio & Gimbal',
      '100 Printed Photos & Premium Album',
    ],
  },
  {
    id: 'event-elite',
    name: 'Elite',
    subtitle: '3 CAMERAS (2 VIDEO + 1 PHOTO)',
    price: '69,000',
    accentColor: '#f59e0b',
    isFeatured: true,
    features: [
      '3 Cameras & 3 Shooters',
      '2 Video + 1 Photo Dedicated',
      'Full Event Coverage',
      'Highlight Film / Cinematic Trailer',
      'Family & Friends Interviews',
      'Unlimited Edited Soft-Copy Photos',
      'Premium+ Lighting Setup',
      'Wireless Audio & Gimbal',
      '100 Printed Photos & Premium Album',
    ],
  },
];

export default function EventPricingSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inquireModalOpen, setInquireModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [eventCards, setEventCards] = useState<EventPackageCard[]>(EVENT_CARDS);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages?category=event`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: EventPackageCard[] = data.map((pkg: any) => ({
            id: `event-${pkg._id || pkg.name.toLowerCase()}`,
            name: pkg.name,
            subtitle: pkg.subtitle,
            price: pkg.price,
            accentColor: pkg.accentColor || '#e85d54',
            isFeatured: !!pkg.isFeatured,
            features: Array.isArray(pkg.features) ? pkg.features : [],
          }));
          setEventCards(mapped);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  const openBooking = (pkg: EventPackageCard) => {
    setSelectedPackage({
      id: pkg.id,
      name: `Event: ${pkg.name}`,
      price: pkg.price,
      badgeColor: pkg.accentColor,
      accentBg: `from-[${pkg.accentColor}] to-[#C4A86D]`,
      category: 'event',
    });
    setModalOpen(true);
  };

  return (
    <section id="pricing" className="relative pt-6 md:pt-10 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-[#faf7f2] to-white border-b border-[#ebdccb] scroll-mt-20">
      {/* Anchor for packages navigation */}
      <div id="packages" className="absolute -top-20" />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[#C4A86D]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-[#e85d54]/5 rounded-full blur-3xl" />
        
        {/* Faint KAB Watermark */}
        <div className="absolute top-10 right-12 opacity-5 w-48 h-48">
          <Image src="/assets/logo.png" alt="" fill className="object-contain filter grayscale" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Pricing Packages Section Title + Top Badge + Event Packages Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#0d1624] mb-4">
            Pricing <span className="text-[#845d35]">Packages</span>
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1724]/90 text-[#C4A86D] border border-[#C4A86D]/30 backdrop-blur-md text-xs sm:text-sm font-semibold uppercase tracking-widest mb-5 shadow-md">
            <span>KAB Creative Lab</span>
            <span className="w-1 h-1 rounded-full bg-[#C4A86D]"></span>
            <span>Official Packages</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0d1624] tracking-tight drop-shadow-sm">
            Event <span className="text-[#845d35]">Packages</span>
          </h3>
        </div>

        {/* 5-CARD GRID: Centered 3 + 2 layout */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {eventCards.map((card) => {
            return (
              <div
                key={card.id}
                className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] max-w-sm relative bg-[#dec9ad] rounded-2xl shadow-2xl overflow-hidden border flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
                  card.isFeatured
                    ? 'border-2 border-[#f59e0b]/50 shadow-[0_25px_50px_-12px_rgba(245,158,11,0.35)] lg:-translate-y-1'
                    : 'border-[#be9f7d]/60 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]'
                }`}
              >
                {/* Header Dark Block */}
                <div className="relative bg-[#09121d] px-6 pt-5 pb-6 text-center text-white">
                  {/* Mini KAB Logo mark */}
                  <div className="absolute top-4 left-4 w-7 h-9">
                    <Image src="/assets/logo.png" alt="KAB" fill className="object-contain" />
                  </div>

                  <h3 
                    className="text-3xl font-light tracking-wide mt-1"
                    style={{ color: card.accentColor }}
                  >
                    {card.name}
                  </h3>

                  {card.subtitle && (
                    <div className="text-[10px] uppercase font-bold text-gray-400 mt-0.5 tracking-wider">
                      {card.subtitle}
                    </div>
                  )}

                  <div className="mt-2 flex items-baseline justify-center gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {card.price}
                    </span>
                    <span className="text-xs font-semibold text-gray-300">
                      ETB
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-300 font-light mt-0.5">
                    per event
                  </div>

                  {/* Layered Fold Chevron Ribbon */}
                  <div className="absolute -bottom-5 left-0 right-0 flex justify-center z-10">
                    <div 
                      className="w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-t-[20px] drop-shadow-md"
                      style={{ borderTopColor: card.accentColor }}
                    />
                  </div>
                </div>

                {/* Card Body with Features List */}
                <div className="pt-9 pb-7 px-6 flex-1 flex flex-col justify-between">
                  <ul className="space-y-3.5 mb-7 text-left">
                    {card.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <CheckIcon className="w-5 h-5 text-[#2cb34a] flex-shrink-0" />
                        <span className="text-[#1a1816] font-medium text-sm sm:text-base">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openBooking(card)}
                      className="w-full py-2.5 px-6 rounded-md text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                      style={{
                        backgroundColor: card.accentColor,
                      }}
                    >
                      SELECT
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM BANNER: CUSTOM PACKAGES AVAILABLE */}
        <div className="mt-12 max-w-6xl mx-auto rounded-2xl bg-[#09121d] border border-[#C4A86D]/40 p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-white">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#C4A86D]/20 text-[#C4A86D] flex items-center justify-center flex-shrink-0">
              <FaBoxes size={24} />
            </div>
            <div>
              <h4 className="text-base font-extrabold uppercase tracking-wider text-[#C4A86D]">
                CUSTOM PACKAGES AVAILABLE
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                We can create a package that fits your needs and budget.
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setInquireModalOpen(true)}
            className="px-7 py-3 rounded-lg bg-[#C4A86D] hover:bg-[#d9bc7f] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex-shrink-0"
          >
            INQUIRE
          </button>
        </div>

      </div>

      {/* CUSTOM PACKAGE INQUIRY MODAL (GET IN TOUCH) */}
      {inquireModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setInquireModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-900 border border-gray-100 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A97E50]">
                  Custom Packages
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  Get in Touch
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInquireModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="py-4 space-y-3">
              <div className="space-y-2.5 text-left">
                <a 
                  href="tel:+251983101000"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-sm font-semibold text-gray-800"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#C4A86D]/20 text-[#A97E50] flex items-center justify-center flex-shrink-0">
                    <FaPhoneAlt size={15} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Call Us</div>
                    <div>+251 983 101 000</div>
                  </div>
                </a>

                <a 
                  href="https://t.me/yared_abebayehu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-sm font-semibold text-gray-800"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <FaTelegramPlane size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Telegram</div>
                    <div>@yared_abebayehu</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <a
                href="https://wa.me/251983101000?text=Hello%20KAB%20Creative%20Lab!%20I%20would%20like%20to%20inquire%20about%20a%20Custom%20Event%20Package."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={16} />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setInquireModalOpen(false)}
                className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUAL-CALENDAR BOOKING MODAL */}
      <PricingBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPackage={selectedPackage}
      />
    </section>
  );
}
