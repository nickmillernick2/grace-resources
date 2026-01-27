import React, { useState } from 'react';
import './App.css';
import RecommendationForm from './components/RecommendationForm';
import RecommendationResults from './components/RecommendationResults';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (question) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/recommend`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Grace Resources</h1>
        <p>Discover resources to support your faith journey</p>
      </header>

      <main className="app-main">
        <RecommendationForm onSubmit={handleSubmit} loading={loading} />

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Finding resources for you...</div>}

        {results && <RecommendationResults results={results} />}
      </main>

      <footer className="app-footer">
        <p>
          Grace Resources — Resources to help your faith grow deeper
        </p>
      </footer>
    </div>
  );
}

export default App;
