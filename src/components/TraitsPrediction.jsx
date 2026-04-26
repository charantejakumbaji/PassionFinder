import React from 'react';

const TraitsPrediction = ({ session, onNext }) => {
  const topTrait = session?.topTrait || 'creative';
  
  const TRAIT_INFO = {
    creative: { icon: '🎨', label: 'Creative Thinking', desc: 'Problem solving through visual and artistic intuition.' },
    analytical: { icon: '🔩', label: 'Logic & Systems', desc: 'Finding order and efficiency in complex structures.' },
    social: { icon: '🤝', label: 'Social & Emotional', desc: 'Understanding people and building meaningful connections.' },
    business: { icon: '📈', label: 'Strategic Growth', desc: 'Identifying opportunities and scaling impact.' },
    physical: { icon: '🏃', label: 'Action & Physical', desc: 'Engaging with the world through movement and craft.' },
    leadership: { icon: '👑', label: 'Visionary Lead', desc: 'Guiding others towards a shared and purposeful goal.' }
  };

  const trait = TRAIT_INFO[topTrait] || TRAIT_INFO.creative;

  return (
    <div className="glass-card animate-up" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button 
          className="btn btn-outline" 
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => onNext('back')}
        >
          ← Back
        </button>
      </div>
      <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1.5rem', display: 'inline-block' }}>
        Step 2: Instinct Insight
      </span>
      <h2 style={{ marginBottom: '1rem' }}>Your Discovery Profile</h2>
      <p style={{ marginBottom: '2.5rem' }}>Based on your responses, we've identified your primary mode of operation.</p>
      
      <div className="glass-card" style={{ padding: '2rem', border: '2px solid var(--accent)', background: 'rgba(0, 242, 254, 0.05)', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{trait.icon}</div>
        <h2 style={{ margin: 0, color: 'var(--accent)' }}>{trait.label}</h2>
        <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.8 }}>{trait.desc}</p>
      </div>

      <p style={{ marginTop: '1rem', marginBottom: '2rem', fontStyle: 'italic', opacity: 0.7 }}>
        "This is just the surface. To truly know, we must act." 
      </p>

      <button className="btn btn-primary btn-large" style={{ width: '100%' }} onClick={onNext}>
        Proceed to Action Test →
      </button>
    </div>
  );
};

export default TraitsPrediction;
