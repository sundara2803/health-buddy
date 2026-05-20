export default function Pet({ score }) {
  const mood = score >= 80 ? 'happy' : score >= 45 ? 'okay' : 'sad'
  const label = mood === 'happy' ? '🌟 Feeling great!' : mood === 'okay' ? '😊 Doing okay' : '💙 Keep going!'

  return (
    <div className={`pet-container pet-${mood}`}>
      <div className="pet">
        <div className="pet-ear pet-ear-left" />
        <div className="pet-ear pet-ear-right" />
        <div className="pet-body">
          <div className="pet-face">
            <div className="pet-eyes">
              <div className="eye" />
              <div className="eye" />
            </div>
            {mood === 'happy' && <div className="pet-cheeks"><span /><span /></div>}
            <div className={`pet-mouth pet-mouth-${mood}`} />
          </div>
        </div>
        <div className="pet-tail" />
      </div>
      <div className="score-ring">
        <svg viewBox="0 0 80 80" width="80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#e0e0e0" strokeWidth="8" />
          <circle cx="40" cy="40" r="32" fill="none"
            stroke={score >= 80 ? '#00b894' : score >= 45 ? '#fdcb6e' : '#fd79a8'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray="201"
            strokeDashoffset={201 - (201 * score) / 100}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="800" fill="#2d3436">{score}%</text>
        </svg>
      </div>
      <p className="mood-label">{label}</p>
    </div>
  )
}
