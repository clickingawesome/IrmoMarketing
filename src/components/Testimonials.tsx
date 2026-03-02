import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, User, ArrowRight } from 'lucide-react';
import { supabase, type Testimonial } from '../lib/supabase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('show_on_homepage', true)
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
      <section id="testimonials" className="py-24 bg-[#1a1a1a]">
        <div className="container mx-auto px-12">
          <div className="text-center">
            <div className="text-gray-400 text-xl">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-6 sm:px-8 md:px-12">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 px-4">
            <span className="text-[#F4B400]">Client</span> <span className="text-white">Testimonials</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-base sm:text-lg md:text-xl px-4">
            Hear what my clients have to say about working together
          </p>
        </div>

        {testimonials.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#0f0f0f] p-6 sm:p-8 rounded-lg border border-gray-800 hover:border-[#F4B400] transition-all duration-300"
              >
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 flex-shrink-0 rounded-full bg-gradient-to-br from-[#F4B400] to-[#ff8c00] flex items-center justify-center overflow-hidden aspect-square">
                    {testimonial.client_avatar ? (
                      <img
                        src={testimonial.client_avatar}
                        alt={testimonial.client_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-white" size={28} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-lg sm:text-xl">{testimonial.client_name}</h4>
                    <p className="text-gray-400 text-sm sm:text-base">{testimonial.client_role}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={
                        index < testimonial.rating
                          ? 'text-[#F4B400] fill-[#F4B400]'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{testimonial.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#F4B400] text-black font-semibold text-lg rounded-lg hover:bg-[#e0a800] transition-all duration-300 hover:gap-4"
          >
            View All Testimonials
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
