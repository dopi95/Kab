'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface Portfolio {
  heroImages: string[];
  aboutText: string;
  experienceYears: string;
  skills: string[];
  experiences: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  sampleWorks: {
    title: string;
    description: string;
    type: 'image' | 'video' | 'youtube';
    mediaUrls?: string[];
    youtubeUrl?: string;
  }[];
}

export default function AdminPortfolioPage() {
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'skills' | 'experience' | 'works'>('hero');
  const [aboutText, setAboutText] = useState('');
  const [experienceYears, setExperienceYears] = useState('10+');
  const [skills, setSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Portfolio['experiences']>([]);
  const [sampleWorks, setSampleWorks] = useState<Portfolio['sampleWorks']>([]);
  const [editingWork, setEditingWork] = useState<{ index: number; work: Portfolio['sampleWorks'][0] } | null>(null);
  const [editMediaToRemove, setEditMediaToRemove] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<'hero' | 'work'>('hero');
  const [workMediaType, setWorkMediaType] = useState<'image' | 'video' | 'youtube'>('image');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }
    fetchUser();
    fetchPortfolio();
  }, [router]);

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

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`);
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        setAboutText(data.data.aboutText);
        setExperienceYears(data.data.experienceYears);
        setSkills(data.data.skills || []);
        setExperiences(data.data.experiences || []);
        setSampleWorks(data.data.sampleWorks || []);
      }
    } catch (error) {
      showToast('Failed to fetch portfolio', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/hero`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        showToast('Image added successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to add image', 'error');
    }
  };

  const handleUpdateImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/hero/${index}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        showToast('Image updated successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to update image', 'error');
    }
  };

  const handleDeleteImage = async (index: number) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = deleteType === 'hero' ? 'hero' : 'works';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${endpoint}/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        if (deleteType === 'work') setSampleWorks(data.data.sampleWorks || []);
        showToast(`${deleteType === 'hero' ? 'Image' : 'Work'} deleted successfully`, 'success');
        setDeleteIndex(null);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast(`Failed to delete ${deleteType === 'hero' ? 'image' : 'work'}`, 'error');
    }
  };

  const handleUpdateAbout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aboutText, experienceYears }),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        showToast('About section updated successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to update about section', 'error');
    }
  };

  const handleUpdateSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills }),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        showToast('Skills updated successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to update skills', 'error');
    }
  };

  const handleUpdateExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/experiences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ experiences }),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        showToast('Experiences updated successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to update experiences', 'error');
    }
  };

  const handleAddWork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const type = formData.get('type') as string;
    const files = (form.querySelector('[name="media"]') as HTMLInputElement)?.files;
    
    if (type !== 'youtube' && (!files || files.length === 0)) {
      showToast('Please select at least one file', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      showToast('Uploading... Please wait', 'success');
      
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.get('title') as string);
      uploadFormData.append('description', formData.get('description') as string);
      uploadFormData.append('type', type);
      uploadFormData.append('youtubeUrl', formData.get('youtubeUrl') as string);
      
      if (files) {
        for (let i = 0; i < files.length; i++) {
          uploadFormData.append('media', files[i]);
        }
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/works`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        setSampleWorks(data.data.sampleWorks || []);
        showToast('Work added successfully', 'success');
        form.reset();
        setWorkMediaType('image');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to add work', 'error');
    }
  };

  const handleUpdateWork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingWork) return;
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const files = (form.querySelector('[name="media"]') as HTMLInputElement).files;

    try {
      const token = localStorage.getItem('token');
      showToast('Updating... Please wait', 'success');
      
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.get('title') as string);
      uploadFormData.append('description', formData.get('description') as string);
      uploadFormData.append('type', formData.get('type') as string);
      uploadFormData.append('youtubeUrl', formData.get('youtubeUrl') as string);
      uploadFormData.append('removeIndices', JSON.stringify(editMediaToRemove));
      
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          uploadFormData.append('media', files[i]);
        }
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/works/${editingWork.index}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data);
        setSampleWorks(data.data.sampleWorks || []);
        showToast('Work updated successfully', 'success');
        setEditingWork(null);
        setEditMediaToRemove([]);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to update work', 'error');
    }
  };

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar user={user} />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">My Portfolio</h1>

          {/* Tabs */}
          <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'hero'
                  ? 'text-[#A97E50] border-b-2 border-[#A97E50]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Hero
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'about'
                  ? 'text-[#A97E50] border-b-2 border-[#A97E50]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'skills'
                  ? 'text-[#A97E50] border-b-2 border-[#A97E50]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'experience'
                  ? 'text-[#A97E50] border-b-2 border-[#A97E50]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('works')}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'works'
                  ? 'text-[#A97E50] border-b-2 border-[#A97E50]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Works
            </button>
          </div>

          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Hero Images (Max 3)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative">
                    {portfolio?.heroImages[index] ? (
                      <div className="relative group">
                        <img
                          src={portfolio.heroImages[index]}
                          alt={`Hero ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex flex-col items-center justify-center gap-2 md:gap-3">
                          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base">
                            Update
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleUpdateImage(index, e)}
                            />
                          </label>
                          <button
                            onClick={() => { setDeleteIndex(index); setDeleteType('hero'); }}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#A97E50] transition">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-gray-500 dark:text-gray-400">Add Image {index + 1}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAddImage}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">About Me Section</h2>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    About Text
                  </label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter about text..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Experience Years
                  </label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 10+"
                  />
                </div>
                <button
                  onClick={handleUpdateAbout}
                  className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Update About Section
                </button>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-2 animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex-1 relative">
                      <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-lg flex items-center justify-center text-white text-xs md:text-sm font-bold">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...skills];
                          newSkills[idx] = e.target.value;
                          setSkills(newSkills);
                        }}
                        className="w-full pl-10 md:pl-14 pr-4 py-2 md:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white transition-all text-sm md:text-base"
                        placeholder="Skill name"
                      />
                    </div>
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                      className="px-3 md:px-4 py-2 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSkills([...skills, ''])}
                  className="md:col-span-2 px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-[#A97E50] hover:text-[#A97E50] hover:bg-[#A97E50]/5 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Skill
                </button>
              </div>
              <button
                onClick={handleUpdateSkills}
                className="w-full mt-6 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Update Skills
              </button>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Experience</h2>
              <div className="space-y-4 md:space-y-6">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative p-4 md:p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl space-y-3 md:space-y-4 hover:border-[#A97E50] transition-all animate-slide-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="absolute -left-2 md:-left-3 -top-2 md:-top-3 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#A97E50] to-[#C4A86D] rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-base">
                      {idx + 1}
                    </div>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[idx].title = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white font-semibold transition-all"
                      placeholder="Job Title"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[idx].company = e.target.value;
                          setExperiences(newExp);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Company"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[idx].period = e.target.value;
                          setExperiences(newExp);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Period (e.g., 2020 - Present)"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[idx].description = e.target.value;
                        setExperiences(newExp);
                      }}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Description"
                    />
                    <button
                      onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                      className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Experience
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setExperiences([...experiences, { title: '', company: '', period: '', description: '' }])}
                  className="w-full px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-[#A97E50] hover:text-[#A97E50] hover:bg-[#A97E50]/5 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Experience
                </button>
              </div>
              <button
                onClick={handleUpdateExperiences}
                className="w-full mt-6 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Update Experiences
              </button>
            </div>
          )}

          {/* Sample Works Tab */}
          {activeTab === 'works' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Sample Works</h2>
              
              {/* Add/Edit Work Form */}
              <form onSubmit={editingWork ? handleUpdateWork : handleAddWork} className="mb-6 md:mb-8 p-4 md:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{editingWork ? 'Edit Work' : 'Add New Work'}</h3>
                  {editingWork && (
                    <button
                      type="button"
                      onClick={() => { setEditingWork(null); setEditMediaToRemove([]); }}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <div className="space-y-3 md:space-y-4">
                  {editingWork && editingWork.work.mediaUrls && editingWork.work.mediaUrls.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Media</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {editingWork.work.mediaUrls.map((url, idx) => (
                          <div key={idx} className="relative group">
                            {editingWork.work.type === 'video' ? (
                              <video src={url} className="w-full h-24 object-cover rounded-lg" />
                            ) : (
                              <img src={url} alt={`Media ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (editMediaToRemove.includes(idx)) {
                                  setEditMediaToRemove(editMediaToRemove.filter(i => i !== idx));
                                } else {
                                  setEditMediaToRemove([...editMediaToRemove, idx]);
                                }
                              }}
                              className={`absolute inset-0 flex items-center justify-center rounded-lg transition-all ${
                                editMediaToRemove.includes(idx)
                                  ? 'bg-red-500/80'
                                  : 'bg-black/0 group-hover:bg-black/50'
                              }`}
                            >
                              {editMediaToRemove.includes(idx) ? (
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      {editMediaToRemove.length > 0 && (
                        <p className="text-xs text-red-500 mt-2">{editMediaToRemove.length} media file(s) will be removed</p>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingWork?.work.title}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white"
                    placeholder="Work Title"
                  />
                  <textarea
                    name="description"
                    required
                    defaultValue={editingWork?.work.description}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white"
                    placeholder="Description"
                  />
                  <select
                    name="type"
                    required
                    defaultValue={editingWork?.work.type || workMediaType}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white"
                    onChange={(e) => setWorkMediaType(e.target.value as 'image' | 'video' | 'youtube')}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="youtube">YouTube</option>
                  </select>
                  {(editingWork ? editingWork.work.type !== 'youtube' : workMediaType !== 'youtube') && (
                    <div>
                      <input
                        type="file"
                        name="media"
                        accept="image/*,video/*"
                        multiple
                        required={!editingWork}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{editingWork ? 'Leave empty to keep existing media' : 'Select multiple files (images or videos)'}</p>
                    </div>
                  )}
                  {(editingWork ? editingWork.work.type === 'youtube' : workMediaType === 'youtube') && (
                    <input
                      type="text"
                      name="youtubeUrl"
                      required
                      defaultValue={editingWork?.work.youtubeUrl}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A97E50] focus:border-[#A97E50] dark:bg-gray-700 dark:text-white"
                      placeholder="YouTube URL"
                    />
                  )}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    {editingWork ? 'Update Work' : 'Add Work'}
                  </button>
                </div>
              </form>

              {/* Works List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sampleWorks.map((work, idx) => {
                  const getYouTubeId = (url: string) => {
                    if (!url) return '';
                    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
                    return match ? match[1] : '';
                  };
                  const youtubeId = work.type === 'youtube' ? getYouTubeId(work.youtubeUrl || '') : '';
                  
                  return (
                  <div key={idx} className="relative group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="aspect-video relative bg-gray-200 dark:bg-gray-600">
                      {work.type === 'youtube' && youtubeId ? (
                        <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group/thumb">
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt={work.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/thumb:bg-black/50 transition">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover/thumb:scale-110 transition">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </a>
                      ) : work.type === 'video' ? (
                        <video src={work.mediaUrls?.[0]} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={work.mediaUrls?.[0]} alt={work.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-[#A97E50] text-white text-xs font-bold rounded">
                        {work.type}
                      </div>
                      {work.mediaUrls && work.mediaUrls.length > 1 && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                          +{work.mediaUrls.length}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{work.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{work.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingWork({ index: idx, work })}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => { setDeleteIndex(idx); setDeleteType('work'); }}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-auto px-4 md:px-6 py-3 rounded-lg shadow-lg text-white animate-slide-in z-50 text-sm md:text-base ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Delete Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Delete {deleteType === 'hero' ? 'Image' : 'Work'}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Are you sure you want to delete this {deleteType === 'hero' ? 'image' : 'work'}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteIndex(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteImage(deleteIndex)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
