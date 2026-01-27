import React from 'react';
import './ScriptureCard.css';

function ScriptureCard({ verse }) {
  return (
    <div className="scripture-card">
      <div className="scripture-reference">
        <h3>{verse.reference}</h3>
        <span className="translation">{verse.translation}</span>
      </div>
      <div className="scripture-text">
        <p>{verse.text}</p>
      </div>
    </div>
  );
}

export default ScriptureCard;
