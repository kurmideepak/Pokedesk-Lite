import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header/Header';
import PokemonGrid from './components/PokemonGrid/PokemonGrid';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import Pagination from './components/Pagination/Pagination';
import SearchBar from './components/SearchBar/SearchBar';
import TypeFilter from './components/TypeFilter/TypeFilter';
import PokemonDetailModal from './components/PokemonDetailModal/PokemonDetailModal';
import { usePokemon } from './hooks/usePokemon';
import { useFavorites } from './hooks/useFavorites';
import { useDebounce } from './hooks/useDebounce';
import { fetchPokemonDetails } from './api/pokeApi';
import { Pokemon } from './api/types';

function App() {
  const {
    pokemon, // This now holds the detailed pokemon for the current page
    loading, // True when fetching page details or initial list
    error,
    page,
    totalPages,
    setPage,
    retry,
    types,
    filterByType,
    selectedType,
  } = usePokemon();

  const { favorites, toggleFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesPokemon, setFavoritesPokemon] = useState<Pokemon[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (showFavoritesOnly && favorites.size > 0) {
      setLoadingFavorites(true);
      const fetchFavorites = async () => {
        try {
          const favoriteIds = Array.from(favorites);
          const pokemonDetails = await Promise.all(
            favoriteIds.map(id => fetchPokemonDetails(String(id)))
          );
          setFavoritesPokemon(pokemonDetails.sort((a, b) => a.id - b.id));
        } catch (err) {
          console.error('Failed to load favorite Pokemon:', err);
        } finally {
          setLoadingFavorites(false);
        }
      };
      fetchFavorites();
    } else {
      setFavoritesPokemon([]);
    }
  }, [showFavoritesOnly, favorites]);

  // Client-side search on the currently displayed page of pokemon
  const filteredPokemon = useMemo(() => {
    const result = showFavoritesOnly ? favoritesPokemon : pokemon;

    if (!debouncedSearchTerm) {
      return result;
    }
    return result.filter(p =>
      p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [pokemon, favoritesPokemon, debouncedSearchTerm, showFavoritesOnly]);

  const handleCardClick = (pokemonData: Pokemon) => {
    setSelectedPokemon(pokemonData);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  const handleTypeSelect = (typeUrl: string | null) => {
    setSearchTerm(''); // Reset search on type change
    setShowFavoritesOnly(false); // Exit favorites mode when selecting a type
    filterByType(typeUrl);
  };

  const handleToggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    setSearchTerm(''); // Reset search on favorites toggle
    if (!showFavoritesOnly) {
      filterByType(null); // Reset type filter to show all favorites
    }
  };

  return (
    <>
      <Header />
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <TypeFilter 
        types={types} 
        selectedType={selectedType} 
        onTypeSelect={handleTypeSelect}
        favoriteCount={favorites.size}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={handleToggleFavorites}
      />
      <div className="scrollableContent"
        style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <main style={{ padding: '1rem 1rem 0 1rem', minHeight: '100%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {(loading || loadingFavorites) && <Loader />}
            {error && <ErrorMessage message={error} onRetry={retry} />}
            {!loading && !loadingFavorites && !error && (
              <>
                {showFavoritesOnly && favorites.size === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>No favorites yet!</p>
                    <p>Mark your favorite Pokémon by clicking the ❤️ button on their cards.</p>
                  </div>
                ) : (
                  <PokemonGrid
                    pokemonList={filteredPokemon}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onCardClick={handleCardClick}
                  />
                )}
              </>
            )}

            {totalPages > 1 && !loading && !loadingFavorites && !error && !showFavoritesOnly && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                disabled={loading}
              />
            )}
          </div>
        </main>
      </div>
      {selectedPokemon && (
        <PokemonDetailModal pokemon={selectedPokemon} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default App;