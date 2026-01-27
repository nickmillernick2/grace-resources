import React, { useState, useEffect } from 'react';
import '../styles/ExplorePage.css';
import ResourceCard from '../components/ResourceCard';

function ExplorePage() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load resource library
    fetch('/resources/library.json')
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((r) => r.category))];
        setCategories(uniqueCategories.sort());
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load resources:', err);
        setLoading(false);
      });
  }, []);

  const filteredResources = selectedCategory
    ? resources.filter((r) => r.category === selectedCategory)
    : resources;

  const formatCategoryName = (cat) => {
    return cat
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="explore-page">
        <div className="explore-header">
          <h1>Loading resources...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>📚 Explore Resources</h1>
        <p>Browse our library of spiritual resources by category</p>
      </div>

      <div className="explore-content">
        <div className="category-sidebar">
          <h3>Categories</h3>
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Resources ({resources.length})
          </button>
          {categories.map((cat) => {
            const count = resources.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {formatCategoryName(cat)} ({count})
              </button>
            );
          })}
        </div>

        <div className="resources-view">
          <div className="view-header">
            <h2>
              {selectedCategory
                ? formatCategoryName(selectedCategory)
                : 'All Resources'}
            </h2>
            <span className="resource-count">
              {filteredResources.length} resource
              {filteredResources.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="resources-grid">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
