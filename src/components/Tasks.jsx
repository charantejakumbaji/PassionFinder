import React, { useState, useEffect } from 'react';
import { getTasksWithStatus, getAdminTasks, toggleTaskCompletion } from '../utils/storage';

const DEFAULT_TASKS = [
  { id: 'd1', title: 'The 5-Minute Logo', description: 'Sketch a quick logo for a fictional brand based on an object near you.', duration: '10 min', trait: 'creative', level_id: 0 },
  { id: 'd2', title: 'Logic Puzzle Audit', description: 'Break down a complex problem you faced today into 5 logical steps.', duration: '15 min', trait: 'analytical', level_id: 0 },
  { id: 'd3', title: 'The Active Listener', description: 'Call a friend and listen for 5 minutes without talking about yourself.', duration: '10 min', trait: 'social', level_id: 0 },
  { id: 'd4', title: 'The Value Proposition', description: 'Write a 3-sentence pitch on how to make a product you use more profitable.', duration: '10 min', trait: 'business', level_id: 0 },
  { id: 'd5', title: 'Tallest Tower', description: 'Build the tallest possible tower using only 10 sheets of paper.', duration: '15 min', trait: 'physical', level_id: 0 },
  { id: 'd6', title: 'Mission Statement', description: 'Write a clear vision statement for your next 3 months of growth.', duration: '15 min', trait: 'leadership', level_id: 0 }
];

const TRAIT_COLORS = {
  creative: '#ff007f', analytical: '#00f2fe', social: '#8a2be2',
  business: '#ffd700', physical: '#ff4500', leadership: '#32cd32'
};

const LEVEL_LABELS = {
  0: { title: 'Level 0 — Discovery', color: 'var(--accent)', icon: '🔍' },
  1: { title: 'Level 1 — Validation', color: 'var(--primary)', icon: '🧪' },
  2: { title: 'Level 2 — Mastery', color: 'var(--secondary)', icon: '🏆' },
};

