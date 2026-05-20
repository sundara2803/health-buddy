import './ProgressBar.css';
interface Props { value: number; color?: string; }
export default function ProgressBar({ value, color = 'var(--primary)' }: Props) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
  );
}
