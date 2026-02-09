import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceSlug: string;
  pdfUrl: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  resourceTitle,
  resourceSlug,
  pdfUrl
}: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;

      const { error: dbError } = await supabase
        .from('lead_captures')
        .insert({
          name,
          email,
          company: company || null,
          resource_slug: resourceSlug,
          resource_title: resourceTitle,
          user_agent: userAgent,
          referrer: referrer || null,
        });

      if (dbError) throw dbError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/functions/v1/send-lead-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          name,
          email,
          company,
          resourceTitle,
          resourceSlug,
        }),
      });

      window.open(pdfUrl, '_blank');
      onClose();

      setName('');
      setEmail('');
      setCompany('');
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#141414] border border-gray-800/60 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F4B400]/10 border border-[#F4B400]/20 mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Get Your Free Resource</h2>
            <p className="text-gray-400 text-sm">
              Enter your details to download <strong className="text-white">{resourceTitle}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-800/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400]/50 focus:ring-1 focus:ring-[#F4B400]/50 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-800/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400]/50 focus:ring-1 focus:ring-[#F4B400]/50 transition-colors"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1.5">
                Company <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-800/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F4B400]/50 focus:ring-1 focus:ring-[#F4B400]/50 transition-colors"
                placeholder="Acme Inc."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Opening PDF...' : 'Download PDF'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your information is secure and will never be shared.
          </p>
        </div>
      </div>
    </div>
  );
}
