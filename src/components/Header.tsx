import { useState, useEffect, useRef } from 'react';
import { Menu, X, Settings, ChevronDown, Briefcase, Images, BookOpen, Library, Music, Download, Star, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const creativeItems = [
  {
    category: 'Portfolio',
    items: [
      { label: 'Featured Projects', description: 'Curated highlights', icon: Star, action: 'scroll:portfolio' },
      { label: 'Full Gallery', description: 'Browse all work', icon: Images, action: 'navigate:/projects' },
    ],
  },
  {
    category: 'Books',
    items: [
      { label: 'Featured Books', description: 'Top picks', icon: BookOpen, action: 'scroll:books' },
      { label: 'All Books', description: 'Complete library', icon: Library, action: 'navigate:/books' },
    ],
  },
  {
    category: 'Music',
    items: [
      { label: 'Browse Music', description: 'Listen & explore', icon: Music, action: 'navigate:/music' },
    ],
  },
  {
    category: 'Resources',
    items: [
      { label: 'Free Downloads', description: 'Guides & tools', icon: Download, action: 'navigate:/resources' },
    ],
  },
];

const adminItems = [
  { label: 'Manage Books', path: '/admin/books' },
  { label: 'Manage Testimonials', path: '/admin/testimonials' },
  { label: 'Manage Projects', path: '/admin/projects' },
  { label: 'Manage Resources', path: '/admin/resources' },
  { label: 'Manage Music', path: '/admin/music' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCreativeOpen, setIsCreativeOpen] = useState(false);
  const [isMobileCreativeOpen, setIsMobileCreativeOpen] = useState(false);
  const [isMobileAdminOpen, setIsMobileAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    function handleClickOutside(event: MouseEvent) {
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setIsAdminOpen(false);
      }
      if (creativeRef.current && !creativeRef.current.contains(event.target as Node)) {
        setIsCreativeOpen(false);
      }
    }

    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
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

  function handleCreativeAction(action: string) {
    const [type, target] = action.split(':');
    if (type === 'scroll') {
      scrollToSection(target);
    } else {
      navigate(target);
    }
    setIsCreativeOpen(false);
    setIsMenuOpen(false);
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0f0f0f]/98 backdrop-blur-md border-b border-gray-800/80 shadow-lg shadow-black/20' : 'bg-[#0f0f0f]/90 backdrop-blur-sm border-b border-gray-800/40'
    }`}>
      <div className="container mx-auto px-6 sm:px-8 md:px-12 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-2xl sm:text-3xl font-bold group"
          >
            <span className="text-[#F4B400] group-hover:text-[#ffcc40] transition-colors">Nick</span>
            <span className="text-white"> Irmo</span>
          </button>

          <button
            className="md:hidden text-white hover:text-[#F4B400] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            <NavButton onClick={() => { scrollToSection('about'); setIsAdminOpen(false); setIsCreativeOpen(false); }}>
              About
            </NavButton>
            <NavButton onClick={() => { scrollToSection('services'); setIsAdminOpen(false); setIsCreativeOpen(false); }}>
              Services
            </NavButton>

            {/* Creative Mega Menu */}
            <div className="relative" ref={creativeRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreativeOpen(!isCreativeOpen);
                  setIsAdminOpen(false);
                }}
                className={`flex items-center gap-1.5 font-medium transition-colors text-base lg:text-lg ${
                  isCreativeOpen ? 'text-[#F4B400]' : 'text-gray-300 hover:text-white'
                }`}
              >
                Creative
                <ChevronDown size={16} className={`transition-transform duration-200 ${isCreativeOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                isCreativeOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <div className="w-[560px] bg-[#141414] border border-gray-800/80 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#F4B400]/30 rounded-full" />

                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {creativeItems.map((group) => (
                        <div key={group.category} className="p-3">
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <div className="w-1 h-3.5 bg-[#F4B400] rounded-full" />
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">{group.category}</h3>
                          </div>
                          <div className="space-y-0.5">
                            {group.items.map((item) => (
                              <button
                                key={item.label}
                                onClick={() => handleCreativeAction(item.action)}
                                className="w-full text-left px-3 py-2.5 rounded-xl group/item hover:bg-white/[0.04] transition-all duration-150"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-[#F4B400]/[0.08] flex items-center justify-center shrink-0 group-hover/item:bg-[#F4B400]/[0.15] transition-colors">
                                    <item.icon size={17} className="text-[#F4B400]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white group-hover/item:text-[#F4B400] transition-colors">{item.label}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                  </div>
                                  <ArrowRight size={14} className="text-gray-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-150" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-800/60 px-5 py-3 bg-[#111111]">
                    <button
                      onClick={() => { navigate('/resume'); setIsCreativeOpen(false); }}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#F4B400] transition-colors group/resume"
                    >
                      <Briefcase size={13} />
                      <span>View Resume</span>
                      <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover/resume:opacity-100 group-hover/resume:translate-x-0 transition-all duration-150" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <NavButton onClick={() => { navigate('/testimonials'); setIsAdminOpen(false); setIsCreativeOpen(false); }}>
              Testimonials
            </NavButton>
            <NavButton onClick={() => { scrollToSection('contact'); setIsAdminOpen(false); setIsCreativeOpen(false); }}>
              Contact
            </NavButton>

            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAdminOpen(!isAdminOpen);
                    setIsCreativeOpen(false);
                  }}
                  className={`flex items-center gap-1.5 font-medium transition-colors text-base lg:text-lg ${
                    isAdminOpen ? 'text-[#F4B400]' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Settings size={17} />
                  Admin
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full right-0 pt-3 transition-all duration-200 ${
                  isAdminOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="w-52 bg-[#141414] border border-gray-800/80 rounded-xl shadow-2xl shadow-black/40 overflow-hidden p-1.5">
                    {adminItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsAdminOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all duration-150 flex items-center justify-between group/admin"
                      >
                        {item.label}
                        <ChevronRight size={14} className="text-gray-600 opacity-0 group-hover/admin:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-[80vh] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}>
          <nav className="flex flex-col gap-1 pb-4">
            <MobileNavButton onClick={() => scrollToSection('about')}>About</MobileNavButton>
            <MobileNavButton onClick={() => scrollToSection('services')}>Services</MobileNavButton>

            <button
              onClick={() => setIsMobileCreativeOpen(!isMobileCreativeOpen)}
              className="text-left px-3 py-2.5 text-lg font-medium text-white hover:text-[#F4B400] rounded-lg hover:bg-white/[0.03] transition-colors active:bg-white/[0.06] flex items-center justify-between"
            >
              Creative
              <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isMobileCreativeOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isMobileCreativeOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pl-3 pr-1 pb-2 space-y-0.5">
                {creativeItems.flatMap((group) => group.items).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleCreativeAction(item.action)}
                    className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/[0.03] transition-colors active:bg-white/[0.06]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F4B400]/[0.08] flex items-center justify-center shrink-0">
                      <item.icon size={15} className="text-[#F4B400]" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => { navigate('/resume'); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/[0.03] transition-colors active:bg-white/[0.06]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F4B400]/[0.08] flex items-center justify-center shrink-0">
                    <Briefcase size={15} className="text-[#F4B400]" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Resume</span>
                </button>
              </div>
            </div>

            <MobileNavButton onClick={() => { navigate('/testimonials'); setIsMenuOpen(false); }}>Testimonials</MobileNavButton>
            <MobileNavButton onClick={() => scrollToSection('contact')}>Contact</MobileNavButton>

            {isAdmin && (
              <div className="mt-3 pt-3 border-t border-gray-800/60">
                <button
                  onClick={() => setIsMobileAdminOpen(!isMobileAdminOpen)}
                  className="w-full text-left px-3 py-2.5 flex items-center justify-between rounded-lg hover:bg-white/[0.03] transition-colors active:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-gray-500" />
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Admin</span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isMobileAdminOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isMobileAdminOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 space-y-0.5 pt-1">
                    {adminItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.03] transition-colors active:bg-white/[0.06]"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-300 hover:text-white font-medium transition-colors text-base lg:text-lg relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#F4B400] after:transition-all after:duration-200 hover:after:w-full"
    >
      {children}
    </button>
  );
}

function MobileNavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-left px-3 py-2.5 text-lg font-medium text-white hover:text-[#F4B400] rounded-lg hover:bg-white/[0.03] transition-colors active:bg-white/[0.06]"
    >
      {children}
    </button>
  );
}
