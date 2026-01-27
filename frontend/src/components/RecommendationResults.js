import React from 'react';
import ResourceCard from './ResourceCard';
import ScriptureCard from './ScriptureCard';
import './RecommendationResults.css';

function RecommendationResults({ results }) {
  return (
    <div className="results-container">
      <div className="understanding">
        <h2>What we heard:</h2>
        <p>{results.understanding}</p>
      </div>

      {/* Scripture Section - Displayed First */}
      {results.scripture && results.scripture.length > 0 && (
        <div className="scripture-section">
          <h2>📖 Scripture</h2>
          <div className="scripture-verses">
            {results.scripture.map((verse, index) => (
              <ScriptureCard key={index} verse={verse} />
            ))}
          </div>
        </div>
      )}

      {/* Resources Section */}
      <div className="recommendations">
        <h2>📚 Resources</h2>
        <div className="resources-grid">
          {results.recommendations.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      {results.summary && (
        <div className="summary">
          <h3>💖 A word of encouragement</h3>
          <p>{results.summary}</p>
        </div>
      )}
    </div>
  );
}

export default RecommendationResults;
