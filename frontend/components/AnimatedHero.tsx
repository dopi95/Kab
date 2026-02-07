'use client';

import { useEffect, useState } from 'react';

export default function AnimatedHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-[#171817] dark:via-gray-900 dark:to-[#2a2520]">
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-20 relative z-10 h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center w-full">
          <div className="text-center md:text-left animate-slideInLeft order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
              <span className="inline-block animate-bounce">K</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>a</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>b</span>
              <br />
              <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent animate-pulse">Creative Lab</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8">
              Where imagination comes alive! ✨
            </p>
            <div className="flex flex-row gap-2 sm:gap-4 justify-center md:justify-start mt-[60px] sm:mt-0">
              <a href="#services" className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] hover:shadow-2xl text-white font-bold py-2 px-5 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-full text-xs sm:text-lg md:text-xl transform hover:scale-110 transition-all duration-300">
                Services ✨
              </a>
              <a href="#contact" className="bg-white dark:bg-gray-800 border-2 border-[#A97E50] text-[#A97E50] dark:text-[#C4A86D] hover:bg-[#A97E50] hover:text-white dark:hover:bg-[#A97E50] font-bold py-2 px-5 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-full text-xs sm:text-lg md:text-xl transform hover:scale-110 transition-all duration-300">
                Contact 💬
              </a>
            </div>
          </div>

          <div className="relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[600px] order-1 md:order-2">
            <svg viewBox="0 0 400 600" className="w-full h-full max-w-md mx-auto md:max-w-full">
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFD4A3', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FFBE8F', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#A97E50', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#C4A86D', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              <g className="character-main" style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}>
                <ellipse cx="200" cy="580" rx="80" ry="15" fill="rgba(0,0,0,0.2)" className="animate-pulse" />

                <g className="animate-float">
                  <rect x="160" y="380" width="80" height="120" rx="10" fill="url(#brandGrad)" className="body" />
                  
                  <g className="arm-left animate-wave">
                    <ellipse cx="145" cy="400" rx="18" ry="50" fill="url(#brandGrad)" transform="rotate(-20 145 400)" />
                    <circle cx="140" cy="445" r="15" fill="url(#skinGrad)" />
                  </g>

                  <g className="arm-right animate-wave-reverse">
                    <ellipse cx="255" cy="400" rx="18" ry="50" fill="url(#brandGrad)" transform="rotate(20 255 400)" />
                    <circle cx="260" cy="445" r="15" fill="url(#skinGrad)" />
                  </g>

                  <g className="leg-left animate-walk">
                    <rect x="170" y="495" width="25" height="70" rx="12" fill="#8B7355" />
                    <ellipse cx="182" cy="570" rx="20" ry="12" fill="#C4A86D" />
                  </g>

                  <g className="leg-right animate-walk-reverse">
                    <rect x="205" y="495" width="25" height="70" rx="12" fill="#8B7355" />
                    <ellipse cx="217" cy="570" rx="20" ry="12" fill="#C4A86D" />
                  </g>

                  <circle cx="200" cy="320" r="60" fill="url(#skinGrad)" className="head" />

                  <g className="hair">
                    <ellipse cx="200" cy="280" rx="65" ry="50" fill="#8B4513" />
                    <circle cx="170" cy="285" r="25" fill="#8B4513" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <circle cx="230" cy="285" r="25" fill="#8B4513" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </g>

                  <g className="face">
                    <g className="eye-left animate-blink">
                      <ellipse cx="180" cy="315" rx="12" ry="15" fill="white" />
                      <circle cx="182" cy="318" r="8" fill="#333" />
                      <circle cx="185" cy="315" r="3" fill="white" />
                    </g>
                    <g className="eye-right animate-blink" style={{ animationDelay: '0.1s' }}>
                      <ellipse cx="220" cy="315" rx="12" ry="15" fill="white" />
                      <circle cx="222" cy="318" r="8" fill="#333" />
                      <circle cx="225" cy="315" r="3" fill="white" />
                    </g>
                    <path d="M 185 340 Q 200 350 215 340" stroke="#A97E50" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-smile" />
                    <circle cx="170" cy="330" r="8" fill="#FFB6C1" opacity="0.6" />
                    <circle cx="230" cy="330" r="8" fill="#FFB6C1" opacity="0.6" />
                  </g>
                </g>
              </g>

              <g className="character-friend hidden sm:block" style={{ transform: `translate(${-mousePos.x * 0.015}px, ${mousePos.y * 0.015}px)` }}>
                <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                  <circle cx="320" cy="250" r="40" fill="#C4A86D" />
                  <circle cx="305" cy="240" r="8" fill="#333" className="animate-blink" />
                  <circle cx="335" cy="240" r="8" fill="#333" className="animate-blink" style={{ animationDelay: '0.2s' }} />
                  <path d="M 310 260 Q 320 268 330 260" stroke="#A97E50" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <rect x="300" y="285" width="40" height="50" rx="8" fill="url(#brandGrad)" />
                  <circle cx="295" cy="300" r="10" fill="#C4A86D" className="animate-wiggle" />
                  <circle cx="345" cy="300" r="10" fill="#C4A86D" className="animate-wiggle" style={{ animationDelay: '0.3s' }} />
                </g>
              </g>

              <g className="character-pet hidden md:block">
                <g className="animate-jump" style={{ transformOrigin: '80px 450px' }}>
                  <ellipse cx="80" cy="450" rx="35" ry="30" fill="#D4A574" />
                  <circle cx="70" cy="440" r="6" fill="#333" />
                  <circle cx="90" cy="440" r="6" fill="#333" />
                  <ellipse cx="50" cy="430" rx="15" ry="8" fill="#D4A574" className="animate-wiggle" />
                  <ellipse cx="110" cy="430" rx="15" ry="8" fill="#D4A574" className="animate-wiggle" style={{ animationDelay: '0.2s' }} />
                  <path d="M 75 450 Q 80 455 85 450" stroke="#333" strokeWidth="2" fill="none" />
                </g>
              </g>

              {[...Array(5)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + i * 80}
                  cy={100 + Math.sin(i) * 50}
                  r="20"
                  fill={['#A97E50', '#C4A86D', '#D4A574', '#E5C89F', '#F5E6D3'][i]}
                  opacity="0.5"
                  className="animate-float hidden lg:block"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-40deg); }
        }
        @keyframes wave-reverse {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(40deg); }
        }
        @keyframes walk {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes walk-reverse {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(0px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes smile {
          0%, 100% { d: path('M 185 340 Q 200 350 215 340'); }
          50% { d: path('M 185 340 Q 200 355 215 340'); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes jump {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-wave { animation: wave 2s ease-in-out infinite; transform-origin: 145px 380px; }
        .animate-wave-reverse { animation: wave-reverse 2s ease-in-out infinite; transform-origin: 255px 380px; }
        .animate-walk { animation: walk 1s ease-in-out infinite; }
        .animate-walk-reverse { animation: walk-reverse 1s ease-in-out infinite; }
        .animate-blink { animation: blink 4s ease-in-out infinite; }
        .animate-smile { animation: smile 2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 1.5s ease-in-out infinite; }
        .animate-jump { animation: jump 1.5s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 1s ease-out; }
        
        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #C4A86D;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
