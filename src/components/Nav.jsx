const TABS = [
  { id: 'water',      icon: '💧', label: 'Water' },
  { id: 'calories',   icon: '🍎', label: 'Calories' },
  { id: 'sleep',      icon: '😴', label: 'Sleep' },
  { id: 'fitness',    icon: '🏃', label: 'Fitness' },
  { id: 'selfcare',   icon: '🧘', label: 'Self Care' },
  { id: 'activities', icon: '🎯', label: 'Activities' },
]

export default function Nav({ tab, setTab }) {
  return (
    <nav className="nav">
      {TABS.map(t => (
        <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
