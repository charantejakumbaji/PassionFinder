import React, { useState, useEffect } from 'react';
import { saveTaskFeedback, getQuestions } from '../utils/storage';

const TaskFeedback = ({ taskId, userId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const EMERGENCY_FEEDBACK = [
    { id: 'f1', text: 'How did you feel while performing this task?', options: ['Energized', 'Bored', 'Challenged', 'Confused'] },
    { id: 'f2', text: 'Could you imagine doing this every day?', options: ['Yes, definitely', 'Maybe as a hobby', 'Not really', 'Absolutely not'] }
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
      setSaving(true);
      try {
        if (userId && taskId) {
          await saveTaskFeedback(userId, taskId, newResponses);
        }
        onComplete(newResponses);
      } catch (err) {
        console.error(err);
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

  if (loading) return <div className="glass-card animate-up">Loading Feedback Questions...</div>;
  
  // Fallback if no feedback questions exist
  if (questions.length === 0) {
    return (
      <div className="glass-card animate-up" style={{ textAlign: 'center' }}>
        <h2>Reflection</h2>
        <p>Your session is complete. Ready to see results?</p>
        <button className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => onComplete({})}>
          See Results →
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="glass-card animate-up" key={currentIndex} style={{ maxWidth: '600px', margin: '0 auto' }}>
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
          Reflection {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="progress-container" style={{ marginBottom: '2rem' }}>
        <div className="progress-bar" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'var(--secondary)' }}></div>
      </div>
      
      <h2 style={{ marginBottom: '2rem' }}>{currentQ.text}</h2>
      
      <div className="option-grid">
        {currentQ.options.map((option, idx) => (
          <button 
            key={idx} 
            className="option-btn"
            onClick={() => handleAnswer(option)}
            disabled={saving}
          >
            {typeof option === 'object' ? option.text : option}
            <span style={{ opacity: 0.5 }}>→</span>
          </button>
        ))}
      </div>
      
      {saving && <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.6 }}>Saving reflection...</p>}
    </div>
  );
};

const styles = {
  label: { fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-muted)' }
};

export default TaskFeedback;
