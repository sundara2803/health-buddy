export default function WaterTracker({ data, update }) {
  const { water = 0, waterGoal = 8 } = data
  const pct = Math.min((water / Math.max(waterGoal, 1)) * 100, 100)

  return (
    <div className="tracker">
      <h2>💧 Water Intake</h2>
      <div className="water-wrap">
        <div className="water-glass">
          <div className="water-fill" style={{ height: `${pct}%` }} />
          <span className="glass-label">{water}/{waterGoal}</span>
        </div>
        <div className="water-drops">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <button
              key={i}
              className={`drop ${i < water ? 'filled' : ''}`}
              onClick={() => update({ water: i < water ? i : i + 1 })}
            >💧</button>
          ))}
        </div>
      </div>
      <div className="btn-row">
        <button className="btn-sec" onClick={() => update({ water: Math.max(0, water - 1) })}>− Glass</button>
        <button className="btn-pri" onClick={() => update({ water: water + 1 })}>+ Glass</button>
      </div>
      <div className="goal-row">
        <label>Daily goal</label>
        <input type="number" min="1" max="20" value={waterGoal}
          onChange={e => update({ waterGoal: Number(e.target.value) })} />
        <span>glasses</span>
      </div>
      {water >= waterGoal && <div className="achievement">🎉 Hydration goal reached!</div>}
    </div>
  )
}
