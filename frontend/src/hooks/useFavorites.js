import { useState, useEffect } from 'react';

function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('graceResourcesFavorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('graceResourcesFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (resourceId) => {
    setFavorites((prev) => {
      if (prev.includes(resourceId)) {
        return prev;
      }
      return [...prev, resourceId];
    });
  };

  const removeFavorite = (resourceId) => {
    setFavorites((prev) => prev.filter((id) => id !== resourceId));
  };

  const toggleFavorite = (resourceId) => {
    if (favorites.includes(resourceId)) {
      removeFavorite(resourceId);
    } else {
      addFavorite(resourceId);
    }
  };

  const isFavorited = (resourceId) => {
    return favorites.includes(resourceId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
  };
}

export default useFavorites;
