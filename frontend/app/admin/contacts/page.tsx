'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      showToast('Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      await updateStatus(message._id, 'read');
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${selectedMessage._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyMessage: replyText }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Reply sent successfully!', 'success');
        setShowReplyModal(false);
        setReplyText('');
        setSelectedMessage(null);
        fetchMessages();
      } else {
        showToast(data.message || 'Failed to send reply', 'error');
      }
    } catch (error) {
      showToast('Error sending reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = (message: Message) => {
    setDeletingMessage(message);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingMessage) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${deletingMessage._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showToast('Message deleted successfully!', 'success');
        fetchMessages();
      } else {
        showToast('Failed to delete message', 'error');
      }
    } catch (error) {
      showToast('Error deleting message', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingMessage(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      read: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return styles[status as keyof typeof styles] || styles.new;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#A97E50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {toast.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaExclamationCircle className="text-2xl" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Contact Submissions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage contact form submissions</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(message.status)}`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {message.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {message.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {message.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                          title="View"
                        >
                          {message.status === 'new' ? <FaEnvelope /> : <FaEnvelopeOpen />}
                        </button>
                        <button
                          onClick={() => handleReply(message)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition"
                          title="Reply"
                        >
                          <FaReply />
                        </button>
                        <button
                          onClick={() => handleDelete(message)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                          title="Delete"
                        >
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
          {messages.map((message) => (
            <div key={message._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{message.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(message.status)}`}>
                  {message.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">{message.subject}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {new Date(message.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewMessage(message)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  {message.status === 'new' ? <FaEnvelope /> : <FaEnvelopeOpen />}
                  View
                </button>
                <button
                  onClick={() => handleReply(message)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaReply />
                  Reply
                </button>
                <button
                  onClick={() => handleDelete(message)}
                  className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <FaEnvelope className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No messages yet</p>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {selectedMessage && !showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                <p className="text-gray-900 dark:text-white">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                <p className="text-gray-900 dark:text-white">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleReply(selectedMessage)}
                className="flex-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition font-medium flex items-center justify-center gap-2"
              >
                <FaReply />
                Reply
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reply to {selectedMessage.name}</h2>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">To: {selectedMessage.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Re: {selectedMessage.subject}</p>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent resize-none"
              placeholder="Type your reply here...\n\nThis will be sent to the customer's email address."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sendingReply}
                className="flex-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingReply ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaReply />
                    Send Reply
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FaTrash className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Delete Message
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the message from <span className="font-semibold text-gray-900 dark:text-white">"{deletingMessage.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingMessage(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
