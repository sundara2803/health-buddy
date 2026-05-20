import { useState } from 'react'

const TYPES = ['Running', 'Walking', 'Cycling', 'Swimming', 'Yoga', 'Weights', 'HIIT', 'Other']

export default function FitnessTracker({ data, update }) {
  const { steps = 0, stepsGoal = 10000, fitness = {} } = data
  const { workouts = [] } = fitness
  const [wType, setWType] = useState('Running')
  const [wDur, setWDur] = useState('')

  const addWorkout = () => {
    if (!wDur) return
    const entry = { type: wType, duration: Number(wDur), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    const next = [...workouts, entry]
    update({ fitness: { ...fitness, workouts: next, duration: next.reduce((s, w) => s + w.duration, 0) } })
    setWDur('')
  }

  const removeWorkout = (i) => {
    const next = workouts.filter((_, idx) => idx !== i)
    update({ fitness: { ...fitness, workouts: next, duration: next.reduce((s, w) => s + w.duration, 0) } })
  }

  const stepsPct = Math.min((steps / Math.max(stepsGoal, 1)) * 100, 100)
  const totalMin = workouts.reduce((s, w) => s + w.duration, 0)

  return (
    <div className="tracker">
      <h2>🏃 Fitness</h2>

      <div className="steps-card">
        <div className="steps-info">
          <div className="steps-num">{steps.toLocaleString()}</div>
          <div className="steps-lbl">steps today</div>
          <div className="steps-pct">{Math.round(stepsPct)}% of goal</div>
        </div>
        <svg viewBox="0 0 80 80" width="80" className="steps-ring">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#eee" strokeWidth="8" />
          <circle cx="40" cy="40" r="30" fill="none" stroke="#00b894" strokeWidth="8"
            strokeLinecap="round" strokeDasharray="188.5"
            strokeDashoffset={188.5 - (188.5 * stepsPct) / 100}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
      </div>

      <div className="btn-row">
        <button className="btn-sec" onClick={() => update({ steps: Math.max(0, steps - 500) })}>−500</button>
        <button className="btn-sec" onClick={() => update({ steps: Math.max(0, steps - 1000) })}>−1k</button>
        <button className="btn-pri" onClick={() => update({ steps: steps + 1000 })}>+1k steps</button>
        <button className="btn-sec" onClick={() => update({ steps: steps + 500 })}>+500</button>
      </div>

      <div className="goal-row">
        <label>Steps goal</label>
        <input type="number" value={stepsGoal} onChange={e => update({ stepsGoal: Number(e.target.value) })} />
      </div>

      <h3>Workouts {totalMin > 0 && <span className="badge">{totalMin} min total</span>}</h3>
      <div className="form-group">
        <select value={wType} onChange={e => setWType(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <input placeholder="min" type="number" min="1" value={wDur}
          onChange={e => setWDur(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addWorkout()}
          style={{ width: 70 }} />
        <button className="btn-pri" onClick={addWorkout}>Log</button>
      </div>
      <ul className="log-list">
        {workouts.map((w, i) => (
          <li key={i}>
            <span className="tag">{w.type}</span>
            <span className="name">{w.duration} min</span>
            <span className="time">{w.time}</span>
            <button className="rm-btn" onClick={() => removeWorkout(i)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
