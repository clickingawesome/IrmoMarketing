import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';
import Header from '../components/Header';
import SEO from '../components/SEO';

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
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

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
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden hover:border-[#F4B400] transition-all group"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-[#F4B400] text-black text-xs font-bold rounded-full mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#F4B400] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-6 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {project.case_study_content && (
                          <button
                            onClick={() => navigate(`/project/${project.id}/case-study`)}
                            className="px-4 py-2 bg-[#F4B400] text-black font-bold rounded hover:bg-[#d9a000] transition-colors"
                          >
                            View Case Study
                          </button>
                        )}
                        {project.gallery_images && project.gallery_images.length > 0 && (
                          <button
                            onClick={() => navigate(`/project/${project.id}/gallery`)}
                            className="px-4 py-2 border border-gray-600 text-white font-bold rounded hover:border-[#F4B400] hover:text-[#F4B400] transition-colors"
                          >
                            View Gallery
                          </button>
                        )}
                        {project.external_link && (
                          <a
                            href={project.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-gray-600 text-white font-bold rounded hover:border-[#F4B400] hover:text-[#F4B400] transition-colors inline-flex items-center gap-2"
                          >
                            Visit Site
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
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
