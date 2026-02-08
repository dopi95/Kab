'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-[#A97E50] to-[#C4A86D]">
          <div className="container mx-auto px-4 text-center">
            <div className="w-40 h-40 mx-auto bg-white rounded-full flex items-center justify-center text-[#A97E50] text-5xl font-bold mb-6 shadow-2xl">
              KAB
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Founder Name</h1>
            <p className="text-xl text-white/90 mb-8">Creative Director & Founder</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition">
                <FaGithub size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Passionate creative professional with years of experience in design, branding, and innovation. I founded Kab Creative Lab to help businesses transform their ideas into reality through exceptional design and creative solutions.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              My journey in the creative industry has been driven by a commitment to excellence and a passion for pushing boundaries in design and innovation.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Skills & Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Design', 'Branding', 'Strategy', 'Leadership', 'Innovation', 'Marketing', 'UI/UX', 'Creative Direction'].map((skill) => (
                <div key={skill} className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center shadow-md">
                  <p className="font-semibold text-gray-900 dark:text-white">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experience</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-[#A97E50] pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Founder & Creative Director</h3>
                <p className="text-[#A97E50] mb-2">Kab Creative Lab | 2020 - Present</p>
                <p className="text-gray-700 dark:text-gray-300">Leading creative projects and building innovative solutions for clients worldwide.</p>
              </div>
              <div className="border-l-4 border-[#A97E50] pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Senior Designer</h3>
                <p className="text-[#A97E50] mb-2">Previous Company | 2015 - 2020</p>
                <p className="text-gray-700 dark:text-gray-300">Developed creative strategies and managed design teams.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
