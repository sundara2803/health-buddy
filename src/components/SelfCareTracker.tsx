import type { SelfCareData } from '../types/health';
import SectionCard from './SectionCard';
import './Trackers.css';
const ITEMS: { key: keyof SelfCareData; label: string; icon: string; tip: string }[] = [
  { key: 'meditation', label: 'Meditation', icon: '🧘', tip: '10 min daily'   },
  { key: 'skincare',   label: 'Skincare',   icon: '🧴', tip: 'AM & PM routine'},
  { key: 'journaling', label: 'Journaling', icon: '📓', tip: 'Write 5 minutes'},
  { key: 'reading',    label: 'Reading',    icon: '📚', tip: '15+ min'        },
  { key: 'gratitude',  label: 'Gratitude',  icon: '🙏', tip: '3 things today' },
  { key: 'stretch',    label: 'Stretching', icon: '🤸', tip: 'Morning stretch' },
];
interface Props { selfCare: SelfCareData; onToggle: (key: keyof SelfCareData) => void; }
export default function SelfCareTracker({ selfCare, onToggle }: Props) {
  const done = Object.values(selfCare).filter(Boolean).length;
  return (
    <SectionCard icon="🌸" title="Self Care" badge={`${done}/6 done`}>
      <div className="selfcare-grid">
        {ITEMS.map(item => (
          <button key={item.key} className={`selfcare-item ${selfCare[item.key] ? 'sc-done' : ''}`}
            onClick={() => onToggle(item.key)}>
            <span className="sc-icon">{item.icon}</span>
            <div className="sc-text">
              <span className="sc-label">{item.label}</span>
              <span className="sc-tip">{item.tip}</span>
            </div>
            {selfCare[item.key] && <span className="sc-check">✅</span>}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
