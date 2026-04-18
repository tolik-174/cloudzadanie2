import { useState } from 'react'
import styles from './MeetingForm.module.css'

export default function MeetingForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('')
  const [transcript, setTranscript] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !transcript.trim()) return
    onSubmit({ title: title.trim(), transcript: transcript.trim() })
  }

  const charCount = transcript.length

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          <span className={styles.labelIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M2 7h7M2 10h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          Meeting Title
        </label>
        <input
          id="title"
          type="text"
          className={styles.input}
          placeholder="e.g. Sprint Planning Q2, Product Sync..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="transcript">
          <span className={styles.labelIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          Meeting Transcript
          <span className={styles.charCount}>{charCount.toLocaleString()} chars</span>
        </label>
        <textarea
          id="transcript"
          className={styles.textarea}
          placeholder="Paste the full meeting transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={loading}
          required
          rows={10}
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !title.trim() || !transcript.trim()}
      >
        {loading ? (
          <>
            <span className={styles.btnSpinner} />
            Summarizing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h9M8 5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="13" cy="8" r="1.5" fill="currentColor" />
            </svg>
            Generate Summary
          </>
        )}
      </button>
    </form>
  )
}
