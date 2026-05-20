import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const TODAY = new Date().toISOString().split('T')[0]

const DEFAULTS = {
  water: 0, waterGoal: 8,
  calories: 0, caloriesGoal: 2000, meals: [],
  sleep: 0, sleepGoal: 8, bedtime: '', wakeTime: '',
  steps: 0, stepsGoal: 10000,
  fitness: { duration: 0, type: '', workouts: [] },
  selfCare: [],
  activities: [],
}

export function useDayData(userId = 'default') {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const docRef = doc(db, 'users', userId, 'days', TODAY)

  useEffect(() => {
    return onSnapshot(docRef, (snap) => {
      setData(snap.exists() ? { ...DEFAULTS, ...snap.data() } : DEFAULTS)
      setLoading(false)
    })
  }, [userId])

  const update = (patch) => setDoc(docRef, patch, { merge: true })

  return { data, loading, update }
}