// ─── LIBRARY MODE ─────────────────────────────────────────────────────────────
const TaskLibrary = ({ user }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLevel, setOpenLevel] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminTasks();
        setAllTasks(data.length > 0 ? data : DEFAULT_TASKS);
      } catch {
        setAllTasks(DEFAULT_TASKS);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="glass-card animate-up" style={{ textAlign: 'center', padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
      <p>Loading Task Library...</p>
    </div>
  );

  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '0.75rem', display: 'inline-block' }}>Task Library</span>
        <h2 style={{ margin: 0 }}>All Micro-Challenges</h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Browse all tasks by level. Complete your levels to access higher challenges.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[0, 1, 2].map(lvl => {
          const cfg = LEVEL_LABELS[lvl];
          const lvlTasks = allTasks.filter(t => t.level_id === lvl);
          const isOpen = openLevel === lvl;

          return (
            <div key={lvl} className="glass-card" style={{ padding: 0, overflow: 'hidden', border: isOpen ? `1px solid ${cfg.color}44` : undefined }}>
              {/* Level Header — clickable to expand */}
              <div
                onClick={() => setOpenLevel(isOpen ? null : lvl)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${cfg.color}18`, border: `1px solid ${cfg.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{cfg.title}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{lvlTasks.length} challenge{lvlTasks.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <span style={{ fontSize: '1.2rem', opacity: 0.5, transition: 'transform 0.3s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
              </div>

              {/* Expanded task list */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${cfg.color}22`, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {lvlTasks.length === 0 && (
                    <p style={{ opacity: 0.5, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No tasks added for this level yet. Admin can add them in the Admin Dashboard.</p>
                  )}
                  {lvlTasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                          {task.trait && <span className="badge" style={{ background: `${TRAIT_COLORS[task.trait]}22`, color: TRAIT_COLORS[task.trait], border: `1px solid ${TRAIT_COLORS[task.trait]}44`, fontSize: '0.7rem' }}>{task.trait}</span>}
                          <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>⏱ {task.duration}</span>
                        </div>
                        <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>{task.title}</div>
                        {task.description && <div style={{ fontSize: '0.83rem', opacity: 0.55, lineHeight: 1.5 }}>{task.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Level 3 — Locked */}
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', opacity: 0.4, border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🔒
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>Level 3 — Coming Soon</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Complete all 3 levels to unlock advanced challenges</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── JOURNEY MODE (used during actual level flow) ─────────────────────────────
const Tasks = ({ user, autoTrait, autoLevel, onSelectTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // If no onSelectTask, render the library browser instead
  if (!onSelectTask && !loading && tasks.length === 0) {
    return <TaskLibrary user={user} />;
  }

  useEffect(() => {
    if (onSelectTask === null) {
      // Library mode — load all from admin
      return;
    }
    if (user?.id) fetchTasks();
  }, [user?.id, autoTrait, autoLevel]);

  // Library mode — delegate
  if (onSelectTask === null) {
    return <TaskLibrary user={user} />;
  }

  const fetchTasks = async () => {
    if (!user?.id) return;
    try {
      let data = await getTasksWithStatus(user.id);
      if (autoTrait) {
        const traitMatch = data.filter(t =>
          t.trait?.toLowerCase() === autoTrait.toLowerCase() &&
          (t.level_id === autoLevel || t.level_id === 0)
        );
        data = traitMatch.length > 0 ? traitMatch : data.filter(t => t.level_id === autoLevel || t.level_id === 0);
      }
      if (data.length === 0 && (autoLevel === 0 || autoLevel === undefined)) {
        data = DEFAULT_TASKS.filter(t => !autoTrait || t.trait === autoTrait);
      }
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks(DEFAULT_TASKS.filter(t => !autoTrait || t.trait === autoTrait));
    } finally { setLoading(false); }
  };

  const handleToggle = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(user.id, taskId, currentStatus);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t));
    } catch (err) { alert('Error updating task: ' + err.message); }
  };

  if (loading) return <div className="glass-card animate-up" style={{ textAlign: 'center', padding: '2rem' }}>Loading Challenges...</div>;

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '800px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span className="badge" style={{ background: 'var(--secondary)', color: '#fff', marginBottom: '0.5rem', display: 'inline-block' }}>
              Level {autoLevel !== undefined ? autoLevel : 0}: {onSelectTask ? 'Select Your Challenge' : 'Active Challenges'}
            </span>
            <h2 style={{ margin: 0 }}>{onSelectTask ? 'Test Your Instinct' : 'Micro-Challenges'}</h2>
          </div>
          {!onSelectTask && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedCount}/{tasks.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Done</div>
            </div>
          )}
        </div>
        {!onSelectTask && <div className="progress-container" style={{ height: '8px' }}><div className="progress-bar" style={{ width: `${progressPercent}%`, background: 'var(--secondary)' }} /></div>}
        {onSelectTask && autoTrait && <p style={{ margin: 0, opacity: 0.7 }}>Choose a challenge that fits your <strong style={{ color: TRAIT_COLORS[autoTrait] || 'var(--accent)' }}>{autoTrait}</strong> trait.</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tasks.map(task => (
          <div key={task.id} className="glass-card task-card-inner" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', borderLeft: task.is_completed ? '4px solid var(--secondary)' : '1px solid var(--card-border)', transition: 'all 0.3s ease' }}>
            {!onSelectTask && (
              <div onClick={() => handleToggle(task.id, task.is_completed)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: `2px solid ${task.is_completed ? ' var(--secondary)' : ' var(--card-border)'}`, background: task.is_completed ? 'var(--secondary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
                {task.is_completed && <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span>}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: task.is_completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.is_completed && !onSelectTask ? 'line-through' : 'none' }}>{task.title}</h3>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {task.trait && <span className="badge" style={{ background: `${TRAIT_COLORS[task.trait] || '#fff'}22`, color: TRAIT_COLORS[task.trait] || 'var(--text-muted)', fontSize: '0.7rem' }}>{task.trait}</span>}
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{task.duration}</span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: task.is_completed ? 0.5 : 0.8, marginBottom: onSelectTask ? '1.5rem' : 0 }}>
                {task.description || 'Take action to validate your trait profile.'}
              </p>
              {onSelectTask && (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => onSelectTask(task)}>
                  Start This Challenge →
                </button>
              )}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ opacity: 0.6 }}>No tasks found for Level {autoLevel} — {autoTrait}.</p>
            {onSelectTask && (
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => onSelectTask({ id: null, title: 'Generic Discovery Task', description: 'Explore your trait through free-form action.', duration: '15 min' })}>
                Skip to Feedback →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
