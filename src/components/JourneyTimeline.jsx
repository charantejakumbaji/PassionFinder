import React from 'react';
import { TRAITS } from '../data/discoveryData';

const JourneyTimeline = ({ history, onRestart }) => {
  if (history.length === 0) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center' }}>
        <h2>Your Journey Starts Here</h2>
        <p>You haven't completed any discoveries yet. Start your first session to see your growth!</p>
        <button className="btn btn-primary btn-large" style={{ marginTop: '2rem' }} onClick={onRestart}>
          Begin Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Journey</h1>
        <button className="btn btn-primary" onClick={onRestart}>New Session</button>
      </div>

      <div className="timeline">
        {history.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot" style={{ background: TRAITS[item.topTrait.toUpperCase()].color }}></div>
            <div className="timeline-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: TRAITS[item.topTrait.toUpperCase()].color, 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {item.topTrait}
                </span>
              </div>
              <h3 style={{ margin: 0 }}>Attempt {history.length - index}</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Focused on <strong>{TRAITS[item.topTrait.toUpperCase()].label}</strong>. 
                {item.reflection1.enjoyed ? " User enjoyed the tasks " : " Challenging session "} 
                and felt {item.comparison === 'task1' ? "initial tasks" : "deeper exploration"} more natural.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <div style={{ 
                  height: '4px', 
                  flex: 1, 
                  background: TRAITS[item.topTrait.toUpperCase()].color,
                  borderRadius: '10px',
                  opacity: 0.6
                }}></div>
                {item.secondTrait && (
                  <div style={{ 
                    height: '4px', 
                    flex: 1, 
                    background: TRAITS[item.secondTrait.toUpperCase()].color,
                    borderRadius: '10px',
                    opacity: 0.3
                  }}></div>
                )}
              </div>
            </div>
          </div>
        )).reverse()}
      </div>

      {history.length >= 2 && (
        <div className="glass-card" style={{ marginTop: '3rem', border: '1px solid var(--accent)' }}>
          <h3>Growth Insights</h3>
          <p>
            You've completed {history.length} sessions. 
            {history[0].topTrait === history[history.length-1].topTrait 
              ? ` Your focus on ${history[0].topTrait} is consistently strong.`
              : ` Your interests are evolving from ${history[0].topTrait} towards ${history[history.length-1].topTrait}.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default JourneyTimeline;
