import React from 'react';
import './ResourceCard.css';

function ResourceCard({ resource }) {
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

  return (
    <div className="resource-card">
      <div className="card-header">
        <div className="title-section">
          <span className="type-icon">{getTypeIcon(resource.type)}</span>
          <div>
            <h3>{resource.title}</h3>
            <p className="author">{resource.author}</p>
          </div>
        </div>
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
