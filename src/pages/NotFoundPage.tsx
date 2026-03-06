import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-8 inline-block">
          <span className="text-[160px] font-black text-[#1a1a1a] leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl px-6 py-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#F4B400]" />
              <span className="text-white font-semibold text-sm">Page not found</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Looks like you're lost
        </h1>
        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F4B400] hover:bg-[#e0a500] text-black font-bold rounded-xl transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
