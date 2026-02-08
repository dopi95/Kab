'use client';

import { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs`);
        const data = await response.json();
        if (data.success) {
          setFaqs(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Character */}
          <div className="flex justify-center lg:justify-start order-1">
            <div className="relative w-72 h-80">
              <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="skinFaq" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFD4A3' }} />
                    <stop offset="100%" style={{ stopColor: '#FFBE8F' }} />
                  </linearGradient>
                  <linearGradient id="brandFaq" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#A97E50' }} />
                    <stop offset="100%" style={{ stopColor: '#C4A86D' }} />
                  </linearGradient>
                  <filter id="shadowFaq">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                <g filter="url(#shadowFaq)">
                  {/* Body */}
                  <rect x="70" y="160" width="60" height="90" rx="12" fill="url(#brandFaq)" />
                  
                  {/* Left Arm - Scratching head */}
                  <ellipse cx="55" cy="175" rx="16" ry="40" fill="url(#brandFaq)" className="animate-scratch-head" style={{ transformOrigin: '55px 165px' }} />
                  <circle cx="45" cy="215" r="14" fill="url(#skinFaq)" />
                  
                  {/* Right Arm - Pointing up */}
                  <ellipse cx="145" cy="175" rx="16" ry="40" fill="url(#brandFaq)" className="animate-point-up" style={{ transformOrigin: '145px 165px' }} />
                  <circle cx="155" cy="215" r="14" fill="url(#skinFaq)" />
                  
                  {/* Legs */}
                  <rect x="78" y="245" width="20" height="50" rx="10" fill="#8B7355" />
                  <ellipse cx="88" cy="300" rx="16" ry="10" fill="#C4A86D" />
                  <rect x="102" y="245" width="20" height="50" rx="10" fill="#8B7355" />
                  <ellipse cx="112" cy="300" rx="16" ry="10" fill="#C4A86D" />
                  
                  {/* Head with thinking expression */}
                  <g className="animate-head-tilt">
                    <circle cx="100" cy="110" r="48" fill="url(#skinFaq)" />
                    
                    {/* Hair */}
                    <ellipse cx="100" cy="80" rx="52" ry="40" fill="#654321" />
                    <circle cx="75" cy="85" r="20" fill="#654321" />
                    <circle cx="125" cy="85" r="20" fill="#654321" />
                    
                    {/* Eyes - thinking */}
                    <ellipse cx="85" cy="105" rx="6" ry="8" fill="#333" className="animate-eye-think" />
                    <circle cx="83" cy="103" r="2" fill="white" />
                    <ellipse cx="115" cy="105" rx="6" ry="8" fill="#333" className="animate-eye-think" />
                    <circle cx="113" cy="103" r="2" fill="white" />
                    
                    {/* Eyebrows - raised */}
                    <path d="M 78 95 Q 85 92 92 95" stroke="#654321" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 108 95 Q 115 92 122 95" stroke="#654321" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    
                    {/* Mouth - thinking */}
                    <path d="M 88 125 Q 100 128 112 125" stroke="#A97E50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    
                    {/* Cheeks */}
                    <circle cx="72" cy="115" r="7" fill="#FFB6C1" opacity="0.6" />
                    <circle cx="128" cy="115" r="7" fill="#FFB6C1" opacity="0.6" />
                  </g>
                </g>
                
                {/* Question Mark Bubble */}
                <g className="animate-bubble-float">
                  <circle cx="160" cy="60" r="28" fill="white" stroke="#A97E50" strokeWidth="3" />
                  <text x="160" y="75" fontSize="36" fontWeight="bold" fill="#A97E50" textAnchor="middle">?</text>
                  {/* Thought bubbles */}
                  <circle cx="145" cy="85" r="6" fill="white" stroke="#A97E50" strokeWidth="2" />
                  <circle cx="135" cy="95" r="4" fill="white" stroke="#A97E50" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="order-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Got questions? We've got answers!
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <FaChevronDown
                      className={`text-[#A97E50] flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes head-tilt {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes scratch-head {
          0%, 100% { transform: rotate(-45deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes point-up {
          0%, 100% { transform: rotate(45deg) translateY(0); }
          50% { transform: rotate(35deg) translateY(-5px); }
        }
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes eye-think {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-head-tilt {
          animation: head-tilt 3s ease-in-out infinite;
          transform-origin: 100px 110px;
        }
        .animate-scratch-head {
          animation: scratch-head 2s ease-in-out infinite;
        }
        .animate-point-up {
          animation: point-up 2.5s ease-in-out infinite;
        }
        .animate-bubble-float {
          animation: bubble-float 3s ease-in-out infinite;
        }
        .animate-eye-think {
          animation: eye-think 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
