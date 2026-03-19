import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, HelpCircle, Gamepad2, DollarSign, Lock, ExternalLink, Newspaper, Clock, Calendar } from 'lucide-react';
import { supabase, type Resource } from '../lib/supabase';
import Header from '../components/Header';
import SocialShare from '../components/SocialShare';
import LeadCaptureModal from '../components/LeadCaptureModal';
import SEO from '../components/SEO';

const ZeroClickCourse = lazy(() => import('./Resources/zero-click-course'));
const MarketingTitleQuiz = lazy(() => import('./Resources/marketing-title-quiz'));
const MarketingCapacityQuiz = lazy(() => import('./Resources/marketing-capacity-quiz'));
const AIReplacementQuiz = lazy(() => import('./Resources/ai-replacement-quiz'));
const MisfortunateCookie = lazy(() => import('./Resources/misfortunate-cookie-v2'));
const PDFFlipbook = lazy(() => import('../components/Resources/flipbook'));
const TrollKingGame = lazy(() => import('./Resources/game'));
const TrollKingDeluxe = lazy(() => import('./Resources/game2'));

const COMPONENT_MAP: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'zero-click-course': ZeroClickCourse,
  'marketing-title-quiz': MarketingTitleQuiz,
  'marketing-capacity-quiz': MarketingCapacityQuiz,
  'ai-replacement-quiz': AIReplacementQuiz,
  'misfortunate-cookie': MisfortunateCookie,
  'flipbook': PDFFlipbook,
  'troll-king-game': TrollKingGame,
  'troll-king-deluxe': TrollKingDeluxe,
};

const CATEGORY_META: Record<string, { icon: typeof BookOpen; label: string; color: string; bg: string }> = {
  course: { icon: BookOpen, label: 'Mini-Course', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  pdf: { icon: FileText, label: 'PDF Download', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  app: { icon: Gamepad2, label: 'Interactive', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  paid: { icon: DollarSign, label: 'Premium', color: 'text-[#F4B400]', bg: 'bg-[#F4B400]/10 border-[#F4B400]/20' },
  article: { icon: Newspaper, label: 'Article', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
};

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ArticleBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n+/);
  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('# ')) {
          return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-3 leading-snug">{trimmed.slice(2)}</h2>;
        }
        if (trimmed.startsWith('## ')) {
          return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-2 leading-snug">{trimmed.slice(3)}</h3>;
        }
        if (trimmed.startsWith('### ')) {
          return <h4 key={i} className="text-lg font-semibold text-gray-100 mt-5 mb-2">{trimmed.slice(4)}</h4>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={i} className="space-y-2 pl-1">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-gray-300 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F4B400] flex-shrink-0" />
                  <span>{item.replace(/^[-*]\s+/, '')}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-3 border-[#F4B400] pl-5 py-1 my-6">
              <p className="text-gray-300 italic text-lg leading-relaxed">{trimmed.slice(2)}</p>
            </blockquote>
          );
        }
        return <p key={i} className="text-gray-300 leading-[1.8] text-[1.05rem]">{trimmed}</p>;
      })}
    </div>
  );
}

