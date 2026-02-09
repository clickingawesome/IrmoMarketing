import { Link } from 'react-router-dom';
import { BookOpen, FileText, HelpCircle, Gamepad2, DollarSign, ArrowRight, Lock } from 'lucide-react';
import type { Resource } from '../lib/supabase';
import SocialShare from './SocialShare';

const CATEGORY_CONFIG: Record<string, { icon: typeof BookOpen; label: string; color: string; bg: string }> = {
  course: { icon: BookOpen, label: 'Mini-Course', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  pdf: { icon: FileText, label: 'PDF Download', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  app: { icon: Gamepad2, label: 'Interactive', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  paid: { icon: DollarSign, label: 'Premium', color: 'text-[#F4B400]', bg: 'bg-[#F4B400]/10 border-[#F4B400]/20' },
};

export { CATEGORY_CONFIG };

export default function ResourceCard({ resource }: { resource: Resource }) {
  const config = CATEGORY_CONFIG[resource.category] || CATEGORY_CONFIG.course;
  const Icon = config.icon;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/resources/${resource.slug}` : '';

  return (
    <div className="group relative bg-[#141414] border border-gray-800/60 rounded-2xl overflow-hidden hover:border-gray-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-gray-900 to-[#1a1a1a] overflow-hidden">
        {resource.thumbnail_url ? (
          <>
            <img
              src={resource.thumbnail_url}
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon size={48} className={`${config.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${config.bg} ${config.color} backdrop-blur-sm`}>
            <Icon size={12} />
            {config.label}
          </span>
        </div>
        {!resource.is_free && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4B400]/15 border border-[#F4B400]/25 text-[#F4B400] backdrop-blur-sm">
              <Lock size={10} />
              ${resource.price}
            </span>
          </div>
        )}
        {resource.is_free && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 backdrop-blur-sm">
              Free
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#F4B400] transition-colors duration-200">
          {resource.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
          {resource.description}
        </p>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
          <SocialShare url={shareUrl} title={resource.title} description={resource.description} />
          <Link
            to={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F4B400] hover:text-[#d99f00] transition-colors duration-200 group/link"
          >
            Open
            <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}
