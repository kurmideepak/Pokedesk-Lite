import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>{message}</p>
      <button onClick={onRetry} className={styles.retryButton}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorMessage;