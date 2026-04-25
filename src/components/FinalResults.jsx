import React, { useEffect } from 'react';

const FinalResults = ({ onRestart, onSaveResult }) => {
  const resultData = {
    strengths: ['Visual Communication', 'Systematic Thinking'],
    careers: ['UI/UX Designer', 'Product Manager', 'Front-end Developer']
  };

  useEffect(() => {
    if (onSaveResult) {
      onSaveResult(resultData);
    }
  }, []);

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '700px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1rem', display: 'inline-block' }}>
          Discovery Complete
        </span>
        <h2 style={{ fontSize: '2.2rem' }}>Your Discovery Profile</h2>
        <p>You've stepped out of your head and into action. Here's what we found:</p>
      </div>

      <div className="option-grid" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Top Strengths
          </h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--text-main)' }}>
            {resultData.strengths.map((s, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{s}</li>)}
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🚀 Careers
          </h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--text-main)' }}>
            {resultData.careers.map((c, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{c}</li>)}
          </ul>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>🎯 Next Steps to Improve</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Build a small portfolio of 3 quick design projects</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Read up on basic user psychology and design principles</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Try coding a simple functional prototype in React</p>
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-large" onClick={onRestart} style={{ width: '100%' }}>
        Restart Discovery Journey
      </button>
    </div>
  );
};

export default FinalResults;
