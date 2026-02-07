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
            <div className="relative w-72 h-72">
              {/* Thinking Person Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Body */}
                <div className="absolute bottom-8 w-24 h-40 bg-gradient-to-b from-[#A97E50] to-[#C4A86D] rounded-t-full"></div>
                
                {/* Arms */}
                <div className="absolute bottom-20 -left-4 w-16 h-6 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] rounded-full transform -rotate-45 animate-wave"></div>
                <div className="absolute bottom-28 right-0 w-16 h-6 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] rounded-full transform rotate-45"></div>
                
                {/* Head */}
                <div className="relative animate-bounce-slow z-10">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-full relative shadow-xl">
                    {/* Eyes */}
                    <div className="absolute top-10 left-7 w-4 h-4 bg-white rounded-full animate-blink">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-gray-900 rounded-full"></div>
                    </div>
                    <div className="absolute top-10 right-7 w-4 h-4 bg-white rounded-full animate-blink">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-gray-900 rounded-full"></div>
                    </div>
                    {/* Smile */}
                    <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-10 h-5 border-b-3 border-white rounded-full"></div>
                  </div>
                  
                  {/* Question Mark Bubble */}
                  <div className="absolute -top-10 -right-10 bg-white dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl animate-float border-4 border-[#A97E50]">
                    <span className="text-4xl font-bold text-[#A97E50]">?</span>
                  </div>
                  
                  {/* Thought Lines */}
                  <div className="absolute -top-4 -right-4 w-3 h-3 bg-white dark:bg-gray-800 rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute -top-6 -right-6 w-2 h-2 bg-white dark:bg-gray-800 rounded-full shadow-lg animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
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
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(-10deg);
          }
          50% {
            transform: translateY(-15px) rotate(-10deg);
          }
        }
        @keyframes blink {
          0%, 90%, 100% {
            opacity: 1;
          }
          95% {
            opacity: 0;
          }
        }
        @keyframes wave {
          0%, 100% {
            transform: rotate(-45deg);
          }
          50% {
            transform: rotate(-35deg);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 4s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
