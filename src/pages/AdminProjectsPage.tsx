import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, type Project, type Testimonial } from '../lib/supabase';
import AdminNav from '../components/AdminNav';
import ImageCropper from '../components/ImageCropper';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [currentUploadTarget, setCurrentUploadTarget] = useState<{
    projectIndex: number;
    field: string;
    arrayIndex?: number;
  } | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [projectsData, testimonialsData] = await Promise.all([
        supabase.from('projects').select('*').order('order_index', { ascending: true }),
        supabase.from('testimonials').select('*').order('order_index', { ascending: true })
      ]);

      if (projectsData.error) throw projectsData.error;
      if (testimonialsData.error) throw testimonialsData.error;

      setProjects(projectsData.data || []);
      setTestimonials(testimonialsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSave(project: Project) {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id);

      if (error) throw error;
      showMessage('success', 'Project updated successfully');
      await fetchData();
    } catch (error) {
      console.error('Error saving project:', error);
      showMessage('error', 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  function updateProject(index: number, field: string, value: any) {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  }

  function addArrayItem(projectIndex: number, field: string, item: any) {
    const updated = [...projects];
    const currentArray = (updated[projectIndex][field as keyof Project] as any[]) || [];
    updated[projectIndex] = {
      ...updated[projectIndex],
      [field]: [...currentArray, item]
    };
    setProjects(updated);
  }

  function removeArrayItem(projectIndex: number, field: string, itemIndex: number) {
    const updated = [...projects];
    const currentArray = updated[projectIndex][field as keyof Project] as any[];
    updated[projectIndex] = {
      ...updated[projectIndex],
      [field]: currentArray.filter((_, i) => i !== itemIndex)
    };
    setProjects(updated);
  }

  function updateArrayItem(projectIndex: number, field: string, itemIndex: number, value: any) {
    const updated = [...projects];
    const currentArray = [...(updated[projectIndex][field as keyof Project] as any[])];
    currentArray[itemIndex] = value;
    updated[projectIndex] = {
      ...updated[projectIndex],
      [field]: currentArray
    };
    setProjects(updated);
  }

  function toggleProjectExpanded(projectIndex: number) {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectIndex)) {
        newSet.delete(projectIndex);
      } else {
        newSet.add(projectIndex);
      }
      return newSet;
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, projectIndex: number, field: string, arrayIndex?: number) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result as string);
        setCurrentUploadTarget({ projectIndex, field, arrayIndex });
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  }

  async function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleCropConfirm(croppedBlob: Blob) {
    if (!currentUploadTarget) return;

    try {
      setUploading(true);
      const file = new File([croppedBlob], 'image.jpg', { type: 'image/jpeg' });
      const imageUrl = await uploadImage(file);

      const { projectIndex, field, arrayIndex } = currentUploadTarget;

      if (arrayIndex !== undefined) {
        updateArrayItem(projectIndex, field, arrayIndex, imageUrl);
      } else {
        updateProject(projectIndex, field, imageUrl);
      }

      showMessage('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploading(false);
      setShowCropper(false);
      setTempImageSrc('');
      setCurrentUploadTarget(null);
    }
  }

  function handleCropCancel() {
    setShowCropper(false);
    setTempImageSrc('');
    setCurrentUploadTarget(null);
  }

  async function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>, projectIndex: number) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      const uploadPromises = Array.from(files).map(async (file) => {
        const compressedFile = await compressImage(file, 1920, 0.85);
        return uploadImage(compressedFile);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const updated = [...projects];
      const currentImages = updated[projectIndex].gallery_images || [];
      updated[projectIndex] = {
        ...updated[projectIndex],
        gallery_images: [...currentImages, ...uploadedUrls]
      };
      setProjects(updated);

      showMessage('success', `${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      showMessage('error', 'Failed to upload images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDirectImageUpload(e: React.ChangeEvent<HTMLInputElement>, projectIndex: number, field: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const compressedFile = await compressImage(file, 1920, 0.85);
      const uploadedUrl = await uploadImage(compressedFile);

      const updated = [...projects];
      updated[projectIndex] = {
        ...updated[projectIndex],
        [field]: uploadedUrl
      };
      setProjects(updated);

      showMessage('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />
        <div className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="text-gray-400">Loading projects...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showCropper && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />

        <div className="py-12">
          <div className="container mx-auto px-6 max-w-7xl">

          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-white">Manage </span>
              <span className="text-[#F4B400]">Projects</span>
            </h1>
            <p className="text-gray-400">
              Configure case study content and image galleries for your featured projects.
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/20 border border-green-700 text-green-400' : 'bg-red-900/20 border border-red-700 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-8">
            {projects.map((project, projectIndex) => (
              <div
                key={project.id}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleProjectExpanded(projectIndex)}
                      className="text-[#F4B400] hover:text-[#d99f00] transition-colors"
                    >
                      {expandedProjects.has(projectIndex) ? (
                        <ChevronUp size={28} />
                      ) : (
                        <ChevronDown size={28} />
                      )}
                    </button>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-400">{project.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSave(project)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>

                {expandedProjects.has(projectIndex) && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">View Type</label>
                      <select
                        value={project.view_type}
                        onChange={(e) => updateProject(projectIndex, 'view_type', e.target.value)}
                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                      >
                        <option value="case_study">Case Study</option>
                        <option value="gallery">Image Gallery</option>
                        <option value="external_link">External Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Is Featured</label>
                      <input
                        type="checkbox"
                        checked={project.is_featured}
                        onChange={(e) => updateProject(projectIndex, 'is_featured', e.target.checked)}
                        className="w-6 h-6 accent-[#F4B400]"
                      />
                    </div>
                  </div>

                  {project.view_type === 'external_link' ? (
                    <div className="border-t border-gray-800 pt-8">
                      <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                        External Link
                      </h4>
                      <p className="text-sm text-gray-400 mb-6">Provide the URL where this project is hosted</p>

                      <div>
                        <label className="block text-gray-300 mb-2 font-semibold">Project URL</label>
                        <input
                          type="url"
                          value={project.external_link || ''}
                          onChange={(e) => updateProject(projectIndex, 'external_link', e.target.value)}
                          className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                          placeholder="https://example.com/project"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Users will be redirected to this URL when they click on this project
                        </p>
                      </div>
                    </div>
                  ) : project.view_type === 'case_study' ? (
                    <>
                      <div className="border-t border-gray-800 pt-8">
                        <h4 className="text-lg font-bold text-[#F4B400] mb-6 flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                          Hero Section
                        </h4>
                        <div>
                          <label className="block text-gray-300 mb-2 font-semibold">Hero Description</label>
                          <textarea
                            value={project.case_study_hero_description || ''}
                            onChange={(e) => updateProject(projectIndex, 'case_study_hero_description', e.target.value)}
                            rows={5}
                            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400] resize-none"
                            placeholder="Extended description for the case study hero section..."
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-8">
                        <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                          Impact Metrics
                        </h4>
                        <p className="text-sm text-gray-400 mb-6">Add quantifiable results and achievements</p>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {(project.impact_metrics || []).length > 0 && (
                            <div className="md:col-span-2">
                              <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-6">
                                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Preview</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {(project.impact_metrics || []).map((metric, idx) => (
                                    <div key={idx} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 text-center">
                                      <div className="text-2xl font-bold text-[#F4B400] mb-1">
                                        {metric.value || '—'}
                                      </div>
                                      <div className="text-xs text-gray-400 leading-snug">
                                        {metric.label || 'Label'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {(project.impact_metrics || []).map((metric, metricIndex) => (
                            <div key={metricIndex} className="flex gap-3 items-start">
                              <div className="flex-1 grid md:grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  value={metric.value}
                                  onChange={(e) => updateArrayItem(projectIndex, 'impact_metrics', metricIndex, { ...metric, value: e.target.value })}
                                  className="bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                                  placeholder="190%"
                                />
                                <input
                                  type="text"
                                  value={metric.label}
                                  onChange={(e) => updateArrayItem(projectIndex, 'impact_metrics', metricIndex, { ...metric, label: e.target.value })}
                                  className="md:col-span-2 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                                  placeholder="Increase in organic traffic"
                                />
                              </div>
                              <button
                                onClick={() => removeArrayItem(projectIndex, 'impact_metrics', metricIndex)}
                                className="text-red-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem(projectIndex, 'impact_metrics', { value: '', label: '' })}
                            className="flex items-center gap-2 text-[#F4B400] hover:text-white transition-colors px-4 py-3 hover:bg-[#F4B400]/10 rounded-lg w-full justify-center border border-dashed border-gray-700 hover:border-[#F4B400]"
                          >
                            <Plus size={20} />
                            Add Metric
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-8">
                        <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                          Challenge & Solution
                        </h4>
                        <p className="text-sm text-gray-400 mb-6">Define the problem and your approach</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 mb-2 font-semibold">Challenge Title</label>
                            <input
                              type="text"
                              value={project.challenge_title || ''}
                              onChange={(e) => updateProject(projectIndex, 'challenge_title', e.target.value)}
                              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                              placeholder="The Challenge"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-semibold">Solution Title</label>
                            <input
                              type="text"
                              value={project.solution_title || ''}
                              onChange={(e) => updateProject(projectIndex, 'solution_title', e.target.value)}
                              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                              placeholder="Our Solution"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-8">
                        <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                          Before & After
                        </h4>
                        <p className="text-sm text-gray-400 mb-6">Show the transformation visually</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 mb-3 font-semibold flex items-center gap-2">
                              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                              Before Image
                            </label>
                            {project.before_image && (
                              <div className="mb-3 bg-[#0f0f0f] border border-gray-700 rounded-lg overflow-hidden">
                                <img src={project.before_image} alt="Before" className="w-full h-auto" />
                              </div>
                            )}
                            <label className="cursor-pointer">
                              <div className="bg-[#0f0f0f] border border-dashed border-gray-700 hover:border-[#F4B400] transition-colors rounded-lg p-6 text-center">
                                <Upload className="inline-block text-[#F4B400] mb-2" size={24} />
                                <p className="text-gray-300 text-sm">
                                  {uploading ? 'Uploading...' : 'Click to upload before image'}
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => handleDirectImageUpload(e, projectIndex, 'before_image')}
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-3 font-semibold flex items-center gap-2">
                              <span className="w-3 h-3 bg-[#F4B400] rounded-full"></span>
                              After Image
                            </label>
                            {project.after_image && (
                              <div className="mb-3 bg-[#0f0f0f] border border-gray-700 rounded-lg overflow-hidden">
                                <img src={project.after_image} alt="After" className="w-full h-auto" />
                              </div>
                            )}
                            <label className="cursor-pointer">
                              <div className="bg-[#0f0f0f] border border-dashed border-gray-700 hover:border-[#F4B400] transition-colors rounded-lg p-6 text-center">
                                <Upload className="inline-block text-[#F4B400] mb-2" size={24} />
                                <p className="text-gray-300 text-sm">
                                  {uploading ? 'Uploading...' : 'Click to upload after image'}
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => handleDirectImageUpload(e, projectIndex, 'after_image')}
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-300 mb-2 font-semibold">Challenge Description</label>
                            <textarea
                              value={project.challenge_description || ''}
                              onChange={(e) => updateProject(projectIndex, 'challenge_description', e.target.value)}
                              rows={4}
                              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400] resize-none"
                              placeholder="Describe the main challenges..."
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-3 font-semibold">Challenge Points</label>
                            <div className="space-y-2">
                              {(project.challenge_points || []).map((point, pointIndex) => (
                                <div key={pointIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => updateArrayItem(projectIndex, 'challenge_points', pointIndex, e.target.value)}
                                    className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                                    placeholder="Key challenge point..."
                                  />
                                  <button
                                    onClick={() => removeArrayItem(projectIndex, 'challenge_points', pointIndex)}
                                    className="text-red-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addArrayItem(projectIndex, 'challenge_points', '')}
                                className="flex items-center gap-2 text-[#F4B400] hover:text-white transition-colors px-4 py-3 hover:bg-[#F4B400]/10 rounded-lg w-full justify-center border border-dashed border-gray-700 hover:border-[#F4B400]"
                              >
                                <Plus size={18} />
                                Add Challenge Point
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-300 mb-2 font-semibold">Solution Description</label>
                            <textarea
                              value={project.solution_description || ''}
                              onChange={(e) => updateProject(projectIndex, 'solution_description', e.target.value)}
                              rows={4}
                              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400] resize-none"
                              placeholder="Describe your solution approach..."
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-3 font-semibold">Solution Points</label>
                            <div className="space-y-2">
                              {(project.solution_points || []).map((point, pointIndex) => (
                                <div key={pointIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => updateArrayItem(projectIndex, 'solution_points', pointIndex, e.target.value)}
                                    className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                                    placeholder="Key solution point..."
                                  />
                                  <button
                                    onClick={() => removeArrayItem(projectIndex, 'solution_points', pointIndex)}
                                    className="text-red-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addArrayItem(projectIndex, 'solution_points', '')}
                                className="flex items-center gap-2 text-[#F4B400] hover:text-white transition-colors px-4 py-3 hover:bg-[#F4B400]/10 rounded-lg w-full justify-center border border-dashed border-gray-700 hover:border-[#F4B400]"
                              >
                                <Plus size={18} />
                                Add Solution Point
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-8">
                        <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                          Social Proof
                        </h4>
                        <p className="text-sm text-gray-400 mb-6">Add a testimonial to showcase client satisfaction</p>

                        <div>
                          <label className="block text-gray-300 mb-3 font-semibold">Select Testimonial</label>
                          <select
                            value={project.testimonial_id || ''}
                            onChange={(e) => updateProject(projectIndex, 'testimonial_id', e.target.value || null)}
                            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                          >
                            <option value="">None</option>
                            {testimonials.map((testimonial) => (
                              <option key={testimonial.id} value={testimonial.id}>
                                {testimonial.client_name} - {testimonial.client_role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-8">
                        <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                          <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                          Call to Action
                        </h4>
                        <p className="text-sm text-gray-400 mb-6">Encourage visitors to get in touch</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 mb-2 font-semibold">CTA Title</label>
                            <input
                              type="text"
                              value={project.cta_title || ''}
                              onChange={(e) => updateProject(projectIndex, 'cta_title', e.target.value)}
                              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                              placeholder="Ready for Your Own Transformation?"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-semibold">CTA Description</label>
                            <input
                              type="text"
                              value={project.cta_description || ''}
                              onChange={(e) => updateProject(projectIndex, 'cta_description', e.target.value)}
                              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                              placeholder="Let's discuss your project..."
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="border-t border-gray-800 pt-8">
                      <h4 className="text-lg font-bold text-[#F4B400] mb-2 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
                        Project Gallery
                        {uploading && <span className="ml-auto text-sm font-normal text-gray-400">Uploading...</span>}
                      </h4>
                      <p className="text-sm text-gray-400 mb-6">Upload project images to showcase your work</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(project.gallery_images || []).map((url, urlIndex) => (
                          <div key={urlIndex} className="relative group">
                            <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg overflow-hidden hover:border-[#F4B400] transition-colors">
                              <img src={url} alt={`Gallery ${urlIndex + 1}`} className="w-full h-auto" />
                            </div>
                            <button
                              onClick={() => removeArrayItem(projectIndex, 'gallery_images', urlIndex)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <label className="min-h-[200px] cursor-pointer">
                          <div className="h-full bg-[#0f0f0f] border-2 border-dashed border-gray-700 hover:border-[#F4B400] transition-colors rounded-lg flex flex-col items-center justify-center p-6">
                            <Upload className="text-[#F4B400] mb-3" size={40} />
                            <p className="text-gray-300 text-sm text-center font-semibold mb-1">Upload Images</p>
                            <p className="text-gray-500 text-xs text-center">Select multiple files</p>
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            onChange={(e) => handleGalleryImageUpload(e, projectIndex)}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">No projects found.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
