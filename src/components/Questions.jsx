import React, { useState, useEffect } from 'react';
import { getQuestions } from '../utils/storage';

const Questions = ({ onComplete, onProgressSave, resumeData }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(resumeData?.currentIndex || 0);
  const [answers, setAnswers] = useState(resumeData?.answers || []);

  const EMERGENCY_QUESTIONS = [
    { id: 'e1', text: 'When faced with a complex problem, you...', options: [{text: 'Break it down logically', trait: 'analytical'}, {text: 'Brainstorm wild ideas', trait: 'creative'}, {text: 'Ask for opinions', trait: 'social'}, {text: 'Look for a system', trait: 'analytical'}] },
    { id: 'e2', text: 'In your free time, you prefer to...', options: [{text: 'Build or craft something', trait: 'physical'}, {text: 'Organize a plan', trait: 'business'}, {text: 'Help someone solve a problem', trait: 'social'}, {text: 'Explore new concepts', trait: 'creative'}] }
  ];

  // 1. Hook for Fetching
  useEffect(() => {
    const fetchQuestions = async () => {
      const timeout = setTimeout(() => {
        if (loading && questions.length === 0) {
          setQuestions(EMERGENCY_QUESTIONS);
          setLoading(false);
        }
      }, 3000);
      try {
        const qData = await getQuestions();
        clearTimeout(timeout);
        if (!qData || qData.length === 0) setQuestions(EMERGENCY_QUESTIONS);
        else setQuestions(qData);
      } catch (err) {
        setQuestions(EMERGENCY_QUESTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 2. Hook for Auto-completion (Must be before any early returns)
  useEffect(() => {
    if (!loading && questions.length > 0 && currentIndex >= questions.length && answers.length > 0) {
      const scores = answers.reduce((acc, curr) => {
        if (curr.trait && curr.trait !== 'legacy') acc[curr.trait] = (acc[curr.trait] || 0) + 1;
        return acc;
      }, {});
      onComplete({ answers, scores });
    }
  }, [currentIndex, questions, loading, answers, onComplete]);

  const handleBack = () => {
    if (currentIndex > 0) {
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex - 1);
      if (onProgressSave) onProgressSave({ answers: newAnswers, currentIndex: currentIndex - 1, step: 'questions' });
    }
  };

  const handleOptionClick = (option) => {
    const trait = typeof option === 'object' ? option.trait : 'legacy';
    const text = typeof option === 'object' ? option.text : option;
    const newAnswers = [...answers, { questionId: questions[currentIndex].id, text, trait }];
    setAnswers(newAnswers);
    if (onProgressSave) onProgressSave({ answers: newAnswers, currentIndex: currentIndex + 1, step: 'questions' });
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else {
      const scores = newAnswers.reduce((acc, curr) => {
        if (curr.trait !== 'legacy') acc[curr.trait] = (acc[curr.trait] || 0) + 1;
        return acc;
      }, {});
      onComplete({ answers: newAnswers, scores });
    }
  };

  // NOW we can have early returns
  if (loading) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p>Initializing assessment...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Phase Complete</h2>
        <p style={{ margin: '1rem 0', opacity: 0.7 }}>Analyzing your discovery path...</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="glass-card animate-up" key={currentIndex}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-outline" style={{ opacity: currentIndex === 0 ? 0.3 : 1 }} onClick={handleBack} disabled={currentIndex === 0}>← Back</button>
        <span className="badge" style={{ background: 'var(--accent)', color: '#000' }}>Step {currentIndex + 1} of {questions.length}</span>
      </div>
      <div className="progress-container" style={{ marginBottom: '2rem' }}><div className="progress-bar" style={{ width: `${progressPercent}%` }}></div></div>
      <h2 style={{ marginBottom: '2rem' }}>{currentQuestion.text}</h2>
      <div className="option-grid">
        {currentQuestion.options.map((option, idx) => (
          <button key={idx} className="option-btn" onClick={() => handleOptionClick(option)}>
            {typeof option === 'object' ? option.text : option} <span style={{ opacity: 0.5 }}>→</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', textAlign: 'center' }}>
        <button className="btn btn-outline" style={{ fontSize: '0.8rem', opacity: 0.6 }} onClick={() => window.location.href = '/'}>✕ Cancel</button>
      </div>
    </div>
  );
};

export default Questions;
