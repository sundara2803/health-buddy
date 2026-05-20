import { useState } from 'react'
import Pet from './components/Pet.jsx'
import Nav from './components/Nav.jsx'
import WaterTracker from './components/WaterTracker.jsx'
import FitnessTracker from './components/FitnessTracker.jsx'
import CaloriesTracker from './components/CaloriesTracker.jsx'
import SleepTracker from './components/SleepTracker.jsx'
import SelfCareTracker from './components/SelfCareTracker.jsx'
import ActivitiesTracker from './components/ActivitiesTracker.jsx'
import { useDayData } from './hooks/useFirestore.js'

function calcScore(data) {
  if (!data) return 0
  let s = 0
  s += data.water >= data.waterGoal ? 20 : Math.round((data.water / Math.max(data.waterGoal, 1)) * 20)
  s += data.calories > 0 ? 15 : 0
  s += data.sleep >= data.sleepGoal ? 20 : Math.round((data.sleep / Math.max(data.sleepGoal, 1)) * 20)
  s += data.steps >= data.stepsGoal ? 20 : Math.round((data.steps / Math.max(data.stepsGoal, 1)) * 20)
  s += (data.selfCare?.length ?? 0) >= 2 ? 15 : 0
  s += (data.activities?.length ?? 0) > 0 ? 10 : 0
  return Math.min(s, 100)
}

export default function App() {
  const [tab, setTab] = useState('water')
  const { data, loading, update } = useDayData()

  if (loading) return <div className="loading"><div className="spinner" />Loading your buddy…</div>

  const score = calcScore(data)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Health Buddy</h1>
        <span className="date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </header>
      <Pet score={score} />
      <Nav tab={tab} setTab={setTab} />
      <main className="content">
        {tab === 'water'      && <WaterTracker      data={data} update={update} />}
        {tab === 'calories'   && <CaloriesTracker   data={data} update={update} />}
        {tab === 'sleep'      && <SleepTracker      data={data} update={update} />}
        {tab === 'fitness'    && <FitnessTracker    data={data} update={update} />}
        {tab === 'selfcare'   && <SelfCareTracker   data={data} update={update} />}
        {tab === 'activities' && <ActivitiesTracker data={data} update={update} />}
      </main>
    </div>
  )
}
