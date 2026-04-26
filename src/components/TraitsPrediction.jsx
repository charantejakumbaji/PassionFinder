import React from 'react';

const TraitsPrediction = ({ session, onNext }) => {
  const topTrait = session?.topTrait || 'creative';
  const scores = session?.scores || {};
  
  const TRAIT_INFO = {
    creative:   { icon: '🎨', label: 'Creative Thinking',  desc: 'Problem solving through visual and artistic intuition.', color: '#ff007f' },
    analytical: { icon: '🔩', label: 'Logic & Systems',    desc: 'Finding order and efficiency in complex structures.',    color: '#00f2fe' },
    social:     { icon: '🤝', label: 'Social & Emotional', desc: 'Understanding people and building meaningful connections.', color: '#8a2be2' },
    business:   { icon: '📈', label: 'Strategic Growth',   desc: 'Identifying opportunities and scaling impact.',           color: '#ffd700' },
    physical:   { icon: '🏃', label: 'Action & Physical',  desc: 'Engaging with the world through movement and craft.',    color: '#ff4500' },
    leadership: { icon: '👑', label: 'Visionary Lead',     desc: 'Guiding others towards a shared and purposeful goal.',   color: '#32cd32' },
  };

  const trait = TRAIT_INFO[topTrait] || TRAIT_INFO.creative;

  // Build score bars — only show traits that have at least 1 point
  const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const sortedTraits = Object.entries(TRAIT_INFO)
    .map(([key, info]) => ({ key, info, score: scores[key] || 0 }))
    .sort((a, b) => b.score - a.score)
    .filter(t => t.score > 0);

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button 
          className="btn btn-outline" 
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => onNext('back')}
        >
          ← Back
        </button>
      </div>

      {/* Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '0.75rem', display: 'inline-block' }}>
          Step 2 of 3: Instinct Insight
        </span>
        <h2 style={{ marginBottom: '0.5rem' }}>Your Discovery Profile</h2>
        <p style={{ margin: 0 }}>Based on your responses, your dominant mode of operation has been identified.</p>
      </div>
      
      {/* Primary Trait Card */}
      <div className="glass-card" style={{ padding: '2rem', border: `2px solid ${trait.color}`, background: `rgba(${trait.color === '#ff007f' ? '255,0,127' : trait.color === '#00f2fe' ? '0,242,254' : '138,43,226'},0.06)`, marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{trait.icon}</div>
        <h2 style={{ margin: 0, color: trait.color }}>{trait.label}</h2>
        <div className="badge" style={{ background: `${trait.color}22`, color: trait.color, border: `1px solid ${trait.color}44`, marginTop: '0.75rem' }}>
          PRIMARY TRAIT — {Math.round(((scores[topTrait] || 0) / totalAnswers) * 100)}% MATCH
        </div>
        <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.8 }}>{trait.desc}</p>
      </div>

      {/* Score Breakdown */}
      {sortedTraits.length > 1 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Full Trait Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedTraits.map(({ key, info, score }) => {
              const pct = Math.round((score / totalAnswers) * 100);
              const isTop = key === topTrait;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: isTop ? '700' : '400', color: isTop ? info.color : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {info.icon} {info.label} {isTop && <span className="badge" style={{ background: info.color, color: '#000', fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>TOP</span>}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: isTop ? info.color : 'var(--text-muted)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: info.color, borderRadius: '10px', transition: 'width 0.8s ease', opacity: isTop ? 1 : 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontStyle: 'italic', opacity: 0.7, fontSize: '0.95rem' }}>
        "This is just the surface. To truly know, we must act." 
      </p>

      <button className="btn btn-primary btn-large" style={{ width: '100%' }} onClick={onNext}>
        Proceed to Action Test →
      </button>
    </div>
  );
};

export default TraitsPrediction;
