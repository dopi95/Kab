'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/UserLayout';
import { FaVideo, FaImage, FaCalendar, FaFilter, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface Asset {
  _id: string;
  type: 'video' | 'photo';
  url: string;
  text: string;
  createdAt: string;
}

export default function MyAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'video' | 'photo'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter(a => a.type === filter));
    }
  }, [filter, assets]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/my-assets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAssets(data.data);
        setFilteredAssets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">My Assets</h1>
          <p className="text-gray-600 dark:text-gray-400">View your videos and photos</p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <FaFilter className="text-gray-600 dark:text-gray-400" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filter === 'video' ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <FaVideo /> Videos
          </button>
          <button
            onClick={() => setFilter('photo')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filter === 'photo' ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <FaImage /> Photos
          </button>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No assets yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white flex items-center gap-2">
                  {asset.type === 'video' ? <FaVideo /> : <FaImage />}
                  <span className="font-semibold capitalize">{asset.type}</span>
                </div>
                
                <div className="p-4">
                  {asset.type === 'video' ? (
                    <div className="aspect-video mb-4">
                      <iframe
                        src={getYouTubeEmbedUrl(asset.url)}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div 
                      className="relative aspect-video mb-4 cursor-pointer hover:opacity-90 transition"
                      onClick={() => setSelectedImage(asset.url)}
                    >
                      <img
                        src={asset.url}
                        alt="Asset"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {asset.text && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Additional Text:</p>
                      <p className="text-gray-600 dark:text-gray-400">{asset.text}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendar />
                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded-full"
          >
            <FaTimes size={24} />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <img
              src={selectedImage}
              alt="Full view"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </UserLayout>
  );
}
