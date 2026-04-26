import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Resend Email Logic
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Sign in anonymously if enabled, or use a demo account
      // For now, let's use a simple demo logic or just inform the user
      // Actually, Supabase has signInAnonymously()
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      onLogin(data.user);
    } catch (err) {
      setError("Guest login failed. Please use email or Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      if (error) {
        if (error.message.includes('rate limit')) {
          setError('Rate limit hit. Please wait 1 minute before trying again.');
          setResendCooldown(60);
        } else {
          throw error;
        }
      } else {
        setError('Verification email resent!');
        setResendCooldown(60);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        if (authError) {
          if (authError.message.includes('rate limit')) {
            setError('Too many requests. Please wait or use Google Login.');
          } else {
            throw authError;
          }
        } else {
          if (data.user && data.session) {
            onLogin(data.user);
          } else {
            setError('Success! Please check your email for a verification link.');
            setResendCooldown(60);
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-up w-100-mobile" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-outline" style={styles.socialBtn} onClick={handleGoogleLogin} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
          Continue with Google
        </button>
        <button className="btn btn-outline" style={{ ...styles.socialBtn, border: 'none', background: 'rgba(255,255,255,0.03)' }} onClick={handleGuestLogin} disabled={loading}>
          👤 Try as Guest (Instant Access)
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ margin: '0 1rem', opacity: 0.5, fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or continue with email</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      </div>

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
              required
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
            required
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
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.togglePassword}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: error.includes('Success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 75, 75, 0.1)', border: `1px solid ${error.includes('Success') ? '#4caf50' : '#ff4b4b'}` }}>
             <p style={{ color: error.includes('Success') ? '#81c784' : '#ff7b7b', fontSize: '0.85rem', margin: 0 }}>
               {error}
             </p>
             {!isLogin && error.includes('check your email') && (
               <button 
                type="button"
                onClick={handleResendEmail}
                style={styles.resendBtn}
                disabled={resendCooldown > 0}
               >
                 {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
               </button>
             )}
          </div>
        )}

        <button 
          className="btn btn-primary btn-large" 
          style={{ marginTop: '1rem' }} 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
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
  },
  socialBtn: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: '500',
    gap: '0.75rem'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '1.5rem 0',
    color: 'var(--text-muted)',
    fontSize: '0.8rem'
  },
  dividerText: {
    margin: '0 1rem',
    opacity: 0.5
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    bottom: '12px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    padding: 0,
    textDecoration: 'underline'
  }
};

export default Auth;
