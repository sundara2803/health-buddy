import { useState } from 'react';
import type { SleepData } from '../types/health';
import SectionCard from './SectionCard';
import './Trackers.css';
const QUALITIES: { label: string; icon: string; value: SleepData['quality'] }[] = [
  { label: 'Poor',      icon: '😴', value: 'poor'      },
  { label: 'Fair',      icon: '😐', value: 'fair'      },
  { label: 'Good',      icon: '🙂', value: 'good'      },
  { label: 'Excellent', icon: '😊', value: 'excellent' },
];
interface Props { sleep: SleepData; onUpdate: (hours: number, quality: SleepData['quality']) => void; }
export default function SleepTracker({ sleep, onUpdate }: Props) {
  const [hours, setHours]     = useState(sleep.hours);
  const [quality, setQuality] = useState(sleep.quality);
  const change = (h: number, q: SleepData['quality']) => { setHours(h); setQuality(q); onUpdate(h, q); };
  return (
    <SectionCard icon="😴" title="Sleep" badge={`${hours}h / ${sleep.goalHours}h goal`}>
      <div className="sleep-row">
        <span className="sleep-big">{hours}h</span>
        <input type="range" min="0" max="12" step="0.5" value={hours}
          onChange={e => change(+e.target.value, quality)} className="sleep-slider" />
      </div>
      <label className="field-label mt">Sleep Quality</label>
      <div className="chip-row">
        {QUALITIES.map(q => (
          <button key={q.value} className={`chip ${quality === q.value ? 'chip-on' : ''}`}
            onClick={() => change(hours, q.value)}>{q.icon} {q.label}</button>
        ))}
      </div>
    </SectionCard>
  );
}
