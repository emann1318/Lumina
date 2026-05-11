import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, dbStatus } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Connection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-12 px-4"
    >
      <div className="bg-sidebar p-10 rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-surface rounded-xl border border-border">
            <LogIn className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-serif italic text-text tracking-tight">Welcome Back</h1>
            <p className="text-muted text-xs uppercase tracking-widest font-bold">Sign in to Lumina</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-gold transition-all bg-bg text-text"
              placeholder="you@lumina.io"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-gold transition-all bg-bg text-text"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gold text-black rounded-sm font-bold uppercase text-xs tracking-widest shadow-lg shadow-gold/10 hover:brightness-110 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <button 
            onClick={() => { setEmail('demo@example.com'); setPassword('demo123'); }}
            className="w-full py-3 bg-surface border border-border text-muted rounded-xl text-[10px] uppercase tracking-widest font-bold hover:text-text hover:border-gold transition-all"
          >
            Use Demo Account
          </button>
        </div>

        <p className="mt-10 text-center text-[10px] uppercase tracking-widest font-bold text-muted">
          New to Lumina? {' '}
          <Link to="/signup" className="text-gold hover:underline">Create Account</Link>
        </p>
      </div>
    </motion.div>
  );
}
