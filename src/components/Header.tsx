import { useState, useEffect, useRef } from 'react';
import { Menu, X, Settings, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCreativeOpen, setIsCreativeOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setIsAdminOpen(false);
      }
      if (creativeRef.current && !creativeRef.current.contains(event.target as Node)) {
        setIsCreativeOpen(false);
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
              onClick={() => {
                scrollToSection('about');
                setIsAdminOpen(false);
                setIsCreativeOpen(false);
              }}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              About
            </button>
            <button
              onClick={() => {
                scrollToSection('services');
                setIsAdminOpen(false);
                setIsCreativeOpen(false);
              }}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Services
            </button>
            <div className="relative" ref={creativeRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreativeOpen(!isCreativeOpen);
                  setIsAdminOpen(false);
                }}
                className="flex items-center gap-2 text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
              >
                Creative
                <ChevronDown size={18} className={`transition-transform ${isCreativeOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCreativeOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-2 gap-6 p-6">
                    <div>
                      <h3 className="text-[#F4B400] font-bold text-sm uppercase tracking-wide mb-3">Portfolio</h3>
                      <button
                        onClick={() => {
                          scrollToSection('portfolio');
                          setIsCreativeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:text-[#F4B400] transition-colors"
                      >
                        Featured Projects
                      </button>
                      <button
                        onClick={() => {
                          navigate('/projects');
                          setIsCreativeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:text-[#F4B400] transition-colors"
                      >
                        Full Gallery
                      </button>
                    </div>
                    <div>
                      <h3 className="text-[#F4B400] font-bold text-sm uppercase tracking-wide mb-3">Books</h3>
                      <button
                        onClick={() => {
                          scrollToSection('books');
                          setIsCreativeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:text-[#F4B400] transition-colors"
                      >
                        Featured Books
                      </button>
                      <button
                        onClick={() => {
                          navigate('/books');
                          setIsCreativeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:text-[#F4B400] transition-colors"
                      >
                        All Books
                      </button>
                    </div>
                    <div>
                      <h3 className="text-[#F4B400] font-bold text-sm uppercase tracking-wide mb-3">Music</h3>
                      <button
                        onClick={() => {
                          navigate('/music');
                          setIsCreativeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:text-[#F4B400] transition-colors"
                      >
                        Browse Music
                      </button>
                    </div>
                    <div>
                      <h3 className="text-[#F4B400] font-bold text-sm uppercase tracking-wide mb-3">Resources</h3>
                      <button
                        onClick={() => {
                          navigate('/resources');
                          setIsCreativeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:text-[#F4B400] transition-colors"
                      >
                        Free Downloads
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                scrollToSection('testimonials');
                setIsAdminOpen(false);
                setIsCreativeOpen(false);
              }}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Testimonials
            </button>
            <button
              onClick={() => {
                scrollToSection('contact');
                setIsAdminOpen(false);
                setIsCreativeOpen(false);
              }}
              className="text-white hover:text-[#F4B400] transition-colors text-lg lg:text-xl"
            >
              Contact
            </button>
            <div className="relative" ref={adminRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdminOpen(!isAdminOpen);
                }}
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
                  <button
                    onClick={() => {
                      navigate('/admin/music');
                      setIsAdminOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#F4B400] hover:text-black transition-colors"
                  >
                    Manage Music
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 sm:mt-6 flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6">
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

            <div className="border-t border-gray-800 pt-4">
              <div className="flex items-center gap-2 text-[#F4B400] mb-3">
                <span className="text-xl font-semibold">Creative</span>
              </div>
              <div className="pl-4 space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Portfolio</p>
                  <button
                    onClick={() => {
                      scrollToSection('portfolio');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-[#F4B400] transition-colors text-left text-base block mb-2"
                  >
                    Featured Projects
                  </button>
                  <button
                    onClick={() => {
                      navigate('/projects');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-[#F4B400] transition-colors text-left text-base block"
                  >
                    Full Gallery
                  </button>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Books</p>
                  <button
                    onClick={() => {
                      scrollToSection('books');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-[#F4B400] transition-colors text-left text-base block mb-2"
                  >
                    Featured Books
                  </button>
                  <button
                    onClick={() => {
                      navigate('/books');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-[#F4B400] transition-colors text-left text-base block"
                  >
                    All Books
                  </button>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Music</p>
                  <button
                    onClick={() => {
                      navigate('/music');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-[#F4B400] transition-colors text-left text-base block"
                  >
                    Browse Music
                  </button>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Resources</p>
                  <button
                    onClick={() => {
                      navigate('/resources');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-[#F4B400] transition-colors text-left text-base block"
                  >
                    Free Downloads
                  </button>
                </div>
              </div>
            </div>

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
                className="text-white hover:text-[#F4B400] transition-colors text-left text-xl mb-3 pl-4 block"
              >
                Manage Resources
              </button>
              <button
                onClick={() => {
                  navigate('/admin/music');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#F4B400] transition-colors text-left text-xl pl-4 block"
              >
                Manage Music
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
