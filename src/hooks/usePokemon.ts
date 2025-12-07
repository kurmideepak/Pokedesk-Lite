import { useState, useEffect, useCallback } from 'react';
import {
  fetchAllPokemonNames,
  fetchPokemonDetails,
  fetchPokemonTypes,
  fetchPokemonsByType,
} from '../api/pokeApi';
import { Pokemon, NamedAPIResource } from '../api/types';

const POKEMON_PER_PAGE = 20;

export function usePokemon() {
  const [allPokemon, setAllPokemon] = useState<NamedAPIResource[]>([]);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); // Pokemon details for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [types, setTypes] = useState<NamedAPIResource[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 1. Fetch all types on initial load
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const typeData = await fetchPokemonTypes();
        setTypes(typeData);
      } catch (err) {
        console.error('Failed to load types', err);
        setError('Could not load Pokémon types.');
      }
    };
    loadTypes();
  }, []);

  // 2. Fetch the list of pokemon names based on the selected filter
  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      setError(null);
      setPage(1); // Reset page when filter changes
      try {
        let pokemonNames: NamedAPIResource[];
        if (selectedType) {
          pokemonNames = await fetchPokemonsByType(selectedType);
        } else {
          pokemonNames = await fetchAllPokemonNames();
        }
        setAllPokemon(pokemonNames);
        setTotalPages(Math.ceil(pokemonNames.length / POKEMON_PER_PAGE));
      } catch (err) {
        console.error(err);
        setError('Failed to load Pokémon list. Please try again.');
        setAllPokemon([]);
        setTotalPages(0);
      } finally {
        // Loading is stopped in the next effect
      }
    };

    fetchPokemonList();
  }, [selectedType]);

  // 3. Fetch details for the current page whenever the page or the list of names changes
  useEffect(() => {
    if (allPokemon.length === 0) {
        setPokemon([]);
        return;
    }

    const fetchPageDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * POKEMON_PER_PAGE;
        const pokemonForPage = allPokemon.slice(offset, offset + POKEMON_PER_PAGE);

        const detailPromises = pokemonForPage.map(p => fetchPokemonDetails(p.name));
        const pokemonDetails = await Promise.all(detailPromises);

        setPokemon(pokemonDetails);
      } catch (err) {
        console.error(err);
        setError('Failed to load Pokémon details. Please try again.');
        setPokemon([]);
      } finally {
        setLoading(false);
      }
    };

    if (allPokemon.length > 0) {
        fetchPageDetails();
    }

  }, [allPokemon, page]);

  const filterByType = (typeUrl: string | null) => {
    setSelectedType(typeUrl);
  };

  const retry = useCallback(() => {
    setError(null);
    setSelectedType(null); // This will trigger the useEffect chain to refetch everything
  }, []);

  return {
    pokemon,
    loading,
    error,
    page,
    totalPages,
    setPage, // Expose setPage directly for pagination component
    retry,
    types,
    selectedType,
    filterByType,
  };
}