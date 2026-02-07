'use client';

import { useEffect, useRef, useState } from 'react';
import { FaVideo, FaPalette, FaRobot, FaRocket, FaBullseye, FaUsers } from 'react-icons/fa';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
        const data = await res.json();
        setContent(data.content || 'Kab Creative Lab is a creative studio focused on helping brands communicate clearly, look premium, and convert attention into results.\nWe specialize in video production, visual branding, and AI-powered content solutions designed for modern businesses and digital platforms.\n\nKab was built with one principle: creative work must drive real outcomes, not just look good. Every project is approached with strategy first, visuals second, and performance always in mind.\n\nWe work with individuals, startups, and companies that want high-quality content without unnecessary complexity. From concept to final delivery, Kab Creative Lab provides streamlined execution, fast turnaround, and consistent quality.');
      } catch (error) {
        setContent('Kab Creative Lab is a creative studio focused on helping brands communicate clearly, look premium, and convert attention into results.\nWe specialize in video production, visual branding, and AI-powered content solutions designed for modern businesses and digital platforms.\n\nKab was built with one principle: creative work must drive real outcomes, not just look good. Every project is approached with strategy first, visuals second, and performance always in mind.\n\nWe work with individuals, startups, and companies that want high-quality content without unnecessary complexity. From concept to final delivery, Kab Creative Lab provides streamlined execution, fast turnaround, and consistent quality.');
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#A97E50]/10 to-[#C4A86D]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#C4A86D]/10 to-[#A97E50]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Us</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] mx-auto rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-8 text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed text-center md:text-left">
              {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="font-light">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaVideo className="text-white text-2xl md:text-3xl" />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Video Production</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaPalette className="text-white text-2xl md:text-3xl" />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Visual Branding</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaRobot className="text-white text-2xl md:text-3xl" />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">AI-Powered Content</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaRocket className="text-white text-2xl md:text-3xl" />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Fast Turnaround</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaBullseye className="text-white text-2xl md:text-3xl" />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Strategy First</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaUsers className="text-white text-2xl md:text-3xl" />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Client Focused</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
