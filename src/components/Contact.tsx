import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (submitError) throw submitError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const emailResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Failed to send email notification:', errorData);
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      navigate('/thank-you');
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#0f0f0f]">
      <div className="container mx-auto px-6 sm:px-8 md:px-12">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 px-4">
            <span className="text-[#F4B400]">Let's</span> <span className="text-white">Connect</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-base sm:text-lg md:text-xl px-4">
            Ready to elevate your marketing? Whether you need strategic guidance, creative
            direction, or a complete marketing overhaul, I'm here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 max-w-7xl mx-auto">
          <div>
            <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10">Get in Touch</h3>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#F4B400]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[#F4B400]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 sm:mb-2 text-lg sm:text-xl">Email</h4>
                  <a
                    href="mailto:nick@clickingawesome.com"
                    className="text-gray-400 hover:text-[#F4B400] transition-colors text-sm sm:text-base md:text-lg break-all"
                  >
                    nick@clickingawesome.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#F4B400]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[#F4B400]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 sm:mb-2 text-lg sm:text-xl">Phone</h4>
                  <a
                    href="tel:+8474144272"
                    className="text-gray-400 hover:text-[#F4B400] transition-colors text-sm sm:text-base md:text-lg"
                  >
                    +1 (847) 414-4272
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#F4B400]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#F4B400]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 sm:mb-2 text-lg sm:text-xl">Location</h4>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg">Barrington Illinois, United States </p>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-12">
              <h4 className="text-white font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">Follow Me</h4>
              <div className="flex gap-4 sm:gap-6">
                <a
                  href="https://www.linkedin.com/in/nickirmo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-15 sm:h-15 bg-[#F4B400]/10 rounded-lg flex items-center justify-center hover:bg-[#F4B400] transition-colors group"
                >
                  <Linkedin className="text-[#F4B400] group-hover:text-black transition-colors" size={24} />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400] transition-colors text-base sm:text-lg"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400] transition-colors text-base sm:text-lg"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400] transition-colors text-base sm:text-lg"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={6}
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-5 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400] transition-colors resize-none text-base sm:text-lg"
                />
              </div>

              {error && (
                <p className="text-red-500 text-base">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#F4B400] text-black px-8 py-4 sm:px-12 sm:py-5 rounded-lg font-semibold hover:bg-[#e5a800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-xl"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2026 Nick Irmo. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#books" className="hover:text-white transition-colors">Books</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
