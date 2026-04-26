import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Questions from './components/Questions';
import TraitsPrediction from './components/TraitsPrediction';
import Tasks from './components/Tasks';
import TaskFeedback from './components/TaskFeedback';
import FinalResults from './components/FinalResults';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';
import FinalReport from './components/FinalReport';
import { 
  getCurrentUser, getUserHistory, getProgress, 
  saveAttempt, logoutUser, saveProgress, 
  checkAdmin, getProfile 
} from './utils/storage';

// Error Boundary for safety
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ color: '#ff4b4b' }}>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button className="btn btn-primary" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Hard Reset App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function TaskExecutionScreen({ task, onComplete }) {
  const [taskDone, setTaskDone] = useState(false);

  // Guard: if task is missing, show a friendly error
  if (!task) {
    return (
      <div className="glass-card animate-up" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <h2>No Task Selected</h2>
        <p style={{ margin: '1rem 0' }}>Please go back and select a challenge first.</p>
        <button className="btn btn-outline" onClick={onComplete}>← Go Back</button>
      </div>
    );
  }

  return (
    <div className="glass-card animate-up" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', marginBottom: '1rem', display: 'inline-block' }}>
          Stage 2 of 3: Verification Phase
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>Active Mission</h1>
        <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Put your predicted trait into real-world action.</p>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'left', marginBottom: '2.5rem' }}>
        <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚡ {task.title}
        </h3>
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.8rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Mission Briefing</h4>
          <p style={{ opacity: 0.8, lineHeight: '1.7', fontSize: '1.1rem' }}>{task.description || 'Complete this challenge using your natural instincts.'}</p>
        </div>
        <div style={{ padding: '1rem', background: 'rgba(138, 43, 226, 0.05)', borderRadius: '12px', border: '1px solid rgba(138, 43, 226, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}><strong>Estimated Time:</strong> {task.duration || '15-20 minutes'}</p>
          <span className="badge" style={{ background: 'var(--accent)', color: '#000', fontSize: '0.65rem' }}>Timed Challenge</span>
        </div>
      </div>

      {/* EXECUTION TIPS */}
      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h4 style={{ fontSize: '0.8rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Execution Tips</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <span>⏱️</span>
            <span><strong>Trust Your Speed:</strong> Aim to finish within the time limit. Your raw instincts are exactly what we're measuring.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <span>🧘</span>
            <span><strong>Deep Focus:</strong> Minimize distractions. This task is about how YOU naturally solve problems.</span>
          </div>
        </div>
      </div>

      {/* CHECKBOX SECTION */}
      <div 
        onClick={() => setTaskDone(!taskDone)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', 
          background: taskDone ? 'rgba(50, 205, 50, 0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${taskDone ? '#32cd32' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease',
          marginBottom: '2rem'
        }}
      >
        <div style={{ 
          width: '28px', height: '28px', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: taskDone ? 'var(--primary)' : 'transparent',
          border: `2px solid ${taskDone ? 'var(--primary)' : 'rgba(255,255,255,0.3)'}`,
          flexShrink: 0,
          transition: 'all 0.2s ease'
        }}>
          {taskDone && <span style={{ fontWeight: 'bold', color: '#fff' }}>✓</span>}
        </div>
        <span style={{ fontWeight: '600', opacity: taskDone ? 1 : 0.6 }}>
          I have completed the "{task.title}" challenge as instructed.
        </span>
      </div>

      {/* ACTION BUTTON */}
      {taskDone && (
        <button 
          className="btn btn-primary btn-large animate-up pulse-glow" 
          style={{ width: '100%', padding: '1.5rem', borderRadius: '16px', fontSize: '1.2rem' }}
          onClick={onComplete}
        >
          Go to Reflection Phase →
        </button>
      )}
      {!taskDone && (
        <p style={{ fontSize: '0.85rem', opacity: 0.4 }}>Please check the box above once you've finished the task to proceed.</p>
      )}
    </div>
  );
}

const TRAIT_MAP = {
  creative: { strengths: ['Visual Design', 'Ideation', 'Abstraction'], careers: ['UI/UX Designer', 'Art Director', 'Content Creator'] },
  analytical: { strengths: ['Logic', 'Problem Deconstruction', 'Efficiency'], careers: ['Software Engineer', 'Data Scientist', 'Operations Manager'] },
  social: { strengths: ['Communication', 'Emotional Intelligence', 'Mediation'], careers: ['Psychologist', 'HR Specialist', 'Community Manager'] },
  business: { strengths: ['Marketing', 'Financial Modeling', 'Opportunity Mapping'], careers: ['Product Manager', 'Entrepreneur', 'Sales Lead'] },
  physical: { strengths: ['Physical Precision', 'Material Knowledge', 'Execution'], careers: ['Industrial Designer', 'Athlete', 'Skilled Technician'] },
  leadership: { strengths: ['Vision', 'Team Building', 'Strategic Planning'], careers: ['Manager', 'Director', 'Team Lead'] },
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [history, setHistory] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [session, setSession] = useState({ level: 0, screen: 'dashboard' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await loadData(user.id);
        } else {
          setCurrentScreen('auth');
          setLoading(false);
        }
      } catch (err) {
        setCurrentScreen('auth');
        setLoading(false);
      }
    };
    initApp();
  }, []);

  const loadData = async (userId, keepScreen = false) => {
    try {
      const [userHistory, progress, adminStatus, profile] = await Promise.all([
        getUserHistory(userId).catch(() => []),
        getProgress(userId).catch(() => null),
        checkAdmin(userId).catch(() => false),
        getProfile(userId).catch(() => null)
      ]);

      setHistory(userHistory || []);
      setIsAdmin(adminStatus);
      setProfileData(profile);
      
      const derivedLevel = (userHistory && userHistory.length > 0) ? Math.min(userHistory[0].level + 1, 2) : 0;
      
      if (progress && progress.screen && progress.screen !== 'dashboard') {
        setSession({ ...progress, level: Math.min(progress.level ?? derivedLevel, 2) });
      } else {
        setSession({ level: derivedLevel, screen: 'dashboard' });
      }
      
      // Only redirect to dashboard if not asked to stay on current screen
      if (!keepScreen) {
        setCurrentScreen('dashboard');
      }
    } catch (err) {
      console.error('loadData error:', err);
      if (!keepScreen) setCurrentScreen('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, targetLevel = null) => {
    if (action === 'logout') {
      await logoutUser();
      setCurrentUser(null);
      setIsAdmin(false);
      setHistory([]);
      setSession({ level: 0, screen: 'dashboard' });
      setCurrentScreen('auth');
      return;
    }

    if (action === 'resume') {
      const resumeScreen = session.screen && session.screen !== 'dashboard' ? session.screen : 'questions';
      setCurrentScreen(resumeScreen);
    } else if (action === 'questions') {
      // targetLevel lets Dashboard specify exactly which level to (re)play
      const startLevel = targetLevel !== null ? targetLevel : (session.level || 0);
      const newSession = { ...session, level: startLevel, screen: 'questions', answers: [], scores: {}, topTrait: null, task: null };
      setSession(newSession);
      if (currentUser) await saveProgress(currentUser.id, newSession);
      setCurrentScreen('questions');
    } else if (action === 'tasks') {
      setCurrentScreen('tasks');
    } else {
      setCurrentScreen(action);
    }
    window.scrollTo(0, 0);
  };

  const updateSession = async (updates) => {
    const next = { ...session, ...updates };
    setSession(next);
    if (currentUser) {
      try {
        await saveProgress(currentUser.id, next);
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }
  };

  const handleLevelAction = async (type) => {
    if (type === 'next') {
      const currentLevel = session.level || 0;
      const allLevelsComplete = history.some(h => h.level === 2);
      // If completing level 2 OR all levels done, go to final report
      if (currentLevel === 2 || allLevelsComplete) {
        setCurrentScreen('final-report');
        return;
      }
      const nextLevel = Math.min(currentLevel + 1, 2);
      const newSession = { level: nextLevel, screen: 'dashboard', answers: [], scores: {}, topTrait: null, task: null };
      setSession(newSession);
      if (currentUser) await saveProgress(currentUser.id, newSession);
      setCurrentScreen('dashboard');
    } else if (type === 'loop') {
      // Retry the exact current level
      const retryLevel = session.level || 0;
      const newSession = { level: retryLevel, screen: 'questions', answers: [], scores: {}, topTrait: null, task: null };
      setSession(newSession);
      if (currentUser) await saveProgress(currentUser.id, newSession);
      setCurrentScreen('questions');
    }
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07051a', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ opacity: 0.6, letterSpacing: '1px' }}>INITIALIZING ENGINE...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={currentUser} history={history} lastResult={history[0]} progress={session.screen && session.screen !== 'dashboard' ? session : null} onAction={handleAction} />;
      
      case 'questions':
        return <Questions 
          resumeData={session} 
          onProgressSave={updateSession} 
          onComplete={(data) => {
            const scores = data.scores || {};
            const topTrait = Object.entries(scores).sort((a,b) => b[1] - a[1])[0]?.[0] || 'creative';
            updateSession({ ...data, topTrait, screen: 'traits' });
            setCurrentScreen('traits');
          }} 
        />;
      
      case 'traits':
        return <TraitsPrediction session={session} onNext={(dir) => {
          if (dir === 'back') {
            updateSession({ screen: 'questions' });
            setCurrentScreen('questions');
          } else {
            updateSession({ screen: 'task-action' });
            setCurrentScreen('task-action');
          }
        }} />;
      
      case 'task-action':
        return <Tasks user={currentUser} autoTrait={session.topTrait} autoLevel={session.level} onSelectTask={(task) => {
          updateSession({ task, screen: 'task-execution' });
          setCurrentScreen('task-execution');
        }} />;

      case 'tasks':
        // Standalone task library — browse all tasks
        return <Tasks user={currentUser} autoTrait={null} autoLevel={session.level} onSelectTask={null} />;
      
      case 'task-execution':
        return <TaskExecutionScreen 
          task={session.task} 
          onComplete={() => {
            updateSession({ screen: 'feedback' });
            setCurrentScreen('feedback');
          }} 
        />;
      
      case 'feedback':
        return <TaskFeedback 
          userId={currentUser?.id} 
          taskId={typeof session.task?.id === 'number' ? session.task?.id : null} 
          onComplete={async (fb) => {
            try {
              const final = { ...session, feedback: fb };
              const map = TRAIT_MAP[final.topTrait] || TRAIT_MAP.creative;
              const payload = { ...final, strengths: map.strengths, careers: map.careers };
              await saveAttempt(currentUser.id, payload);
              const newH = await getUserHistory(currentUser.id);
              setHistory(newH);
            } catch (err) {
              console.error('Error saving attempt:', err);
            }
            setCurrentScreen('results');
          }} 
        />;
      
      case 'results':
        return <FinalResults session={session} history={history} onRestart={() => handleAction('questions')} onLevelAction={handleLevelAction} />;
      
      case 'final-report':
        return <FinalReport session={session} history={history} onRestart={() => handleAction('questions')} onGoHome={() => { setCurrentScreen('dashboard'); window.scrollTo(0,0); }} />;
      
      case 'profile':
        return <Profile 
          currentUser={{ 
            ...currentUser, 
            ...profileData,
            results: history, 
            name: currentUser?.user_metadata?.full_name || profileData?.full_name
          }} 
          onUpdate={() => loadData(currentUser.id, true)}
        />;
      
      case 'admin':
        return <AdminDashboard />;
      
      default:
        return <Dashboard user={currentUser} lastResult={history[0]} onAction={handleAction} />;
    }
  };

  return (
    <div className="app-container">
      {currentScreen === 'auth' ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Auth onLogin={(u) => { setCurrentUser(u); loadData(u.id); }} />
        </div>
      ) : (
        <Layout 
          currentScreen={currentScreen} 
          onNavigate={handleAction} 
          user={{ ...currentUser, is_admin: isAdmin }} 
          onLogout={() => handleAction('logout')}
        >
          <ErrorBoundary>
            <div className="animate-up">
              {renderScreen()}
            </div>
          </ErrorBoundary>
        </Layout>
      )}
    </div>
  );
}

export default App;
