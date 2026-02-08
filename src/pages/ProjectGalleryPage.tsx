import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';
import Header from '../components/Header';

export default function ProjectGalleryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/');
          return;
        }

        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="text-gray-400">Loading gallery...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#F4B400] transition-colors mb-12"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>

          <div className="mb-16">
            <span className="inline-block px-5 py-2 bg-[#F4B400] text-black text-sm font-bold rounded-full mb-6">
              {project.category}
            </span>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
              {project.description}
            </p>
          </div>

          {(project.gallery_images || []).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No images in this gallery yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(project.gallery_images || []).map((imageUrl, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(imageUrl)}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-[#F4B400] transition-all group"
                >
                  <img
                    src={imageUrl}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#F4B400] transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
