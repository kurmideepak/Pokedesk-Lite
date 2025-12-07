import { Pokemon } from '../../api/types';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onCardClick: (pokemon: Pokemon) => void;
}

const PokemonCard = ({ pokemon, isFavorite, onToggleFavorite, onCardClick }: PokemonCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking favorite
    onToggleFavorite(pokemon.id);
  };

  const primaryType = pokemon.types[0]?.type.name || 'normal';

  return (
    <div className={styles.card} onClick={() => onCardClick(pokemon)}>
      <button
        className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        &hearts;
      </button>
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        className={styles.pokemonImage}
        loading="lazy"
      />
      <h3 className={styles.pokemonName}>{pokemon.name}</h3>
      <div className={`${styles.typeBadge} ${styles[primaryType]}`}>
        {primaryType}
      </div>
    </div>
  );
};

export default PokemonCard;