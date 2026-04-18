import { useState, useEffect } from 'react'
import MeetingCard from '../components/MeetingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllMeetings } from '../api/meetings'
import styles from './History.module.css'

export default function History() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllMeetings()
      .then(setMeetings)
      .catch(() => setError('Could not load meetings. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])
  const handleDelete = (id) => setMeetings(prev => prev.filter(m => m.id !== id))
  const filtered = meetings.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.summary || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Meeting History</h1>
            <p className={styles.pageSub}>
              {loading ? 'Loading...' : `${meetings.length} meeting${meetings.length !== 1 ? 's' : ''} recorded`}
            </p>
          </div>
          {!loading && meetings.length > 0 && (
            <div className={styles.searchWrap}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={styles.searchIcon}>
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search meetings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {loading && <LoadingSpinner text="Loading meetings..." />}

        {error && (
          <div className={styles.errorState}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <path d="M20 13v8M20 25v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && meetings.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 12h12M10 17h8M10 22h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No meetings yet</h3>
            <p className={styles.emptySub}>Submit your first meeting transcript on the Home page.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && meetings.length > 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptySub}>No meetings match "<strong>{search}</strong>"</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((m, i) => (
              <MeetingCard key={m.id} meeting={m} index={i} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
