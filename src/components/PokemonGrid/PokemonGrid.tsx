import { Pokemon } from '../../api/types';
import PokemonCard from '../PokemonCard/PokemonCard';
import styles from './PokemonGrid.module.css';

interface PokemonGridProps {
  pokemonList: Pokemon[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onCardClick: (pokemon: Pokemon) => void;
}

const PokemonGrid = ({ pokemonList, favorites, onToggleFavorite, onCardClick }: PokemonGridProps) => {
  if (pokemonList.length === 0) {
    return <p className={styles.noResults}>No Pokémon found matching your criteria.</p>;
  }

  return (
    <div className={styles.gridContainer}>
      {pokemonList.map((p, index) => (
        <div key={p.id} style={{ animationDelay: `${index * 0.08}s` }} className={styles.cardWrapper}>
          <PokemonCard
            pokemon={p}
            isFavorite={favorites.has(p.id)}
            onToggleFavorite={onToggleFavorite}
            onCardClick={onCardClick}
          />
        </div>
      ))}
    </div>
  );
};

export default PokemonGrid;