'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaDownload, FaCheck } from 'react-icons/fa';

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A97E50] to-[#C4A86D] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image src="/assets/logo.png" alt="Kab Lab" fill className="object-contain" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kab Creative Lab</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Install our app for quick access</p>

        {isInstalled ? (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <FaCheck className="text-2xl" />
            <span className="font-semibold">App Installed!</span>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-4 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-3 text-lg font-semibold"
          >
            <FaDownload /> Install App
          </button>
        )}

        <div className="mt-8 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <FaCheck className="text-green-500 mt-1" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Quick access from home screen</p>
          </div>
          <div className="flex items-start gap-3">
            <FaCheck className="text-green-500 mt-1" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Fast and reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
