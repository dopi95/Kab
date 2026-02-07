'use client';

import UserLayout from '@/components/UserLayout';

export default function UserDashboard() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">My Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Messages</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notifications</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
              <div className="text-4xl">🔔</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Project created</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">New message received</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Profile updated</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white hover:shadow-lg transition-all">
              <span className="text-2xl">➕</span>
              <div className="text-left">
                <p className="font-semibold">New Project</p>
                <p className="text-xs opacity-90">Create a new project</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#A97E50] transition-all">
              <span className="text-2xl">📧</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">Send Message</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Contact support</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
