import React, { useState, useEffect } from 'react';
import { getAdminQuestions, saveQuestion, deleteQuestion, getAdminTasks, saveTask, deleteTask, getSystemStats } from '../utils/storage';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDiscoveries: 0, totalTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'questions', 'tasks'
  
  // Form States
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ text: '', options: '', title: '', duration: '', description: '', level_id: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = await getAdminQuestions();
      const t = await getAdminTasks();
      const s = await getSystemStats();
      setQuestions(q);
      setTasks(t);
      setStats(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'questions') {
      setFormData({ text: item.text, options: item.options.join(', '), level_id: item.level_id, id: item.id });
    } else {
      setFormData({ title: item.title, duration: item.duration, description: item.description, level_id: item.level_id, id: item.id });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'questions') {
        await saveQuestion({
          id: formData.id,
          text: formData.text,
          options: formData.options.split(',').map(s => s.trim()),
          level_id: parseInt(formData.level_id)
        });
      } else {
        await saveTask({
          id: formData.id,
          title: formData.title,
          duration: formData.duration,
          description: formData.description,
          level_id: parseInt(formData.level_id)
        });
      }
      setEditingItem(null);
      setFormData({ text: '', options: '', title: '', duration: '', description: '', level_id: 0 });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
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

  if (loading) return <div className="glass-card animate-up">Loading Admin Panel...</div>;

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('overview'); setEditingItem(null); }}
          >
            Overview
          </button>
          <button 
            className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('questions'); setEditingItem(null); }}
          >
            Questions
          </button>
          <button 
            className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('tasks'); setEditingItem(null); }}
          >
            Tasks
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="option-grid" style={{ marginBottom: '2rem' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--accent)', margin: 0 }}>{stats.totalUsers}</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>Registered Users</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--secondary)', margin: 0 }}>{stats.totalDiscoveries}</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>Discovery History</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--primary)', margin: 0 }}>{stats.totalTasks}</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>Active Challenges</p>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <>
          <div className="glass-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
            <h3>{editingItem ? 'Edit' : 'Add New'} {activeTab === 'questions' ? 'Question' : 'Task'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select 
                  className="auth-input" 
                  style={{ width: '130px' }}
                  value={formData.level_id}
                  onChange={(e) => setFormData({...formData, level_id: e.target.value})}
                >
                  <option value="0">Level 0</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                </select>
                {activeTab === 'questions' ? (
                  <input 
                    className="auth-input" 
                    style={{ flex: 1 }}
                    placeholder="Question Text" 
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    required
                  />
                ) : (
                  <input 
                    className="auth-input" 
                    style={{ flex: 1 }}
                    placeholder="Task Title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                )}
              </div>
              
              {activeTab === 'questions' ? (
                <input 
                  className="auth-input" 
                  placeholder="Options (comma separated)" 
                  value={formData.options}
                  onChange={(e) => setFormData({...formData, options: e.target.value})}
                  required
                />
              ) : (
                <>
                  <input 
                    className="auth-input" 
                    placeholder="Duration (e.g. 15 min)" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                  <textarea 
                    className="auth-input" 
                    placeholder="Task Description" 
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" type="submit">
                  {editingItem ? 'Update' : 'Save'} {activeTab === 'questions' ? 'Question' : 'Task'}
                </button>
                {editingItem && (
                   <button className="btn btn-outline" type="button" onClick={() => { setEditingItem(null); setFormData({ text: '', options: '', title: '', duration: '', description: '', level_id: 0 }); }}>
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
                    <h4 style={{ margin: 0 }}>{item.text || item.title}</h4>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
                    {activeTab === 'questions' ? item.options.join(' | ') : item.duration}
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
    </div>
  );
};

export default AdminDashboard;
