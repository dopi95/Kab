'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminAboutPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
      const data = await res.json();
      setContent(data.content || '');
    } catch (error) {
      console.error('Error fetching about:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setMessage('About section updated successfully!');
      } else {
        setMessage('Failed to update about section');
      }
    } catch (error) {
      setMessage('Error updating about section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
            Manage About Section
          </h1>

          <div className="mb-6">
            <a
              href="/admin/founder-message"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Manage Founder's Message
            </a>
          </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              About Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter about section content..."
              required
            />
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update About Section'}
          </button>
        </form>
        </div>
      </div>
    </AdminLayout>
  );
}
