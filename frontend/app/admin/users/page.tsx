'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FaPlus, FaTrash, FaTimes, FaCheckCircle, FaExclamationCircle, FaCopy, FaUser, FaEye } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  plainPassword?: string;
  createdAt: string;
}

interface NewUser {
  name: string;
  username: string;
  password: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [newUser, setNewUser] = useState<NewUser | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!name.trim()) {
      showToast('Please enter a name', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewUser(data.data);
        setShowModal(false);
        setShowCredentialsModal(true);
        setName('');
        fetchUsers();
      } else {
        showToast(data.message || 'Failed to create user', 'error');
      }
    } catch (error) {
      showToast('Error creating user', 'error');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`, 'success');
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${deletingUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showToast('User deleted successfully!', 'success');
        fetchUsers();
      } else {
        showToast('Failed to delete user', 'error');
      }
    } catch (error) {
      showToast('Error deleting user', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingUser(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {toast.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaExclamationCircle className="text-2xl" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Users Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage system users</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FaPlus /> Create User
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setViewingUser(user); setShowViewModal(true); }} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded">
                        <FaEye />
                      </button>
                      {user.role !== 'admin' && (
                        <button onClick={() => { setDeletingUser(user); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{new Date(user.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => { setViewingUser(user); setShowViewModal(true); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <FaEye /> View
                </button>
                {user.role !== 'admin' && (
                  <button onClick={() => { setDeletingUser(user); setShowDeleteModal(true); }} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create User</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 p-2">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter user name"
              />
            </div>
            <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition">
              Generate Credentials
            </button>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && newUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">User Created!</h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Save these credentials. They won't be shown again.</p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-900 dark:text-white font-mono">{newUser.username}</p>
                  <button onClick={() => handleCopy(newUser.username, 'Username')} className="text-[#A97E50] hover:text-[#C4A86D]">
                    <FaCopy />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</label>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-900 dark:text-white font-mono">{newUser.password}</p>
                  <button onClick={() => handleCopy(newUser.password, 'Password')} className="text-[#A97E50] hover:text-[#C4A86D]">
                    <FaCopy />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => { setShowCredentialsModal(false); setNewUser(null); }} className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition">
              Done
            </button>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <FaUser className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">User Details</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-900 dark:text-white font-medium">{viewingUser.name}</p>
                  <button onClick={() => handleCopy(viewingUser.name, 'Name')} className="text-[#A97E50] hover:text-[#C4A86D]">
                    <FaCopy />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-900 dark:text-white font-mono">{viewingUser.email}</p>
                  <button onClick={() => handleCopy(viewingUser.email, 'Email')} className="text-[#A97E50] hover:text-[#C4A86D]">
                    <FaCopy />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</label>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-900 dark:text-white font-mono">{(viewingUser as any).plainPassword || '••••••••'}</p>
                  <button onClick={() => handleCopy((viewingUser as any).plainPassword || '', 'Password')} className="text-[#A97E50] hover:text-[#C4A86D]">
                    <FaCopy />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => { setShowViewModal(false); setViewingUser(null); }} className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <FaTrash className="text-red-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deletingUser.name}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
