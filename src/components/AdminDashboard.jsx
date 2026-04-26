import React, { useState, useEffect } from 'react';
import { 
  getAdminQuestions, saveQuestion, deleteQuestion, 
  getAdminTasks, saveTask, deleteTask, 
  getSystemStats, getAllUsers, getAllFeedback 
} from '../utils/storage';

const TRAITS = ['creative', 'analytical', 'social', 'business', 'physical', 'leadership'];
const LEVEL_OPTIONS = [
  { value: 0, label: 'Level 0 — Discovery' },
  { value: 1, label: 'Level 1 — Validation' },
  { value: 2, label: 'Level 2 — Mastery' },
];
const TRAIT_COLORS = {
  creative: '#ff007f', analytical: '#00f2fe', social: '#8a2be2',
  business: '#ffd700', physical: '#ff4500', leadership: '#32cd32'
};

const SelectInput = ({ value, onChange, children, style = {} }) => (
  <select
    className="auth-input"
    value={value}
    onChange={onChange}
    style={{
      background: '#1a1535',
      border: '1px solid rgba(255,255,255,0.15)',
      color: '#f8f9fa',
      cursor: 'pointer',
      ...style
    }}
  >
    {children}
  </select>
);

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDiscoveries: 0, totalTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [taskLevelFilter, setTaskLevelFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    text: '', options: [{ text: '', trait: 'creative' }],
    title: '', duration: '', description: '',
    level_id: 0, trait: 'creative', type: 'assessment'
  });

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await getSystemStats();
      setStats(s);
      if (activeTab === 'questions') {
        const q = await getAdminQuestions();
        setQuestions(q.filter(q => q.type === 'assessment'));
      } else if (activeTab === 'feedback-qs') {
        const q = await getAdminQuestions();
        setFeedback(q.filter(q => q.type === 'feedback'));
      } else if (activeTab === 'tasks') {
        const t = await getAdminTasks();
        setTasks(t);
      } else if (activeTab === 'users') {
        const u = await getAllUsers();
        setUsers(u);
      } else if (activeTab === 'responses') {
        const f = await getAllFeedback();
        setFeedback(f);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'questions' || activeTab === 'feedback-qs') {
      const opts = Array.isArray(item.options) && typeof item.options[0] === 'object'
        ? item.options : item.options.map(o => ({ text: o, trait: 'creative' }));
      setFormData({ text: item.text, options: opts, level_id: item.level_id, id: item.id, type: item.type || (activeTab === 'feedback-qs' ? 'feedback' : 'assessment') });
    } else {
      setFormData({ title: item.title, duration: item.duration, description: item.description, level_id: item.level_id, id: item.id, trait: item.trait || 'creative' });
    }
  };

  const addOption = () => setFormData({ ...formData, options: [...formData.options, { text: '', trait: 'creative' }] });

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
        await saveQuestion({ id: formData.id, text: formData.text, options: formData.options, level_id: parseInt(formData.level_id), type: 'assessment' });
      } else if (activeTab === 'feedback-qs') {
        await saveQuestion({ id: formData.id, text: formData.text, options: formData.options, level_id: parseInt(formData.level_id), type: 'feedback' });
      } else {
        await saveTask({ id: formData.id, title: formData.title, duration: formData.duration, description: formData.description, level_id: parseInt(formData.level_id), trait: formData.trait });
      }
      setSuccessMsg('Saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      fetchData();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ text: '', options: [{ text: '', trait: 'creative' }], title: '', duration: '', description: '', level_id: 0, trait: 'creative', type: activeTab === 'feedback-qs' ? 'feedback' : 'assessment' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      if (activeTab === 'questions' || activeTab === 'feedback-qs') await deleteQuestion(id);
      else await deleteTask(id);
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const isQuestionTab = activeTab === 'questions' || activeTab === 'feedback-qs';

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'questions', label: '❓ Questions' },
    { id: 'feedback-qs', label: '💭 Feedback Qs' },
    { id: 'tasks', label: '🎯 Tasks' },
    { id: 'users', label: '👥 Users' },
    { id: 'responses', label: '📋 Responses' },
  ];

  const filteredTasks = taskLevelFilter === 'all' ? tasks : tasks.filter(t => t.level_id === parseInt(taskLevelFilter));

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '1000px', width: '100%' }}>
      {/* Header + Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => { setActiveTab(tab.id); resetForm(); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div className="option-grid" style={{ marginBottom: '2rem' }}>
            {[
              { label: 'Registered Users', value: stats.totalUsers, color: 'var(--accent)' },
              { label: 'Discovery Sessions', value: stats.totalDiscoveries, color: 'var(--secondary)' },
              { label: 'Active Tasks', value: stats.totalTasks, color: 'var(--primary)' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(0,242,254,0.03)', borderLeft: '4px solid var(--accent)' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>📌 Quick Guide</h3>
            <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              <li><strong>Questions tab</strong> — Add/edit assessment questions (shown during Level journey)</li>
              <li><strong>Feedback Qs tab</strong> — Add/edit reflection questions (shown after task completion)</li>
              <li><strong>Tasks tab</strong> — Manage micro-challenges per level and trait</li>
              <li><strong>Responses tab</strong> — View raw user feedback submissions</li>
            </ul>
          </div>
        </div>
      )}

      {/* QUESTIONS or FEEDBACK-QS form */}
      {(activeTab === 'questions' || activeTab === 'feedback-qs') && (
        <>
          <div className="glass-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editingItem ? '✏️ Edit' : '➕ Add'} {activeTab === 'questions' ? 'Assessment Question' : 'Feedback Question'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Journey Level</label>
                  <SelectInput value={formData.level_id} onChange={e => setFormData({ ...formData, level_id: e.target.value })}>
                    {LEVEL_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </SelectInput>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>{activeTab === 'questions' ? 'Assessment Question Text' : 'Reflection Question Text'}</label>
                <input className="auth-input" placeholder={activeTab === 'questions' ? 'e.g. When faced with a challenge, you...' : 'e.g. How did you feel while doing this task?'}
                  value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} required />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '1rem', color: 'var(--accent)' }}>
                  {activeTab === 'questions' ? 'Answer Options & Trait Mapping' : 'Answer Options (no trait needed for feedback)'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.options.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem' }} className="flex-column-mobile">
                      <input className="auth-input" style={{ flex: 1 }} placeholder={`Option ${idx + 1}`}
                        value={opt.text} onChange={e => updateOption(idx, 'text', e.target.value)} required />
                      {activeTab === 'questions' && (
                        <SelectInput value={opt.trait} onChange={e => updateOption(idx, 'trait', e.target.value)} style={{ width: '160px' }}>
                          {TRAITS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </SelectInput>
                      )}
                      <button type="button" className="btn btn-outline" style={{ color: '#ff4b4b', borderColor: 'rgba(255,75,75,0.2)', padding: '0.5rem 0.75rem' }}
                        onClick={() => setFormData({ ...formData, options: formData.options.filter((_, i) => i !== idx) })}>
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={addOption}>
                    + Add Option
                  </button>
                </div>
              </div>

              {successMsg && <div style={{ padding: '0.75rem', background: 'rgba(50,205,50,0.1)', color: '#32cd32', borderRadius: '8px', border: '1px solid rgba(50,205,50,0.2)', textAlign: 'center' }}>✓ {successMsg}</div>}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editingItem ? 'Update' : 'Save'}</button>
                {editingItem && <button className="btn btn-outline" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ opacity: 0.6, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {activeTab === 'questions' ? 'Assessment' : 'Feedback'} Questions ({activeTab === 'questions' ? questions : feedback}.length)
            </h4>
            {(activeTab === 'questions' ? questions : feedback).map(item => (
              <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>L{item.level_id}</span>
                    <span className="badge" style={{ background: item.type === 'feedback' ? 'rgba(138,43,226,0.15)' : 'rgba(0,242,254,0.1)', color: item.type === 'feedback' ? 'var(--primary)' : 'var(--accent)' }}>{item.type}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{item.text}</p>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', opacity: 0.4 }}>{item.options?.length || 0} options</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleEdit(item)}>✏️ Edit</button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#ff4b4b', borderColor: 'rgba(255,75,75,0.2)' }} onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TASKS */}
      {activeTab === 'tasks' && (
        <>
          <div className="glass-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editingItem ? '✏️ Edit' : '➕ Add'} Task
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Level</label>
                  <SelectInput value={formData.level_id} onChange={e => setFormData({ ...formData, level_id: e.target.value })}>
                    {LEVEL_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </SelectInput>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Target Trait</label>
                  <SelectInput value={formData.trait} onChange={e => setFormData({ ...formData, trait: e.target.value })}>
                    {TRAITS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </SelectInput>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Task Title</label>
                <input className="auth-input" placeholder="e.g. The 5-Minute Logo Challenge" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }} className="flex-column-mobile">
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Duration</label>
                  <input className="auth-input" placeholder="e.g. 15 min" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Instructions</label>
                  <textarea className="auth-input" placeholder="What should the user do?" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ minHeight: '80px', resize: 'vertical' }} />
                </div>
              </div>
              {successMsg && <div style={{ padding: '0.75rem', background: 'rgba(50,205,50,0.1)', color: '#32cd32', borderRadius: '8px', textAlign: 'center' }}>✓ {successMsg}</div>}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editingItem ? 'Update Task' : 'Save Task'}</button>
                {editingItem && <button className="btn btn-outline" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* Level Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, alignSelf: 'center', marginRight: '0.5rem' }}>FILTER:</span>
            {[{ v: 'all', l: 'All Levels' }, { v: '0', l: 'Level 0' }, { v: '1', l: 'Level 1' }, { v: '2', l: 'Level 2' }].map(f => (
              <button key={f.v} className={`btn ${taskLevelFilter === f.v ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setTaskLevelFilter(f.v)}>
                {f.l}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTasks.map(item => (
              <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>L{item.level_id}</span>
                    {item.trait && <span className="badge" style={{ background: `${TRAIT_COLORS[item.trait]}22`, color: TRAIT_COLORS[item.trait], border: `1px solid ${TRAIT_COLORS[item.trait]}44` }}>{item.trait}</span>}
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>{item.duration}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{item.title}</p>
                  {item.description && <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', opacity: 0.5, lineHeight: 1.5 }}>{item.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleEdit(item)}>✏️ Edit</button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#ff4b4b', borderColor: 'rgba(255,75,75,0.2)' }} onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}><p>No tasks found. Add one above.</p></div>}
          </div>
        </>
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Registered Users</h3>
          {users.map(u => (
            <div key={u.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }} className="flex-column-mobile">
              <div>
                <h4 style={{ margin: 0 }}>{u.full_name || 'Anonymous'}</h4>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', opacity: 0.5 }}>Joined {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
              {u.is_admin && <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>Admin</span>}
            </div>
          ))}
          {users.length === 0 && <p style={{ opacity: 0.5 }}>No users found.</p>}
        </div>
      )}

      {/* RESPONSES (user feedback submissions) */}
      {activeTab === 'responses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>User Feedback Responses</h3>
          {feedback.length === 0 ? <p style={{ opacity: 0.5 }}>No responses yet.</p> : feedback.map(f => (
            <div key={f.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge" style={{ background: 'var(--accent)', color: '#000' }}>{f.tasks?.title || 'Task'}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{new Date(f.created_at).toLocaleString()}</span>
              </div>
              <p style={{ fontWeight: '600', margin: '0 0 0.75rem', color: 'var(--text-main)' }}>{f.profiles?.full_name || 'Anonymous'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {Object.entries(f.responses || {}).map(([k, v]) => (
                  <div key={k} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{k.substring(0, 30)}</div>
                    <div style={{ fontSize: '0.85rem' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  inputLabel: { fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
};

export default AdminDashboard;
