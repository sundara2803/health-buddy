import { useState } from 'react'

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function CaloriesTracker({ data, update }) {
  const { calories = 0, caloriesGoal = 2000, meals = [] } = data
  const [item, setItem] = useState('')
  const [kcal, setKcal] = useState('')
  const [meal, setMeal] = useState('Breakfast')

  const addEntry = () => {
    if (!item.trim() || !kcal) return
    const entry = { name: item.trim(), meal, kcal: Number(kcal), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    update({ meals: [...meals, entry], calories: calories + Number(kcal) })
    setItem(''); setKcal('')
  }

  const remove = (i) => {
    const removed = meals[i]
    update({ meals: meals.filter((_, idx) => idx !== i), calories: Math.max(0, calories - removed.kcal) })
  }

  const pct = Math.min((calories / Math.max(caloriesGoal, 1)) * 100, 100)
  const over = calories > caloriesGoal

  return (
    <div className="tracker">
      <h2>🍎 Calories</h2>
      <div className="cal-stat">
        <span className="cal-num" style={{ color: over ? '#e17055' : '#00b894' }}>{calories}</span>
        <span className="cal-sep">/</span>
        <span className="cal-goal">{caloriesGoal} kcal</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: over ? '#e17055' : '#00b894' }} />
      </div>
      {over && <p className="over-warn">⚠️ Over daily goal by {calories - caloriesGoal} kcal</p>}

      <div className="form-group">
        <input placeholder="Food item" value={item} onChange={e => setItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addEntry()} />
        <input placeholder="kcal" type="number" value={kcal} onChange={e => setKcal(e.target.value)}
          style={{ width: 80 }} onKeyDown={e => e.key === 'Enter' && addEntry()} />
        <select value={meal} onChange={e => setMeal(e.target.value)}>
          {MEALS.map(m => <option key={m}>{m}</option>)}
        </select>
        <button className="btn-pri" onClick={addEntry}>Add</button>
      </div>

      <ul className="log-list">
        {meals.map((m, i) => (
          <li key={i}>
            <span className="tag">{m.meal}</span>
            <span className="name">{m.name}</span>
            <span className="kcal">{m.kcal} kcal</span>
            <span className="time">{m.time}</span>
            <button className="rm-btn" onClick={() => remove(i)}>×</button>
          </li>
        ))}
      </ul>

      <div className="goal-row">
        <label>Goal</label>
        <input type="number" value={caloriesGoal} onChange={e => update({ caloriesGoal: Number(e.target.value) })} />
        <span>kcal</span>
      </div>
    </div>
  )
}
