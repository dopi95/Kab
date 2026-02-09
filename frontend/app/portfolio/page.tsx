'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

interface Founder {
  name: string;
  message: string;
  images: string[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  mediaFiles?: string[];
  youtubeUrl?: string;
}

interface Portfolio {
  heroImages: string[];
  aboutText: string;
  experienceYears: string;
  skills: string[];
  experiences: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  sampleWorks: {
    title: string;
    description: string;
    type: 'image' | 'video' | 'youtube';
    mediaUrls?: string[];
    youtubeUrl?: string;
  }[];
}

export default function PortfolioPage() {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [heroInView, setHeroInView] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);
  const [skillsInView, setSkillsInView] = useState(false);
  const [expInView, setExpInView] = useState(false);
  const [worksInView, setWorksInView] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchFounder();
    fetchPortfolio();
    fetchProjects();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setHeroInView(true);
              setTimeout(() => setIsVisible(true), 2000);
            }
            if (entry.target === aboutRef.current) setAboutInView(true);
            if (entry.target === skillsRef.current) setSkillsInView(true);
            if (entry.target === expRef.current) setExpInView(true);
            if (entry.target === worksRef.current) setWorksInView(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (skillsRef.current) observer.observe(skillsRef.current);
    if (expRef.current) observer.observe(expRef.current);
    if (worksRef.current) observer.observe(worksRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (!selectedProject || !isAutoPlay || !selectedProject.mediaFiles || selectedProject.mediaFiles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % selectedProject.mediaFiles!.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedProject, isAutoPlay, currentMediaIndex]);

  const fetchFounder = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder`);
      const data = await res.json();
      if (data.success && data.data) setFounder(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`);
      const data = await res.json();
      if (data.success) setPortfolio(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data.slice(0, 6));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const skills = [
    'Creative Direction', 'Brand Strategy', 'UI/UX Design', 'Video Production',
    'Photography', 'Digital Marketing', 'Content Creation', 'Project Management'
  ];

  const experiences = [
    { title: 'Founder & Creative Director', company: 'Kab Creative Lab', period: '2020 - Present', desc: 'Leading creative projects and building innovative solutions for clients worldwide.' },
    { title: 'Senior Designer', company: 'Creative Agency', period: '2017 - 2020', desc: 'Developed creative strategies and managed design teams for major brands.' },
    { title: 'Designer', company: 'Digital Studio', period: '2015 - 2017', desc: 'Created compelling visual designs and brand identities.' }
  ];

  return (
    <>
      <Header />
      <main className="pt-20 overflow-x-hidden">
        {/* Hero Section with Overlapping Images */}
        <section ref={heroRef} className="flex items-center justify-center bg-gradient-to-br from-[#A97E50] to-[#C4A86D] relative overflow-hidden py-4 md:py-6 mt-8 pb-20 md:pb-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Animated Characters with Name & Social Icons */}
              <div className="relative mb-0">
                {/* Animated Characters */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="animate-walk-hero">
                    <svg viewBox="0 0 200 320" className="w-16 h-24 md:w-20 md:h-32 drop-shadow-xl">
                      <defs>
                        <linearGradient id="skinHero" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FFD4A3' }} />
                          <stop offset="100%" style={{ stopColor: '#FFBE8F' }} />
                        </linearGradient>
                      </defs>
                      <g className="animate-body-bounce">
                        <rect x="70" y="160" width="60" height="90" rx="12" fill="white" opacity="0.9" />
                        <ellipse cx="55" cy="175" rx="16" ry="40" fill="white" opacity="0.9" className="animate-arm-swing-left" style={{ transformOrigin: '55px 165px' }} />
                        <ellipse cx="145" cy="175" rx="16" ry="40" fill="white" opacity="0.9" className="animate-arm-swing-right" style={{ transformOrigin: '145px 165px' }} />
                        <rect x="78" y="245" width="20" height="50" rx="10" fill="white" opacity="0.8" className="animate-leg-walk-left" style={{ transformOrigin: '88px 245px' }} />
                        <rect x="102" y="245" width="20" height="50" rx="10" fill="white" opacity="0.8" className="animate-leg-walk-right" style={{ transformOrigin: '112px 245px' }} />
                        <circle cx="100" cy="110" r="48" fill="url(#skinHero)" />
                        <ellipse cx="100" cy="80" rx="52" ry="40" fill="#654321" />
                        <circle cx="85" cy="105" r="5" fill="#333" />
                        <circle cx="115" cy="105" r="5" fill="#333" />
                        <path d="M 88 125 Q 100 130 112 125" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>
                  <div className="animate-walk-hero-reverse">
                    <svg viewBox="0 0 200 320" className="w-16 h-24 md:w-20 md:h-32 drop-shadow-xl scale-x-[-1]">
                      <g className="animate-body-bounce-delayed">
                        <rect x="70" y="160" width="60" height="90" rx="12" fill="white" opacity="0.9" />
                        <ellipse cx="55" cy="175" rx="16" ry="40" fill="white" opacity="0.9" className="animate-arm-swing-right" style={{ transformOrigin: '55px 165px' }} />
                        <ellipse cx="145" cy="175" rx="16" ry="40" fill="white" opacity="0.9" className="animate-arm-swing-left" style={{ transformOrigin: '145px 165px' }} />
                        <rect x="78" y="245" width="20" height="50" rx="10" fill="white" opacity="0.8" className="animate-leg-walk-right" style={{ transformOrigin: '88px 245px' }} />
                        <rect x="102" y="245" width="20" height="50" rx="10" fill="white" opacity="0.8" className="animate-leg-walk-left" style={{ transformOrigin: '112px 245px' }} />
                        <circle cx="100" cy="110" r="48" fill="url(#skinHero)" />
                        <ellipse cx="100" cy="80" rx="52" ry="40" fill="#8B4513" />
                        <circle cx="85" cy="105" r="5" fill="#333" />
                        <circle cx="115" cy="105" r="5" fill="#333" />
                        <path d="M 88 125 Q 100 130 112 125" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Name & Social Icons */}
                <div className={`text-center transition-all duration-1000 mt-6 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-3 animate-fade-in">
                    {founder?.name || 'Yared Abebayehu'}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-3 md:mb-4 font-light">Creative Director & Founder</p>
                  
                  {/* Social Icons */}
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
                    {[FaEnvelope, FaWhatsapp, FaInstagram, FaLinkedin].map((Icon, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white hover:text-[#A97E50] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 animate-bounce-in"
                        style={{ animationDelay: `${idx * 100 + 400}ms` }}
                      >
                        <Icon size={20} className="md:w-6 md:h-6" />
                      </a>
                    ))}
                  </div>

                  {/* Overlapping Images */}
                  <div className="flex justify-center items-center">
                    <div className="relative w-full max-w-3xl h-64 md:h-80">
                      {portfolio?.heroImages && portfolio.heroImages.length > 0 ? (
                        portfolio.heroImages.map((img, idx) => {
                          const rotations = ['-8deg', '4deg', '8deg'];
                          const isActive = activeImage === idx;
                          return (
                          <div
                            key={idx}
                            className={`absolute w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-1000 ${
                              idx === 0 ? 'left-0 md:left-10 top-0 animate-slide-in-left' :
                              idx === 1 ? 'left-1/2 -translate-x-1/2 top-4 md:top-8 animate-slide-in-up' :
                              'right-0 md:right-10 top-0 animate-slide-in-right'
                            } ${
                              isActive ? 'scale-110 z-30 opacity-100' : 'scale-90 opacity-70'
                            }`}
                            style={{ 
                              animationDelay: `${idx * 200 + 600}ms`,
                              rotate: isActive ? '0deg' : rotations[idx],
                              zIndex: isActive ? 30 : idx === 1 ? 20 : 10
                            }}
                          >
                            <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        );}
                        )
                      ) : (
                        ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500', 
                         'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500', 
                         'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500'].map((img, idx) => {
                          const rotations = ['-8deg', '4deg', '8deg'];
                          const isActive = activeImage === idx;
                          return (
                          <div
                            key={idx}
                            className={`absolute w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-1000 ${
                              idx === 0 ? 'left-0 md:left-10 top-0 animate-slide-in-left' :
                              idx === 1 ? 'left-1/2 -translate-x-1/2 top-4 md:top-8 animate-slide-in-up' :
                              'right-0 md:right-10 top-0 animate-slide-in-right'
                            } ${
                              isActive ? 'scale-110 z-30 opacity-100' : 'scale-90 opacity-70'
                            }`}
                            style={{ 
                              animationDelay: `${idx * 200 + 600}ms`,
                              rotate: isActive ? '0deg' : rotations[idx],
                              zIndex: isActive ? 30 : idx === 1 ? 20 : 10
                            }}
                          >
                            <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        );}
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section ref={aboutRef} className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${aboutInView ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`transition-all duration-1000 delay-200 ${aboutInView ? 'translate-x-0' : '-translate-x-20'}`}>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                    About <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Me</span>
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {portfolio?.aboutText || founder?.message || 'Passionate creative professional with years of experience in design, branding, and innovation. I founded Kab Creative Lab to help businesses transform their ideas into reality through exceptional design and creative solutions.'}
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    My journey in the creative industry has been driven by a commitment to excellence and a passion for pushing boundaries in design and innovation.
                  </p>
                </div>
                <div className={`relative transition-all duration-1000 delay-400 ${aboutInView ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                  <div className="relative w-full h-96">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-2xl transform rotate-6 animate-pulse"></div>
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-black text-[#A97E50] mb-4">{portfolio?.experienceYears || '10+'}</div>
                        <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">Years Experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section ref={skillsRef} className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className={`text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white mb-12 transition-all duration-1000 ${skillsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                Skills & <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Expertise</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(portfolio?.skills && portfolio.skills.length > 0 ? portfolio.skills : skills).map((skill, idx) => (
                  <div
                    key={idx}
                    className={`group relative bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-3 overflow-hidden ${
                      skillsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A97E50]/10 to-[#C4A86D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-xl mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                        {idx + 1}
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#A97E50] transition-colors duration-300">{skill}</p>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section ref={expRef} className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white mb-12 transition-all duration-1000 ${expInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                My <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Experience</span>
              </h2>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A97E50] via-[#C4A86D] to-[#A97E50] animate-pulse"></div>
                {(portfolio?.experiences && portfolio.experiences.length > 0 ? portfolio.experiences : experiences).map((exp, idx) => (
                  <div
                    key={idx}
                    className={`relative pl-20 pb-12 transition-all duration-1000 ${expInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
                    style={{ transitionDelay: `${idx * 200}ms` }}
                  >
                    <div className="absolute left-4 w-9 h-9 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center text-white font-bold text-sm animate-pulse">
                      {idx + 1}
                    </div>
                    <div className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#A97E50]/5 to-[#C4A86D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A97E50]/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#A97E50] transition-colors duration-300">{exp.title}</h3>
                        <p className="text-[#A97E50] font-semibold mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {exp.period}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{(exp as any).description || (exp as any).desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sample Works Section */}
        <section ref={worksRef} className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className={`text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white mb-12 transition-all duration-1000 ${worksInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                Sample <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Works</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(portfolio?.sampleWorks && portfolio.sampleWorks.length > 0 
                  ? portfolio.sampleWorks.map((work, idx) => ({
                      _id: `work-${idx}`,
                      title: work.title,
                      description: work.description,
                      type: work.type,
                      mediaFiles: work.mediaUrls || [],
                      youtubeUrl: work.youtubeUrl,
                    }))
                  : projects
                ).map((project, idx) => {
                  const getYouTubeId = (url: string) => {
                    if (!url) return '';
                    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
                    return match ? match[1] : '';
                  };
                  const youtubeId = project.type === 'youtube' && project.youtubeUrl ? getYouTubeId(project.youtubeUrl) : '';
                  
                  return (
                  <div
                    key={project._id}
                    onClick={() => { setSelectedProject(project); setCurrentMediaIndex(0); }}
                    className={`group relative bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                      worksInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      {project.type === 'youtube' && youtubeId ? (
                        <div className="relative w-full h-full">
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : project.mediaFiles && project.mediaFiles[0] ? (
                        project.type === 'video' ? (
                          <video src={project.mediaFiles[0]} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={project.mediaFiles[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#A97E50] to-[#C4A86D] flex items-center justify-center text-white text-4xl font-bold">
                          {project.title[0]}
                        </div>
                      )}
                      {project.mediaFiles && project.mediaFiles.length > 1 && (
                        <div className="absolute top-3 right-3 bg-[#A97E50] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          +{project.mediaFiles.length}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex items-center text-[#A97E50] font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>View More</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            </div>
          </div>
        </section>

        {/* Modal Viewer */}
        {selectedProject && (() => {
          const getYouTubeId = (url: string) => {
            if (!url) return '';
            const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
            return match ? match[1] : '';
          };
          const youtubeId = selectedProject.type === 'youtube' && selectedProject.youtubeUrl ? getYouTubeId(selectedProject.youtubeUrl) : '';
          
          return (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-12 animate-fade-in" onClick={() => { setSelectedProject(null); setIsAutoPlay(true); }}>
            <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { setSelectedProject(null); setIsAutoPlay(true); }}
                className="absolute -top-10 right-0 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition z-50 shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl animate-scale-in">
                <div className="relative">
                  {selectedProject.type === 'youtube' && youtubeId ? (
                    <div className="w-full aspect-video bg-black">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : selectedProject.mediaFiles && selectedProject.mediaFiles.length > 0 ? (
                    <div className="relative bg-black aspect-video flex items-center justify-center">
                      {selectedProject.type === 'video' ? (
                        <video 
                          key={currentMediaIndex}
                          src={selectedProject.mediaFiles[currentMediaIndex]} 
                          controls 
                          autoPlay 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <img 
                          key={currentMediaIndex}
                          src={selectedProject.mediaFiles[currentMediaIndex]} 
                          alt={selectedProject.title} 
                          className="w-full h-full object-contain" 
                        />
                      )}

                      {selectedProject.mediaFiles.length > 1 && (
                        <>
                          <button
                            onClick={() => { setCurrentMediaIndex((currentMediaIndex - 1 + selectedProject.mediaFiles!.length) % selectedProject.mediaFiles!.length); setIsAutoPlay(false); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition z-10"
                          >
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setCurrentMediaIndex((currentMediaIndex + 1) % selectedProject.mediaFiles!.length); setIsAutoPlay(false); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition z-10"
                          >
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                            <button
                              onClick={() => setIsAutoPlay(!isAutoPlay)}
                              className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
                            >
                              {isAutoPlay ? 'Pause' : 'Play'}
                            </button>
                            <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              {currentMediaIndex + 1} / {selectedProject.mediaFiles.length}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="p-5">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedProject.title}</h3>
                  <p className="text-base text-gray-600 dark:text-gray-300 mb-4">{selectedProject.description}</p>
                  {(selectedProject as any).category && (
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-full text-sm font-semibold">
                      {(selectedProject as any).category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );})()}
      </main>
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-100px) rotate(-8deg); }
          100% { opacity: 1; transform: translateX(0) rotate(-8deg); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(100px) rotate(8deg); }
          100% { opacity: 1; transform: translateX(0) rotate(8deg); }
        }
        @keyframes slide-in-up {
          0% { opacity: 0; transform: translate(-50%, 50px) rotate(4deg); }
          100% { opacity: 1; transform: translate(-50%, 0) rotate(4deg); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(100%); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes walk-hero {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
        @keyframes walk-hero-reverse {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100vw); }
        }
        @keyframes body-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes body-bounce-delayed {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(0); }
        }
        @keyframes arm-swing-left {
          0%, 100% { transform: rotate(-35deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes arm-swing-right {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes leg-walk-left {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes leg-walk-right {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        .animate-slide-in-up { animation: slide-in-up 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        .animate-walk-hero { animation: walk-hero 15s linear infinite; }
        .animate-walk-hero-reverse { animation: walk-hero-reverse 15s linear infinite; }
        .animate-body-bounce { animation: body-bounce 0.6s ease-in-out infinite; }
        .animate-body-bounce-delayed { animation: body-bounce-delayed 0.6s ease-in-out infinite; }
        .animate-arm-swing-left { animation: arm-swing-left 0.6s ease-in-out infinite; }
        .animate-arm-swing-right { animation: arm-swing-right 0.6s ease-in-out infinite; }
        .animate-leg-walk-left { animation: leg-walk-left 0.6s ease-in-out infinite; }
        .animate-leg-walk-right { animation: leg-walk-right 0.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}
