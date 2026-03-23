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
      <style jsx>{``}</style>
    </section>
  );
}
