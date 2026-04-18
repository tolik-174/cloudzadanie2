import { Link } from 'react-router-dom'
import styles from './MeetingCard.module.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function shortSummary(text, max = 120) {
  if (!text) return '—'
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

export default function MeetingCard({ meeting, index = 0 }) {
  const { id, title, summary, created_at } = meeting

  return (
    <Link
      to={`/meetings/${id}`}
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={styles.top}>
        <span className={styles.idPill}>#{id}</span>
        <time className={styles.date}>{formatDate(created_at)}</time>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.summary}>{shortSummary(summary)}</p>
      <div className={styles.footer}>
        <span className={styles.cta}>
          View details
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
