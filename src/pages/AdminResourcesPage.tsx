import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, GripVertical, Eye, EyeOff, Star, ExternalLink } from 'lucide-react';
import { supabase, type Resource } from '../lib/supabase';
import AdminNav from '../components/AdminNav';
import { CATEGORY_CONFIG } from '../components/ResourceCard';

type ResourceFormData = Omit<Resource, 'id' | 'created_at' | 'updated_at'>;

const EMPTY_RESOURCE: ResourceFormData = {
  title: '',
  slug: '',
  description: '',
  long_description: null,
  category: 'course',
  thumbnail_url: null,
  component_path: null,
  pdf_url: null,
  external_url: null,
  is_free: true,
  price: 0,
  is_published: true,
  is_featured: false,
  order_index: 0,
  tags: [],
  meta_title: null,
  meta_description: null,
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>(EMPTY_RESOURCE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      showMessage('error', 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setFormData({ ...EMPTY_RESOURCE, order_index: resources.length });
    setTagInput('');
  }

  function startEdit(resource: Resource) {
    setEditing(resource);
    setCreating(false);
    setFormData({
      title: resource.title,
      slug: resource.slug,
      description: resource.description,
      long_description: resource.long_description,
      category: resource.category,
      thumbnail_url: resource.thumbnail_url,
      component_path: resource.component_path,
      pdf_url: resource.pdf_url,
      external_url: resource.external_url,
      is_free: resource.is_free,
      price: resource.price,
      is_published: resource.is_published,
      is_featured: resource.is_featured,
      order_index: resource.order_index,
      tags: resource.tags || [],
      meta_title: resource.meta_title,
      meta_description: resource.meta_description,
    });
    setTagInput('');
  }

  function cancelForm() {
    setEditing(null);
    setCreating(false);
    setFormData(EMPTY_RESOURCE);
    setTagInput('');
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  }

  async function handleSave() {
    if (!formData.title || !formData.slug || !formData.description) {
      showMessage('error', 'Title, slug, and description are required');
      return;
    }

    setSaving(true);
    try {
      if (creating) {
        const { error } = await supabase.from('resources').insert([formData]);
        if (error) throw error;
        showMessage('success', 'Resource created');
      } else if (editing) {
        const { error } = await supabase
          .from('resources')
          .update(formData)
          .eq('id', editing.id);
        if (error) throw error;
        showMessage('success', 'Resource updated');
      }

      cancelForm();
      await fetchResources();
    } catch (error: any) {
      console.error('Error saving resource:', error);
      showMessage('error', error.message || 'Failed to save resource');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      showMessage('success', 'Resource deleted');
      if (editing?.id === id) cancelForm();
      await fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      showMessage('error', 'Failed to delete resource');
    }
  }

  async function togglePublished(resource: Resource) {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_published: !resource.is_published })
        .eq('id', resource.id);
      if (error) throw error;
      await fetchResources();
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  }

  async function toggleFeatured(resource: Resource) {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_featured: !resource.is_featured })
        .eq('id', resource.id);
      if (error) throw error;
      await fetchResources();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  }

  async function moveResource(id: string, direction: 'up' | 'down') {
    const idx = resources.findIndex(r => r.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= resources.length) return;

    try {
      const current = resources[idx];
      const swap = resources[swapIdx];
      await supabase.from('resources').update({ order_index: swap.order_index }).eq('id', current.id);
      await supabase.from('resources').update({ order_index: current.order_index }).eq('id', swap.id);
      await fetchResources();
    } catch (error) {
      console.error('Error reordering:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />
        <div className="py-20 text-center text-gray-400">Loading resources...</div>
      </div>
    );
  }

  const isFormOpen = creating || editing !== null;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminNav />

      <div className="py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="text-white">Manage </span>
                <span className="text-[#F4B400]">Resources</span>
              </h1>
              <p className="text-gray-400">
                Add, edit, reorder, and manage your resource library.
              </p>
            </div>
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-5 py-3 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Resource
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/20 border border-green-700 text-green-400' : 'bg-red-900/20 border border-red-700 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {isFormOpen && (
            <div className="mb-8 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {creating ? 'New Resource' : `Edit: ${editing?.title}`}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: creating ? generateSlug(title) : formData.slug,
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Short Description *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Long Description</label>
                  <textarea
                    value={formData.long_description || ''}
                    onChange={(e) => setFormData({ ...formData, long_description: e.target.value || null })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Resource['category'] })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  >
                    <option value="course">Course</option>
                    <option value="pdf">PDF</option>
                    <option value="quiz">Quiz</option>
                    <option value="app">App / Game</option>
                    <option value="paid">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Component Path</label>
                  <input
                    type="text"
                    value={formData.component_path || ''}
                    onChange={(e) => setFormData({ ...formData, component_path: e.target.value || null })}
                    placeholder="e.g., zero-click-course"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Thumbnail URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail_url || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value || null })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">PDF URL</label>
                  <input
                    type="text"
                    value={formData.pdf_url || ''}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value || null })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">External URL</label>
                  <input
                    type="text"
                    value={formData.external_url || ''}
                    onChange={(e) => setFormData({ ...formData, external_url: e.target.value || null })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Order Index</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_free}
                      onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                      className="w-4 h-4 accent-[#F4B400]"
                    />
                    <span className="text-sm text-gray-300">Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 accent-[#F4B400]"
                    />
                    <span className="text-sm text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-[#F4B400]"
                    />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                </div>

                {!formData.is_free && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      placeholder="Type a tag and press Enter"
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-[#F4B400]/50"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-medium"
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-400 transition-colors">
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Meta Title</label>
                  <input
                    type="text"
                    value={formData.meta_title || ''}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value || null })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Meta Description</label>
                  <input
                    type="text"
                    value={formData.meta_description || ''}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value || null })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:border-[#F4B400]/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : creating ? 'Create Resource' : 'Save Changes'}
                </button>
                <button
                  onClick={cancelForm}
                  className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {resources.map((resource, idx) => {
              const config = CATEGORY_CONFIG[resource.category];
              const CatIcon = config?.icon;
              return (
                <div
                  key={resource.id}
                  className={`bg-[#1a1a1a] border rounded-xl p-4 flex items-center gap-4 transition-all ${
                    editing?.id === resource.id ? 'border-[#F4B400]/40' : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveResource(resource.id, 'up')}
                      disabled={idx === 0}
                      className="text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <GripVertical size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => moveResource(resource.id, 'down')}
                      disabled={idx === resources.length - 1}
                      className="text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <GripVertical size={14} />
                    </button>
                  </div>

                  {resource.thumbnail_url ? (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.title}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-gray-800/50 flex items-center justify-center flex-shrink-0">
                      {CatIcon && <CatIcon size={18} className={config?.color || 'text-gray-500'} />}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white font-semibold truncate">{resource.title}</h3>
                      {config && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                      )}
                      {!resource.is_free && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4B400]/10 border border-[#F4B400]/20 text-[#F4B400] font-semibold">
                          ${resource.price}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">{resource.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/resources/${resource.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                      title="View"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={() => toggleFeatured(resource)}
                      className={`p-2 rounded-lg transition-all ${
                        resource.is_featured ? 'text-[#F4B400] bg-[#F4B400]/10' : 'text-gray-500 hover:text-[#F4B400] hover:bg-white/5'
                      }`}
                      title={resource.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <Star size={16} />
                    </button>
                    <button
                      onClick={() => togglePublished(resource)}
                      className={`p-2 rounded-lg transition-all ${
                        resource.is_published ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-500 hover:text-emerald-400 hover:bg-white/5'
                      }`}
                      title={resource.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {resource.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => startEdit(resource)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {resources.length === 0 && !isFormOpen && (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-4">No resources yet.</p>
              <button
                onClick={startCreate}
                className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                <Plus size={18} />
                Add Your First Resource
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
