'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export default function PricingSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Social Media <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional social media management packages tailored for your business
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            onClick={() => setShowModal(true)}
            className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/ssm.png"
              alt="Social Media Management Pricing"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Click to view full details
          </p>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#C4A86D] transition-colors"
            >
              <FaTimes size={32} />
            </button>
            <Image
              src="/images/ssm.png"
              alt="Social Media Management Pricing"
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
