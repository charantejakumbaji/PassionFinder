import React, { useState, useEffect } from 'react';
import { saveTaskFeedback, getQuestions } from '../utils/storage';

const TaskFeedback = ({ taskId, userId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  // 4 rich, meaningful fallback reflection questions
  const EMERGENCY_FEEDBACK = [
    {
      id: 'f1',
      text: 'How did you feel while performing this task?',
      options: ['⚡ Energized & in the zone', '😐 Neutral, it was okay', '😴 Bored, it felt repetitive', '😕 Confused & frustrated']
    },
    {
      id: 'f2',
      text: 'How quickly did time seem to pass while doing it?',
      options: ['🚀 Very fast — I lost track of time', '⏳ Normal — it felt measured', '🐢 Slow — I kept checking the clock', '⏰ I had to force myself to finish']
    },
    {
      id: 'f3',
      text: 'Could you imagine doing this type of work professionally?',
      options: ['✅ Yes, I would love that', '🤔 Maybe as part of my work', '🔄 Only as a hobby, not full-time', '❌ No, not at all']
    },
    {
      id: 'f4',
      text: 'After completing the task, how do you feel right now?',
      options: ['💪 Proud & accomplished', '😌 Satisfied but not excited', '😐 Indifferent — it was just a task', '🧠 Mentally drained']
    },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      const timeout = setTimeout(() => {
        if (loading && questions.length === 0) {
          setQuestions(EMERGENCY_FEEDBACK);
          setLoading(false);
        }
      }, 3000);

      try {
        const data = await getQuestions('feedback');
        clearTimeout(timeout);
        if (!data || data.length === 0) {
          setQuestions(EMERGENCY_FEEDBACK);
        } else {
          setQuestions(data);
        }
      } catch (err) {
        setQuestions(EMERGENCY_FEEDBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (option) => {
    const question = questions[currentIndex];
    const newResponses = { ...responses, [question.text]: typeof option === 'object' ? option.text : option };
    setResponses(newResponses);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Show completion flash before navigating
      setSaving(true);
      setCompleted(true);
      try {
        if (userId && taskId) {
          await saveTaskFeedback(userId, taskId, newResponses);
        }
        // Brief pause to show completion animation
        await new Promise(r => setTimeout(r, 1400));
        onComplete(newResponses);
      } catch (err) {
        console.error(err);
        await new Promise(r => setTimeout(r, 1400));
        onComplete(newResponses);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center', padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
        <p>Loading reflection questions...</p>
      </div>
    );
  }

  // Completion Flash Screen
  if (completed) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'fadeInUp 0.5s ease-out' }}>🎉</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Reflection Complete!</h2>
        <p style={{ opacity: 0.7 }}>Processing your discovery results...</p>
        <div className="loading-spinner" style={{ margin: '1.5rem auto 0' }} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Reflection</h2>
        <p>Your session is complete. Ready to see results?</p>
        <button className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => onComplete({})}>
          See Results →
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPct = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="glass-card animate-up" key={currentIndex} style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button 
          className="btn btn-outline" 
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', opacity: currentIndex === 0 ? 0.3 : 1 }}
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          ← Back
        </button>
        <span className="badge" style={{ background: 'var(--secondary)', color: '#fff' }}>
          Stage 3 of 3: Reflection {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-container" style={{ marginBottom: '2rem' }}>
        <div className="progress-bar" style={{ width: `${progressPct}%`, background: 'var(--secondary)' }} />
      </div>

      {/* Motivational sub-label */}
      <div style={{ fontSize: '0.8rem', opacity: 0.45, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
        Post-Task Reflection · Be honest with yourself
      </div>
      
      <h2 style={{ marginBottom: '2rem', lineHeight: 1.4 }}>{currentQ.text}</h2>
      
      <div className="option-grid">
        {currentQ.options.map((option, idx) => (
          <button 
            key={idx} 
            className="option-btn"
            onClick={() => handleAnswer(option)}
            disabled={saving}
            style={{ textAlign: 'left', lineHeight: 1.5 }}
          >
            {typeof option === 'object' ? option.text : option}
            <span style={{ opacity: 0.4, flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFeedback;
