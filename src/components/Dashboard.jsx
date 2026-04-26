import React from 'react';

const LEVEL_CONFIG = [
  { id: 0, title: 'Discovery Phase', subtitle: 'Core instinct assessment loop', icon: '🔍' },
  { id: 1, title: 'Validation Phase', subtitle: 'Deeper testing of your trait profile', icon: '🧪' },
  { id: 2, title: 'Mastery Phase', subtitle: 'Final confirmation & passion mapping', icon: '🏆' },
];

const getStageFromScreen = (screen) => {
  if (!screen || screen === 'dashboard') return 0;
  if (screen === 'questions' || screen === 'traits') return 1;
  if (screen === 'task-action' || screen === 'task-execution') return 2;
  if (screen === 'feedback') return 3;
  return 0;
};

const StageDots = ({ current, total = 3 }) => (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i < current ? '20px' : '10px',
          height: '10px',
          borderRadius: '5px',
          background: i < current ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
          transition: 'all 0.3s ease',
        }}
      />
    ))}
    <span style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '4px' }}>{current}/3</span>
  </div>
);

const STAGE_LABELS = ['', 'Assessment', 'Action Tasks', 'Reflection'];

const Dashboard = ({ user, history = [], lastResult, progress, onAction }) => {
  const hasCompleted = (lvl) => (history || []).some(h => h.level === lvl);

  // Active level: lowest level not yet completed, max 2
  const activeLevel = !hasCompleted(0) ? 0 : !hasCompleted(1) ? 1 : 2;

  const isUnlocked = (lvl) => {
    if (lvl === 0) return true;
    if (lvl === 1) return hasCompleted(0);
    if (lvl === 2) return hasCompleted(1);
    return false;
  };

  const hasInProgress = progress && progress.screen && progress.screen !== 'dashboard';
  const progressLevel = progress?.level ?? activeLevel;
  const currentStage = hasInProgress && progressLevel === activeLevel ? getStageFromScreen(progress.screen) : 0;

  // Get most recent result for a given level
  const getLatestResult = (lvl) => (history || []).find(h => h.level === lvl);

  const TRAIT_COLORS = {
    creative: '#ff007f', analytical: '#00f2fe', social: '#8a2be2',
    business: '#ffd700', physical: '#ff4500', leadership: '#32cd32'
  };

  const passionTips = [
    "Passion isn't found — it's built through curiosity and action.",
    "Your unique perspective is your greatest asset.",
    "Small consistent steps lead to massive personal breakthroughs.",
  ];

  const allLevelsComplete = hasCompleted(0) && hasCompleted(1) && hasCompleted(2);

  return (
    <div style={{ width: '100%', maxWidth: '1100px', animation: 'fadeInUp 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: '800', marginBottom: '0.5rem', lineHeight: 1.1 }}>
          Welcome back, <span className="text-gradient">{user?.user_metadata?.full_name?.split(' ')[0] || 'Explorer'}</span>
        </h1>
        <p style={{ opacity: 0.6 }}>
          {allLevelsComplete ? '🎉 All levels mastered! View your final passion report.' : 'Your discovery path is expanding.'}
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'CURRENT LEVEL', value: Math.min(activeLevel, 2), color: 'var(--secondary)', icon: '🏆' },
          { label: 'DISCOVERIES', value: (history || []).length, color: 'var(--accent)', icon: '🧭' },
          { label: 'LEVELS DONE', value: [0,1,2].filter(hasCompleted).length + '/3', color: 'var(--primary)', icon: '⭐' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ flex: '1', minWidth: '130px', padding: '1.25rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '1.1rem', opacity: 0.2 }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.2rem' }}>{stat.value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.6, letterSpacing: '1px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Journey Progress Bar */}
      {(() => {
        const levelsComplete = [0,1,2].filter(hasCompleted).length;
        const pct = Math.round((levelsComplete / 3) * 100);
        return (
          <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.5, letterSpacing: '1px', whiteSpace: 'nowrap' }}>JOURNEY PROGRESS</div>
            <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '10px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent)', minWidth: '40px', textAlign: 'right' }}>{pct}%</div>
          </div>
        );
      })()}

      <div className="grid-2-1" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Left: Level Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ marginBottom: '0.25rem', fontSize: '1.4rem' }}>Your Journey</h2>

          {LEVEL_CONFIG.map((lvlCfg) => {
            const unlocked = isUnlocked(lvlCfg.id);
            const completed = hasCompleted(lvlCfg.id);
            const isActive = lvlCfg.id === activeLevel && unlocked;
            const inProgressHere = isActive && hasInProgress && progressLevel === lvlCfg.id;
            const stageProgress = inProgressHere ? getStageFromScreen(progress.screen) : completed ? 3 : 0;
            const result = getLatestResult(lvlCfg.id);
            const traitColor = result?.topTrait ? TRAIT_COLORS[result.topTrait] || 'var(--accent)' : 'var(--accent)';

            let borderColor = 'var(--card-border)';
            let glowStyle = {};
            if (completed) { borderColor = 'rgba(0, 242, 254, 0.3)'; }
            if (isActive && !completed) {
              borderColor = 'var(--primary)';
              glowStyle = { boxShadow: '0 0 30px rgba(138, 43, 226, 0.2)' };
            }

            return (
              <div
                key={lvlCfg.id}
                className="glass-card"
                style={{
                  padding: '1.5rem 2rem',
                  borderColor,
                  opacity: !unlocked ? 0.45 : 1,
                  transition: 'all 0.3s ease',
                  filter: !unlocked ? 'blur(0.5px)' : 'none',
                  ...glowStyle,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle background for active */}
                {isActive && !completed && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(138,43,226,0.04), rgba(0,242,254,0.02))', pointerEvents: 'none' }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }} className="flex-column-mobile">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="w-100-mobile">
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem',
                      background: completed ? 'rgba(0,242,254,0.12)' : isActive ? 'rgba(138,43,226,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${completed ? 'rgba(0,242,254,0.3)' : isActive ? 'rgba(138,43,226,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                      {completed ? '✓' : !unlocked ? '🔒' : lvlCfg.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', opacity: 0.5, letterSpacing: '1px', marginBottom: '2px' }}>LEVEL {lvlCfg.id}</div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{lvlCfg.title}</h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="badge" style={{
                    background: completed ? 'rgba(0,242,254,0.12)' : isActive ? 'rgba(138,43,226,0.15)' : 'rgba(255,255,255,0.05)',
                    color: completed ? 'var(--accent)' : isActive ? 'var(--primary)' : 'var(--text-muted)',
                    border: `1px solid ${completed ? 'rgba(0,242,254,0.3)' : isActive ? 'rgba(138,43,226,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    flexShrink: 0,
                  }}>
                    {completed ? 'COMPLETED' : isActive ? (inProgressHere ? 'IN PROGRESS' : 'ACTIVE') : 'LOCKED'}
                  </span>
                </div>

                <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', opacity: 0.55 }}>{lvlCfg.subtitle}</p>

                {/* Stage Progress */}
                <div style={{ marginBottom: completed && result ? '1rem' : '0' }}>
                  <StageDots current={stageProgress} />
                  {stageProgress > 0 && stageProgress < 3 && (
                    <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>
                      Currently in: {STAGE_LABELS[stageProgress]}
                    </div>
                  )}
                </div>

                {/* Show result trait for completed levels */}
                {completed && result && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: traitColor, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      Result: <strong style={{ color: traitColor }}>{result.topTrait?.toUpperCase()}</strong>
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.4 }}>
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                {unlocked && (
                  <div style={{ marginTop: '1.25rem' }}>
                    {completed ? (
                      <button
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                        onClick={() => onAction('questions', lvlCfg.id)}
                      >
                        🔄 Replay Level {lvlCfg.id}
                      </button>
                    ) : inProgressHere ? (
                      <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} onClick={() => onAction('resume')}>
                        ▶ Continue — {STAGE_LABELS[stageProgress] || 'In Progress'}
                      </button>
                    ) : (
                      <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} onClick={() => onAction('questions')}>
                        Start Level {lvlCfg.id} →
                      </button>
                    )}
                  </div>
                )}

                {!unlocked && (
                  <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔒 Complete Level {lvlCfg.id - 1} to unlock
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Report CTA if all complete */}
          {allLevelsComplete && (
            <div className="glass-card" style={{ padding: '1.5rem 2rem', textAlign: 'center', border: '1px solid rgba(138,43,226,0.4)', background: 'linear-gradient(135deg, rgba(138,43,226,0.08), rgba(0,242,254,0.04))' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <h3 style={{ marginBottom: '0.5rem' }}>All Levels Complete!</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>View your complete Passion Profile & Final Report.</p>
              <button className="btn btn-primary pulse-glow" style={{ width: '100%' }} onClick={() => onAction('final-report')}>
                View Final Passion Report →
              </button>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Daily Insight */}
          <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>💡</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Daily Insight</h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.7', fontStyle: 'italic' }}>
              "{passionTips[activeLevel % passionTips.length]}"
            </p>
          </div>

          {/* What happens next */}
          {!allLevelsComplete && (
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', opacity: 0.7, letterSpacing: '1px' }}>
                NEXT UP — LEVEL {activeLevel}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { step: '1', label: 'Answer assessment questions', done: currentStage > 0 },
                  { step: '2', label: 'Complete a micro-challenge task', done: currentStage > 1 },
                  { step: '3', label: 'Reflect & get your results', done: currentStage > 2 },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', opacity: s.done ? 0.5 : 1 }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: s.done ? 'var(--accent)' : 'rgba(255,255,255,0.08)', border: `1px solid ${s.done ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', flexShrink: 0 }}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <span style={{ textDecoration: s.done ? 'line-through' : 'none' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Nav */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', opacity: 0.6, letterSpacing: '1px' }}>QUICK NAV</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', fontSize: '0.9rem' }} onClick={() => onAction('profile')}>
                👤 My Growth Profile
              </button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', fontSize: '0.9rem' }} onClick={() => onAction('tasks')}>
                🎯 Browse Task Library
              </button>
              {allLevelsComplete && (
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', fontSize: '0.9rem', borderColor: 'rgba(138,43,226,0.4)', color: 'var(--primary)' }} onClick={() => onAction('final-report')}>
                  🏆 Final Passion Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Big CTA if not all complete */}
      {!allLevelsComplete && (
        <div style={{ marginTop: '2rem' }}>
          <button
            className="btn btn-primary btn-large pulse-glow"
            style={{ width: '100%', padding: '1.4rem', fontSize: '1.15rem', borderRadius: '18px' }}
            onClick={() => hasInProgress ? onAction('resume') : onAction('questions')}
          >
            {hasInProgress ? `Continue Level ${progressLevel} Discovery →` : `Start Level ${activeLevel} Journey →`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
