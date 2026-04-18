import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ text = 'Processing...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        <div className={styles.inner} />
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
