import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Grace Resources</h1>
      <p>Find resources to help your faith journey</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What are you looking for? (e.g., 'I'm struggling with doubt')"
          rows="4"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Finding resources...' : 'Get Recommendations'}
        </button>
      </form>

      {resources.length > 0 && (
        <div className="resources">
          <h2>Recommended Resources</h2>
          {resources.map((resource, idx) => (
            <div key={idx} className="resource-card">
              <h3>{resource.title}</h3>
              <p><strong>{resource.author}</strong></p>
              <p>{resource.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
