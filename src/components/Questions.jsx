import React, { useState, useEffect } from 'react';
import { getQuestions } from '../utils/storage';

const Questions = ({ onComplete, onProgressSave, resumeData }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(resumeData?.currentIndex || 0);
  const [answers, setAnswers] = useState(resumeData?.answers || []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qData = await getQuestions();
        setQuestions(qData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    const newAnswers = [...answers, { questionId: questions[currentIndex].id, option }];
    setAnswers(newAnswers);

    // Save progress after each answer
    if (onProgressSave) {
      onProgressSave({ 
        answers: newAnswers, 
        currentIndex: currentIndex + 1,
        step: 'questions' 
      });
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  if (loading) return <div className="glass-card">Loading Questions...</div>;
  if (!questions.length) return <div className="glass-card">No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="glass-card animate-up" key={currentIndex}>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>
      
      <span className="badge" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1rem', display: 'inline-block' }}>
        Question {currentIndex + 1} of {questions.length}
      </span>
      
      <h2 style={{ marginBottom: '2rem' }}>
        {currentQuestion.text}
      </h2>
      
      <div className="option-grid">
        {currentQuestion.options.map((option, idx) => (
          <button 
            key={idx} 
            className="option-btn"
            onClick={() => handleOptionClick(option)}
          >
            {option}
            <span style={{ opacity: 0.5 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Questions;
