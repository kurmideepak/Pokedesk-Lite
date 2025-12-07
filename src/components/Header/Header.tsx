import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <span className={styles.fire}>🔥</span>
          <span className={styles.lightning}>⚡</span>
        </div>
        <h1 className={styles.title}>Pokédex Lite</h1>
        <div className={styles.headerRight}>
          <span className={styles.water}>💧</span>
        </div>
      </div>
      <p className={styles.subtitle}>Explore & Discover Pokémon</p>
    </header>
  );
};

export default Header;