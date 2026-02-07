'use client';

import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% from last month</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">56</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 8% from last month</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Messages</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">89</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">↓ 3% from last month</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$12.5k</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 23% from last month</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white hover:shadow-lg transition-all">
                <span className="text-2xl">➕</span>
                <div className="text-left">
                  <p className="font-semibold">Add New Project</p>
                  <p className="text-xs opacity-90">Create a new project entry</p>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#A97E50] transition-all">
                <span className="text-2xl">📝</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Manage Content</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Update website content</p>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#A97E50] transition-all">
                <span className="text-2xl">📊</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">View Analytics</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Check detailed statistics</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Project updated</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New message received</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Content published</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Server Status</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Database</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">API</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Running</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
