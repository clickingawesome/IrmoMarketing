import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-[#F4B400]/10 rounded-full flex items-center justify-center">
            <CheckCircle className="text-[#F4B400]" size={48} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Thank You!
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl mb-8">
          Your message has been received. I'll get back to you shortly.
        </p>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm mb-6">
            You'll be redirected to the homepage in a few seconds.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#F4B400] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#e5a800] transition-colors text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
