import React, { useState } from 'react';

const TaskFeedback = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState({});

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(feedback);
    }
  };

  const currentTask = step === 1 ? 'Explanation Video' : step === 2 ? 'Simple Poster' : 'Logic Problem';

  return (
    <div className="glass-container feedback-view fade-in" key={step}>
      <h2 className="text-gradient">Feedback: {currentTask}</h2>
      <p>How did you feel about this micro-challenge?</p>

      <form className="feedback-form" onSubmit={handleNext}>
        <div className="rating-group">
          <label>Did you enjoy it? (1 - 5)</label>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={`enjoy-${num}`}
                type="button"
                className="rating-btn"
                onClick={(e) => {
                  e.target.parentElement.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                  e.target.classList.add('active');
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="rating-group">
          <label>Was it easy?</label>
          <div className="rating-buttons">
            {['Very Hard', 'Neutral', 'Very Easy'].map((opt, i) => (
              <button
                key={`easy-${i}`}
                type="button"
                className="rating-btn"
                onClick={(e) => {
                  e.target.parentElement.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                  e.target.classList.add('active');
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="rating-group">
          <label>Do you want to do it again?</label>
          <div className="rating-buttons">
            {['No', 'Maybe', 'Yes'].map((opt, i) => (
              <button
                key={`again-${i}`}
                type="button"
                className="rating-btn"
                onClick={(e) => {
                  e.target.parentElement.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                  e.target.classList.add('active');
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          {step < 3 ? 'Next Task' : 'See Results'}
        </button>
      </form>
    </div>
  );
};

export default TaskFeedback;
