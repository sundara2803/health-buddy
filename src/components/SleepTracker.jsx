export default function SleepTracker({ data, update }) {
  const { sleep = 0, sleepGoal = 8, bedtime = '', wakeTime = '' } = data

  const calcHours = (bed, wake) => {
    if (!bed || !wake) return 0
    const [bh, bm] = bed.split(':').map(Number)
    const [wh, wm] = wake.split(':').map(Number)
    let mins = (wh * 60 + wm) - (bh * 60 + bm)
    if (mins < 0) mins += 1440
    return Math.round((mins / 60) * 10) / 10
  }

  const handleTime = (field, value) => {
    const bed  = field === 'bedtime'  ? value : bedtime
    const wake = field === 'wakeTime' ? value : wakeTime
    const hrs  = calcHours(bed, wake)
    update({ [field]: value, ...(hrs > 0 ? { sleep: hrs } : {}) })
  }

  const pct     = Math.min((sleep / Math.max(sleepGoal, 1)) * 100, 100)
  const quality = sleep >= sleepGoal ? 'Excellent' : sleep >= sleepGoal * 0.75 ? 'Good' : sleep > 0 ? 'Poor' : '—'
  const qualColor = sleep >= sleepGoal ? '#6c5ce7' : sleep >= sleepGoal * 0.75 ? '#fdcb6e' : '#fd79a8'

  return (
    <div className="tracker">
      <h2>😴 Sleep</h2>
      <div className="sleep-arc-wrap">
        <svg viewBox="0 0 200 130" className="sleep-svg">
          <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#eee" strokeWidth="14" strokeLinecap="round" />
          <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={qualColor} strokeWidth="14"
            strokeLinecap="round" strokeDasharray="251"
            strokeDashoffset={251 - (251 * pct) / 100}
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
          <text x="100" y="105" textAnchor="middle" fontSize="30" fontWeight="800" fill="#2d3436">{sleep}h</text>
          <text x="100" y="125" textAnchor="middle" fontSize="13" fill={qualColor} fontWeight="700">{quality}</text>
        </svg>
      </div>

      <div className="time-row">
        <div className="time-field">
          <label>🌙 Bedtime</label>
          <input type="time" value={bedtime} onChange={e => handleTime('bedtime', e.target.value)} />
        </div>
        <div className="time-field">
          <label>☀️ Wake up</label>
          <input type="time" value={wakeTime} onChange={e => handleTime('wakeTime', e.target.value)} />
        </div>
      </div>

      <div className="goal-row">
        <label>Goal</label>
        <input type="number" min="1" max="14" value={sleepGoal}
          onChange={e => update({ sleepGoal: Number(e.target.value) })} />
        <span>hours</span>
      </div>
      {sleep >= sleepGoal && <div className="achievement">🎉 Sleep goal reached!</div>}
    </div>
  )
}
