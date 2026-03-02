import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const cardColors = [
    'from-[#4A5568] to-[#5A4A7B]',
    'from-[#2C5F6F] to-[#1A4D5C]',
    'from-[#8B6F47] to-[#6B4F27]',
    'from-[#6B3951] to-[#4B1931]',
    'from-[#2D5A7B] to-[#1D3A5B]',
    'from-[#5A3F7B] to-[#3A1F5B]',
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .eq('is_visible', true)
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
      <section id="portfolio" className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-12">
          <div className="text-center">
            <div className="text-gray-400 text-xl">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-6 sm:px-8 md:px-12">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 px-4">
            <span className="text-[#F4B400]">Featured</span> <span className="text-white">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-base sm:text-lg md:text-xl px-4">
            A selection of my recent work, featuring innovative solutions and impactful results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
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
                  <Link
                    to={project.view_type === 'gallery' ? `/project/${project.id}/gallery` : `/project/${project.id}/case-study`}
                    className="text-[#F4B400] hover:text-white transition-colors flex items-center gap-3 text-base"
                  >
                    View Details <ExternalLink size={24} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#F4B400] text-black font-semibold text-lg rounded-lg hover:bg-[#e0a800] transition-all duration-300 hover:gap-4"
          >
            View All Projects
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
