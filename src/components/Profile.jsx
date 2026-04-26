import React, { useState, useEffect } from 'react';
import { deleteResult, updateProfile } from '../utils/storage';

const Profile = ({ currentUser, onUpdate }) => {
  const { name, bio, goal, interests, results } = currentUser || {};
  const userId = currentUser?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: bio || '',
    goal: goal || '',
    interests: interests || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync form when profile data refreshes
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        bio: bio || '',
        goal: goal || '',
        interests: interests || ''
      });
    }
  }, [bio, goal, interests, isEditing]);

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await updateProfile(userId, formData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Delete this history record?')) return;
    try {
      await deleteResult(id);
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="profile-container animate-up" style={{ width: '100%', maxWidth: '900px' }}>
      {/* Profile Info Section */}
      <div className="glass-card" style={{ marginBottom: '3rem', padding: '3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="flex-column-mobile">
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
          }}>
            {name?.[0] || 'U'}
          </div>
          <div>
            <h1 style={{ margin: 0 }}>{name}</h1>
            <p style={{ margin: '0.25rem 0 0', opacity: 0.5 }}>{currentUser?.email || 'Discovery Explorer'}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {results?.length || 0} Discoveries
              </span>
              <span className="badge" style={{ background: 'var(--accent)', color: '#000' }}>
                Level {results?.length > 0 ? (results[0].level + 1) : 0} Explorer
              </span>
            </div>
            {!isEditing && (
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Core Bio</h4>
            {isEditing ? (
              <textarea 
                className="auth-input"
                style={{ minHeight: '80px', width: '100%', background: 'rgba(255,255,255,0.03)' }}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p style={{ margin: 0, opacity: 0.8, lineHeight: '1.6' }}>{bio || 'No bio added yet.'}</p>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="flex-column-mobile">
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Primary Goal</h4>
              {isEditing ? (
                <input 
                  className="auth-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)' }}
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  placeholder="What are you working towards?"
                />
              ) : (
                <p style={{ margin: 0, opacity: 0.8, lineHeight: '1.6' }}>{goal || 'No primary goal set.'}</p>
              )}
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Interests</h4>
              {isEditing ? (
                <input 
                  className="auth-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)' }}
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  placeholder="Design, Logic, Strategy..."
                />
              ) : (
                <p style={{ margin: 0, opacity: 0.8, lineHeight: '1.6' }}>{interests || 'No interests added.'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div>
        <h2 style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>Discovery Journey History</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {results && results.length > 0 ? (
            results.map((res, i) => (
              <div key={res.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', borderLeft: `6px solid var(--color-${res.topTrait || 'creative'})` }}>
                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge" style={{ background: 'var(--primary)', marginBottom: '0.5rem', display: 'inline-block' }}>Level {res.level} Session</span>
                    <h3 style={{ margin: 0 }}>Result: <span style={{ color: `var(--color-${res.topTrait || 'creative'})` }}>{res.topTrait?.toUpperCase()}</span></h3>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.4 }}>Completed on {new Date(res.date).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="btn btn-outline" 
                    style={{ color: '#ff4b4b', borderColor: 'rgba(255,75,75,0.2)', padding: '0.5rem' }}
                    onClick={() => handleDeleteResult(res.id)}
                  >
                    🗑️
                  </button>
                </div>

                <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                  {/* Stage 1: Questions */}
                  <div>
                    <h5 style={{ color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Stage 1: Assessment</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {res.answers && res.answers.slice(0, 3).map((ans, j) => (
                        <div key={j} style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          • {ans.text}
                        </div>
                      ))}
                      {res.answers?.length > 3 && <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>+{res.answers.length - 3} more answers</div>}
                    </div>
                  </div>

                  {/* Stage 2: Verification */}
                  <div>
                    <h5 style={{ color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Stage 2: Verification</h5>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{res.task?.title || 'Generic Discovery'}</div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>{res.task?.duration || 'Completed'}</p>
                  </div>

                  {/* Stage 3: Reflection */}
                  <div>
                    <h5 style={{ color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Stage 3: Reflection</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {res.feedback && Object.entries(res.feedback).map(([q, a], j) => (
                        <div key={j} style={{ fontSize: '0.8rem' }}>
                          <span style={{ opacity: 0.5 }}>•</span> {a}
                        </div>
                      ))}
                      {(!res.feedback || Object.keys(res.feedback).length === 0) && <div style={{ fontSize: '0.8rem', opacity: 0.4 }}>No reflection recorded.</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
              <p>Your discovery history is empty.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/'}>Start First Journey</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
