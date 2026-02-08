'use client';

import { useRouter } from 'next/navigation';
import { FaQuoteLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Founder {
  name: string;
  message: string;
  images: string[];
}

export default function FounderSection() {
  const router = useRouter();
  const [founder, setFounder] = useState<Founder | null>(null);

  useEffect(() => {
    fetchFounder();
  }, []);

  const fetchFounder = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder`);
      const data = await res.json();
      if (data.success && data.data) {
        setFounder(data.data);
      }
    } catch (error) {
      console.error('Error fetching founder:', error);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left order-2 md:order-1">
              <FaQuoteLeft className="text-4xl text-[#A97E50] mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Founder's Message
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{founder?.message || 'At Kab Creative Lab, we believe in transforming ideas into reality through innovative design and creative excellence. Our passion drives us to deliver exceptional results for every project.'}"
              </p>
              <p className="text-xl font-semibold text-[#A97E50] mb-6">- {founder?.name || 'Yared Abebayehu'}</p>
              <button
                onClick={() => router.push('/portfolio')}
                className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-8 py-3 rounded-lg hover:shadow-lg transition"
              >
                View Portfolio
              </button>
            </div>
            
            <div className="relative min-h-[600px] md:min-h-96 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-4 order-1 md:order-2">
              {founder?.images && founder.images.length > 0 ? (
                founder.images.map((img, idx) => (
                  <div key={idx} className={`w-full md:w-80 h-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl transform ${idx === 0 ? 'rotate-3 md:rotate-6' : idx === 1 ? '-rotate-2 md:-rotate-3' : 'rotate-2 md:rotate-3'} hover:rotate-0 transition-all duration-500 hover:scale-105 border-4 border-white dark:border-gray-800`}>
                    <img src={img} alt={`Founder ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <>
                  <div className="w-full md:w-80 h-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 md:rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105 border-4 border-white dark:border-gray-800">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500" alt="Team" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full md:w-80 h-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl transform -rotate-2 md:-rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 border-4 border-white dark:border-gray-800">
                    <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500" alt="Creative" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full md:w-80 h-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 md:rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 border-4 border-white dark:border-gray-800">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500" alt="Innovation" className="w-full h-full object-cover" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
