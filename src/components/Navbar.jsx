import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Book, User as UserIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-20 border-b border-border bg-sidebar/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-8 h-full flex items-center justify-between max-w-6xl">
        <Link to="/" className="flex items-center gap-3 font-serif italic text-2xl text-text group tracking-tight">
          <div className="p-2 bg-surface rounded-lg border border-border group-hover:border-gold/50 transition-colors">
            <Book className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
          </div>
          <span>Lumina</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

          {user ? (
            <>
              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-border">
                  <span className="text-gold text-xs font-bold leading-none">{user.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <span className="hidden sm:inline font-medium text-text tracking-wide">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-muted hover:text-text hover:bg-surface rounded-full transition-all border border-transparent hover:border-border"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex gap-10 items-center">
              <Link to="/login" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted hover:text-text transition-colors">Login</Link>
              <Link to="/signup" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold hover:brightness-125 transition-all border-b border-gold/30 pb-0.5">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
