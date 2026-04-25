import React from 'react';

const Landing = ({ onStart }) => {
  return (
    <div className="glass-card animate-up" style={{ textAlign: 'center', maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ 
          background: 'rgba(0, 242, 254, 0.1)', 
          color: 'var(--accent)', 
          padding: '0.5rem 1rem', 
          borderRadius: '50px',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          VERSION 1.0 – DISCOVERY SYSTEM
        </span>
      </div>
      <h1>Passion Finder</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem' }}>
        Identify what you think you like vs. what you actually enjoy doing through action, reflection, and adaptive growth.
      </p>
      
      <div style={{ textAlign: 'left', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Discovery Loop:</h3>
        <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', paddingLeft: '1.2rem' }}>
          <li><strong>Detect:</strong> Quick instinct questions</li>
          <li><strong>Act:</strong> Real-world micro-tasks</li>
          <li><strong>Reflect:</strong> How did it actually feel?</li>
          <li><strong>Understand:</strong> Get personalized direction</li>
        </ul>
      </div>

      <button className="btn btn-primary btn-large" onClick={onStart} style={{ width: '100%' }}>
        Start Discovery Session
      </button>
      <p style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
        Fast flow: 5–7 minutes • Mobile friendly • No login required
      </p>
    </div>
  );
};

export default Landing;
