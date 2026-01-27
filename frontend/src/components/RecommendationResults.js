import React from 'react';
import ResourceCard from './ResourceCard';
import './RecommendationResults.css';

function RecommendationResults({ results }) {
  return (
    <div className="results-container">
      <div className="understanding">
        <h2>What we heard:</h2>
        <p>{results.understanding}</p>
      </div>

      <div className="recommendations">
        <h2>Recommended Resources</h2>
        <div className="resources-grid">
          {results.recommendations.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      {results.summary && (
        <div className="summary">
          <h3>A word of encouragement</h3>
          <p>{results.summary}</p>
        </div>
      )}
    </div>
  );
}

export default RecommendationResults;
