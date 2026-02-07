'use client';

import { useEffect, useRef, useState } from 'react';
import { FaVideo, FaPalette, FaRobot, FaCamera, FaBullhorn, FaCode } from 'react-icons/fa';

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const services = [
    { icon: FaVideo, title: 'Video Production', desc: 'Professional video content that captures attention and drives engagement' },
    { icon: FaPalette, title: 'Visual Branding', desc: 'Distinctive brand identities that stand out in the market' },
    { icon: FaRobot, title: 'AI Content', desc: 'Smart content solutions powered by cutting-edge AI technology' },
    { icon: FaCamera, title: 'Photography', desc: 'Stunning visuals that tell your brand story perfectly' },
    { icon: FaBullhorn, title: 'Marketing', desc: 'Strategic campaigns that convert attention into results' },
    { icon: FaCode, title: 'Web Design', desc: 'Modern, responsive websites that deliver exceptional experiences' },
  ];

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

  useEffect(() => {
    if (isVisible && !animationComplete) {
      const interval = setInterval(() => {
        setActiveService((prev) => {
          if (prev >= services.length - 1) {
            clearInterval(interval);
            setAnimationComplete(true);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isVisible, animationComplete, services.length]);

  return (
    <section id="services" ref={sectionRef} className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#A97E50]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#C4A86D]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
            Our <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Services</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] mx-auto rounded-full"></div>
        </div>

        {/* Mobile Layout - Character moves down with services */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Character - Mobile - Moves down then up */}
            <div className="absolute left-4 z-10" style={{
              top: animationComplete ? '0px' : `${activeService * 100}px`,
              transition: animationComplete ? 'top 1.5s ease-in-out' : 'top 0.6s ease-out'
            }}>
              <svg viewBox="0 0 100 200" className="w-24 h-32">
                <defs>
                  <linearGradient id="skinGradMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFD4A3', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FFBE8F', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="brandGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#A97E50', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#C4A86D', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                <g className="animate-float-slow">
                  <rect x="15" y="80" width="70" height="90" rx="10" fill="url(#brandGradMobile)" />
                  
                  <g className="arm-left">
                    <ellipse cx="5" cy="95" rx="14" ry="40" fill="url(#brandGradMobile)" transform="rotate(-10 5 95)" />
                    <circle cx="0" cy="130" r="12" fill="url(#skinGradMobile)" />
                  </g>

                  <g className="arm-right" style={{
                    transform: 'rotate(40deg)',
                    transformOrigin: '95px 95px',
                    transition: 'transform 0.5s ease-out'
                  }}>
                    <ellipse cx="95" cy="95" rx="14" ry="40" fill="url(#brandGradMobile)" transform="rotate(10 95 95)" />
                    <circle cx="100" cy="130" r="12" fill="url(#skinGradMobile)" />
                    <circle cx="105" cy="135" r="6" fill="#C4A86D" opacity="0.8" className="animate-pulse" />
                  </g>

                  <g className="leg-left animate-walk">
                    <rect x="25" y="165" width="18" height="30" rx="9" fill="#8B7355" />
                  </g>

                  <g className="leg-right animate-walk-reverse">
                    <rect x="47" y="165" width="18" height="30" rx="9" fill="#8B7355" />
                  </g>

                  <circle cx="50" cy="50" r="40" fill="url(#skinGradMobile)" />

                  <g className="hair">
                    <ellipse cx="50" cy="25" rx="45" ry="35" fill="#654321" />
                    <circle cx="30" cy="30" r="16" fill="#654321" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <circle cx="70" cy="30" r="16" fill="#654321" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </g>

                  <g className="face">
                    <circle cx="38" cy="48" r="4" fill="#333" className="animate-blink" />
                    <circle cx="62" cy="48" r="4" fill="#333" className="animate-blink" style={{ animationDelay: '0.1s' }} />
                    <path d="M 42 62 Q 50 68 58 62" stroke="#A97E50" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Services - Mobile */}
            <div className="ml-28 grid grid-cols-1 gap-4 pr-2" style={{
              minHeight: `${services.length * 110 + 200}px`
            }}>
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = index <= activeService && isVisible;
                return (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 transition-all duration-700 transform ${
                      isActive
                        ? 'opacity-100 translate-x-0 scale-100 border-[#A97E50]'
                        : 'opacity-0 translate-x-20 scale-95 border-transparent'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 150}ms`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="flex gap-8 items-start max-w-7xl mx-auto">
            {/* Character 1 - Left - Desktop */}
            <div className="w-48 flex-shrink-0 relative" style={{ height: `${Math.max(800, services.length * 120)}px` }}>
              <div className="sticky top-4" style={{
                transform: animationComplete ? 'translateY(0)' : `translateY(${activeService * 120}px)`,
                transition: animationComplete ? 'transform 1.5s ease-in-out' : 'transform 0.6s ease-out'
              }}>
                <svg viewBox="0 0 200 500" className="w-full h-auto">
                  <defs>
                    <linearGradient id="skinGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FFD4A3', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FFBE8F', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="brandGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#A97E50', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#C4A86D', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>

                  <g className="animate-float-slow">
                    <rect x="65" y="280" width="70" height="110" rx="10" fill="url(#brandGrad2)" />
                    
                    <g className="arm-left-char1">
                      <ellipse cx="55" cy="300" rx="16" ry="45" fill="url(#brandGrad2)" transform="rotate(-20 55 300)" />
                      <circle cx="45" cy="340" r="14" fill="url(#skinGrad2)" />
                    </g>

                    <g className="arm-right-char1" style={{
                      transform: 'rotate(40deg)',
                      transformOrigin: '145px 300px'
                    }}>
                      <ellipse cx="145" cy="300" rx="16" ry="45" fill="url(#brandGrad2)" transform="rotate(20 145 300)" />
                      <circle cx="155" cy="340" r="14" fill="url(#skinGrad2)" />
                      <circle cx="160" cy="345" r="8" fill="#C4A86D" opacity="0.8" className="animate-pulse" />
                    </g>

                    <g className="leg-left animate-walk">
                      <rect x="75" y="385" width="22" height="65" rx="11" fill="#8B7355" />
                      <ellipse cx="86" cy="455" rx="18" ry="10" fill="#C4A86D" />
                    </g>

                    <g className="leg-right animate-walk-reverse">
                      <rect x="103" y="385" width="22" height="65" rx="11" fill="#8B7355" />
                      <ellipse cx="114" cy="455" rx="18" ry="10" fill="#C4A86D" />
                    </g>

                    <circle cx="100" cy="230" r="50" fill="url(#skinGrad2)" />

                    <g className="hair">
                      <ellipse cx="100" cy="200" rx="55" ry="45" fill="#654321" />
                      <circle cx="75" cy="205" r="20" fill="#654321" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <circle cx="125" cy="205" r="20" fill="#654321" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </g>

                    <g className="face">
                      <circle cx="85" cy="225" r="5" fill="#333" className="animate-blink" />
                      <circle cx="115" cy="225" r="5" fill="#333" className="animate-blink" style={{ animationDelay: '0.1s' }} />
                      <path d="M 90 245 Q 100 252 110 245" stroke="#A97E50" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <circle cx="75" cy="235" r="6" fill="#FFB6C1" opacity="0.6" />
                      <circle cx="125" cy="235" r="6" fill="#FFB6C1" opacity="0.6" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>

            {/* Services Grid - Center - Desktop */}
            <div className="flex-1 max-w-3xl grid grid-cols-1 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = index <= activeService && isVisible;
                return (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-2 transition-all duration-700 transform min-h-[140px] ${
                      isActive
                        ? 'opacity-100 translate-x-0 scale-100 border-[#A97E50]'
                        : 'opacity-0 translate-x-20 scale-95 border-transparent'
                    } hover:shadow-2xl hover:scale-105`}
                    style={{ 
                      transitionDelay: `${index * 150}ms`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Character 2 - Right - Desktop */}
            <div className="w-48 flex-shrink-0 relative" style={{ height: `${Math.max(800, services.length * 120)}px` }}>
              <div className="sticky top-4" style={{
                transform: animationComplete ? 'translateY(0)' : `translateY(${activeService * 120}px)`,
                transition: animationComplete ? 'transform 1.5s ease-in-out' : 'transform 0.6s ease-out'
              }}>
                <svg viewBox="0 0 200 500" className="w-full h-auto">
                  <g className="animate-float-slow" style={{ animationDelay: '1s' }}>
                    <rect x="65" y="280" width="70" height="110" rx="10" fill="url(#brandGrad2)" />
                    
                    <g className="arm-left-char2" style={{
                      transform: 'rotate(-40deg)',
                      transformOrigin: '55px 300px'
                    }}>
                      <ellipse cx="55" cy="300" rx="16" ry="45" fill="url(#brandGrad2)" transform="rotate(-20 55 300)" />
                      <circle cx="45" cy="340" r="14" fill="url(#skinGrad2)" />
                      <circle cx="40" cy="345" r="8" fill="#C4A86D" opacity="0.8" className="animate-pulse" />
                    </g>

                    <g className="arm-right-char2">
                      <ellipse cx="145" cy="300" rx="16" ry="45" fill="url(#brandGrad2)" transform="rotate(20 145 300)" />
                      <circle cx="155" cy="340" r="14" fill="url(#skinGrad2)" />
                    </g>

                    <g className="leg-left animate-walk">
                      <rect x="75" y="385" width="22" height="65" rx="11" fill="#8B7355" />
                      <ellipse cx="86" cy="455" rx="18" ry="10" fill="#C4A86D" />
                    </g>

                    <g className="leg-right animate-walk-reverse">
                      <rect x="103" y="385" width="22" height="65" rx="11" fill="#8B7355" />
                      <ellipse cx="114" cy="455" rx="18" ry="10" fill="#C4A86D" />
                    </g>

                    <circle cx="100" cy="230" r="50" fill="url(#skinGrad2)" />

                    <g className="hair">
                      <ellipse cx="100" cy="200" rx="55" ry="45" fill="#8B4513" />
                      <circle cx="75" cy="205" r="20" fill="#8B4513" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <circle cx="125" cy="205" r="20" fill="#8B4513" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </g>

                    <g className="face">
                      <circle cx="85" cy="225" r="5" fill="#333" className="animate-blink" />
                      <circle cx="115" cy="225" r="5" fill="#333" className="animate-blink" style={{ animationDelay: '0.1s' }} />
                      <path d="M 90 245 Q 100 252 110 245" stroke="#A97E50" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <circle cx="75" cy="235" r="6" fill="#FFB6C1" opacity="0.6" />
                      <circle cx="125" cy="235" r="6" fill="#FFB6C1" opacity="0.6" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9) rotate(5deg); 
          }
          60% { 
            transform: translateY(-5px) scale(1.02) rotate(-1deg); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1) rotate(0deg); 
          }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes walk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes walk-reverse {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(0); }
        }

        .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
        .animate-walk { animation: walk 1s ease-in-out infinite; }
        .animate-walk-reverse { animation: walk-reverse 1s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
