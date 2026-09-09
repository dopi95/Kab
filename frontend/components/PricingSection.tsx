'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaTimes, 
  FaPhoneAlt, 
  FaTelegramPlane, 
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

interface SocialPackageCard {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  period?: string;
  accentColor: string;
  badgeColor?: string;
  isFeatured?: boolean;
  isAddon?: boolean;
  features: string[];
}

const DEFAULT_SOCIAL_PACKAGES: SocialPackageCard[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '14,700',
    period: 'per month',
    accentColor: '#e85d54',
    badgeColor: '#e85d54',
    isFeatured: false,
    isAddon: false,
    features: [
      '8 edited videos',
      'Content Strategy & Planning',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '27,900',
    period: 'per month',
    accentColor: '#1d8cf8',
    badgeColor: '#1d8cf8',
    isFeatured: true,
    isAddon: false,
    features: [
      '12 edited videos',
      'Content Strategy & Planning',
      'Engaging Video Editing',
      'Community Engagement',
      'Monthly Performance Report',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '50,000',
    period: 'per month',
    accentColor: '#f59e0b',
    badgeColor: '#f59e0b',
    isFeatured: false,
    isAddon: false,
    features: [
      '20 edited videos',
      '2 Add on',
      '8 Graphics designed post',
      'Content Strategy & Planning',
      'Advanced Video Editing',
      'Full Community Engagement',
      'Monthly Performance Report',
    ],
  },
  {
    id: 'addon',
    name: 'Add-on',
    price: 'Add-on',
    period: '',
    accentColor: '#00e676',
    badgeColor: '#e85d54',
    isFeatured: false,
    isAddon: true,
    features: [
      'Events',
      'V-log',
      'Documentary',
      'Interview',
      'Graphics',
    ],
  },
];

export default function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inquireModalOpen, setInquireModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [packages, setPackages] = useState<SocialPackageCard[]>(DEFAULT_SOCIAL_PACKAGES);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages?category=social_media`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: SocialPackageCard[] = data.map((pkg: any) => ({
            id: `social-${pkg._id || pkg.name.toLowerCase()}`,
            name: pkg.name,
            subtitle: pkg.subtitle,
            price: pkg.price,
            period: pkg.period,
            accentColor: pkg.accentColor || '#e85d54',
            badgeColor: pkg.badgeColor || pkg.accentColor || '#e85d54',
            isFeatured: !!pkg.isFeatured,
            isAddon: !!pkg.isAddon,
            features: Array.isArray(pkg.features) ? pkg.features : [],
          }));
          setPackages(mapped);
        }
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  const openBooking = (pkg: SocialPackageCard) => {
    setSelectedPackage({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      badgeColor: pkg.accentColor,
      accentBg: `from-[${pkg.accentColor}] to-[#C4A86D]`,
      category: 'social_media',
    });
    setModalOpen(true);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#241c14]">
      {/* BACKGROUND GRAPHICS: Recreating the geometric sand/khaki luxury backdrop of ssm.png */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Base rich warm tone gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cbb497] via-[#bd9d7b] to-[#a38059]" />

        {/* Angular faceted geometric overlays matching ssm.png */}
        <div 
          className="absolute -top-[20%] -left-[15%] w-[80%] h-[120%] bg-[#b8956e]/50"
          style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 0 85%)' }}
        />
        <div 
          className="absolute top-[10%] right-[-10%] w-[70%] h-[110%] bg-[#96744d]/30"
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 70%)' }}
        />
        <div 
          className="absolute top-[35%] -left-[20%] w-[140%] h-[28%] bg-[#a38059]/40 transform -rotate-6"
        />
        <div 
          className="absolute -bottom-[10%] left-[20%] w-[70%] h-[60%] bg-[#d8c3a9]/40"
          style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
        />

        {/* Faint KAB Logo Watermark Motifs */}
        <div className="absolute top-12 left-10 opacity-10 w-44 h-44">
          <Image src="/assets/logo.png" alt="" fill className="object-contain filter grayscale" />
        </div>
        <div className="absolute bottom-16 right-16 opacity-10 w-52 h-52">
          <Image src="/assets/logo.png" alt="" fill className="object-contain filter grayscale" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0d1624] tracking-tight drop-shadow-sm">
            Social Media <span className="text-[#845d35]">Packages</span>
          </h2>
        </div>

        {/* Dynamic Package Cards Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto items-stretch">
          {packages.map((card) => {
            const isAddon = !!card.isAddon;
            const isFeatured = !!card.isFeatured;

            return (
              <div
                key={card.id}
                className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] max-w-sm relative bg-[#dec9ad] rounded-2xl shadow-2xl overflow-hidden border flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
                  isFeatured
                    ? 'border-2 border-[#1d8cf8]/50 shadow-[0_25px_50px_-12px_rgba(29,140,248,0.35)] lg:-translate-y-1'
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
                    {!isAddon && card.price !== 'Add-on' && (
                      <span className="text-xs font-semibold text-gray-300">
                        ETB
                      </span>
                    )}
                  </div>

                  {card.period && (
                    <div className="text-[11px] text-gray-300 font-light mt-0.5">
                      {card.period}
                    </div>
                  )}

                  {/* Layered Chevron Fold */}
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
                    {card.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckIcon className="w-5 h-5 text-[#2cb34a] flex-shrink-0" />
                        <span className="text-[#1a1816] font-medium text-sm sm:text-base">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="pt-2">
                    {isAddon ? (
                      <button
                        type="button"
                        onClick={() => setInquireModalOpen(true)}
                        className="w-full py-2.5 px-6 rounded-md bg-[#09121d] hover:bg-black active:scale-[0.98] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
                      >
                        INQUIRE
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openBooking(card)}
                        className="w-full py-2.5 px-6 rounded-md text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                        style={{ backgroundColor: card.accentColor }}
                      >
                        SELECT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM BANNER: CUSTOM PACKAGES AVAILABLE (Matching Event Package Style) */}
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
                  <div className="w-9 h-9 rounded-lg bg-[#A97E50]/10 text-[#A97E50] flex items-center justify-center flex-shrink-0">
                    <FaPhoneAlt size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-normal">Call Us Directly</p>
                    <p className="text-sm font-bold text-gray-900 truncate">+251 983 101 000</p>
                  </div>
                </a>

                <a 
                  href="https://t.me/yared_abebayehu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-sm font-semibold text-gray-800"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center flex-shrink-0">
                    <FaTelegramPlane size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-normal">Telegram</p>
                    <p className="text-sm font-bold text-gray-900 truncate">@yared_abebayehu</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/251983101000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-sm font-semibold text-gray-800"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-normal">WhatsApp</p>
                    <p className="text-sm font-bold text-gray-900 truncate">+251 983 101 000</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setInquireModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Booking Modal */}
      {selectedPackage && (
        <PricingBookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedPackage={selectedPackage}
        />
      )}
    </section>
  );
}
