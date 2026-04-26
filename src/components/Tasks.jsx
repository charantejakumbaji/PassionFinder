import React, { useState, useEffect } from 'react';
import { getTasksWithStatus, toggleTaskCompletion } from '../utils/storage';

const DEFAULT_TASKS = [
  { id: 'd1', title: 'The 5-Minute Logo', description: 'Sketch a quick logo for a fictional brand based on an object near you.', duration: '10 min', trait: 'creative', level_id: 0 },
  { id: 'd2', title: 'Logic Puzzle Audit', description: 'Break down a complex problem you faced today into 5 logical steps.', duration: '15 min', trait: 'analytical', level_id: 0 },
  { id: 'd3', title: 'The Active Listener', description: 'Call a friend and listen for 5 minutes without talking about yourself.', duration: '10 min', trait: 'social', level_id: 0 },
  { id: 'd4', title: 'The Value Proposition', description: 'Write a 3-sentence pitch on how to make a product you use more profitable.', duration: '10 min', trait: 'business', level_id: 0 },
  { id: 'd5', title: 'Tallest Tower', description: 'Build the tallest possible tower using only 10 sheets of paper.', duration: '15 min', trait: 'physical', level_id: 0 },
  { id: 'd6', title: 'Mission Statement', description: 'Write a clear vision statement for your next 3 months of growth.', duration: '15 min', trait: 'leadership', level_id: 0 }
];

const Tasks = ({ user, autoTrait, autoLevel, onSelectTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user?.id, autoTrait, autoLevel]);

  const fetchTasks = async () => {
    if (!user?.id) return;
    try {
      let data = await getTasksWithStatus(user.id);
      
      // Filter logic (Stage 2 of the loop)
      if (autoTrait) {
        const traitMatch = data.filter(t => 
          t.trait?.toLowerCase() === autoTrait.toLowerCase() && 
          (t.level_id === autoLevel || t.level_id === 0)
        );
        
        // If no perfect match, show all tasks for this level
        if (traitMatch.length > 0) {
          data = traitMatch;
        } else {
          data = data.filter(t => t.level_id === autoLevel || t.level_id === 0);
        }
      }

      // 4. If no tasks found and we are at Level 0, add defaults
      if (data.length === 0 && (autoLevel === 0 || autoLevel === undefined)) {
        data = DEFAULT_TASKS.filter(t => !autoTrait || t.trait === autoTrait);
      }

      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(user.id, taskId, currentStatus);
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, is_completed: !currentStatus } : t
      ));
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  if (loading) return <div className="glass-card animate-up">Loading Challenges...</div>;

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '800px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge" style={{ background: 'var(--secondary)', color: '#fff', marginBottom: '0.5rem', display: 'inline-block' }}>
              Level {autoLevel !== undefined ? autoLevel : 1}: {onSelectTask ? 'Verification' : 'Active Challenges'}
            </span>
            <h2 style={{ margin: 0 }}>{onSelectTask ? 'Test Your Instinct' : 'Micro-Challenges'}</h2>
          </div>
          {!onSelectTask && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedCount}/{tasks.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tasks Done</div>
            </div>
          )}
        </div>
        
        {!onSelectTask && (
          <div className="progress-container" style={{ height: '8px' }}>
            <div className="progress-bar" style={{ width: `${progressPercent}%`, background: 'var(--secondary)' }}></div>
          </div>
        )}
        
        {onSelectTask && (
          <p style={{ margin: 0, opacity: 0.7 }}>
            Choose a challenge to verify your **{autoTrait}** trait.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="glass-card task-card-inner" 
            style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              gap: '1.5rem', 
              alignItems: 'center',
              borderLeft: task.is_completed ? '4px solid var(--secondary)' : '1px solid var(--card-border)',
              transition: 'all 0.3s ease'
            }}
          >
            {!onSelectTask && (
              <div 
                onClick={() => handleToggle(task.id, task.is_completed)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  border: '2px solid' + (task.is_completed ? ' var(--secondary)' : ' var(--card-border)'),
                  background: task.is_completed ? ' var(--secondary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
              >
                {task.is_completed && <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span>}
              </div>
            )}
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: task.is_completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.is_completed && !onSelectTask ? 'line-through' : 'none' }}>
                  {task.title}
                </h3>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  {task.duration}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: task.is_completed ? 0.5 : 0.8, marginBottom: onSelectTask ? '1.5rem' : 0 }}>
                {task.description || 'Take action to validate your trait profile.'}
              </p>
              
              {onSelectTask && (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onSelectTask(task)}>
                  Start This Challenge →
                </button>
              )}
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>No tasks found for Level {autoLevel} - {autoTrait}.</p>
            {onSelectTask && (
              <button className="btn btn-outline" onClick={() => onSelectTask({ id: 0, title: 'Generic Discovery' })}>
                Skip to Feedback
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
