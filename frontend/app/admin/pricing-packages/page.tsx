'use client';

import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaTags,
  FaStar,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';
import Spinner from '@/components/Spinner';

export interface PricingPackageItem {
  _id: string;
  name: string;
  category: 'event' | 'social_media';
  subtitle?: string;
  price: string;
  period?: string;
  currency: string;
  features: string[];
  accentColor: string;
  badgeColor?: string;
  isFeatured: boolean;
  isAddon?: boolean;
  isActive: boolean;
  order: number;
  ctaText?: string;
  createdAt: string;
}

const COLOR_PRESETS = [
  { name: 'Red / Coral', color: '#e85d54' },
  { name: 'Electric Blue', color: '#1d8cf8' },
  { name: 'Amber / Gold', color: '#f59e0b' },
  { name: 'Emerald Green', color: '#00e676' },
  { name: 'Sky Blue', color: '#38a3f8' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Warm Bronze', color: '#C4A86D' },
];

export default function AdminPricingPackagesPage() {
  const [packages, setPackages] = useState<PricingPackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'event' | 'social_media'>('all');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackageItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'event' as 'event' | 'social_media',
    subtitle: '',
    price: '',
    period: 'per event',
    currency: 'ETB',
    accentColor: '#e85d54',
    isFeatured: false,
    isAddon: false,
    isActive: true,
    order: 0,
    ctaText: 'SELECT',
  });

  // Features list manager state inside modal
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        showToast('Failed to load pricing packages', 'error');
      }
    } catch (error) {
      showToast('Network error loading pricing packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      category: activeTab === 'social_media' ? 'social_media' : 'event',
      subtitle: '',
      price: '',
      period: activeTab === 'social_media' ? 'per month' : 'per event',
      currency: 'ETB',
      accentColor: '#e85d54',
      isFeatured: false,
      isAddon: false,
      isActive: true,
      order: packages.length + 1,
      ctaText: 'SELECT',
    });
    setFeaturesList([]);
    setNewFeatureText('');
    setShowModal(true);
  };

  const handleOpenEditModal = (pkg: PricingPackageItem) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      category: pkg.category,
      subtitle: pkg.subtitle || '',
      price: pkg.price,
      period: pkg.period || '',
      currency: pkg.currency || 'ETB',
      accentColor: pkg.accentColor || '#e85d54',
      isFeatured: !!pkg.isFeatured,
      isAddon: !!pkg.isAddon,
      isActive: pkg.isActive,
      order: pkg.order || 0,
      ctaText: pkg.ctaText || 'SELECT',
    });
    setFeaturesList([...pkg.features]);
    setNewFeatureText('');
    setShowModal(true);
  };

  const handleAddFeature = () => {
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    setFeaturesList([...featuresList, trimmed]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleEditFeature = (index: number, val: string) => {
    const updated = [...featuresList];
    updated[index] = val;
    setFeaturesList(updated);
  };

  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === featuresList.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...featuresList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFeaturesList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price.trim()) {
      showToast('Name and Price are required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingPackage
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages/${editingPackage._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages`;

      const payload = {
        ...formData,
        features: featuresList,
      };

      const res = await fetch(url, {
        method: editingPackage ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          editingPackage ? 'Package updated successfully!' : 'Package created successfully!',
          'success'
        );
        setShowModal(false);
        fetchPackages();
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to save package', 'error');
      }
    } catch (err) {
      showToast('Error saving pricing package', 'error');
    }
  };

  const handleToggleActive = async (pkg: PricingPackageItem) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages/${pkg._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });

      if (res.ok) {
        showToast(`Package ${!pkg.isActive ? 'activated' : 'deactivated'}`, 'success');
        fetchPackages();
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  const handleDeleteClick = (pkg: PricingPackageItem) => {
    setDeletingPackage({ id: pkg._id, name: pkg.name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingPackage) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pricing-packages/${deletingPackage.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        showToast('Package deleted successfully!', 'success');
        fetchPackages();
      } else {
        showToast('Failed to delete package', 'error');
      }
    } catch {
      showToast('Error deleting package', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingPackage(null);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === 'event') return pkg.category === 'event';
    if (activeTab === 'social_media') return pkg.category === 'social_media';
    return true;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 min-h-screen">
        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaExclamationCircle className="text-xl" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A97E50] to-[#C4A86D] text-white flex items-center justify-center shadow-md">
                <FaTags className="text-xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Pricing Packages
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage Event Packages and Social Media Packages in real-time.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white font-bold text-sm hover:shadow-lg transition-all active:scale-95"
          >
            <FaPlus className="text-sm" />
            <span>Add New Package</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[#A97E50] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'event'
                ? 'bg-[#A97E50] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Event Packages ({packages.filter((p) => p.category === 'event').length})
          </button>
          <button
            onClick={() => setActiveTab('social_media')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'social_media'
                ? 'bg-[#A97E50] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Social Media ({packages.filter((p) => p.category === 'social_media').length})
          </button>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <FaTags className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              No packages found
            </h3>
            <p className="text-gray-500 text-sm mt-1 mb-6">
              Get started by creating your first pricing package.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#A97E50] text-white font-semibold text-sm hover:bg-[#8e6940] transition-colors"
            >
              <FaPlus />
              <span>Add Package</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border overflow-hidden flex flex-col transition-all hover:shadow-xl ${
                  !pkg.isActive ? 'opacity-60 border-gray-300 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Header Strip with Accent Color */}
                <div
                  className="p-5 text-white relative"
                  style={{
                    backgroundColor: pkg.accentColor || '#09121d',
                    backgroundImage: 'linear-gradient(135deg, rgba(9,18,29,0.92) 0%, rgba(9,18,29,0.98) 100%)',
                    borderTop: `4px solid ${pkg.accentColor || '#C4A86D'}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                      {pkg.category === 'event' ? 'Event Package' : 'Social Media'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {pkg.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40">
                          <FaStar size={10} /> Featured
                        </span>
                      )}
                      {pkg.isAddon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                          Add-on
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: pkg.accentColor || '#ffffff' }}
                      >
                        {pkg.name}
                      </h3>
                      {pkg.subtitle && (
                        <p className="text-xs text-gray-300 mt-0.5 font-medium">
                          {pkg.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-white">
                        {pkg.price} {pkg.currency && <span className="text-xs font-normal text-gray-300">{pkg.currency}</span>}
                      </div>
                      {pkg.period && (
                        <div className="text-[11px] text-gray-400">
                          {pkg.period}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-gray-50/50 dark:bg-gray-800/40">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
                      <span>Features ({pkg.features.length})</span>
                      <span className="text-[10px] font-normal text-gray-400">Order: {pkg.order}</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {pkg.features.length === 0 ? (
                        <li className="text-xs italic text-gray-400">No features listed</li>
                      ) : (
                        pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                            <FaCheck className="text-green-500 w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(pkg)}
                      title={pkg.isActive ? 'Active - click to deactivate' : 'Inactive - click to activate'}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        pkg.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300'
                      }`}
                    >
                      {pkg.isActive ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                      <span>{pkg.isActive ? 'Active' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(pkg)}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                        title="Edit Package & Lists"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(pkg)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                        title="Delete Package"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= MODAL: ADD / EDIT PACKAGE & LISTS ================= */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#A97E50]/20 text-[#A97E50] flex items-center justify-center">
                    <FaTags size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingPackage ? 'Edit Pricing Package' : 'Create New Pricing Package'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Standard, Professional, Elite"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as 'event' | 'social_media',
                          period: e.target.value === 'event' ? 'per event' : 'per month',
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    >
                      <option value="event">Event Package</option>
                      <option value="social_media">Social Media Package</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Subtitle / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Most Popular"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 20,000 or Add-on"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Billing Period
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="e.g. per event, per month"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    />
                  </div>
                </div>

                {/* Accent Color & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.color}
                            type="button"
                            onClick={() => setFormData({ ...formData, accentColor: preset.color })}
                            className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-transform hover:scale-110"
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#A97E50] rounded focus:ring-[#A97E50]"
                    />
                    <span>Featured Card</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.isAddon}
                      onChange={(e) => setFormData({ ...formData, isAddon: e.target.checked })}
                      className="w-4 h-4 text-[#A97E50] rounded focus:ring-[#A97E50]"
                    />
                    <span>Add-on Package</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#A97E50] rounded focus:ring-[#A97E50]"
                    />
                    <span>Active / Visible</span>
                  </label>
                </div>

                {/* DYNAMIC FEATURES LIST BUILDER */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Package Features / Bullet List ({featuresList.length})
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Add, edit, or remove each item
                    </span>
                  </div>

                  {/* Add New Feature Row */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Type a feature and press Enter (e.g. 12 edited videos)..."
                      className="flex-1 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A97E50]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 rounded-lg bg-[#A97E50] hover:bg-[#8e6940] text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 flex-shrink-0"
                    >
                      <FaPlus size={12} />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* List of Features */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {featuresList.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-2">
                        No features added yet. Type above and click Add.
                      </p>
                    ) : (
                      featuresList.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600"
                        >
                          <span className="text-xs font-bold text-gray-400 w-5 text-center">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => handleEditFeature(idx, e.target.value)}
                            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#A97E50] rounded px-1.5 py-0.5"
                          />
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveFeature(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
                              title="Move Up"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveFeature(idx, 'down')}
                              disabled={idx === featuresList.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
                              title="Move Down"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              className="p-1 text-red-500 hover:text-red-700"
                              title="Remove item"
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Submit & Cancel buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    {editingPackage ? 'Update Package' : 'Create Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: DELETE CONFIRMATION ================= */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                <FaTrash size={20} />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
                Delete Package
              </h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{deletingPackage?.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
