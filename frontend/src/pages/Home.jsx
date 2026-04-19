import { useState } from 'react'
import MeetingForm from '../components/MeetingForm'
import MeetingResult from '../components/MeetingResult'
import { submitMeeting, transcribeMeetingAudio } from '../api/meetings'
import styles from './Home.module.css'

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/x-m4a',
  'audio/webm',
  'audio/ogg',
  'audio/opus',
]

const MAX_FILE_SIZE = 25 * 1024 * 1024

export default function Home() {
  const [title, setTitle] = useState('')
  const [transcript, setTranscript] = useState('')
  const [audioFile, setAudioFile] = useState(null)

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const meeting = await submitMeeting({
        title: title.trim(),
        transcript: transcript.trim(),
      })
      setResult(meeting)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleAudioChange = (file) => {
    setError(null)

    if (!file) {
      setAudioFile(null)
      return
    }

    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      setAudioFile(null)
      setError('Unsupported file type. Please use MP3, WAV, M4A, WEBM, OGG, or OPUS.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setAudioFile(null)
      setError('File is too large. Maximum allowed size is 25 MB.')
      return
    }

    setAudioFile(file)
  }

  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('Please choose an audio file first.')
      return
    }

    setTranscribing(true)
    setError(null)

    try {
      const data = await transcribeMeetingAudio(audioFile)
      setTranscript(data.text || '')
    } catch (err) {
      setError(err.response?.data?.detail || 'Audio transcription failed.')
    } finally {
      setTranscribing(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setTitle('')
    setTranscript('')
    setAudioFile(null)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {!result ? (
          <>
            <div className={styles.hero}>
              <div className={styles.heroBadge}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M6.5 1L8.2 4.5H12L9 6.8l1.1 3.7L6.5 8.5 3.4 10.5l1.1-3.7L1.5 4.5h3.8z"
                    fill="currentColor"
                  />
                </svg>
                AI-Powered Summarizer
              </div>
              <h1 className={styles.heroTitle}>
                Turn meetings into
                <br />
                <span className={styles.heroAccent}>clear decisions</span>
              </h1>
              <p className={styles.heroSub}>
                Upload an audio file or paste a transcript, then generate an instant summary with action items.
              </p>
            </div>

            <div className={styles.formCard}>
              {error && (
                <div className={styles.errorBanner}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <MeetingForm
                title={title}
                transcript={transcript}
                audioFile={audioFile}
                loading={loading}
                transcribing={transcribing}
                onTitleChange={setTitle}
                onTranscriptChange={setTranscript}
                onAudioChange={handleAudioChange}
                onTranscribe={handleTranscribe}
                onSubmit={handleSubmit}
              />
            </div>
          </>
        ) : (
          <div className={styles.resultWrap}>
            <button className={styles.backBtn} onClick={handleReset}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              New meeting
            </button>
            <MeetingResult meeting={result} />
          </div>
        )}
      </div>
    </main>
  )
}