export type PetMood = 'ecstatic' | 'happy' | 'good' | 'neutral' | 'sad' | 'sick';

export interface WaterData { glasses: number; goalGlasses: number; }

export interface FitnessData {
  steps: number; stepsGoal: number;
  workoutMinutes: number; workoutGoalMinutes: number; workoutType: string;
}

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
}

export interface CaloriesData {
  meals: MealEntry[];
  calorieGoal: number;
  proteinGoal: number;
}

export interface SleepData {
  hours: number; goalHours: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface SelfCareData {
  meditation: boolean; skincare: boolean; journaling: boolean;
  reading: boolean; gratitude: boolean; stretch: boolean;
}

export interface HealthActivity {
  id: string; label: string; icon: string; completed: boolean;
}

export interface PetState {
  name: string; mood: PetMood; healthScore: number;
  streak: number; level: number; message: string;
}

export interface DailyHealthData {
  date: string;
  water: WaterData;
  fitness: FitnessData;
  calories: CaloriesData;
  sleep: SleepData;
  selfCare: SelfCareData;
  activities: HealthActivity[];
}
