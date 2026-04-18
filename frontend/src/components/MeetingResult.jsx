import styles from './MeetingResult.module.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function ActionItems({ raw }) {
  const items = raw
    .split('\n')
    .map(l => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
  return (
    <ul className={styles.actionList}>
      {items.map((item, i) => (
        <li key={i} className={styles.actionItem}>
          <span className={styles.actionCheck}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function MeetingResult({ meeting }) {
  const { title, transcript, summary, action_items, created_at } = meeting

  return (
    <div className={styles.result}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.2" />
            <circle cx="6" cy="6" r="2.5" fill="currentColor" />
          </svg>
          Summary generated
        </div>
        <h2 className={styles.title}>{title}</h2>
        <time className={styles.date}>{formatDate(created_at)}</time>
      </div>

      <div className={styles.grid}>
        <Section
          icon={<SumIcon />}
          label="Summary"
          accent="purple"
        >
          <p className={styles.prose}>{summary}</p>
        </Section>

        <Section
          icon={<TaskIcon />}
          label="Action Items"
          accent="teal"
        >
          <ActionItems raw={action_items} />
        </Section>

        <Section
          icon={<TranscriptIcon />}
          label="Original Transcript"
          accent="dim"
          collapsible
        >
          <p className={styles.transcript}>{transcript}</p>
        </Section>
      </div>
    </div>
  )
}

function Section({ icon, label, accent, children, collapsible }) {
  return (
    <div className={`${styles.section} ${styles[`section_${accent}`]}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>{icon}</span>
        <span className={styles.sectionLabel}>{label}</span>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

const SumIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 3h11M2 6h8M2 9h9M2 12h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const TaskIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 7.5l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const TranscriptIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M3 2h7l3 3v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M5 7h5M5 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
