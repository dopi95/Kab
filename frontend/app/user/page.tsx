'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '@/components/UserLayout';
import { FaFolderOpen, FaVideo, FaImage } from 'react-icons/fa';

interface Asset {
  _id: string;
  type: 'video' | 'photo';
  url: string;
  text: string;
  createdAt: string;
}

export default function UserDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/my-assets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAssets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your dashboard!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-[#A97E50] hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">My Assets</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '...' : assets.length}</p>
              </div>
              <FaFolderOpen className="text-4xl text-[#A97E50]" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : assets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No activity yet</p>
          ) : (
            <div className="space-y-4">
              {assets.slice(0, 5).map((asset) => (
                <div key={asset._id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="mt-1">
                    {asset.type === 'video' ? (
                      <FaVideo className="text-blue-500" />
                    ) : (
                      <FaImage className="text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {asset.type === 'video' ? 'Video' : 'Photo'} asset sent
                    </p>
                    {asset.text && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{asset.text}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{getTimeAgo(asset.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/user/my-assets')}
              className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white hover:shadow-lg transition-all"
            >
              <FaFolderOpen className="text-2xl" />
              <div className="text-left">
                <p className="font-semibold">View Assets</p>
                <p className="text-xs opacity-90">Browse your assets</p>
              </div>
            </button>
            <button 
              onClick={() => router.push('/user/profile')}
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#A97E50] transition-all"
            >
              <span className="text-2xl">👤</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">My Profile</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Update your profile</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
