'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', order: 0, isActive: true });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (error) {
      showToast('Failed to fetch FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingFAQ
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/faqs/${editingFAQ._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/faqs`;
      const method = editingFAQ ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingFAQ ? 'FAQ updated successfully!' : 'FAQ added successfully!', 'success');
        setShowModal(false);
        setEditingFAQ(null);
        setFormData({ question: '', answer: '', order: 0, isActive: true });
        fetchFAQs();
      } else {
        showToast('Failed to save FAQ', 'error');
      }
    } catch (error) {
      showToast('Error saving FAQ', 'error');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({ question: faq.question, answer: faq.answer, order: faq.order, isActive: faq.isActive });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingFAQ) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs/${deletingFAQ._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showToast('FAQ deleted successfully!', 'success');
        fetchFAQs();
      } else {
        showToast('Failed to delete FAQ', 'error');
      }
    } catch (error) {
      showToast('Error deleting FAQ', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingFAQ(null);
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
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {toast.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaExclamationCircle className="text-2xl" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">FAQs Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage frequently asked questions</p>
          </div>
          <button
            onClick={() => {
              setEditingFAQ(null);
              setFormData({ question: '', answer: '', order: 0, isActive: true });
              setShowModal(true);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FaPlus /> Add FAQ
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Question</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Answer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{faq.order}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{faq.question}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-md truncate">{faq.answer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(faq)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded">
                          <FaEdit />
                        </button>
                        <button onClick={() => { setDeletingFAQ(faq); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white text-xs font-bold px-2 py-1 rounded">
                    #{faq.order}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {faq.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{faq.answer}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => { setDeletingFAQ(faq); setShowDeleteModal(true); }}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <FaQuestionCircle className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No FAQs yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingFAQ ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 p-2">
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition">
                  {editingFAQ ? 'Update' : 'Add'} FAQ
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deletingFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <FaTrash className="text-red-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Delete FAQ</h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this FAQ? This action cannot be undone.
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
