import React, { useState, useEffect } from 'react';
import '../styles/FavoritesPage.css';
import ResourceCard from '../components/ResourceCard';
import useFavorites from '../hooks/useFavorites';

function FavoritesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    fetch('/resources/library.json')
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load resources:', err);
        setLoading(false);
      });
  }, []);

  const favoriteResources = resources.filter((r) =>
    favorites.includes(r.id)
  );

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ Your Favorites</h1>
        <p>Resources you've saved for later</p>
      </div>

      <div className="favorites-content">
        {favoriteResources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>No favorites yet</h2>
            <p>
              Start exploring resources and click the heart icon to save your
              favorites!
            </p>
            <a href="/explore" className="explore-button">
              Explore Resources
            </a>
          </div>
        ) : (
          <>
            <div className="favorites-stats">
              <div className="stat">
                <strong>{favoriteResources.length}</strong>
                <span>Saved Resource{favoriteResources.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="resources-grid">
              {favoriteResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
