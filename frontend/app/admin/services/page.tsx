'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaPalette, FaRobot, FaCamera, FaBullhorn, FaCode, FaCog, FaLaptopCode, FaMobileAlt, FaChartLine, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';
import Spinner from '@/components/Spinner';

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

const iconOptions = [
  { name: 'FaVideo', component: FaVideo, label: 'Video' },
  { name: 'FaPalette', component: FaPalette, label: 'Palette' },
  { name: 'FaRobot', component: FaRobot, label: 'Robot' },
  { name: 'FaCamera', component: FaCamera, label: 'Camera' },
  { name: 'FaBullhorn', component: FaBullhorn, label: 'Bullhorn' },
  { name: 'FaCode', component: FaCode, label: 'Code' },
  { name: 'FaCog', component: FaCog, label: 'Cog' },
  { name: 'FaLaptopCode', component: FaLaptopCode, label: 'Laptop Code' },
  { name: 'FaMobileAlt', component: FaMobileAlt, label: 'Mobile' },
  { name: 'FaChartLine', component: FaChartLine, label: 'Chart' },
];

const getIconComponent = (iconName: string) => {
  const icon = iconOptions.find(i => i.name === iconName);
  return icon ? icon.component : FaCog;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingService, setDeletingService] = useState<{ id: string; title: string } | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FaCog',
    isActive: true,
    order: 0,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      showToast('Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingService
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${editingService._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;
      
      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingService ? 'Service updated successfully!' : 'Service created successfully!', 'success');
        fetchServices();
        handleCloseModal();
      } else {
        showToast('Failed to save service', 'error');
      }
    } catch (error) {
      showToast('Error saving service', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    setDeletingService({ id, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingService) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${deletingService.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showToast('Service deleted successfully!', 'success');
        fetchServices();
      } else {
        showToast('Failed to delete service', 'error');
      }
    } catch (error) {
      showToast('Error deleting service', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingService(null);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      isActive: service.isActive,
      order: service.order,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'FaCog',
      isActive: true,
      order: 0,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manage Services</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition w-full sm:w-auto justify-center"
          >
            <FaPlus /> Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <div
              key={service._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-lg flex items-center justify-center">
                  <IconComponent className="text-white text-lg sm:text-xl" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id, service.title)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">{service.description}</p>
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <span className={`px-2 sm:px-3 py-1 rounded-full ${service.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Order: {service.order}</span>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                  placeholder="Enter service title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                  rows={3}
                  placeholder="Enter service description"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((icon) => {
                    const Icon = icon.component;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: icon.name })}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition hover:scale-110 ${
                          formData.icon === icon.name
                            ? 'border-[#A97E50] bg-[#A97E50]/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-[#A97E50]/50'
                        }`}
                        title={icon.label}
                      >
                        <Icon className="text-lg sm:text-xl mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                  placeholder="Display order"
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#A97E50] focus:ring-[#A97E50] rounded"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-2.5 rounded-lg hover:shadow-lg transition font-medium"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2.5 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FaTrash className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Delete Service
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{deletingService?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingService(null);
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