export default function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    if (slug) fetchResource(slug);
  }, [slug]);

  useEffect(() => {
    if (resource) {
      document.title = resource.meta_title || `${resource.title} | Nick Irmo Resources`;
    }
    return () => { document.title = 'Nick Irmo'; };
  }, [resource]);

  async function fetchResource(resourceSlug: string) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('slug', resourceSlug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setNotFound(true);
      } else {
        setResource(data);
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-800/50" />
            <div className="h-5 w-48 bg-gray-800/50 rounded" />
            <div className="h-4 w-32 bg-gray-800/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !resource) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="pt-28 pb-20">
          <div className="container mx-auto px-6 sm:px-8 md:px-12 text-center">
            <div className="text-6xl mb-6 opacity-30">404</div>
            <h1 className="text-3xl font-bold text-white mb-4">Resource Not Found</h1>
            <p className="text-gray-400 mb-8">The resource you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const config = CATEGORY_META[resource.category] || CATEGORY_META.course;
  const Icon = config.icon;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/resources/${resource.slug}` : '';
  const hasComponent = resource.component_path && COMPONENT_MAP[resource.component_path];
  const hasExternalUrl = resource.external_url;
  const hasPdfUrl = resource.pdf_url;
  const isArticle = resource.category === 'article';
  const readTime = isArticle && resource.body ? estimateReadTime(resource.body) : null;
  const publishDate = new Date(resource.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <SEO
        title={resource.title}
        description={resource.description}
        canonical={`https://irmomarketing.com/resources/${resource.slug}`}
        ogImage={resource.thumbnail_url}
      />
      <div className="min-h-screen bg-[#0f0f0f]">
        {!hasComponent && <Header />}

      <div className={hasComponent ? '' : 'pt-28 pb-20'}>
        {!hasComponent && (
          <div className="container mx-auto px-6 sm:px-8 md:px-12">
            <div className="mb-6">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Back to Resources
              </Link>
            </div>

            <div className={isArticle ? 'max-w-2xl mx-auto' : 'max-w-3xl'}>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${config.bg} ${config.color}`}>
                  <Icon size={12} />
                  {config.label}
                </span>
                {resource.is_free ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
                    Free
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4B400]/15 border border-[#F4B400]/25 text-[#F4B400]">
                    <Lock size={10} />
                    ${resource.price}
                  </span>
                )}
                {isArticle && (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Calendar size={11} />
                      {publishDate}
                    </span>
                    {readTime && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Clock size={11} />
                        {readTime} min read
                      </span>
                    )}
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {resource.title}
              </h1>

              {resource.long_description && (
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  {resource.long_description}
                </p>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {resource.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mb-10">
                <SocialShare url={shareUrl} title={resource.title} description={resource.description} />
              </div>

              {resource.thumbnail_url && (
                <div className="mb-10">
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title}
                    className="w-full rounded-xl border border-gray-800/60 shadow-2xl"
                  />
                </div>
              )}

              {isArticle && resource.body && (
                <div className="border-t border-gray-800/60 pt-10">
                  <ArticleBody body={resource.body} />
                  <div className="mt-12 pt-8 border-t border-gray-800/60">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <SocialShare url={shareUrl} title={resource.title} description={resource.description} />
                      <Link
                        to="/resources"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft size={14} />
                        Back to Resources
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {hasComponent && (
          <div>
            <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm border border-gray-800/60 text-gray-300 hover:text-white text-sm transition-all hover:bg-black/80"
              >
                <ArrowLeft size={14} />
                Resources
              </Link>
            </div>
            <div className="fixed top-4 right-4 z-50">
              <div className="bg-black/60 backdrop-blur-sm border border-gray-800/60 rounded-xl px-3 py-2">
                <SocialShare url={shareUrl} title={resource.title} description={resource.description} />
              </div>
            </div>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
                <div className="animate-pulse flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-800/50" />
                  <div className="text-gray-500 text-sm">Loading resource...</div>
                </div>
              </div>
            }>
              {(() => {
                const Component = COMPONENT_MAP[resource.component_path!];
                return <Component />;
              })()}
            </Suspense>
          </div>
        )}

        {!hasComponent && hasPdfUrl && (
          <div className="container mx-auto px-6 sm:px-8 md:px-12">
            <div className="max-w-4xl">
              <div className="bg-[#141414] border border-gray-800/60 rounded-2xl overflow-hidden">
                <div className="p-8 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-sky-400 opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">Download PDF</h3>
                  <p className="text-gray-400 text-sm mb-6">Get the full document as a downloadable PDF file.</p>
                  <button
                    onClick={() => setShowLeadModal(true)}
                    className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                    Get PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasComponent && hasExternalUrl && !hasPdfUrl && (
          <div className="container mx-auto px-6 sm:px-8 md:px-12">
            <div className="max-w-4xl">
              <div className="bg-[#141414] border border-gray-800/60 rounded-2xl overflow-hidden">
                <div className="p-8 text-center">
                  <ExternalLink size={48} className="mx-auto mb-4 text-[#F4B400] opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">External Resource</h3>
                  <p className="text-gray-400 text-sm mb-6">This resource is hosted on an external platform.</p>
                  <a
                    href={resource.external_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                    Visit Resource
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasPdfUrl && (
        <LeadCaptureModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          resourceTitle={resource?.title || ''}
          resourceSlug={resource?.slug || ''}
          pdfUrl={resource?.pdf_url || ''}
        />
      )}
    </div>
    </>
  );
}
