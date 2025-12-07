import { useEffect } from 'react';
import { Pokemon } from '../../api/types';
import styles from './PokemonDetailModal.module.css';

interface PokemonDetailModalProps {
  pokemon: Pokemon | null;
  onClose: () => void;
}

const PokemonDetailModal = ({ pokemon, onClose }: PokemonDetailModalProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name || 'normal';

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={`${styles.modal} ${styles[primaryType]}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.pokemonName}>{pokemon.name}</h2>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className={styles.pokemonImage}
        />
        <div className={styles.detailsContent}>
          <div className={styles.section}>
            <h3>Types</h3>
            <div className={styles.badgeContainer}>
              {pokemon.types.map(t => <span key={t.type.name} className={`${styles.badge} ${styles[t.type.name]}`}>{t.type.name}</span>)}
            </div>
          </div>
          <div className={styles.section}>
            <h3>Abilities</h3>
            <div className={styles.badgeContainer}>
              {pokemon.abilities.map(a => <span key={a.ability.name} className={`${styles.badge} ${styles.ability}`}>{a.ability.name}</span>)}
            </div>
          </div>
          <div className={styles.section}>
            <h3>Base Stats</h3>
            <ul className={styles.statsList}>
              {pokemon.stats.map(s => (
                <li key={s.stat.name}>
                  <span>{s.stat.name.replace('-', ' ')}</span>
                  <div className={styles.statBar}>
                    <div className={styles.statValue} style={{ width: `${(s.base_stat / 255) * 100}%` }}></div>
                  </div>
                  <span>{s.base_stat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailModal;