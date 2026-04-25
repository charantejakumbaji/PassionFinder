import React, { useState } from 'react';
import { updateProfile } from '../utils/storage';

const Profile = ({ currentUser, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: currentUser.bio || '',
    goal: currentUser.goal || '',
    interests: currentUser.interests || ''
  });
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(currentUser.id, formData);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('Error saving profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-up" style={{ width: '100%', maxWidth: '800px' }}>
      <div className="glass-card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(0, 242, 254, 0.1))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            {currentUser.name[0]}
          </div>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
          >
            {saving ? 'Saving...' : (isEditing ? 'Save Profile' : 'Edit Profile')}
          </button>
        </div>
        
        <h2 style={{ fontSize: '2rem', marginTop: '1rem', marginBottom: '0.25rem' }}>{currentUser.name}</h2>
        <p style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>@{currentUser.username}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <h5 style={styles.fieldLabel}>Bio</h5>
            {isEditing ? (
              <textarea 
                className="auth-input" 
                style={{ width: '100%', minHeight: '80px' }} 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p style={styles.fieldText}>{currentUser.bio || 'No bio yet.'}</p>
            )}
          </div>
          <div>
            <h5 style={styles.fieldLabel}>Main Goal</h5>
            {isEditing ? (
              <input 
                className="auth-input" 
                style={{ width: '100%' }} 
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                placeholder="What is your biggest aspiration?"
              />
            ) : (
              <p style={styles.fieldText}>{currentUser.goal || 'No goal set.'}</p>
            )}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <h5 style={styles.fieldLabel}>Interests</h5>
            {isEditing ? (
              <input 
                className="auth-input" 
                style={{ width: '100%' }} 
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                placeholder="Coding, Design, Public Speaking..."
              />
            ) : (
              <p style={styles.fieldText}>{currentUser.interests || 'Add your interests to help your discovery.'}</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📅 Discovery History
        </h3>
      </div>
      
      <div className="timeline">
        {currentUser.results && currentUser.results.length > 0 ? (
          currentUser.results.slice().reverse().map((result, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content animate-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'inline-block' }}>
                      Discovery Session
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Potential Realized</h4>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(result.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h5 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Strengths</h5>
                    <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.9rem' }}>
                      {result.strengths.map((str, i) => <li key={i}>{str}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Suggested Paths</h5>
                    <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.9rem' }}>
                      {result.careers.map((car, i) => <li key={i}>{car}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>You haven't completed any discoveries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  fieldLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '0.5rem'
  },
  fieldText: {
    margin: 0,
    fontSize: '1rem',
    opacity: 0.9
  }
};

export default Profile;
