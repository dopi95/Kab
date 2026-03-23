'use client';

export default function AnimatedHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-[#171817] dark:via-gray-900 dark:to-[#2a2520]">
      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${(i * 8.3 + 2)}%`,
              top: `${(i % 4) * 25 + 5}%`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 py-24 sm:py-28 md:py-32 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-[#A97E50]/30 rounded-full px-4 py-1.5 mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-[#A97E50] animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-[#A97E50] tracking-wide uppercase">Creative Studio</span>
        </div>

        {/* Heading */}
        <h1 className="font-black leading-none tracking-tight mb-4 sm:mb-6">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">
            Kab
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent mt-1 sm:mt-2">
            Creative Lab
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xl mb-8 sm:mb-10 leading-relaxed">
          Where imagination comes alive — we craft brands, visuals, and stories that leave a lasting impression.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[200px] sm:max-w-none sm:w-auto">
          <a
            href="#services"
            className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
          >
            Our Services ✨
          </a>
          <a
            href="/contact"
            className="bg-white dark:bg-gray-800 border-2 border-[#A97E50] text-[#A97E50] dark:text-[#C4A86D] hover:bg-[#A97E50] hover:text-white dark:hover:bg-[#A97E50] font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg hover:scale-105 transition-all duration-300 text-center"
          >
            Get in Touch 💬
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#A97E50] to-transparent animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .star {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #C4A86D;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
