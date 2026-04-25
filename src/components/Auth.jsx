import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;
        onLogin(data.user);
      } else {
        if (!formData.name) throw new Error('Name is required');
        
        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });

        if (authError) throw authError;
        
        // Supabase sends a verification email by default. 
        // If auto-confirm is on, we'll have a session immediately.
        if (data.user && data.session) {
          onLogin(data.user);
        } else {
          setError('Success! Please check your email for a verification link.');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {!isLogin && (
          <div>
            <label style={styles.label}>Full Name</label>
            <input 
              className="auth-input"
              style={{ width: '100%' }}
              type="text" 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={loading}
            />
          </div>
        )}
        
        <div>
          <label style={styles.label}>Email Address</label>
          <input 
            className="auth-input"
            style={{ width: '100%' }}
            type="email" 
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            disabled={loading}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <label style={styles.label}>Password</label>
          <input 
            className="auth-input"
            style={{ width: '100%' }}
            type={showPassword ? 'text' : 'password'} 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={loading}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              bottom: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {error && <p style={{ color: error.includes('Success') ? '#4caf50' : '#ff4b4b', fontSize: '0.9rem' }}>{error}</p>}

        <button 
          className="btn btn-primary btn-large" 
          style={{ marginTop: '1rem' }} 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Get Started')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  }
};

export default Auth;
