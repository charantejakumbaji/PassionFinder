import React, { useState, useEffect } from 'react';
import { 
  getAdminQuestions, saveQuestion, deleteQuestion, 
  getAdminTasks, saveTask, deleteTask, 
  getSystemStats, getAllUsers, getAllFeedback 
} from '../utils/storage';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDiscoveries: 0, totalTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'questions', 'tasks', 'users', 'feedback', 'settings'
  
  const TRAITS = ['creative', 'analytical', 'social', 'business', 'physical', 'leadership'];

  // Form States
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ 
    text: '', 
    options: [{ text: '', trait: 'creative' }], 
    title: '', 
    duration: '', 
    description: '', 
    level_id: 0,
    trait: 'creative', // For tasks
    type: 'assessment' // 'assessment' or 'feedback'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await getSystemStats();
      setStats(s);

      if (activeTab === 'questions') {
        const q = await getAdminQuestions();
        setQuestions(q);
      } else if (activeTab === 'tasks') {
        const t = await getAdminTasks();
        setTasks(t);
      } else if (activeTab === 'users') {
        const u = await getAllUsers();
        setUsers(u);
      } else if (activeTab === 'feedback') {
        const f = await getAllFeedback();
        setFeedback(f);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'questions') {
      const opts = Array.isArray(item.options) && typeof item.options[0] === 'object' 
        ? item.options 
        : item.options.map(o => ({ text: o, trait: 'creative' }));
      setFormData({ 
        text: item.text, 
        options: opts, 
        level_id: item.level_id, 
        id: item.id,
        type: item.type || 'assessment'
      });
    } else {
      setFormData({ 
        title: item.title, 
        duration: item.duration, 
        description: item.description, 
        level_id: item.level_id, 
        id: item.id,
        trait: item.trait || 'creative'
      });
    }
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, { text: '', trait: 'creative' }] });
  };

  const updateOption = (index, field, value) => {
    const newOpts = [...formData.options];
    newOpts[index][field] = value;
    setFormData({ ...formData, options: newOpts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      if (activeTab === 'questions') {
        await saveQuestion({
          id: formData.id,
          text: formData.text,
          options: formData.options,
          level_id: parseInt(formData.level_id),
          type: formData.type
        });
      } else {
        await saveTask({
          id: formData.id,
          title: formData.title,
          duration: formData.duration,
          description: formData.description,
          level_id: parseInt(formData.level_id),
          trait: formData.trait
        });
      }
      setSuccessMsg(`${activeTab === 'questions' ? 'Question' : 'Task'} saved successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ 
      text: '', 
      options: [{ text: '', trait: 'creative' }], 
      title: '', 
      duration: '', 
      description: '', 
      level_id: 0,
      trait: 'creative',
      type: 'assessment'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      if (activeTab === 'questions') {
        await deleteQuestion(id);
      } else {
        await deleteTask(id);
      }
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && !['settings', 'overview'].includes(activeTab)) {
    return <div className="glass-card animate-up">Loading Admin Data...</div>;
  }

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '1000px', width: '100%' }}>
      <div className="flex-column-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%', justifyContent: 'flex-start' }} className="w-100-mobile hide-scrollbar">
          {['overview', 'questions', 'tasks', 'users', 'feedback', 'settings'].map(tab => (
            <button 
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => { setActiveTab(tab); setEditingItem(null); }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="option-grid" style={{ marginBottom: '2rem' }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h1 style={{ color: 'var(--accent)', margin: 0 }}>{stats.totalUsers}</h1>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Registered Users</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h1 style={{ color: 'var(--secondary)', margin: 0 }}>{stats.totalDiscoveries}</h1>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Discovery History</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h1 style={{ color: 'var(--primary)', margin: 0 }}>{stats.totalTasks}</h1>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Active Challenges</p>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>User Feedback</h3>
          {feedback.length === 0 ? <p>No feedback received yet.</p> : feedback.map(f => (
            <div key={f.id} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: 'var(--accent)', color: '#000' }}>{f.tasks?.title}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(f.created_at).toLocaleString()}</span>
              </div>
              <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>{f.profiles?.full_name || 'Anonymous'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                {Object.entries(f.responses || {}).map(([k, v]) => (
                  <div key={k}><span style={{ opacity: 0.6 }}>{k}:</span> {v}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'questions' || activeTab === 'tasks') && (
        <>
          <div className="glass-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editingItem ? 'Edit' : 'Add New'} {activeTab === 'questions' ? 'Question' : 'Task'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={styles.inputGroup}>
                   <label style={styles.inputLabel}>Journey Level</label>
                   <select 
                    className="auth-input" 
                    style={styles.selectInput}
                    value={formData.level_id}
                    onChange={(e) => setFormData({...formData, level_id: e.target.value})}
                   >
                    <option value="0">Level 0: Assessment</option>
                    <option value="1">Level 1: Validation</option>
                    <option value="2">Level 2: Deep Dive</option>
                   </select>
                </div>

                {activeTab === 'questions' && (
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Question Category</label>
                    <select 
                      className="auth-input" 
                      style={styles.selectInput}
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="assessment">Assessment Questions</option>
                      <option value="feedback">Post-Task Feedback</option>
                    </select>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Target Trait</label>
                    <select 
                      className="auth-input" 
                      style={styles.selectInput}
                      value={formData.trait}
                      onChange={(e) => setFormData({...formData, trait: e.target.value})}
                    >
                      {TRAITS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{activeTab === 'questions' ? 'Main Question Text' : 'Challenge Title'}</label>
                <input 
                  className="auth-input" 
                  placeholder={activeTab === 'questions' ? "e.g. How do you handle complex problems?" : "e.g. The 5-Minute Logo Challenge"} 
                  value={activeTab === 'questions' ? formData.text : formData.title}
                  onChange={(e) => setFormData({...formData, [activeTab === 'questions' ? 'text' : 'title']: e.target.value})}
                  required
                />
              </div>
              
              {activeTab === 'questions' ? (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem', color: 'var(--accent)' }}>
                    Multiple Choice Options & Trait Mapping
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {formData.options.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem' }} className="flex-column-mobile">
                        <input 
                          className="auth-input" 
                          style={{ flex: 1 }}
                          placeholder={`Option ${idx + 1} Text`} 
                          value={opt.text}
                          onChange={(e) => updateOption(idx, 'text', e.target.value)}
                          required
                        />
                        <select 
                          className="auth-input" 
                          style={{ ...styles.selectInput, width: '150px' }}
                          value={opt.trait}
                          onChange={(e) => updateOption(idx, 'trait', e.target.value)}
                        >
                          {TRAITS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                        <button type="button" className="btn btn-outline" style={{ color: '#ff4b4b', borderColor: 'rgba(255,75,75,0.2)' }} onClick={() => {
                          const newOpts = formData.options.filter((_, i) => i !== idx);
                          setFormData({ ...formData, options: newOpts });
                        }}>🗑️</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={addOption}>
                      + Add New Option
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }} className="flex-column-mobile">
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Duration</label>
                    <input 
                      className="auth-input" 
                      placeholder="e.g. 15 min" 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Challenge Instructions</label>
                    <textarea 
                      className="auth-input" 
                      placeholder="Explain what the user needs to do..." 
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}
              
              {successMsg && (
                <div style={{ padding: '0.75rem', background: 'rgba(50, 205, 50, 0.1)', color: '#32cd32', borderRadius: '8px', border: '1px solid rgba(50, 205, 50, 0.2)', fontSize: '0.9rem', textAlign: 'center' }}>
                  ✓ {successMsg}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingItem ? 'Update' : 'Save')} {activeTab === 'questions' ? 'Question' : 'Task'}
                </button>
                {editingItem && (
                   <button className="btn btn-outline" type="button" onClick={resetForm} disabled={saving}>
                     Cancel
                   </button>
                )}
              </div>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(activeTab === 'questions' ? questions : tasks).map((item) => (
              <div key={item.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>L{item.level_id}</span>
                    {item.type && <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>{item.type}</span>}
                    {item.trait && <span className="badge" style={{ background: 'rgba(138, 43, 226, 0.1)', color: 'var(--primary)' }}>{item.trait}</span>}
                    <h4 style={{ margin: 0 }}>{item.text || item.title}</h4>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
                    {activeTab === 'questions' 
                      ? `${item.options.length} options mapped to ${[...new Set(item.options.map(o => typeof o === 'object' ? o.trait : 'legacy'))].join(', ')}`
                      : item.duration}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => handleEdit(item)}>✏️</button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', borderColor: '#ff4b4b' }} onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>User Management</h3>
          {users.map(u => (
            <div key={u.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>{u.full_name || 'Anonymous'}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>{u.id.substring(0, 8)}... • Joined {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
              {u.is_admin && <span className="badge" style={{ background: 'var(--primary)' }}>Admin</span>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <h3>System Settings & Tips</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {/* Previous tips remain... */}
             <div style={styles.tipBox}>
              <h4 style={{ color: 'var(--primary)' }}>🛠️ Future Levels</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                You can now add questions and tasks for any Level (0, 1, 2, 3...). 
                The system will automatically unlock these as users progress through feedback loops.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  tipBox: {
    padding: '1.25rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderLeft: '4px solid var(--accent)'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1
  },
  inputLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  selectInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default AdminDashboard;
