'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FaPaperPlane, FaTimes, FaCheckCircle, FaExclamationCircle, FaVideo, FaImage, FaTrash, FaEdit } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Asset {
  _id: string;
  type: 'video' | 'photo';
  url: string;
  text: string;
  createdAt: string;
}

export default function SendDataPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [type, setType] = useState<'video' | 'photo'>('video');
  const [videoUrl, setVideoUrl] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/${assetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showToast('Asset deleted successfully!', 'success');
        if (viewingUser) fetchUserAssets(viewingUser._id);
      } else {
        showToast('Failed to delete asset', 'error');
      }
    } catch (error) {
      showToast('Error deleting asset', 'error');
    }
  };

  const handleUpdateAsset = async () => {
    if (!editingAsset) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/${editingAsset._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        showToast('Asset updated successfully!', 'success');
        setEditingAsset(null);
        setEditText('');
        if (viewingUser) fetchUserAssets(viewingUser._id);
      } else {
        showToast('Failed to update asset', 'error');
      }
    } catch (error) {
      showToast('Error updating asset', 'error');
    }
  };

  const fetchUserAssets = async (userId: string) => {
    setLoadingAssets(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUserAssets(data.data);
      }
    } catch (error) {
      showToast('Failed to fetch assets', 'error');
    } finally {
      setLoadingAssets(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.filter((u: User) => u.role === 'user'));
      }
    } catch (error) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedUser) return;
    
    if (type === 'video' && !videoUrl.trim()) {
      showToast('Please enter a YouTube URL', 'error');
      return;
    }
    
    if (type === 'photo' && photos.length === 0) {
      showToast('Please select at least one photo', 'error');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('userId', selectedUser._id);
      formData.append('type', type);
      formData.append('text', text);
      
      if (type === 'video') {
        formData.append('url', videoUrl);
      } else {
        photos.forEach((photo) => {
          formData.append('photos', photo);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        showToast('Data sent successfully!', 'success');
        setShowModal(false);
        setSelectedUser(null);
        setVideoUrl('');
        setPhotos([]);
        setText('');
        setType('video');
      } else {
        showToast('Failed to send data', 'error');
      }
    } catch (error) {
      showToast('Error sending data', 'error');
    } finally {
      setSending(false);
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
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Send Data</h1>
          <p className="text-gray-600 dark:text-gray-400">Send videos or photos to users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] rounded-full text-white text-2xl font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-1">{user.name}</h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowModal(true);
                }}
                className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-2 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 mb-2"
              >
                <FaPaperPlane /> Send Data
              </button>
              <button
                onClick={() => {
                  setViewingUser(user);
                  setShowViewModal(true);
                  fetchUserAssets(user._id);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                View Assets
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send to {selectedUser.name}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 p-2">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setType('video')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${type === 'video' ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <FaVideo /> Video
                </button>
                <button
                  onClick={() => setType('photo')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${type === 'photo' ? 'bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <FaImage /> Photo
                </button>
              </div>
            </div>

            {type === 'video' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YouTube URL</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photos (Multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {photos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{photos.length} photo(s) selected</p>
                    <div className="flex flex-wrap gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-lg flex items-center gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{photo.name}</span>
                          <button
                            onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Text (Optional)</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Add a message..."
              />
            </div>

            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {showViewModal && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assets for {viewingUser.name}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 p-2">
                <FaTimes size={20} />
              </button>
            </div>

            {loadingAssets ? (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userAssets.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No assets sent yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                {userAssets.map((asset) => (
                  <div key={asset._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {asset.type === 'video' ? <FaVideo className="text-[#A97E50]" /> : <FaImage className="text-[#A97E50]" />}
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{asset.type}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAsset(asset);
                            setEditText(asset.text);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {asset.type === 'video' ? (
                      <div className="aspect-video mb-2">
                        <iframe
                          src={getYouTubeEmbedUrl(asset.url)}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video mb-2">
                        <img src={asset.url} alt="Asset" className="w-full h-full object-cover rounded-lg" />
                      </div>
                    )}
                    {asset.text && <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{asset.text}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(asset.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Text</h2>
              <button onClick={() => setEditingAsset(null)} className="text-gray-500 hover:text-gray-700 p-2">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Text</label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>
            <button
              onClick={handleUpdateAsset}
              className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
