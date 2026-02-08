'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function FounderMessagePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchFounder();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFounder = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder`);
      const data = await res.json();
      if (data.success && data.data) {
        setName(data.data.name);
        setMessage(data.data.message);
        setExistingImages(data.data.images || []);
      }
    } catch (error) {
      console.error('Error fetching founder:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }
    setImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const removePreview = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const showToast = (message: string, type: string) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('message', message);
    images.forEach(img => formData.append('images', img));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Founder message updated successfully!', 'success');
        fetchFounder();
        setImages([]);
        setPreviews([]);
      } else {
        showToast('Error updating founder message', 'error');
      }
    } catch (error) {
      showToast('Error updating founder message', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Founder data deleted successfully!', 'success');
        setName('');
        setMessage('');
        setExistingImages([]);
      } else {
        showToast('Error deleting founder data', 'error');
      }
    } catch (error) {
      showToast('Error deleting founder data', 'error');
    }
  };

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar user={user} />
      <div className="flex-1 p-8 ml-0 md:ml-64">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 mt-16 md:mt-0">Founder's Message</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl">
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Founder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Images (Max 3)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Current Images</p>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((img, idx) => (
                  <img key={idx} src={img} alt={`Current ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {previews.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">New Images Preview</p>
              <div className="grid grid-cols-3 gap-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-6 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Save Founder Message'}
          </button>

          {existingImages.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="ml-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              Delete All Data
            </button>
          )}
        </form>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-semibold`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Founder Data?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete all founder data? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
