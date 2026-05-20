const ITEMS = [
  { id: 'meditation', label: '🧘 Meditation' },
  { id: 'skincare',   label: '🧴 Skincare' },
  { id: 'vitamins',  label: '💊 Vitamins' },
  { id: 'journal',   label: '📓 Journaling' },
  { id: 'reading',   label: '📚 Reading' },
  { id: 'stretch',   label: '🤸 Stretching' },
  { id: 'bath',      label: '🛁 Bath/Shower' },
  { id: 'gratitude', label: '🙏 Gratitude' },
  { id: 'nap',       label: '😪 Power Nap' },
  { id: 'breathing', label: '🌬️ Breathing' },
]

export default function SelfCareTracker({ data, update }) {
  const { selfCare = [] } = data

  const toggle = (id) => {
    const next = selfCare.includes(id) ? selfCare.filter(x => x !== id) : [...selfCare, id]
    update({ selfCare: next })
  }

  return (
    <div className="tracker">
      <h2>🧘 Self Care</h2>
      <p className="sub-text">{selfCare.length} / {ITEMS.length} completed today</p>
      <div className="progress-track" style={{ marginBottom: 20 }}>
        <div className="progress-fill" style={{ width: `${(selfCare.length / ITEMS.length) * 100}%`, background: '#a29bfe' }} />
      </div>
      <div className="selfcare-grid">
        {ITEMS.map(item => (
          <button
            key={item.id}
            className={`sc-btn ${selfCare.includes(item.id) ? 'done' : ''}`}
            onClick={() => toggle(item.id)}
          >
            {item.label}
            {selfCare.includes(item.id) && <span className="check-mark">✓</span>}
          </button>
        ))}
      </div>
      {selfCare.length === ITEMS.length && <div className="achievement">🌟 Perfect self-care day!</div>}
    </div>
  )
}
