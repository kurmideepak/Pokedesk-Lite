import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, disabled }: PaginationProps) => {
  return (
    <div className={styles.paginationContainer}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1 || disabled} className={styles.pageButton}>
        &laquo; Previous
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || disabled} className={styles.pageButton}>
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;