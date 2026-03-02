import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import Header from '../components/Header';
import SEO from '../components/SEO';
import ResourceCard from '../components/ResourceCard';
import { supabase, type Resource } from '../lib/supabase';

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'course', label: 'Courses' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'quiz', label: 'Quizzes' },
  { key: 'app', label: 'Interactive' },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = resources.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.tags && r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.filter((r) => r.is_featured);
  const rest = filtered.filter((r) => !r.is_featured);

  return (
    <>
      <SEO
        title="Free Resources & Tools"
        description="Free marketing resources, courses, PDFs, quizzes and interactive tools by Nick Irmo. Level up your marketing skills."
        canonical="https://irmomarketing.com/resources"
      />
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

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
                  Resource <span className="text-[#F4B400]">Library</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                  Free courses, templates, quizzes, and tools to level up your marketing.
                </p>
              </div>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all text-sm"
              >
                {showSearch ? <X size={16} /> : <Search size={16} />}
                {showSearch ? 'Close' : 'Search'}
              </button>
            </div>

            {showSearch && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative max-w-md">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F4B400]/50 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = activeCategory === cat.key;
                const count =
                  cat.key === 'all'
                    ? resources.length
                    : resources.filter((r) => r.category === cat.key).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                      isActive
                        ? 'bg-[#F4B400]/10 border-[#F4B400]/30 text-[#F4B400]'
                        : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#F4B400]/20 text-[#F4B400]' : 'bg-white/5 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
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
                      <div className="h-5 bg-gray-800/40 rounded w-3/4" />
                      <div className="h-4 bg-gray-800/20 rounded w-full" />
                      <div className="h-4 bg-gray-800/20 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <SlidersHorizontal size={40} className="mx-auto mb-4 text-gray-700" />
                <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search.`
                    : 'No resources in this category yet.'}
                </p>
                {(searchQuery || activeCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-[#F4B400] hover:text-[#d99f00] text-sm font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-10">
                {featured.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">Featured</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featured.map((r) => (
                        <ResourceCard key={r.id} resource={r} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  {featured.length > 0 && rest.length > 0 && (
                    <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">
                      All Resources
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((r) => (
                      <ResourceCard key={r.id} resource={r} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
