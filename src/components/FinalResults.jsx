import React, { useEffect } from 'react';

const FinalResults = ({ session, history = [], onRestart, onSaveResult, onLevelAction }) => {
  const topTrait = session?.topTrait || 'creative';
  const currentLevel = session?.level ?? 0;
  
  const TRAIT_MAP = {
    creative: { label: 'Creative Explorer', icon: '🎨', strengths: ['Visual Design', 'Ideation', 'Abstraction'], careers: ['UI/UX Designer', 'Art Director', 'Content Creator'] },
    analytical: { label: 'Systems Architect', icon: '🔩', strengths: ['Logic', 'Problem Deconstruction', 'Efficiency'], careers: ['Software Engineer', 'Data Scientist', 'Operations Manager'] },
    social: { label: 'Empathetic Connector', icon: '🤝', strengths: ['Communication', 'Emotional Intelligence', 'Mediation'], careers: ['Psychologist', 'HR Specialist', 'Community Manager'] },
    business: { label: 'Growth Strategist', icon: '📈', strengths: ['Marketing', 'Financial Modeling', 'Opportunity Mapping'], careers: ['Product Manager', 'Entrepreneur', 'Sales Lead'] },
    physical: { label: 'Action Craftsman', icon: '🏃', strengths: ['Physical Precision', 'Material Knowledge', 'Execution'], careers: ['Industrial Designer', 'Athlete', 'Skilled Technician'] },
    leadership: { label: 'Visionary Lead', icon: '👑', strengths: ['Vision', 'Team Building', 'Strategic Planning'], careers: ['Manager', 'Director', 'Team Lead'] },
  };

  const data = TRAIT_MAP[topTrait] || TRAIT_MAP.creative;

  useEffect(() => {
    if (onSaveResult) {
      onSaveResult({ strengths: data.strengths, careers: data.careers, topTrait });
    }
  }, []);

  // Determine if level 2 is now complete (just finished it)
  const justCompletedLevel2 = currentLevel === 2;
  const allPreviousLevelsComplete = (history || []).some(h => h.level === 1);
  
  // Confidence score based on session
  const scores = session?.scores || {};
  const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0);
  const topScore = scores[topTrait] || 0;
  const confidence = totalAnswers > 0 ? Math.round((topScore / totalAnswers) * 100) : 75;

  const LEVEL_NAMES = ['Discovery', 'Validation', 'Mastery'];
  const NEXT_LEVEL_LABELS = ['', 'Unlock Level 1', 'Unlock Level 2'];

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1rem', display: 'inline-block' }}>
          Level {currentLevel} — {LEVEL_NAMES[currentLevel] || 'Discovery'} Complete
        </span>
        <div style={{ fontSize: '3rem', margin: '0.75rem 0' }}>{data.icon}</div>
        <h2 style={{ marginBottom: '0.25rem' }}>You are a {data.label}</h2>
        <p style={{ opacity: 0.6 }}>Based on your instincts and task verification.</p>
      </div>

      {/* Confidence Score */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'rgba(0,242,254,0.04)', border: '1px solid rgba(0,242,254,0.15)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '1px', marginBottom: '0.5rem' }}>TRAIT CONFIDENCE SCORE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)' }}>{confidence}%</div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase' }}>{topTrait}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>dominant trait detected</div>
          </div>
        </div>
        <div style={{ marginTop: '0.75rem', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${confidence}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--primary))', borderRadius: '10px', transition: 'width 1s ease' }} />
        </div>
      </div>

      {/* Strengths + Careers Grid */}
      <div className="option-grid" style={{ gap: '1.25rem', marginBottom: '1.5rem', marginTop: 0 }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Identified Strengths
          </h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {data.strengths.map((s, i) => <li key={i} style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{s}</li>)}
          </ul>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🚀 Career Paths
          </h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {data.careers.map((c, i) => <li key={i} style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{c}</li>)}
          </ul>
        </div>
      </div>

      {/* Level-specific unlock box */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: `1px solid ${justCompletedLevel2 ? 'rgba(138,43,226,0.4)' : 'var(--accent)'}`, background: justCompletedLevel2 ? 'rgba(138,43,226,0.06)' : 'rgba(0,242,254,0.04)' }}>
        {justCompletedLevel2 ? (
          <>
            <h3 style={{ marginBottom: '0.5rem' }}>🏆 All Levels Mastered!</h3>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              You've completed the full discovery journey. Your Final Passion Report is ready.
            </p>
          </>
        ) : currentLevel < 2 ? (
          <>
            <h3 style={{ marginBottom: '0.5rem' }}>🔓 Level {currentLevel + 1} Unlocked!</h3>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {currentLevel === 0
                ? 'Level 1 Validation Phase is now available. Dive deeper into your trait profile.'
                : 'Level 2 Mastery Phase is now available. Begin your final confirmation.'}
            </p>
          </>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {justCompletedLevel2 ? (
          // Level 2 done: show retry + final report
          <>
            <button
              className="btn btn-primary btn-large"
              onClick={() => onLevelAction ? onLevelAction('next') : onRestart()}
              style={{ flex: 1, minWidth: '200px' }}
            >
              🏆 View Final Passion Report
            </button>
            <button
              className="btn btn-outline btn-large"
              onClick={() => onLevelAction ? onLevelAction('loop') : onRestart()}
              style={{ flex: 1, minWidth: '200px' }}
            >
              🔄 Retry Level 2
            </button>
          </>
        ) : (
          // Level 0 or 1 done: advance or loop
          <>
            <button
              className="btn btn-primary btn-large"
              onClick={() => onLevelAction ? onLevelAction('next') : onRestart()}
              style={{ flex: 1, minWidth: '200px' }}
            >
              {NEXT_LEVEL_LABELS[currentLevel + 1] || `Advance to Level ${currentLevel + 1}`} →
            </button>
            <button
              className="btn btn-outline btn-large"
              onClick={() => onLevelAction ? onLevelAction('loop') : onRestart()}
              style={{ flex: 1, minWidth: '200px' }}
            >
              🔄 Retry Level {currentLevel}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FinalResults;
