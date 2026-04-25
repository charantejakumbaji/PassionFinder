import React, { useState, useEffect } from 'react';
import { getTasksWithStatus, toggleTaskCompletion } from '../utils/storage';

const Tasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user.id]);

  const fetchTasks = async () => {
    try {
      const data = await getTasksWithStatus(user.id);
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
      // Update local state for immediate feedback
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, is_completed: !currentStatus } : t
      ));
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  if (loading) return <div className="glass-card animate-up">Loading Level 1 Tasks...</div>;

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '800px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge" style={{ background: 'var(--secondary)', color: '#fff', marginBottom: '0.5rem', display: 'inline-block' }}>
              Level 1: Action
            </span>
            <h2 style={{ margin: 0 }}>Micro-Challenges</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedCount}/{tasks.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tasks Done</div>
          </div>
        </div>
        
        <div className="progress-container" style={{ height: '8px' }}>
          <div className="progress-bar" style={{ width: `${progressPercent}%`, background: 'var(--secondary)' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="glass-card" 
            style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              gap: '1.5rem', 
              alignItems: 'flex-start',
              borderLeft: task.is_completed ? '4px solid var(--secondary)' : '1px solid var(--card-border)',
              transition: 'all 0.3s ease'
            }}
          >
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
                marginTop: '4px',
                transition: 'all 0.2s'
              }}
            >
              {task.is_completed && <span style={{ color: '#fff', fontWeight: 'bold' }}>✓</span>}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: task.is_completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                  {task.title}
                </h3>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  {task.duration}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: task.is_completed ? 0.5 : 0.8 }}>
                {task.description || 'Take action to validate your trait profile.'}
              </p>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>No tasks assigned per Level 1 yet. Admins are crafting your journey.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
