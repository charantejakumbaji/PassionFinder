import React, { useState } from 'react';

const Navbar = ({ currentScreen, onNavigate, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (screen) => {
    onNavigate(screen);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar" style={styles.nav}>
      <div style={styles.logo} onClick={() => handleNav('dashboard')}>
        Passion Finder
      </div>

      {/* Hamburger Menu Toggle (Mobile Only) */}
      <div className="show-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuToggle}>
        {isMenuOpen ? '✕' : '☰'}
      </div>

      <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`} style={styles.links}>
        {user ? (
          <>
            <button 
              className={`btn ${currentScreen === 'dashboard' ? 'btn-primary' : 'btn-outline'} w-100-mobile`}
              style={styles.navBtn}
              onClick={() => handleNav('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`btn ${currentScreen === 'profile' ? 'btn-primary' : 'btn-outline'} w-100-mobile`}
              style={styles.navBtn}
              onClick={() => handleNav('profile')}
            >
              Profile
            </button>
            {user.is_admin && (
              <button 
                className={`btn ${currentScreen === 'admin' ? 'btn-primary' : 'btn-outline'} w-100-mobile`}
                style={styles.navBtn}
                onClick={() => handleNav('admin')}
              >
                Admin
              </button>
            )}
            <div style={styles.userProfile} className="flex-column-mobile w-100-mobile">
              <span style={styles.userName} className="hidden-mobile">
                {(user.user_metadata?.full_name || user.name || 'User').split(' ')[0]}
              </span>
              <button 
                className="btn btn-outline w-100-mobile"
                style={{ ...styles.navBtn, borderColor: '#ff4b4b', color: '#ff4b4b' }}
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Discovery System</span>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(7, 5, 26, 0.85)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #00f2fe, #8a2be2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
    zIndex: 1001,
  },
  menuToggle: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'white',
    zIndex: 1001,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
  },
  navBtn: {
    padding: '0.6rem 1.25rem',
    fontSize: '0.9rem',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '0.5rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(255,255,255,0.1)'
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)'
  }
};

export default Navbar;
