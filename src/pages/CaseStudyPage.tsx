import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Mail } from 'lucide-react';
import { supabase, type Project, type Testimonial } from '../lib/supabase';
import Header from '../components/Header';

export default function CaseStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

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

        if (data.testimonial_id) {
          const { data: testimonialData } = await supabase
            .from('testimonials')
            .select('*')
            .eq('id', data.testimonial_id)
            .maybeSingle();

          setTestimonial(testimonialData);
        }
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
              <div className="text-gray-400">Loading case study...</div>
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
        <div className="container mx-auto px-6 max-w-6xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#F4B400] transition-colors mb-12"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>

          <section className="mb-24">
            <span className="inline-block px-5 py-2 bg-[#F4B400] text-black text-sm font-bold rounded-full mb-6">
              {project.category}
            </span>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
              {project.case_study_hero_description || project.description}
            </p>
          </section>

          {(project.impact_metrics || []).length > 0 && (
            <section className="mb-24">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span className="text-white">Measurable </span>
                <span className="text-[#F4B400]">Impact</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(project.impact_metrics || []).map((metric, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 text-center"
                  >
                    <div className="text-4xl font-bold text-[#F4B400] mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-400 leading-snug">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(project.challenge_description || project.solution_description) && (
            <section className="mb-24">
              <h2 className="text-4xl font-bold text-center mb-4">
                <span className="text-[#F4B400]">{project.challenge_title || 'The Challenge'}</span>
              </h2>
              <p className="text-gray-400 text-center mb-16 max-w-3xl mx-auto">
                {project.challenge_description}
              </p>

              <div className="grid md:grid-cols-2 gap-12 mb-16">
                {(project.challenge_points || []).length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Challenges</h3>
                    <ul className="space-y-4">
                      {(project.challenge_points || []).map((point, index) => (
                        <li key={index} className="flex gap-3 text-gray-300">
                          <Check className="text-red-500 flex-shrink-0 mt-1" size={20} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(project.solution_points || []).length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {project.solution_title || 'Our Solution'}
                    </h3>
                    <ul className="space-y-4">
                      {(project.solution_points || []).map((point, index) => (
                        <li key={index} className="flex gap-3 text-gray-300">
                          <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {project.solution_description && (
                <p className="text-gray-400 max-w-3xl mx-auto text-center">
                  {project.solution_description}
                </p>
              )}
            </section>
          )}

          {(project.before_image || project.after_image) && (
            <section className="mb-24">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span className="text-white">Before & </span>
                <span className="text-[#F4B400]">After</span>
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
                A comprehensive transformation that elevated every aspect of the digital experience.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                {project.before_image && (
                  <div>
                    <div className="relative mb-6">
                      <span className="absolute -top-3 left-6 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        Before
                      </span>
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={project.before_image}
                          alt="Before"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    {(project.before_points || []).length > 0 && (
                      <ul className="space-y-3">
                        {(project.before_points || []).map((point, index) => (
                          <li key={index} className="flex gap-3 text-red-400 text-sm">
                            <Check className="flex-shrink-0 mt-0.5" size={18} />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {project.after_image && (
                  <div>
                    <div className="relative mb-6">
                      <span className="absolute -top-3 left-6 bg-[#F4B400] text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                        After
                      </span>
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={project.after_image}
                          alt="After"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    {(project.after_points || []).length > 0 && (
                      <ul className="space-y-3">
                        {(project.after_points || []).map((point, index) => (
                          <li key={index} className="flex gap-3 text-green-400 text-sm">
                            <Check className="flex-shrink-0 mt-0.5" size={18} />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {(project.strategic_approach || []).length > 0 && (
            <section className="mb-24">
              <h2 className="text-4xl font-bold text-center mb-4">
                <span className="text-white">Strategic </span>
                <span className="text-[#F4B400]">Approach</span>
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
                A comprehensive methodology designed for long-term success
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(project.strategic_approach || []).map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
                  >
                    <div className="w-12 h-12 bg-[#F4B400] rounded-lg flex items-center justify-center mb-4 text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(project.tags || []).length > 0 && (
            <section className="mb-24">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span className="text-white">Technologies </span>
                <span className="text-[#F4B400]">Used</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {(project.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(project.project_process || []).length > 0 && (
            <section className="mb-24">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span className="text-white">Project </span>
                <span className="text-[#F4B400]">Process</span>
              </h2>
              <div className="space-y-8">
                {(project.project_process || []).map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#F4B400] rounded-full flex items-center justify-center text-black font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="text-sm text-[#F4B400] font-semibold mb-1">
                        {step.phase}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {testimonial && (
            <section className="mb-24">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-12 text-center max-w-4xl mx-auto">
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={24}
                      className={
                        index < testimonial.rating
                          ? 'text-[#F4B400] fill-[#F4B400]'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>
                <p className="text-2xl text-white leading-relaxed mb-8">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  {testimonial.client_avatar && (
                    <img
                      src={testimonial.client_avatar}
                      alt={testimonial.client_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <div className="text-white font-semibold">{testimonial.client_name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.client_role}</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {(project.cta_title || project.cta_description) && (
            <section className="mb-12">
              <div className="bg-gradient-to-br from-[#F4B400] to-[#ff8c00] rounded-lg p-12 text-center">
                <h2 className="text-4xl font-bold text-black mb-4">
                  {project.cta_title || 'Ready for Your Own Transformation?'}
                </h2>
                <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
                  {project.cta_description || "Let's discuss your project and create something amazing together."}
                </p>
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/#contact');
                    }
                  }}
                  className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors text-lg"
                >
                  <Mail size={24} />
                  Get in Touch
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
