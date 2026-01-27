import React, { useState } from 'react';
import './RecommendationForm.css';

function RecommendationForm({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recommendation-form">
      <div className="form-group">
        <label htmlFor="question">What's on your heart?</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Share what you're struggling with, seeking, or wondering about... For example: 'I'm struggling with doubt and want to grow deeper in my faith'"
          rows={4}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading || !question.trim()} className="submit-btn">
        {loading ? 'Finding resources...' : 'Get Recommendations'}
      </button>
    </form>
  );
}

export default RecommendationForm;
