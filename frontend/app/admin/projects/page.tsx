'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaImage, FaYoutube, FaTimes } from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: 'video' | 'photograph' | 'branding';
  type: 'video' | 'image' | 'youtube';
  mediaFiles: string[];
  youtubeUrl?: string;
  isActive: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'video' as 'video' | 'photograph' | 'branding',
    type: 'video' as 'video' | 'image' | 'youtube',
    youtubeUrl: '',
    isActive: true,
    order: 0,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      
      let mediaFiles: string[] = editingProject?.mediaFiles || [];
      
      if (selectedFiles.length > 0) {
        showToast(`Uploading ${selectedFiles.length} file(s)...`, 'success');
        
        const uploadedUrls = await Promise.all(
          selectedFiles.map(async (file) => {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('upload_preset', 'unsigned_preset');
            
            const resourceType = file.type.startsWith('video') ? 'video' : 'image';
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/depzhcwaf/${resourceType}/upload`,
              { method: 'POST', body: uploadData }
            );
            
            if (!response.ok) {
              const error = await response.json();
              console.error('Cloudinary error:', error);
              throw new Error('Upload failed');
            }
            
            const data = await response.json();
            return data.secure_url;
          })
        );
        mediaFiles = [...mediaFiles, ...uploadedUrls];
      }

      const url = editingProject
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${editingProject._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;
      
      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, mediaFiles }),
      });

      if (response.ok) {
        fetchProjects();
        handleCloseModal();
        showToast(editingProject ? 'Project updated successfully!' : 'Project created successfully!', 'success');
      } else {
        showToast('Failed to save project', 'error');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('Error saving project', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
      setShowDeleteModal(false);
      setDeletingId(null);
      showToast('Project deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('Error deleting project', 'error');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      type: project.type,
      youtubeUrl: project.youtubeUrl || '',
      isActive: project.isActive,
      order: project.order,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setSelectedFiles([]);
    setFormData({
      title: '',
      description: '',
      category: 'video',
      type: 'video',
      youtubeUrl: '',
      isActive: true,
      order: 0,
    });
  };

  const removeMediaFile = (index: number) => {
    if (editingProject) {
      const updated = { ...editingProject };
      updated.mediaFiles.splice(index, 1);
      setEditingProject(updated);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <FaVideo />;
      case 'youtube': return <FaYoutube />;
      default: return <FaImage />;
    }
  };

  if (loading) {
    return <AdminLayout><div className="flex justify-center items-center h-screen">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition"
          >
            <FaPlus /> Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden">
                {project.type === 'youtube' && project.youtubeUrl ? (
                  <img 
                    src={`https://img.youtube.com/vi/${project.youtubeUrl.split('v=')[1]?.split('&')[0] || project.youtubeUrl.split('youtu.be/')[1]?.split('?')[0]}/maxresdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : project.mediaFiles && project.mediaFiles.length > 0 ? (
                  project.type === 'video' ? (
                    <video src={project.mediaFiles[0]} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={project.mediaFiles[0]} alt="" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="text-5xl text-gray-400">{getIcon(project.type)}</div>
                )}
                {project.mediaFiles && project.mediaFiles.length > 1 && (
                  <span className="absolute top-2 right-2 bg-[#A97E50] text-white px-2 py-1 rounded text-xs font-bold">
                    +{project.mediaFiles.length}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{project.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 bg-[#A97E50] text-white rounded">{project.category}</span>
                  <span className={`px-2 py-1 rounded ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}</div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add Project'}
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} id="projectForm" className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent resize-none"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                      >
                        <option value="video">Video</option>
                        <option value="photograph">Photograph</option>
                        <option value="branding">Branding</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                      >
                        <option value="video">Video File</option>
                        <option value="image">Image</option>
                        <option value="youtube">YouTube</option>
                      </select>
                    </div>
                  </div>
                  
                  {formData.type === 'youtube' ? (
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">YouTube URL</label>
                      <input
                        type="text"
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Upload Files</label>
                      <input
                        type="file"
                        multiple
                        accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleFileChange}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#A97E50] file:text-white file:cursor-pointer hover:file:bg-[#8B6A42]"
                      />
                      {selectedFiles.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selectedFiles.length} file(s) selected</p>
                      )}
                    </div>
                  )}
                  
                  {editingProject && editingProject.mediaFiles.length > 0 && (
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Existing Files</label>
                      <div className="flex flex-wrap gap-2">
                        {editingProject.mediaFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            {file ? (
                              formData.type === 'video' ? (
                                <video src={file} className="w-20 h-20 rounded-lg object-cover" />
                              ) : (
                                <img src={file} alt="" className="w-20 h-20 rounded-lg object-cover" />
                              )
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                {formData.type === 'video' ? <FaVideo /> : <FaImage />}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeMediaFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-5 h-5 text-[#A97E50] border-gray-300 rounded focus:ring-[#A97E50]"
                        />
                        <span className="text-sm font-medium">Active</span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="projectForm"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    editingProject ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white flex items-center gap-3 animate-slide-in`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Delete Project?</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletingId(null); }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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
