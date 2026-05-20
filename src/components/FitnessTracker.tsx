import { useState } from 'react';
import type { FitnessData } from '../types/health';
import ProgressBar from './ProgressBar';
import SectionCard from './SectionCard';
import './Trackers.css';

const WORKOUT_TYPES = [
  { label: 'Walk',  icon: '🚶', value: 'Walk'  },
  { label: 'Run',   icon: '🏃', value: 'Run'   },
  { label: 'Yoga',  icon: '🧘', value: 'Yoga'  },
  { label: 'Gym',   icon: '🏋️', value: 'Gym'   },
  { label: 'Swim',  icon: '🏊', value: 'Swim'  },
  { label: 'Cycle', icon: '🚴', value: 'Cycle' },
];

interface Props {
  fitness: FitnessData;
  onUpdateSteps: (s: number) => void;
  onAddWorkout: (mins: number, type: string) => void;
}

export default function FitnessTracker({ fitness, onUpdateSteps, onAddWorkout }: Props) {
  const [steps, setSteps] = useState(String(fitness.steps));
  const [mins,  setMins]  = useState('');
  const [wType, setWType] = useState('');

  const stepsPct = Math.min(100, (fitness.steps / fitness.stepsGoal) * 100);
  const burnt    = Math.round(fitness.steps * 0.04 + fitness.workoutMinutes * 7);

  const logWorkout = () => {
    const m = parseInt(mins);
    if (m > 0 && wType) { onAddWorkout(m, wType); setMins(''); }
  };

  return (
    <SectionCard icon="🏃" title="Fitness"
      badge={`${fitness.steps.toLocaleString()} / ${fitness.stepsGoal.toLocaleString()} steps`}>
      <label className="field-label">Steps Today</label>
      <div className="steps-row">
        <input className="text-input" type="number" value={steps}
          onChange={e => setSteps(e.target.value)}
          onBlur={() => onUpdateSteps(parseInt(steps) || 0)}
          placeholder="e.g. 5000" />
        <ProgressBar value={stepsPct} color="#a78bfa" />
      </div>
      {burnt > 0 && (
        <div className="burnt-badge">
          <span className="burnt-icon">⚡</span>
          <div className="burnt-info">
            <div className="burnt-val">{burnt} kcal burnt</div>
            <div className="burnt-lbl">
              {fitness.steps.toLocaleString()} steps + {fitness.workoutMinutes} min workout
            </div>
          </div>
        </div>
      )}
      <label className="field-label mt">Log Workout</label>
      <div className="chip-row">
        {WORKOUT_TYPES.map(w => (
          <button key={w.value} className={`chip ${wType === w.value ? 'chip-on' : ''}`}
            onClick={() => setWType(w.value)}>{w.icon} {w.label}</button>
        ))}
      </div>
      <div className="inline-row">
        <input className="text-input sm" type="number" value={mins}
          onChange={e => setMins(e.target.value)} placeholder="Minutes" min="1" />
        <button className="pill-btn primary" onClick={logWorkout} disabled={!wType || !mins}>Log</button>
      </div>
      {fitness.workoutMinutes > 0 && (
        <div className="logged-badge">
          ✅ {fitness.workoutMinutes} min {fitness.workoutType} logged today
        </div>
      )}
    </SectionCard>
  );
}
