'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FaChartLine, FaUser, FaFileAlt, FaCog, FaUsers, FaFolderOpen, FaEnvelope, FaFileInvoice, FaSignOutAlt, FaGlobe } from 'react-icons/fa';

interface SidebarProps {
  user: any;
}

export default function AdminSidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const menuItems = [
    { icon: FaChartLine, label: 'Dashboard', path: '/admin' },
    { icon: FaUser, label: 'My Profile', path: '/admin/profile' },
    { icon: FaFileAlt, label: 'About', path: '/admin/about' },
    { icon: FaCog, label: 'Services', path: '/admin/services' },
    { icon: FaUsers, label: 'Users', path: '/admin/users' },
    { icon: FaFolderOpen, label: 'Projects', path: '/admin/projects' },
    { icon: FaEnvelope, label: 'Messages', path: '/admin/messages' },
    { icon: FaFileInvoice, label: 'Content', path: '/admin/content' },
    { icon: FaCog, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 pt-16 lg:pt-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image src="/assets/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#A97E50] to-[#C4A86D] bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            {user?.profileImage ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image src={user.profileImage} alt="Profile" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      router.push(item.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      pathname === item.path
                        ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="text-sm" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <a
            href="/"
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <FaGlobe className="text-sm" />
            <span className="text-sm font-medium">Back to Website</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <FaSignOutAlt className="text-sm" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
