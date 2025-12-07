import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'pokedex_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Error writing favorites to localStorage', error);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((pokemonId: number) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(pokemonId)) {
        newFavorites.delete(pokemonId);
      } else {
        newFavorites.add(pokemonId);
      }
      return newFavorites;
    });
  }, []);

  return { favorites, toggleFavorite };
}