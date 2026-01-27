import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RecommendationForm from './components/RecommendationForm';
import RecommendationResults from './components/RecommendationResults';
import ExplorePage from './pages/ExplorePage';
import FavoritesPage from './pages/FavoritesPage';
import useFavorites from './hooks/useFavorites';

function HomePage({ onSubmit, loading, results, error }) {
  return (
    <>
      <RecommendationForm onSubmit={onSubmit} loading={loading} />

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Finding resources for you...</div>}

      {results && <RecommendationResults results={results} />}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const { favorites } = useFavorites();

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
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <Link to="/" className="logo-link">
              <h1>Grace Resources</h1>
            </Link>
            <p>Discover resources to support your faith journey</p>
          </div>
          <nav className="app-nav">
            <Link to="/" className="nav-link">Search</Link>
            <Link to="/explore" className="nav-link">Explore</Link>
            <Link to="/favorites" className="nav-link favorites-link">
              ❤️ Favorites {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage onSubmit={handleSubmit} loading={loading} results={results} error={error} />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>
            Grace Resources — Resources to help your faith grow deeper
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
