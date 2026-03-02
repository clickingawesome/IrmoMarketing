import { useEffect, useState } from 'react';
import { Star, User, Quote } from 'lucide-react';
import { supabase, type Testimonial } from '../lib/supabase';
import Header from '../components/Header';
import SEO from '../components/SEO';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="text-gray-400">Loading testimonials...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Testimonials - Nick Irmo"
        description="Read what clients say about working with Nick Irmo. Real testimonials from marketing leaders, business owners, and creative directors."
        canonical="https://irmomarketing.com/testimonials"
      />
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />

        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="mb-16">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6">
                Client <span className="text-[#F4B400]">Testimonials</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                Real feedback from the people I've worked with. Every project is a partnership, and these words reflect the results we achieved together.
              </p>
            </div>

            {testimonials.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400">No testimonials available yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`relative bg-[#141414] border border-gray-800/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#F4B400]/40 ${
                      index === 0 ? 'md:flex md:items-stretch' : ''
                    }`}
                  >
                    {index === 0 ? (
                      <>
                        <div className="md:w-1/3 bg-gradient-to-br from-[#1a1a1a] to-[#111] p-8 sm:p-10 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-gray-800/40">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#F4B400] to-[#ff8c00] flex items-center justify-center overflow-hidden aspect-square mb-6 ring-4 ring-[#F4B400]/10">
                            {testimonial.client_avatar ? (
                              <img
                                src={testimonial.client_avatar}
                                alt={testimonial.client_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-white" size={44} />
                            )}
                          </div>
                          <h3 className="text-white font-bold text-2xl mb-1">{testimonial.client_name}</h3>
                          <p className="text-gray-400 text-sm">{testimonial.client_role}</p>
                          <div className="flex gap-1.5 mt-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={i < testimonial.rating ? 'text-[#F4B400] fill-[#F4B400]' : 'text-gray-600'}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="md:w-2/3 p-8 sm:p-10 flex items-center">
                          <div>
                            <Quote size={36} className="text-[#F4B400]/20 mb-4" />
                            <p className="text-gray-200 text-lg sm:text-xl leading-relaxed">{testimonial.content}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 sm:p-8">
                        <div className="flex items-start gap-5 sm:gap-6">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-br from-[#F4B400] to-[#ff8c00] flex items-center justify-center overflow-hidden aspect-square">
                            {testimonial.client_avatar ? (
                              <img
                                src={testimonial.client_avatar}
                                alt={testimonial.client_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-white" size={26} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                              <div>
                                <h3 className="text-white font-semibold text-lg">{testimonial.client_name}</h3>
                                <p className="text-gray-400 text-sm">{testimonial.client_role}</p>
                              </div>
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < testimonial.rating ? 'text-[#F4B400] fill-[#F4B400]' : 'text-gray-600'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{testimonial.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
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
