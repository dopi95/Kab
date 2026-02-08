'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { FaUsers, FaCog, FaEnvelope, FaFolderOpen, FaUserPlus, FaPaperPlane, FaChartBar } from 'react-icons/fa';

interface Stats {
  users: number;
  services: number;
  contacts: number;
  projects: number;
}

interface Contact {
  _id: string;
  name: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, services: 0, contacts: 0, projects: 0 });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [usersRes, servicesRes, contactsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const servicesData = await servicesRes.json();
      const contactsData = await contactsRes.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayContacts = contactsData.success 
        ? contactsData.data.filter((c: any) => !c.isRead && new Date(c.createdAt) >= today)
        : [];

      setStats({
        users: usersData.success ? usersData.data.filter((u: any) => u.role === 'user').length : 0,
        services: Array.isArray(servicesData) ? servicesData.length : 0,
        contacts: todayContacts.length,
        projects: 0,
      });

      setRecentContacts(contactsData.success ? contactsData.data.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to fetch stats');
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
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.users}</p>
              </div>
              <FaUsers className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Services</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.services}</p>
              </div>
              <FaCog className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Contacts Today</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.contacts}</p>
              </div>
              <FaEnvelope className="text-4xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.projects}</p>
              </div>
              <FaFolderOpen className="text-4xl text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin/users')}
                className="w-full flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white hover:shadow-lg transition-all"
              >
                <FaUserPlus className="text-2xl" />
                <div className="text-left">
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-xs opacity-90">Create and manage users</p>
                </div>
              </button>
              <button 
                onClick={() => router.push('/admin/send-data')}
                className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#A97E50] transition-all"
              >
                <FaPaperPlane className="text-2xl text-gray-700 dark:text-gray-300" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Send Data</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Send assets to users</p>
                </div>
              </button>
              <button 
                onClick={() => router.push('/admin/contacts')}
                className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#A97E50] transition-all"
              >
                <FaChartBar className="text-2xl text-gray-700 dark:text-gray-300" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">View Contacts</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Check messages</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentContacts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact._id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New contact from {contact.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{getTimeAgo(contact.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
