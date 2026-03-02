import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Folder } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';
import Header from '../components/Header';
import SEO from '../components/SEO';

const cardColors = [
  'from-[#4A5568] to-[#5A4A7B]',
  'from-[#2C5F6F] to-[#1A4D5C]',
  'from-[#8B6F47] to-[#6B4F27]',
  'from-[#6B3951] to-[#4B1931]',
  'from-[#2D5A7B] to-[#1D3A5B]',
  'from-[#5A3F7B] to-[#3A1F5B]',
];

export default function AllProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="pt-32 pb-20">
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
      <SEO
        title="All Projects - Portfolio"
        description="Browse my complete portfolio of marketing projects, campaigns, and creative work."
        canonical="https://irmomarketing.com/projects"
      />
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />

        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="mb-16">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                All Projects
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                Explore my complete portfolio of marketing projects, campaigns, and creative work.
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400">No projects available yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="bg-[#0f0f0f] rounded-lg overflow-hidden border border-gray-800 hover:border-[#F4B400] transition-all duration-300 group"
                  >
                    <div className={`h-56 sm:h-72 bg-gradient-to-br ${cardColors[index % cardColors.length]} flex items-center justify-center`}>
                      <Folder className="text-[#F4B400]" size={72} />
                    </div>
                    <div className="p-6 sm:p-8">
                      <span className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-[#F4B400] text-black text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                        {project.category}
                      </span>
                      <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">{project.title}</h3>
                      <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#1a1a1a] text-gray-400 text-xs sm:text-sm rounded border border-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {project.view_type === 'external_link' ? (
                        <a
                          href={project.external_link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F4B400] hover:text-white transition-colors flex items-center gap-3 text-base"
                        >
                          View Project <ExternalLink size={24} />
                        </a>
                      ) : (
                        <button
                          onClick={() => navigate(project.view_type === 'gallery' ? `/project/${project.id}/gallery` : `/project/${project.id}/case-study`)}
                          className="text-[#F4B400] hover:text-white transition-colors flex items-center gap-3 text-base"
                        >
                          View Details <ExternalLink size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
