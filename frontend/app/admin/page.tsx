'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    fetch('http://localhost:5000/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          router.push('/signin');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/signin');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#171817]">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#171817] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">0</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Projects</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Messages</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">0</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#A97E50] transition-all duration-300 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update website content and pages</p>
              </button>
              <button className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#A97E50] transition-all duration-300 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">View Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check website statistics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
