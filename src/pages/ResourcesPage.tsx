import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Bell } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

export default function ResourcesPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      await supabase.from('lead_captures').insert({
        name: 'Resource Page Waitlist',
        email,
        resource_slug: 'resources-coming-soon',
        resource_title: 'Resources Page Launch Notification',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Resources - Coming Soon"
        description="Free marketing resources, courses, PDFs, quizzes and tools by Nick Irmo. Coming soon."
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

            <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[#F4B400]/10 border border-[#F4B400]/20 flex items-center justify-center">
                  <Sparkles size={36} className="text-[#F4B400]" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4B400] animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4B400]/10 border border-[#F4B400]/20 text-[#F4B400] text-xs font-semibold tracking-wider uppercase mb-6">
                Coming Soon
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-2xl">
                Resource <span className="text-[#F4B400]">Library</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-lg leading-relaxed mb-10">
                Interactive courses, downloadable templates, quizzes, and tools -- all built to help you grow. We're putting the finishing touches on something great.
              </p>

              {submitted ? (
                <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Bell size={18} className="text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">
                    You're on the list. We'll let you know when it launches.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F4B400]/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? 'Saving...' : 'Notify Me'}
                  </button>
                </form>
              )}

              <div className="flex items-center gap-6 mt-16 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F4B400]/40" />
                  Courses
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F4B400]/40" />
                  Templates
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F4B400]/40" />
                  Quizzes
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F4B400]/40" />
                  Tools
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
