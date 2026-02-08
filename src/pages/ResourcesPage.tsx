import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, HelpCircle, Gamepad2, DollarSign, LayoutGrid, Search } from 'lucide-react';
import { supabase, type Resource } from '../lib/supabase';
import ResourceCard from '../components/ResourceCard';
import Header from '../components/Header';

const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: LayoutGrid },
  { id: 'course', label: 'Courses', icon: BookOpen },
  { id: 'pdf', label: 'PDFs', icon: FileText },
  { id: 'quiz', label: 'Quizzes', icon: HelpCircle },
  { id: 'app', label: 'Apps & Games', icon: Gamepad2 },
  { id: 'paid', label: 'Premium', icon: DollarSign },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = resources.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const counts: Record<string, number> = { all: resources.length };
  resources.forEach(r => {
    counts[r.category] = (counts[r.category] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <div className="pt-28 pb-20">
        <div className="container mx-auto px-6 sm:px-8 md:px-12">
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4B400]/10 border border-[#F4B400]/20 text-[#F4B400] text-xs font-semibold tracking-wider uppercase mb-4">
              Free Marketing Resources
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Resource <span className="text-[#F4B400]">Library</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
              Interactive courses, downloadable templates, quizzes, and tools -- all built to help you grow. Free to use, easy to share.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F4B400]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count = counts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F4B400] text-black shadow-lg shadow-[#F4B400]/10'
                      : 'bg-[#1a1a1a] text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/5 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#141414] border border-gray-800/60 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-800/30" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-800/30 rounded w-3/4" />
                    <div className="h-4 bg-gray-800/20 rounded w-full" />
                    <div className="h-4 bg-gray-800/20 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-600 text-6xl mb-4">
                <Search size={48} className="mx-auto opacity-30" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No resources found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
