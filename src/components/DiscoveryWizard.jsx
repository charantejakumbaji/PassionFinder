import React, { useState, useEffect } from 'react';
import { QUESTIONS, TASKS_DATA, TRAITS } from '../data/discoveryData';

const DiscoveryWizard = ({ onComplete, onProgressUpdate, resumeData }) => {
  // Initialize state from resumeData or defaults
  const [step, setStep] = useState(resumeData?.step || 1);
  const [qIndex, setQIndex] = useState(resumeData?.qIndex || 0);
  const [scores, setScores] = useState(resumeData?.scores || {
    creative: 0, analytical: 0, social: 0, business: 0, physical: 0, leadership: 0
  });
  const [topTrait, setTopTrait] = useState(resumeData?.topTrait || null);
  const [secondTrait, setSecondTrait] = useState(resumeData?.secondTrait || null);
  const [reflection1, setReflection1] = useState(resumeData?.reflection1 || { enjoyed: false, easy: false, energy: false });
  const [useDeepTask, setUseDeepTask] = useState(resumeData?.useDeepTask ?? true);
  const [comparison, setComparison] = useState(resumeData?.comparison || null);
  const [timer, setTimer] = useState(0);
  const [taskStarted, setTaskStarted] = useState(false);

  // Autosave progress whenever key states change
  useEffect(() => {
    if (step < 6) { // Don't save if on results screen
      onProgressUpdate({
        step, qIndex, scores, topTrait, secondTrait, reflection1, useDeepTask, comparison
      });
    }
  }, [step, qIndex, scores, topTrait, secondTrait, reflection1, useDeepTask, comparison]);

  useEffect(() => {
    let interval;
    if (taskStarted && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setTaskStarted(false);
    }
    return () => clearInterval(interval);
  }, [taskStarted, timer]);

  const handleAnswer = (trait) => {
    setScores(prev => ({ ...prev, [trait]: prev[trait] + 2 }));
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const sorted = Object.entries({...scores, [trait]: scores[trait] + 2})
        .sort((a, b) => b[1] - a[1]);
      setTopTrait(sorted[0][0]);
      setSecondTrait(sorted[1][0]);
      setStep(2);
      startTask(TASKS_DATA[sorted[0][0]].task1.duration);
    }
  };

  const startTask = (duration) => {
    setTimer(duration);
    setTaskStarted(true);
  };

  const handleReflection = (field) => {
    setReflection1(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const submitReflection = () => {
    const isStrong = reflection1.enjoyed && reflection1.energy;
    setUseDeepTask(isStrong);
    setStep(4);
    const duration = isStrong 
      ? TASKS_DATA[topTrait].task2Deep.duration 
      : TASKS_DATA[topTrait].task2Switch.duration;
    startTask(duration);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        const currentQ = QUESTIONS[qIndex];
        return (
          <div className="animate-up">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 33}%` }}></div>
            </div>
            <h2>{currentQ.text}</h2>
            <div className="option-grid">
              {currentQ.options.map((opt, i) => (
                <button key={i} className="option-btn" onClick={() => handleAnswer(opt.trait)}>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        const t1 = TASKS_DATA[topTrait].task1;
        return (
          <div className="animate-up">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '45%' }}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span className="badge" style={{ background: TRAITS[topTrait.toUpperCase()].color }}>{TRAITS[topTrait.toUpperCase()].label} Focus</span>
              <h2 style={{ marginTop: '1rem' }}>{t1.title}</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t1.instruction}</p>
              
              {!taskStarted && timer === 0 ? (
                <button className="btn btn-primary btn-large" onClick={() => setStep(3)}>I'm Done</button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div className="timer-container">
                    <div className="timer-circle">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</div>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: '0.9rem' }} onClick={() => { setTimer(0); setTaskStarted(false); }}>
                    I have completed the task early
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-up">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '60%' }}></div>
            </div>
            <h2>How did it feel?</h2>
            <p>Your honest reflection helps us guide you better.</p>
            <div className="option-grid">
              <button 
                className={`option-btn ${reflection1.enjoyed ? 'active' : ''}`} 
                onClick={() => handleReflection('enjoyed')}
              >
                I enjoyed doing this
                <span>{reflection1.enjoyed ? '✅' : '+'}</span>
              </button>
              <button 
                className={`option-btn ${reflection1.easy ? 'active' : ''}`} 
                onClick={() => handleReflection('easy')}
              >
                It felt easy or natural
                <span>{reflection1.easy ? '✅' : '+'}</span>
              </button>
              <button 
                className={`option-btn ${reflection1.energy ? 'active' : ''}`} 
                onClick={() => handleReflection('energy')}
              >
                It gave me energy
                <span>{reflection1.energy ? '✅' : '+'}</span>
              </button>
            </div>
            <button className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '2rem' }} onClick={submitReflection}>
              Continue
            </button>
          </div>
        );

      case 4:
        const t2 = useDeepTask ? TASKS_DATA[topTrait].task2Deep : TASKS_DATA[topTrait].task2Switch;
        return (
          <div className="animate-up">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '75%' }}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2>{useDeepTask ? "Going Deeper" : "Trying a Different Angle"}</h2>
              <h3>{t2.title}</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t2.instruction}</p>
              
              {!taskStarted && timer === 0 ? (
                <button className="btn btn-primary btn-large" onClick={() => setStep(5)}>Completed</button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div className="timer-container">
                    <div className="timer-circle">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</div>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: '0.9rem' }} onClick={() => { setTimer(0); setTaskStarted(false); }}>
                    I have completed the task early
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-up">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '90%' }}></div>
            </div>
            <h2>The Comparison</h2>
            <p>Between Task 1 ({TASKS_DATA[topTrait].task1.title}) and Task 2 ({useDeepTask ? TASKS_DATA[topTrait].task2Deep.title : TASKS_DATA[topTrait].task2Switch.title}), which felt more natural?</p>
            <div className="option-grid">
              <button className="option-btn" onClick={() => { setComparison('task1'); setStep(6); }}>
                Task 1 was better
              </button>
              <button className="option-btn" onClick={() => { setComparison('task2'); setStep(6); }}>
                Task 2 was better
              </button>
            </div>
          </div>
        );

      case 6:
        const finalResults = {
          date: new Date().toLocaleDateString(),
          topTrait,
          secondTrait,
          reflection1,
          useDeepTask,
          comparison,
          scores
        };
        return (
          <div className="animate-up" style={{ textAlign: 'center' }}>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '100%' }}></div>
            </div>
            <h2>Discovery Complete!</h2>
            <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: TRAITS[topTrait.toUpperCase()].color, fontWeight: 'bold' }}>
                  {TRAITS[topTrait.toUpperCase()].label}
                </div>
                <h3>is your strongest area today.</h3>
              </div>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Why?</strong> {reflection1.enjoyed ? "You enjoyed the action," : "Even if it was challenging,"} {reflection1.energy ? "it energized you," : "you showed focus,"} and you felt {comparison === 'task1' ? "immediately comfortable" : "better as you went deeper"}.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Potential: {TRAITS[secondTrait.toUpperCase()].label}</h4>
                <p>You also showed interest in {TRAITS[secondTrait.toUpperCase()].label} tasks.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => onComplete({...finalResults, loopType: 'same'})}>
                Go to Journey
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onComplete({...finalResults, loopType: 'new'})}>
                Restart Loop
              </button>
            </div>
          </div>
        );

      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {renderStep()}
    </div>
  );
};

export default DiscoveryWizard;
