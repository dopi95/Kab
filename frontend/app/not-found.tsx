'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.querySelector('header')?.style.setProperty('display', 'none', 'important');
    return () => {
      document.querySelector('header')?.style.removeProperty('display');
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#171817] dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 animate-bounce">
          <div className="text-6xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">
            404
          </div>
        </div>
        
        <div className="animate-fadeIn space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-4">
            Oops! Page Not Found
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mt-12 animate-float">
          <svg className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto text-gray-300 dark:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
        </div>
      </div>
    </main>
  );
}
