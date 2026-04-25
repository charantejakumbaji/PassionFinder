import React, { useState } from 'react';
import { challengesData } from '../data/config';

const Challenges = ({ onComplete }) => {
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleTaskComplete = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const allDone = completedTasks.length === challengesData.length;

  return (
    <div className="glass-container traits-view fade-in">
      <h2 className="text-gradient">Micro Challenges</h2>
      <p>Try these quick tasks to see what actually energizes you in practice.</p>

      <div className="challenges-grid">
        {challengesData.map((task) => {
          const isDone = completedTasks.includes(task.id);
          return (
            <div key={task.id} className="task-card" style={{ opacity: isDone ? 0.6 : 1 }}>
              <div className="task-info" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{task.title}</h3>
                <span className="task-meta">Est: {task.duration}</span>
              </div>
              <button 
                className={isDone ? "btn-secondary" : "btn-primary"} 
                style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
                onClick={() => handleTaskComplete(task.id)}
                disabled={isDone}
              >
                {isDone ? 'Completed' : 'Do It'}
              </button>
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="fade-in">
          <p style={{ color: '#00f2fe', marginBottom: '1rem', fontWeight: 'bold' }}>All tasks finished! Awesome job.</p>
          <button className="btn-primary" onClick={onComplete}>
            Give Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default Challenges;
