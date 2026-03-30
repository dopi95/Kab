'use client';

export default function AnimatedHero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-[#171817] dark:via-gray-900 dark:to-[#2a2520]">

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="star" style={{ left: `${(i * 7.1 + 3)}%`, top: `${(i % 5) * 20 + 4}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-10 py-4 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-8 lg:gap-20">

        {/* Character — top on mobile, right on desktop */}
        <div className="order-1 lg:order-2 flex-shrink-0 w-32 sm:w-48 lg:w-64">
          <div className="animate-float">
            <svg viewBox="0 0 160 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDDBB4" />
                  <stop offset="100%" stopColor="#F5C28A" />
                </linearGradient>
                <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A97E50" />
                  <stop offset="100%" stopColor="#C4A86D" />
                </linearGradient>
              </defs>

              {/* Ground shadow */}
              <ellipse cx="80" cy="274" rx="38" ry="6" fill="rgba(0,0,0,0.10)" className="animate-shadow" />

              {/* === LEGS === */}
              {/* Left leg */}
              <g className="animate-leg-l" style={{ transformOrigin: '65px 195px' }}>
                <rect x="57" y="195" width="18" height="52" rx="9" fill="#7A6040" />
                {/* Left shoe */}
                <ellipse cx="66" cy="250" rx="14" ry="7" fill="#3D2B1F" />
                <ellipse cx="72" cy="249" rx="6" ry="5" fill="#4A3525" />
              </g>
              {/* Right leg */}
              <g className="animate-leg-r" style={{ transformOrigin: '95px 195px' }}>
                <rect x="85" y="195" width="18" height="52" rx="9" fill="#7A6040" />
                {/* Right shoe */}
                <ellipse cx="94" cy="250" rx="14" ry="7" fill="#3D2B1F" />
                <ellipse cx="100" cy="249" rx="6" ry="5" fill="#4A3525" />
              </g>

              {/* === BODY === */}
              <rect x="52" y="130" width="56" height="70" rx="14" fill="url(#brand)" />
              {/* Shirt collar V */}
              <path d="M 72 130 L 80 148 L 88 130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinejoin="round" />
              {/* Shirt pocket */}
              <rect x="58" y="148" width="16" height="12" rx="3" fill="rgba(255,255,255,0.15)" />

              {/* === LEFT ARM — waving up === */}
              <g className="animate-wave" style={{ transformOrigin: '54px 138px' }}>
                <rect x="38" y="130" width="18" height="46" rx="9" fill="url(#brand)" transform="rotate(-15 54 138)" />
                {/* Left hand */}
                <circle cx="34" cy="170" r="11" fill="url(#skin)" />
                {/* Fingers */}
                <rect x="26" y="160" width="7" height="12" rx="3.5" fill="url(#skin)" transform="rotate(-20 26 160)" />
                <rect x="33" y="158" width="7" height="13" rx="3.5" fill="url(#skin)" transform="rotate(-5 33 158)" />
                <rect x="40" y="160" width="7" height="12" rx="3.5" fill="url(#skin)" transform="rotate(10 40 160)" />
              </g>

              {/* === RIGHT ARM — relaxed === */}
              <g className="animate-sway" style={{ transformOrigin: '106px 138px' }}>
                <rect x="104" y="130" width="18" height="46" rx="9" fill="url(#brand)" transform="rotate(12 106 138)" />
                {/* Right hand */}
                <circle cx="124" cy="170" r="11" fill="url(#skin)" />
              </g>

              {/* === NECK === */}
              <rect x="72" y="118" width="16" height="16" rx="6" fill="url(#skin)" />

              {/* === HEAD === */}
              <circle cx="80" cy="90" r="40" fill="url(#skin)" />

              {/* === HAIR === */}
              <ellipse cx="80" cy="62" rx="42" ry="32" fill="#2C1A0E" />
              <ellipse cx="56" cy="70" rx="16" ry="20" fill="#2C1A0E" />
              <ellipse cx="104" cy="70" rx="16" ry="20" fill="#2C1A0E" />
              {/* Hair shine */}
              <ellipse cx="70" cy="58" rx="10" ry="5" fill="#4A2E1A" opacity="0.6" />

              {/* === FACE === */}
              {/* Left eye */}
              <g className="animate-blink" style={{ transformOrigin: '68px 88px' }}>
                <ellipse cx="68" cy="88" rx="7" ry="8.5" fill="white" />
                <circle cx="70" cy="90" r="4.5" fill="#1A0A00" />
                <circle cx="71.5" cy="88" r="1.8" fill="white" />
              </g>
              {/* Right eye */}
              <g className="animate-blink" style={{ transformOrigin: '92px 88px', animationDelay: '0.1s' }}>
                <ellipse cx="92" cy="88" rx="7" ry="8.5" fill="white" />
                <circle cx="94" cy="90" r="4.5" fill="#1A0A00" />
                <circle cx="95.5" cy="88" r="1.8" fill="white" />
              </g>

              {/* Eyebrows */}
              <path d="M 60 77 Q 68 73 76 77" stroke="#2C1A0E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 84 77 Q 92 73 100 77" stroke="#2C1A0E" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Nose */}
              <ellipse cx="80" cy="100" rx="3" ry="2" fill="rgba(180,120,60,0.3)" />

              {/* Smile */}
              <path d="M 68 110 Q 80 122 92 110" stroke="#A97E50" strokeWidth="2.8" fill="none" strokeLinecap="round" />

              {/* Cheeks */}
              <circle cx="58" cy="100" r="7" fill="#FFB6C1" opacity="0.5" />
              <circle cx="102" cy="100" r="7" fill="#FFB6C1" opacity="0.5" />

              {/* === SPEECH BUBBLE === */}
              <g className="animate-bubble">
                <rect x="96" y="14" width="58" height="36" rx="10" fill="white" stroke="#A97E50" strokeWidth="2" />
                <path d="M 104 50 L 96 60 L 114 50" fill="white" stroke="#A97E50" strokeWidth="2" strokeLinejoin="round" />
                <text x="125" y="30" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#A97E50">Hello!</text>
                <text x="125" y="42" textAnchor="middle" fontSize="6.5" fill="#888">Let's create!</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-[#A97E50]/30 rounded-full px-3 py-1 mb-3 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#A97E50] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#A97E50] tracking-wide uppercase">Creative Studio</span>
          </div>

          {/* Heading */}
          <h1 className="font-black leading-none tracking-tight mb-2 sm:mb-6">
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">
              Kab
            </span>
            <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent mt-1">
              Creative Lab
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mb-4 sm:mb-8 leading-relaxed">
            Where imagination comes alive — we craft brands, visuals, and stories that leave a lasting impression.
          </p>

          {/* Buttons */}
          <div className="flex flex-row gap-2 sm:gap-4">
            <a href="#services" className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-bold px-4 py-2 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center">
              Our Services
            </a>
            <a href="/contact" className="bg-white dark:bg-gray-800 border-2 border-[#A97E50] text-[#A97E50] dark:text-[#C4A86D] hover:bg-[#A97E50] hover:text-white dark:hover:bg-[#A97E50] font-bold px-4 py-2 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base hover:scale-105 transition-all duration-300 text-center">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#A97E50] to-transparent animate-pulse"></div>
      </div>

      <style jsx>{`
        /* Stars */
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .star {
          position: absolute;
          width: 4px; height: 4px;
          background: #C4A86D;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }

        /* Float body */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        .animate-float { animation: float 3.5s ease-in-out infinite; }

        /* Ground shadow shrinks as character floats up */
        @keyframes shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.10; }
          50% { transform: scaleX(0.65); opacity: 0.04; }
        }
        .animate-shadow { animation: shadow 3.5s ease-in-out infinite; }

        /* Wave arm */
        @keyframes wave {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-35deg); }
          40%  { transform: rotate(5deg); }
          60%  { transform: rotate(-30deg); }
          80%  { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave { animation: wave 2.2s ease-in-out infinite; }

        /* Right arm gentle sway */
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-sway { animation: sway 3s ease-in-out infinite; }

        /* Legs alternating */
        @keyframes leg-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        @keyframes leg-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
        .animate-leg-l { animation: leg-l 1.4s ease-in-out infinite; }
        .animate-leg-r { animation: leg-r 1.4s ease-in-out infinite; }

        /* Blink */
        @keyframes blink {
          0%, 85%, 100% { transform: scaleY(1); }
          92% { transform: scaleY(0.05); }
        }
        .animate-blink { animation: blink 4.5s ease-in-out infinite; }

        /* Speech bubble */
        @keyframes bubble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.04); }
        }
        .animate-bubble { animation: bubble 3.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
