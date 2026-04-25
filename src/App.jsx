import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Questions from './components/Questions';
import TraitsPrediction from './components/TraitsPrediction';
import FinalResults from './components/FinalResults';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Tasks from './components/Tasks';
import { getCurrentUser, getUserHistory, getProgress, saveAttempt, logoutUser, saveProgress, checkAdmin } from './utils/storage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('loading'); // loading, auth, dashboard, wizard, journey, tasks
  const [history, setHistory] = useState([]);
  const [resumeData, setResumeData] = useState(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await loadUserData(user.id);
        } else {
          setCurrentScreen('auth');
        }
      } catch (err) {
        console.error("Session init failed:", err);
        setCurrentScreen('auth'); // Fallback to auth if check fails
      }
    };
    initSession();
  }, []);

  const loadUserData = async (userId) => {
    // Fetch History & Progress
    const [userHistory, progress, adminStatus] = await Promise.all([
      getUserHistory(userId),
      getProgress(userId),
      checkAdmin(userId)
    ]);

    setHistory(userHistory);
    setResumeData(progress);
    setIsAdmin(adminStatus);
    
    // Fetch Extended Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('bio, goal, interests')
      .eq('id', userId)
      .single();
    
    if (profile) {
      setCurrentUser(prev => ({ ...prev, ...profile }));
    }
    
    setCurrentScreen('dashboard');
  };

  const handleLogin = async (user) => {
    setCurrentUser(user);
    await loadUserData(user.id);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentScreen('auth');
  };

  const handleDiscoveryComplete = async (result) => {
    await saveAttempt(currentUser.id, result);
    // Refresh history
    const userHistory = await getUserHistory(currentUser.id);
    setHistory(userHistory);
    setResumeData(null);
    setCurrentScreen('journey');
  };

  const handleProgressUpdate = async (state) => {
    if (currentUser) {
      setResumeData(state);
      await saveProgress(currentUser.id, state);
    }
  };

  const handleAction = (action) => {
    if (action === 'resume') {
      setCurrentScreen('questions');
    } else if (['dashboard', 'questions', 'traits', 'results', 'profile', 'admin', 'tasks'].includes(action)) {
      if (action === 'questions') setResumeData(null);
      setCurrentScreen(action);
    }
  };

  const handleSaveResult = async (resultData) => {
    await saveAttempt(currentUser.id, resultData);
    const userHistory = await getUserHistory(currentUser.id);
    setHistory(userHistory);
  };

  if (currentScreen === 'loading') return <div className="app-content">Loading...</div>;

  // Prepare profile data
  const profileData = currentUser ? {
    id: currentUser.id,
    name: currentUser.user_metadata?.full_name || 'User',
    username: currentUser.email.split('@')[0],
    bio: currentUser.bio,
    goal: currentUser.goal,
    interests: currentUser.interests,
    results: history.map(item => ({
      date: item.date,
      strengths: item.strengths || ['Creative Thinking', 'Logic'],
      careers: item.careers || ['Designer', 'Developer']
    }))
  } : null;

  return (
    <div className="app-container">
      {currentScreen === 'auth' ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Auth onLogin={handleLogin} />
        </div>
      ) : (
        <Layout 
          currentScreen={currentScreen} 
          onNavigate={handleAction} 
          user={currentUser ? { ...currentUser, is_admin: isAdmin } : null}
          onLogout={handleLogout}
        >
          {currentScreen === 'dashboard' && (
            <Dashboard 
              user={currentUser}
              lastResult={history.length > 0 ? history[history.length - 1] : null}
              progress={resumeData}
              onAction={handleAction}
            />
          )}
          
          {currentScreen === 'questions' && (
            <Questions 
              onComplete={(answers) => {
                handleProgressUpdate({ answers, step: 'traits' });
                setCurrentScreen('traits');
              }} 
              onProgressSave={handleProgressUpdate}
              resumeData={resumeData}
            />
          )}

          {currentScreen === 'traits' && (
            <TraitsPrediction 
              onNext={() => setCurrentScreen('results')} 
            />
          )}

          {currentScreen === 'results' && (
            <FinalResults 
              onRestart={() => setCurrentScreen('questions')}
              onSaveResult={handleSaveResult}
            />
          )}

          {currentScreen === 'profile' && (
            <Profile currentUser={profileData} onUpdate={() => loadUserData(currentUser.id)} />
          )}

          {currentScreen === 'admin' && isAdmin && (
            <AdminDashboard />
          )}

          {currentScreen === 'tasks' && (
            <Tasks user={currentUser} />
          )}
        </Layout>
      )}
    </div>
  );
}

export default App;
