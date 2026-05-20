import { useState, useCallback, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import type { DailyHealthData, PetState, PetMood, SelfCareData, MealEntry } from '../types/health';

const DATA_KEY = 'hb_health_data';
const PET_KEY  = 'hb_pet_state';

function todayStr() { return new Date().toISOString().split('T')[0]; }

function defaultData(): DailyHealthData {
  return {
    date: todayStr(),
    water:   { glasses: 0, goalGlasses: 8 },
    fitness: { steps: 0, stepsGoal: 10000, workoutMinutes: 0, workoutGoalMinutes: 30, workoutType: '' },
    calories: { meals: [], calorieGoal: 2000, proteinGoal: 120 },
    sleep:   { hours: 0, goalHours: 8, quality: 'fair' },
    selfCare: { meditation: false, skincare: false, journaling: false, reading: false, gratitude: false, stretch: false },
    activities: [
      { id: 'morning-walk',      label: 'Morning Walk',  icon: '🌅', completed: false },
      { id: 'yoga',              label: 'Yoga',          icon: '🧘', completed: false },
      { id: 'cycling',           label: 'Cycling',       icon: '🚴', completed: false },
      { id: 'vitamins',          label: 'Take Vitamins', icon: '💊', completed: false },
      { id: 'healthy-breakfast', label: 'Healthy Meal',  icon: '🥗', completed: false },
      { id: 'no-junk',           label: 'No Junk Food',  icon: '🚫', completed: false },
      { id: 'sun-exposure',      label: 'Sun Exposure',  icon: '☀️', completed: false },
      { id: 'screen-break',      label: 'Screen Break',  icon: '👁️', completed: false },
    ],
  };
}

function defaultPet(): PetState {
  return { name: 'Buddy', mood: 'neutral', healthScore: 0, streak: 0, level: 1, message: 'Start logging to wake me up! 🌱' };
}

function loadLocal(): DailyHealthData {
  try {
    const s = localStorage.getItem(DATA_KEY);
    if (s) { const p = JSON.parse(s) as DailyHealthData; if (p.date === todayStr()) return p; }
  } catch { /* ignore */ }
  return defaultData();
}

function loadPetLocal(): PetState {
  try { const s = localStorage.getItem(PET_KEY); if (s) return { ...defaultPet(), ...(JSON.parse(s) as PetState) }; }
  catch { /* ignore */ }
  return defaultPet();
}

function calcScore(d: DailyHealthData): number {
  const water   = Math.min(25, (d.water.glasses / d.water.goalGlasses) * 25);
  const steps   = Math.min(12.5, (d.fitness.steps / d.fitness.stepsGoal) * 12.5);
  const workout = Math.min(12.5, (d.fitness.workoutMinutes / d.fitness.workoutGoalMinutes) * 12.5);
  const total   = d.calories.meals.reduce((s, m) => s + m.calories, 0);
  const ratio   = total > 0 ? total / d.calories.calorieGoal : 0;
  const cals    = total === 0 ? 0 : ratio >= 0.8 && ratio <= 1.2 ? 20 : ratio >= 0.6 && ratio <= 1.5 ? 12 : 5;
  const self    = (Object.values(d.selfCare).filter(Boolean).length / 6) * 15;
  const sleep   = Math.min(10, (d.sleep.hours / d.sleep.goalHours) * 10);
  const acts    = Math.min(5, (d.activities.filter(a => a.completed).length / d.activities.length) * 10);
  return Math.min(100, Math.round(water + steps + workout + cals + self + sleep + acts));
}

function scoreToMood(s: number): PetMood {
  if (s >= 90) return 'ecstatic';
  if (s >= 75) return 'happy';
  if (s >= 55) return 'good';
  if (s >= 35) return 'neutral';
  if (s >= 15) return 'sad';
  return 'sick';
}

const MESSAGES: Record<PetMood, string[]> = {
  ecstatic: ["You're absolutely crushing it! 🌟", "Perfect health day! I'm so proud! 🏆", "You're my hero today! 💫"],
  happy:    ["Great job! Keep the momentum! 💪", "You're doing amazing today! 😄", "Almost perfect — so happy for you!"],
  good:     ["Good progress! Keep going! 🎯", "You're on the right track! 👍", "Doing well, push a little more!"],
  neutral:  ["Let's do more together! 🌱", "I believe in you — try one more thing.", "You can do better, I know it! 💛"],
  sad:      ["Please drink more water... 💧", "I miss when you exercised... 😢", "Let's get back on track together."],
  sick:     ["Please take care of yourself 🤒", "I need you to log some activities...", "I'm not feeling well... help me! 😷"],
};

function pickMessage(mood: PetMood) {
  const arr = MESSAGES[mood];
  return arr[Math.floor(Math.random() * arr.length)];
}

function derivePet(prev: PetState, data: DailyHealthData): PetState {
  const score = calcScore(data);
  const mood  = scoreToMood(score);
  const level = Math.max(1, Math.floor(score / 20) + 1);
  return { ...prev, mood, healthScore: score, level, message: pickMessage(mood) };
}

export function useHealthTracker(user: User | null) {
  const [health, setHealth] = useState<DailyHealthData>(loadLocal);
  const [pet, setPet]       = useState<PetState>(loadPetLocal);

  useEffect(() => {
    if (!db || !user || !isFirebaseConfigured()) return;
    const _db   = db;
    const today = todayStr();
    const unsubDay = onSnapshot(doc(_db, 'users', user.uid, 'days', today), snap => {
      if (snap.exists()) {
        const data = snap.data() as DailyHealthData;
        setHealth(data);
        setPet(prev => derivePet(prev, data));
      }
    });
    const unsubPet = onSnapshot(doc(_db, 'users', user.uid, 'pet', 'state'), snap => {
      if (snap.exists()) setPet(snap.data() as PetState);
    });
    return () => { unsubDay(); unsubPet(); };
  }, [user]);

  const persist = useCallback(async (next: DailyHealthData) => {
    setHealth(next);
    const updatedPet = derivePet(pet, next);
    setPet(updatedPet);
    if (db && user && isFirebaseConfigured()) {
      const _db = db;
      await setDoc(doc(_db, 'users', user.uid, 'days', todayStr()), next);
      await setDoc(doc(_db, 'users', user.uid, 'pet', 'state'), updatedPet);
    } else {
      localStorage.setItem(DATA_KEY, JSON.stringify(next));
      localStorage.setItem(PET_KEY, JSON.stringify(updatedPet));
    }
  }, [pet, user]);

  const addWater    = useCallback(() => persist({ ...health, water: { ...health.water, glasses: health.water.glasses + 1 } }), [health, persist]);
  const removeWater = useCallback(() => { if (health.water.glasses > 0) void persist({ ...health, water: { ...health.water, glasses: health.water.glasses - 1 } }); }, [health, persist]);
  const updateSteps = useCallback((steps: number) => persist({ ...health, fitness: { ...health.fitness, steps } }), [health, persist]);
  const addWorkout  = useCallback((minutes: number, type: string) =>
    persist({ ...health, fitness: { ...health.fitness, workoutMinutes: health.fitness.workoutMinutes + minutes, workoutType: type } }), [health, persist]);

  const addMeal = useCallback((name: string, calories: number, protein: number, carbs: number, fat: number, mealType: MealEntry['mealType']) => {
    const meal: MealEntry = {
      id: Date.now().toString(), name, calories, protein, carbs, fat, mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    return persist({ ...health, calories: { ...health.calories, meals: [...health.calories.meals, meal] } });
  }, [health, persist]);

  const removeMeal = useCallback((id: string) =>
    persist({ ...health, calories: { ...health.calories, meals: health.calories.meals.filter(m => m.id !== id) } }),
    [health, persist]);

  const updateSleep    = useCallback((hours: number, quality: DailyHealthData['sleep']['quality']) =>
    persist({ ...health, sleep: { ...health.sleep, hours, quality } }), [health, persist]);

  const toggleSelfCare = useCallback((key: keyof SelfCareData) =>
    persist({ ...health, selfCare: { ...health.selfCare, [key]: !health.selfCare[key] } }), [health, persist]);

  const toggleActivity = useCallback((id: string) =>
    persist({ ...health, activities: health.activities.map(a => a.id === id ? { ...a, completed: !a.completed } : a) }),
    [health, persist]);

  const renamePet = useCallback(async (name: string) => {
    const updated = { ...pet, name };
    setPet(updated);
    if (db && user && isFirebaseConfigured()) {
      const _db = db;
      await setDoc(doc(_db, 'users', user.uid, 'pet', 'state'), updated);
    } else {
      localStorage.setItem(PET_KEY, JSON.stringify(updated));
    }
  }, [pet, user]);

  return { health, pet, addWater, removeWater, updateSteps, addWorkout, addMeal, removeMeal, updateSleep, toggleSelfCare, toggleActivity, renamePet };
}
