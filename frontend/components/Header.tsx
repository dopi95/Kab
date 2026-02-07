'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/user') || pathname?.startsWith('/forgot-password')) {
    return null;
  }
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(saved);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('darkMode', String(isDarkMode));
    }
  }, [isDarkMode, mounted]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-[#171817]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile: Hamburger on left */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 order-first"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
            <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110">
              <Image src="/assets/logo.png" alt="Logo" fill sizes="64px" className="object-contain" priority />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-gray-700 dark:text-gray-300 hover:text-[#A97E50] dark:hover:text-[#C4A86D] font-medium transition-colors duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Sign In - Desktop & Mobile */}
            <Link
              href="/signin"
              className="flex items-center space-x-2 text-[#A97E50] dark:text-[#C4A86D] hover:scale-110 transition-all duration-300 group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Sign In</span>
            </Link>

            {/* Dark Mode Toggle - Desktop only */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hidden md:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-6 px-4 bg-white dark:bg-gray-800">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 mb-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#A97E50] dark:hover:text-[#C4A86D] hover:translate-x-2 transition-all duration-300 animate-bounceIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-[#A97E50] dark:hover:text-[#C4A86D] transition-all duration-300 animate-bounceIn"
                style={{ animationDelay: `${navLinks.length * 100}ms` }}
              >
                {isDarkMode ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 animate-spin" style={{ animationDuration: '20s' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="font-medium">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
