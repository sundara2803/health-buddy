import type { HealthActivity } from '../types/health';
import SectionCard from './SectionCard';
import './Trackers.css';
interface Props { activities: HealthActivity[]; onToggle: (id: string) => void; }
export default function ActivitiesTracker({ activities, onToggle }: Props) {
  const done = activities.filter(a => a.completed).length;
  return (
    <SectionCard icon="✅" title="Daily Activities" badge={`${done}/${activities.length} done`}>
      <div className="activities-list">
        {activities.map(act => (
          <button key={act.id} className={`activity-item ${act.completed ? 'act-done' : ''}`}
            onClick={() => onToggle(act.id)}>
            <span className="act-icon">{act.icon}</span>
            <span className="act-label">{act.label}</span>
            <span className="act-check">{act.completed ? '✅' : '⬜'}</span>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
