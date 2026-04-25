import React from 'react';

const Dashboard = ({ user, lastResult, progress, onAction }) => {
  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Welcome back, {(user.user_metadata?.full_name || user.name || 'User').split(' ')[0]}!
        </h1>
        <p>Ready to continue your journey of self-discovery?</p>
      </div>

      <div className="option-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Main Action: Continue or Start */}
        <div className="glass-card" style={progress ? styles.highlightCard : {}}>
          {progress ? (
            <>
              <span className="badge" style={{ background: 'var(--accent)', color: '#000' }}>IN PROGRESS</span>
              <h3 style={{ marginTop: '1rem' }}>Pick up where you left off</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                You were at Step {progress.step} in your last session.
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onAction('resume')}>
                Continue Discovery
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }}
                onClick={() => onAction('questions')}
              >
                Restart New Session
              </button>
            </>
          ) : (
            <>
              <h3>Start New Discovery</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Begin a fresh 5-minute session to mapping your natural traits.
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onAction('questions')}>
                Begin Level 0
              </button>
            </>
          )}
        </div>

        {/* Secondary Action: Profile/History */}
        <div className="glass-card">
          <h3>My Journey</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Review past results and track your improvements over time.
          </p>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => onAction('profile')}>
            View History
          </button>
        </div>

        {/* Level 1 Tasks */}
        <div className="glass-card" style={{ border: '1px solid var(--secondary)' }}>
          <span className="badge" style={{ background: 'var(--secondary)', color: '#fff' }}>LEVEL 1</span>
          <h3 style={{ marginTop: '1rem' }}>Take Real Action</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Ready to test your traits? Complete micro-challenges to validate your passion.
          </p>
          <button className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--secondary)' }} onClick={() => onAction('tasks')}>
            Start Level 1 Tasks
          </button>
        </div>
      </div>

      {/* Last Result Summary */}
      {lastResult && lastResult.strengths && lastResult.strengths.length > 0 && (
        <div className="glass-card" style={{ marginTop: '2rem', borderLeft: `6px solid var(--accent)` }}>
          <h3>Latest Insight</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
             <div style={{ 
               padding: '0.5rem 1rem', 
               borderRadius: '8px', 
               background: 'rgba(255,255,255,0.1)',
               fontWeight: 'bold',
               fontSize: '0.9rem'
             }}>
               {lastResult.strengths[0]}
             </div>
             <p style={{ margin: 0, fontSize: '0.95rem' }}>
               was one of your strongest traits on {new Date(lastResult.date).toLocaleDateString()}.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  highlightCard: {
    border: '1px solid var(--accent)',
    boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)'
  }
};

export default Dashboard;
