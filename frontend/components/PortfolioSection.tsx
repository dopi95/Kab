'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaImage, FaYoutube } from 'react-icons/fa';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  mediaFiles?: string[];
  youtubeUrl?: string;
}

export default function PortfolioSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'video', label: 'Video' },
    { id: 'photograph', label: 'Photograph' },
    { id: 'branding', label: 'Branding' },
  ];

  const filteredItems = activeFilter === 'all' 
    ? projects 
    : projects.filter(item => item.category === activeFilter);

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <FaPlay />;
      case 'youtube': return <FaYoutube />;
      default: return <FaImage />;
    }
  };

  return (
    <section id="portfolio" ref={sectionRef} className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#A97E50]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#C4A86D]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-sm font-semibold text-[#A97E50] uppercase tracking-wider mb-2">Our Work</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-3">
            Featured <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Showcasing creativity and excellence in every project
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] mx-auto rounded-full mt-3"></div>
        </div>

        {/* Animated Characters with Movement */}
        <div className={`relative h-64 mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Character 1 - Walking from left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-walk-from-left">
            <svg viewBox="0 0 200 320" className="w-28 h-44 md:w-36 md:h-56">
              <defs>
                <linearGradient id="skin1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFD4A3' }} />
                  <stop offset="100%" style={{ stopColor: '#FFBE8F' }} />
                </linearGradient>
                <linearGradient id="brand1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#A97E50' }} />
                  <stop offset="100%" style={{ stopColor: '#C4A86D' }} />
                </linearGradient>
              </defs>
              <g>
                <rect x="65" y="150" width="70" height="100" rx="10" fill="url(#brand1)" />
                <ellipse cx="50" cy="170" rx="16" ry="42" fill="url(#brand1)" transform="rotate(-25 50 170)" className="animate-wave" />
                <circle cx="38" cy="208" r="14" fill="url(#skin1)" />
                <ellipse cx="150" cy="170" rx="16" ry="42" fill="url(#brand1)" transform="rotate(25 150 170)" />
                <circle cx="162" cy="208" r="14" fill="url(#skin1)" />
                <rect x="75" y="245" width="22" height="55" rx="11" fill="#8B7355" className="animate-leg-left" />
                <ellipse cx="86" cy="305" rx="18" ry="10" fill="#C4A86D" />
                <rect x="103" y="245" width="22" height="55" rx="11" fill="#8B7355" className="animate-leg-right" />
                <ellipse cx="114" cy="305" rx="18" ry="10" fill="#C4A86D" />
                <circle cx="100" cy="105" r="48" fill="url(#skin1)" />
                <ellipse cx="100" y="78" rx="52" ry="42" fill="#654321" />
                <circle cx="73" cy="83" r="20" fill="#654321" />
                <circle cx="127" cy="83" r="20" fill="#654321" />
                <circle cx="85" cy="100" r="5" fill="#333" className="animate-blink" />
                <circle cx="115" cy="100" r="5" fill="#333" className="animate-blink" />
                <path d="M 88 120 Q 100 127 112 120" stroke="#A97E50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="73" cy="110" r="7" fill="#FFB6C1" opacity="0.6" />
                <circle cx="127" cy="110" r="7" fill="#FFB6C1" opacity="0.6" />
              </g>
            </svg>
          </div>

          {/* Character 2 - Walking from right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-walk-from-right">
            <svg viewBox="0 0 200 320" className="w-28 h-44 md:w-36 md:h-56 scale-x-[-1]">
              <g>
                <rect x="65" y="150" width="70" height="100" rx="10" fill="url(#brand1)" />
                <ellipse cx="50" cy="170" rx="16" ry="42" fill="url(#brand1)" transform="rotate(-20 50 170)" />
                <circle cx="40" cy="208" r="14" fill="url(#skin1)" />
                <ellipse cx="150" cy="170" rx="16" ry="42" fill="url(#brand1)" transform="rotate(35 150 170)" className="animate-wave" />
                <circle cx="165" cy="208" r="14" fill="url(#skin1)" />
                <rect x="75" y="245" width="22" height="55" rx="11" fill="#8B7355" className="animate-leg-right" />
                <ellipse cx="86" cy="305" rx="18" ry="10" fill="#C4A86D" />
                <rect x="103" y="245" width="22" height="55" rx="11" fill="#8B7355" className="animate-leg-left" />
                <ellipse cx="114" cy="305" rx="18" ry="10" fill="#C4A86D" />
                <circle cx="100" cy="105" r="48" fill="url(#skin1)" />
                <ellipse cx="100" y="78" rx="52" ry="42" fill="#8B4513" />
                <circle cx="73" cy="83" r="20" fill="#8B4513" />
                <circle cx="127" cy="83" r="20" fill="#8B4513" />
                <circle cx="85" cy="100" r="5" fill="#333" className="animate-blink" />
                <circle cx="115" cy="100" r="5" fill="#333" className="animate-blink" />
                <path d="M 88 120 Q 100 127 112 120" stroke="#A97E50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="73" cy="110" r="7" fill="#FFB6C1" opacity="0.6" />
                <circle cx="127" cy="110" r="7" fill="#FFB6C1" opacity="0.6" />
              </g>
            </svg>
          </div>

          {/* Text in center - appears after characters meet */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-text-appear">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
              Let's see our
            </p>
            <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent whitespace-nowrap">
              Projects
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === cat.id
                  ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 100 + 700}ms` }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-64 bg-gray-900 overflow-hidden">
                {item.type === 'youtube' && item.youtubeUrl ? (
                  <>
                    <img 
                      src={`https://img.youtube.com/vi/${item.youtubeUrl.split('v=')[1]?.split('&')[0] || item.youtubeUrl.split('youtu.be/')[1]?.split('?')[0]}/hqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <FaPlay className="text-white text-2xl ml-1" />
                      </div>
                    </div>
                  </>
                ) : item.mediaFiles && item.mediaFiles.length > 0 ? (
                  item.type === 'video' ? (
                    <video src={item.mediaFiles[0]} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                  ) : (
                    <img src={item.mediaFiles[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-5xl text-gray-400">{getIcon(item.type)}</div>
                  </div>
                )}
                {item.mediaFiles && item.mediaFiles.length > 1 && (
                  <span className="absolute top-3 right-3 bg-[#A97E50] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    +{item.mediaFiles.length}
                  </span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#A97E50] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#A97E50] uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className="text-[#C4A86D] group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedItem.title}</h3>
                <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-3xl">×</button>
              </div>
              
              <div className="mb-4">
                {selectedItem.type === 'youtube' && selectedItem.youtubeUrl && (
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedItem.youtubeUrl.split('v=')[1]?.split('&')[0] || selectedItem.youtubeUrl.split('youtu.be/')[1]?.split('?')[0]}?autoplay=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                )}
                {selectedItem.type === 'video' && selectedItem.mediaFiles && selectedItem.mediaFiles.length > 0 && (
                  <div className="space-y-4">
                    {selectedItem.mediaFiles.map((file: string, idx: number) => (
                      <video key={idx} controls autoPlay className="w-full rounded-lg">
                        <source src={file} type="video/mp4" />
                      </video>
                    ))}
                  </div>
                )}
                {selectedItem.type === 'image' && selectedItem.mediaFiles && selectedItem.mediaFiles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.mediaFiles.map((file: string, idx: number) => (
                      <img key={idx} src={file} alt={`${selectedItem.title} ${idx + 1}`} className="w-full rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedItem.description}</p>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-full text-sm font-semibold">
                {selectedItem.category}
              </span>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes walk-from-left {
          0% { transform: translateX(-200%) translateY(-50%); }
          100% { transform: translateX(0) translateY(-50%); }
        }
        @keyframes walk-from-right {
          0% { transform: translateX(200%) translateY(-50%); }
          100% { transform: translateX(0) translateY(-50%); }
        }
        @keyframes text-appear {
          0%, 70% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes leg-left {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes leg-right {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(0); }
        }
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        .animate-walk-from-left { animation: walk-from-left 2s ease-out forwards; }
        .animate-walk-from-right { animation: walk-from-right 2s ease-out forwards; }
        .animate-text-appear { animation: text-appear 2.5s ease-out forwards; }
        .animate-wave { animation: wave 1.5s ease-in-out infinite; transform-origin: 50px 170px; }
        .animate-leg-left { animation: leg-left 0.8s ease-in-out infinite; }
        .animate-leg-right { animation: leg-right 0.8s ease-in-out infinite; }
        .animate-blink { animation: blink 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
