import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      
      if (data?.session) {
        navigate('/dashboard');
      } else {
        setMessage('Registration successful! Please check your email to verify your account.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-primary-100/70">Join to get instant AI help</p>
        </div>
        
        {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-200 rounded-lg text-sm">{error}</div>}
        {message && <div className="p-3 bg-green-500/10 border border-green-500/50 text-green-200 rounded-lg text-sm">{message}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input 
              type="email" 
              required
              className="glass-input w-full" 
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input 
              type="password" 
              required
              className="glass-input w-full" 
              placeholder="••••••••"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="glass-button w-full mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
