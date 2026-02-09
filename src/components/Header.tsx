import { useState, useEffect, useRef } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setIsAdminOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-2xl sm:text-3xl font-bold"
          >
            <span className="text-[#F4B400]">Nick</span> Irmo
          </button>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('books')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Books
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/resources')}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Resources
            </button>
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="flex items-center gap-2 text-white hover:text-[#F4B400] transition-colors text-xl"
              >
                <Settings size={20} />
                Admin
              </button>
              {isAdminOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <button
                    onClick={() => {
                      navigate('/admin/books');
                      setIsAdminOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#F4B400] hover:text-black transition-colors"
                  >
                    Manage Books
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/testimonials');
                      setIsAdminOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#F4B400] hover:text-black transition-colors"
                  >
                    Manage Testimonials
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/projects');
                      setIsAdminOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#F4B400] hover:text-black transition-colors"
                  >
                    Manage Projects
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/resources');
                      setIsAdminOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#F4B400] hover:text-black transition-colors"
                  >
                    Manage Resources
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 sm:mt-6 flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('books')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Books
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Contact
            </button>
            <button
              onClick={() => {
                navigate('/resources');
                setIsMenuOpen(false);
              }}
              className="text-white hover:text-[#F4B400] transition-colors text-left text-lg sm:text-xl"
            >
              Resources
            </button>
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Settings size={20} />
                <span className="text-xl font-semibold">Admin</span>
              </div>
              <button
                onClick={() => {
                  navigate('/admin/books');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#F4B400] transition-colors text-left text-xl mb-3 pl-4 block"
              >
                Manage Books
              </button>
              <button
                onClick={() => {
                  navigate('/admin/testimonials');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#F4B400] transition-colors text-left text-xl mb-3 pl-4 block"
              >
                Manage Testimonials
              </button>
              <button
                onClick={() => {
                  navigate('/admin/projects');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#F4B400] transition-colors text-left text-xl mb-3 pl-4 block"
              >
                Manage Projects
              </button>
              <button
                onClick={() => {
                  navigate('/admin/resources');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#F4B400] transition-colors text-left text-xl pl-4 block"
              >
                Manage Resources
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
