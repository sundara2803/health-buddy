import { useState } from 'react'

const QUICK = ['Walk outside 🌳', 'Cook healthy 🥗', 'Call a friend 📞', 'Dance 💃', 'Clean up 🧹', 'Creative time 🎨', 'Read a book 📖']

export default function ActivitiesTracker({ data, update }) {
  const { activities = [] } = data
  const [input, setInput] = useState('')

  const add = (name) => {
    if (!name.trim()) return
    update({ activities: [...activities, { name: name.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: false }] })
    setInput('')
  }

  const toggleDone = (i) => update({ activities: activities.map((a, idx) => idx === i ? { ...a, done: !a.done } : a) })
  const remove = (i) => update({ activities: activities.filter((_, idx) => idx !== i) })

  const done = activities.filter(a => a.done).length

  return (
    <div className="tracker">
      <h2>🎯 Activities</h2>

      <div className="form-group">
        <input
          placeholder="Add an activity…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add(input)}
        />
        <button className="btn-pri" onClick={() => add(input)}>Add</button>
      </div>

      <div className="quick-add">
        <p className="sub-text">Quick add:</p>
        <div className="chip-row">
          {QUICK.map(s => <button key={s} className="chip" onClick={() => add(s)}>{s}</button>)}
        </div>
      </div>

      {activities.length > 0 && (
        <p className="sub-text" style={{ marginBottom: 8 }}>{done}/{activities.length} completed</p>
      )}

      <ul className="activity-list">
        {activities.map((a, i) => (
          <li key={i} className={a.done ? 'done' : ''}>
            <button className="check-btn" onClick={() => toggleDone(i)}>{a.done ? '✅' : '⬜'}</button>
            <span className="act-name">{a.name}</span>
            <span className="time">{a.time}</span>
            <button className="rm-btn" onClick={() => remove(i)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
