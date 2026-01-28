import React, { useState } from 'react';
import './ResourceCard.css';
import useFavorites from '../hooks/useFavorites';

function ResourceCard({ resource }) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book':
        return '📚';
      case 'scripture':
        return '✝️';
      case 'prayer':
        return '🙏';
      default:
        return '📖';
    }
  };

  const handleCoverLoad = () => {
    setCoverLoaded(true);
  };

  const handleCoverError = () => {
    setCoverError(true);
  };

  const handleFavoriteClick = () => {
    toggleFavorite(resource.id);
  };

  const isSaved = isFavorited(resource.id);

  return (
    <div className="resource-card">
      {/* Book Cover Image */}
      {resource.type === 'book' && resource.coverUrl && !coverError && (
        <div className="card-image">
          <img
            src={resource.coverUrl}
            alt={`${resource.title} cover`}
            onLoad={handleCoverLoad}
            onError={handleCoverError}
            className={coverLoaded ? 'loaded' : 'loading'}
          />
        </div>
      )}

      <div className="card-header">
        <div className="title-section">
          <span className="type-icon">{getTypeIcon(resource.type)}</span>
          <div>
            <h3>{resource.title}</h3>
            <p className="author">{resource.author}</p>
          </div>
        </div>
        <button 
          className={`favorite-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleFavoriteClick}
          title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="card-body">
        <p className="description">{resource.description}</p>

        {resource.reason && (
          <div className="reason">
            <strong>Why this helps:</strong> {resource.reason}
          </div>
        )}

        <div className="card-footer">
          <span className="type-badge">{resource.type}</span>
          <span className="difficulty-badge">{resource.difficulty}</span>
          {resource.duration && (
            <span className="duration-badge">⏱ {resource.duration}</span>
          )}
        </div>

        {resource.reference && (
          <div className="reference">
            <small>{resource.reference}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceCard;
