import type { DailyHealthData } from '../types/health';
import './QuickStats.css';

interface Props { health: DailyHealthData; }

function caloriesBurnt(health: DailyHealthData): number {
  return Math.round(health.fitness.steps * 0.04 + health.fitness.workoutMinutes * 7);
}

export default function QuickStats({ health }: Props) {
  const totalCal  = health.calories.meals.reduce((s, m) => s + m.calories, 0);
  const totalProt = health.calories.meals.reduce((s, m) => s + m.protein, 0);
  const selfDone  = Object.values(health.selfCare).filter(Boolean).length;
  const burnt     = caloriesBurnt(health);

  return (
    <div className="quick-stats">
      {[
        { icon: '💧', val: `${health.water.glasses}/${health.water.goalGlasses}`, lbl: 'Water' },
        { icon: '👟', val: health.fitness.steps.toLocaleString(), lbl: 'Steps' },
        { icon: '🔥', val: `${totalCal}`, lbl: 'kcal in' },
        { icon: '⚡', val: `${burnt}`, lbl: 'kcal out' },
        { icon: '💪', val: `${totalProt}g`, lbl: 'Protein' },
        { icon: '😴', val: `${health.sleep.hours}h`, lbl: 'Sleep' },
        { icon: '🌸', val: `${selfDone}/6`, lbl: 'Self-care' },
      ].map(s => (
        <div key={s.lbl} className="q-stat">
          <div className="q-icon">{s.icon}</div>
          <div className="q-val">{s.val}</div>
          <div className="q-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
