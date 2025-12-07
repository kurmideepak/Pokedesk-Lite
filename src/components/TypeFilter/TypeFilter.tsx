import { NamedAPIResource } from '../../api/types';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  types: NamedAPIResource[];
  selectedType: string | null;
  onTypeSelect: (typeUrl: string | null) => void;
  favoriteCount: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

const TypeFilter = ({ 
  types, 
  selectedType, 
  onTypeSelect,
  favoriteCount,
  showFavoritesOnly,
  onToggleFavorites
}: TypeFilterProps) => {
  return (
    <div className={styles.filterContainer}>
      <button
        onClick={() => onTypeSelect(null)}
        className={`${styles.typeChip} ${!selectedType ? styles.active : ''}`}>
          All
      </button>
      {types.map(type => (
        <button
          key={type.name}
          onClick={() => onTypeSelect(type.url)}
          className={`${styles.typeChip} ${selectedType === type.url ? styles.active : ''}`}>
          {type.name}
        </button>
      ))}
      <div className={styles.separator}></div>
      <button
        onClick={onToggleFavorites}
        className={`${styles.favoritesButton} ${showFavoritesOnly ? styles.active : ''}`}
        title={favoriteCount === 0 ? 'No favorites yet' : `${favoriteCount} favorite(s)`}>
        ❤️ Favorites {favoriteCount > 0 && `(${favoriteCount})`}
      </button>
    </div>
  );
};

export default TypeFilter;