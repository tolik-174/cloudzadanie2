import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MeetingResult from '../components/MeetingResult'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMeetingById } from '../api/meetings'
import styles from './MeetingDetails.module.css'

export default function MeetingDetails() {
  const { id } = useParams()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMeetingById(id)
      .then(setMeeting)
      .catch(() => setError('Meeting not found or backend is unavailable.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/history" className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to History
          </Link>
          {meeting && (
            <span className={styles.meetingId}>Meeting #{id}</span>
          )}
        </div>

        {loading && <LoadingSpinner text="Fetching meeting..." />}

        {error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                <path d="M14 9v6M14 18v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.errorTitle}>Oops</h3>
            <p className={styles.errorMsg}>{error}</p>
            <Link to="/history" className={styles.errorLink}>← Back to History</Link>
          </div>
        )}

        {!loading && !error && meeting && (
          <div className={styles.content}>
            <MeetingResult meeting={meeting} />
          </div>
        )}
      </div>
    </main>
  )
}
