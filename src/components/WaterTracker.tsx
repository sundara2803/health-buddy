import type { WaterData } from '../types/health';
import ProgressBar from './ProgressBar';
import SectionCard from './SectionCard';
import './Trackers.css';
interface Props { water: WaterData; onAdd: () => void; onRemove: () => void; }
export default function WaterTracker({ water, onAdd, onRemove }: Props) {
  const pct = Math.min(100, (water.glasses / water.goalGlasses) * 100);
  return (
    <SectionCard icon="💧" title="Hydration" badge={`${water.glasses}/${water.goalGlasses} glasses`}>
      <ProgressBar value={pct} color="#38bdf8" />
      <div className="water-grid">
        {Array.from({ length: water.goalGlasses }).map((_, i) => (
          <button key={i} className={`water-glass ${i < water.glasses ? 'filled' : ''}`}
            onClick={i < water.glasses ? onRemove : onAdd}>💧</button>
        ))}
      </div>
      <div className="btn-row">
        <button className="pill-btn" onClick={onAdd}>+ Add Glass</button>
        <button className="pill-btn warn" onClick={onRemove}>− Remove</button>
      </div>
    </SectionCard>
  );
}
