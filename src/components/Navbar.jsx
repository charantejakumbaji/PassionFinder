import React from 'react';

const Navbar = ({ currentScreen, onNavigate, user, onLogout }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => onNavigate('dashboard')}>
        Passion Finder
      </div>
      <div style={styles.links}>
        {user ? (
          <>
            <button 
              className={`btn ${currentScreen === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
              style={styles.navBtn}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`btn ${currentScreen === 'profile' ? 'btn-primary' : 'btn-outline'}`}
              style={styles.navBtn}
              onClick={() => onNavigate('profile')}
            >
              Profile
            </button>
            {user.is_admin && (
              <button 
                className={`btn ${currentScreen === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                style={styles.navBtn}
                onClick={() => onNavigate('admin')}
              >
                Admin
              </button>
            )}
            <div style={styles.userProfile}>
              <span style={styles.userName}>
                {(user.user_metadata?.full_name || user.name || 'User').split(' ')[0]}
              </span>
              <button 
                className="btn btn-outline"
                style={{ ...styles.navBtn, borderColor: '#ff4b4b', color: '#ff4b4b' }}
                onClick={onLogout}
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
    background: 'rgba(7, 5, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #00f2fe, #8a2be2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.9rem',
    borderRadius: '12px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '1rem',
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
