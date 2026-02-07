'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';

export default function ContactSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: '🎉 Message sent successfully! We\'ll get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 5000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FaEnvelope, label: 'Email', value: 'Kabcreativelab@gmail.com', href: 'mailto:Kabcreativelab@gmail.com' },
    { icon: FaPhone, label: 'Phone', value: '+251 983 101 000', href: 'tel:+251983101000' },
    { icon: FaMapMarkerAlt, label: 'Location', value: 'Addis Ababa, Ethiopia', href: '#' },
  ];

  const socialLinks = [
    { icon: FaWhatsapp, href: 'https://wa.me/251983101000', label: 'WhatsApp' },
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <section id="contact" className="relative py-20 bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-[#171817] dark:via-gray-900 dark:to-[#2a2520] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#C4A86D] rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Get In <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Animated Character */}
          <div className="mb-12 animate-slideInRight">
            <div className="relative h-64 sm:h-80 lg:h-96">
              <svg viewBox="0 0 400 500" className="w-full h-full max-w-sm mx-auto">
                <defs>
                  <linearGradient id="contactSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFD4A3', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FFBE8F', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="contactBrand" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#A97E50', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#C4A86D', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                <g className="character" style={{ transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)` }}>
                  <ellipse cx="200" cy="480" rx="60" ry="12" fill="rgba(0,0,0,0.15)" className="animate-pulse" />

                  <g className="animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}>
                    <rect x="240" y="140" width="120" height="60" rx="10" fill="white" stroke="#A97E50" strokeWidth="2" />
                    <path d="M 240 170 L 220 180 L 240 190" fill="white" stroke="#A97E50" strokeWidth="2" />
                    <text x="300" y="165" textAnchor="middle" className="text-base font-bold" fill="#A97E50">Call Us!</text>
                    <text x="300" y="185" textAnchor="middle" className="text-xs" fill="#666">We're here</text>
                  </g>

                  <g className="animate-float">
                    <rect x="170" y="280" width="60" height="100" rx="8" fill="url(#contactBrand)" />
                    
                    <g className="arm-left animate-wave">
                      <ellipse cx="160" cy="300" rx="14" ry="40" fill="url(#contactBrand)" transform="rotate(-25 160 300)" />
                      <circle cx="155" cy="335" r="12" fill="url(#contactSkin)" />
                      <rect x="148" y="340" width="14" height="22" rx="2" fill="#333" className="animate-wiggle" />
                    </g>

                    <g className="arm-right animate-point">
                      <ellipse cx="240" cy="300" rx="14" ry="45" fill="url(#contactBrand)" transform="rotate(45 240 300)" />
                      <circle cx="255" cy="325" r="12" fill="url(#contactSkin)" />
                      <ellipse cx="265" cy="320" rx="8" ry="4" fill="url(#contactSkin)" transform="rotate(45 265 320)" className="animate-wiggle" />
                    </g>

                    <g className="leg-left animate-walk">
                      <rect x="180" y="375" width="18" height="60" rx="9" fill="#8B7355" />
                      <ellipse cx="189" cy="440" rx="15" ry="10" fill="#C4A86D" />
                    </g>

                    <g className="leg-right animate-walk-reverse">
                      <rect x="202" y="375" width="18" height="60" rx="9" fill="#8B7355" />
                      <ellipse cx="211" cy="440" rx="15" ry="10" fill="#C4A86D" />
                    </g>

                    <circle cx="200" cy="230" r="50" fill="url(#contactSkin)" />

                    <g className="hair">
                      <ellipse cx="200" cy="195" rx="55" ry="40" fill="#654321" />
                      <circle cx="175" cy="200" r="20" fill="#654321" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <circle cx="225" cy="200" r="20" fill="#654321" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </g>

                    <g className="face">
                      <g className="eye-left animate-blink">
                        <ellipse cx="185" cy="225" rx="10" ry="12" fill="white" />
                        <circle cx="187" cy="227" r="6" fill="#333" />
                        <circle cx="189" cy="225" r="2" fill="white" />
                      </g>
                      <g className="eye-right animate-blink" style={{ animationDelay: '0.1s' }}>
                        <ellipse cx="215" cy="225" rx="10" ry="12" fill="white" />
                        <circle cx="217" cy="227" r="6" fill="#333" />
                        <circle cx="219" cy="225" r="2" fill="white" />
                      </g>
                      <path d="M 185 245 Q 200 255 215 245" stroke="#A97E50" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-smile" />
                      <circle cx="170" cy="235" r="7" fill="#FFB6C1" opacity="0.6" />
                      <circle cx="230" cy="235" r="7" fill="#FFB6C1" opacity="0.6" />
                    </g>

                    <g className="headset">
                      <path d="M 160 210 Q 155 230 160 250" stroke="#333" strokeWidth="3" fill="none" />
                      <circle cx="160" cy="230" r="8" fill="#333" />
                      <path d="M 240 210 Q 245 230 240 250" stroke="#333" strokeWidth="3" fill="none" />
                      <circle cx="240" cy="230" r="8" fill="#333" />
                      <path d="M 160 210 Q 200 200 240 210" stroke="#333" strokeWidth="3" fill="none" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 mb-12 animate-slideInLeft hover:shadow-3xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent transition"
                  placeholder="Fullname"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent transition"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent transition"
                  placeholder="Subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent transition resize-none"
                  placeholder="Your message.."
                  required
                />
              </div>

              {status.message && (
                <div className={`p-4 rounded-lg animate-slideInLeft ${
                  status.type === 'success' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-2 border-green-500' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-2 border-red-500'
                }`}>
                  <div className="flex items-center gap-2">
                    {status.type === 'success' ? (
                      <span className="text-2xl animate-bounce">✅</span>
                    ) : (
                      <span className="text-2xl">❌</span>
                    )}
                    <span className="font-medium">{status.message}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-bold py-4 px-8 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                      <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="text-white text-xl" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes point {
          0%, 100% { transform: rotate(45deg); }
          50% { transform: rotate(55deg); }
        }
        @keyframes walk {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes walk-reverse {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(0px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes smile {
          0%, 100% { d: path('M 185 245 Q 200 255 215 245'); }
          50% { d: path('M 185 245 Q 200 258 215 245'); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-wave { animation: wave 2s ease-in-out infinite; transform-origin: 160px 280px; }
        .animate-point { animation: point 1.5s ease-in-out infinite; transform-origin: 240px 280px; }
        .animate-walk { animation: walk 1s ease-in-out infinite; }
        .animate-walk-reverse { animation: walk-reverse 1s ease-in-out infinite; }
        .animate-blink { animation: blink 4s ease-in-out infinite; }
        .animate-smile { animation: smile 2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 1.5s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
      `}</style>
    </section>
  );
}
