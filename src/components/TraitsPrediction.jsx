import React from 'react';

const TraitsPrediction = ({ onNext }) => {
  return (
    <div className="glass-card animate-up" style={{ textAlign: 'center' }}>
      <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1.5rem', display: 'inline-block' }}>
        Step 2: Insight
      </span>
      <h2 style={{ marginBottom: '1rem' }}>Your Discovery Profile</h2>
      <p style={{ marginBottom: '2.5rem' }}>Based on your quick instincts, we've identified your primary modes of operation.</p>
      
      <div className="option-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--primary)', background: 'rgba(138, 43, 226, 0.05)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
          <h3 style={{ margin: 0 }}>Creative Thinking</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Problem solving through visual and artistic intuition.</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--accent)', background: 'rgba(0, 242, 254, 0.05)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔩</div>
          <h3 style={{ margin: 0 }}>Logic & Systems</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Finding order and efficiency in complex structures.</p>
        </div>
      </div>

      <p style={{ marginTop: '1rem', marginBottom: '2rem', fontStyle: 'italic' }}>
        "Action is the foundational key to all success." 
      </p>

      <button className="btn btn-primary btn-large" style={{ width: '100%' }} onClick={onNext}>
        See Final Analysis →
      </button>
    </div>
  );
};

export default TraitsPrediction;
