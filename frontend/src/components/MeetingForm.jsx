import styles from './MeetingForm.module.css'

export default function MeetingForm({
  title,
  transcript,
  audioFile,
  loading,
  transcribing,
  onTitleChange,
  onTranscriptChange,
  onAudioChange,
  onTranscribe,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !transcript.trim()) return
    onSubmit()
  }

  const charCount = transcript.length

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          <span className={styles.labelIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4h10M2 7h7M2 10h5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
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
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={loading || transcribing}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="audioFile">
          <span className={styles.labelIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2.2a2 2 0 0 1 2 2v2.7a2 2 0 1 1-4 0V4.2a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M3.8 6.8a3.2 3.2 0 0 0 6.4 0M7 10.4v1.4M5.2 12h3.6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Audio Upload
        </label>

        <div className={styles.uploadRow}>
          <label className={styles.fileInputWrap}>
            <input
              id="audioFile"
              type="file"
              accept=".mp3,.wav,.m4a,.webm,.ogg,.opus,audio/*"
              className={styles.fileInput}
              onChange={(e) => onAudioChange(e.target.files?.[0] || null)}
              disabled={loading || transcribing}
            />
            <span className={styles.fileBtn}>
              Choose Audio File
            </span>
          </label>

          <button
            type="button"
            className={styles.transcribeBtn}
            onClick={onTranscribe}
            disabled={!audioFile || loading || transcribing}
          >
            {transcribing ? (
              <>
                <span className={styles.btnSpinnerDark} />
                Transcribing...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M3 7.5h7M8 4.5l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Transcribe Audio
              </>
            )}
          </button>
        </div>

        <div className={styles.fileMeta}>
          <span className={styles.fileHint}>
            Supported: MP3, WAV, M4A, WEBM, OGG, OPUS — up to 25 MB
          </span>
          {audioFile && (
            <span className={styles.fileName}>
              Selected: {audioFile.name}
            </span>
          )}
        </div>
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
          placeholder="Paste the full meeting transcript here, or generate it from audio above..."
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          disabled={loading || transcribing}
          required
          rows={10}
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || transcribing || !title.trim() || !transcript.trim()}
      >
        {loading ? (
          <>
            <span className={styles.btnSpinner} />
            Summarizing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8h9M8 5l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="13" cy="8" r="1.5" fill="currentColor" />
            </svg>
            Generate Summary
          </>
        )}
      </button>
    </form>
  )
}