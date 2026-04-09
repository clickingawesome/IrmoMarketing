import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Book, Folder, Home, LayoutGrid, Music, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { path: '/admin/books', label: 'Books', icon: Book },
    { path: '/admin/projects', label: 'Projects', icon: Folder },
    { path: '/admin/resources', label: 'Resources', icon: LayoutGrid },
    { path: '/admin/music', label: 'Music', icon: Music },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="bg-[#1a1a1a] border-b border-gray-800">
      <div className="container mx-auto px-6">
        <nav className="flex gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 ${
                  isActive
                    ? 'text-[#F4B400] border-[#F4B400]'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-4 font-semibold text-gray-400 border-b-2 border-transparent hover:text-red-400 hover:border-red-400 transition-colors ml-auto"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </nav>
      </div>
    </div>
  );
}
