'use client';

import Link from 'next/link';
import { FaFacebook, FaTiktok, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#A97E50] rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#C4A86D] rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">
              Kab Creative Lab
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transforming ideas into stunning visual experiences. Your creative partner for content creation, video production, and branding.
            </p>
            <div className="flex gap-3">
              <a href="mailto:kab@kabcreativelab.com" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-[#A97E50] hover:to-[#C4A86D] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaEnvelope />
              </a>
              <a href="https://www.facebook.com/share/1RWimTw4mU/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-[#A97E50] hover:to-[#C4A86D] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaFacebook />
              </a>
              <a href="https://instagram.com/kabcreativelab" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-[#A97E50] hover:to-[#C4A86D] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@kab.creativelab?_r=1&_t=ZS-93zyvKezp81" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-[#A97E50] hover:to-[#C4A86D] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-delayed">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#home" className="text-gray-400 hover:text-[#C4A86D] transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#C4A86D] transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-[#C4A86D] transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#C4A86D] transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-gray-400 hover:text-[#C4A86D] transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#C4A86D] transition-all duration-300"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-gray-400 hover:text-[#C4A86D] transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#C4A86D] transition-all duration-300"></span>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#C4A86D] transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#C4A86D] transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4 animate-fade-in-delayed-2">
            <h4 className="text-lg font-semibold text-white">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Content Creation</li>
              <li className="text-gray-400 text-sm">Video Editing & Production</li>
              <li className="text-gray-400 text-sm">Branding Visuals</li>
              <li className="text-gray-400 text-sm">AI-Assisted Solutions</li>
              <li className="text-gray-400 text-sm">Social Media Management</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 animate-fade-in-delayed-3">
            <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <FaMapMarkerAlt className="text-[#C4A86D] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <FaPhone className="text-[#C4A86D] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+251983101000" className="hover:text-[#C4A86D] transition-colors">+251 983 101 000</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <FaEnvelope className="text-[#C4A86D] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:kab@kabcreativelab.com" className="hover:text-[#C4A86D] transition-colors">kab@kabcreativelab.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <FaWhatsapp className="text-[#C4A86D] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="https://wa.me/251983101000" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A86D] transition-colors">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex justify-center items-center">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} Kab Creative Lab. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(-15px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
        .animate-fade-in-delayed-3 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
