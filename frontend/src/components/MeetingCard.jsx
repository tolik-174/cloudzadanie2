import { Link } from 'react-router-dom'
import styles from './MeetingCard.module.css'
import { deleteMeeting } from '../api/meetings'


function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function shortSummary(text, max = 120) {
  if (!text) return '—'
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

export default function MeetingCard({ meeting, index = 0, onDelete }) {
  const { id, title, summary, created_at } = meeting
  const handleDelete = async (e) => {
    e.preventDefault() // щоб не відкривав деталі
    if (!confirm(`Delete "${meeting.title}"?`)) return
    try {
      await deleteMeeting(meeting.id)
      onDelete?.(meeting.id)
    } catch {
      alert('Failed to delete meeting.')
    }
  }
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
        <button className={styles.deleteBtn} onClick={handleDelete}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.5h6.6L11 4" 
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Delete
      </button>
    </Link>
  )
}
