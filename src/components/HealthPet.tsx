import { useState } from 'react';
import type { PetMood, PetState } from '../types/health';
import './HealthPet.css';

const MOOD_EMOJI: Record<PetMood, string> = { ecstatic: '🌟', happy: '😄', good: '🙂', neutral: '😐', sad: '😢', sick: '🤒' };
const SCORE_COLORS: [number, string][] = [[75, '#4ade80'], [50, '#fb923c'], [25, '#f87171'], [0, '#94a3b8']];
function scoreColor(s: number) { return SCORE_COLORS.find(([min]) => s >= min)?.[1] ?? '#94a3b8'; }
const CIRC = 2 * Math.PI * 50;

interface Props { pet: PetState; onRename: (name: string) => void; }

export default function HealthPet({ pet, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState(pet.name);
  const save = () => { if (nameVal.trim()) onRename(nameVal.trim()); setEditing(false); };
  const offset = CIRC - (CIRC * pet.healthScore) / 100;

  return (
    <div className={`pet-section mood-${pet.mood}`}>
      <div className="pet-scene">
        <div className={`pet-character mood-${pet.mood}`}>
          <div className="pet-ears"><div className="ear left" /><div className="ear right" /></div>
          <div className="pet-head">
            <div className="pet-face">
              <div className="eyes">
                <div className="eye"><div className="pupil" /></div>
                <div className="eye"><div className="pupil" /></div>
              </div>
              <div className="cheeks"><div className="cheek" /><div className="cheek" /></div>
              <div className={`mouth ${pet.mood}`} />
            </div>
          </div>
          <div className="pet-torso"><div className="paw" /><div className="paw" /></div>
          <div className="pet-feet"><div className="foot" /><div className="foot" /></div>
        </div>
        <svg className="score-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor(pet.healthScore)} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }} />
          <text x="60" y="54" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white">{pet.healthScore}</text>
          <text x="60" y="70" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.8)">Health Score</text>
        </svg>
      </div>
      <div className="pet-info">
        <div className="pet-name-row">
          {editing ? (
            <>
              <input className="pet-name-input" value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
              <button className="icon-btn" onClick={save}>✅</button>
            </>
          ) : (
            <>
              <span className="pet-name">{pet.name}</span>
              <button className="icon-btn" onClick={() => { setNameVal(pet.name); setEditing(true); }}>✏️</button>
            </>
          )}
          <span className="level-chip">Lv {pet.level}</span>
          {pet.streak > 0 && <span className="streak-chip">🔥 {pet.streak}d</span>}
        </div>
        <div className="mood-row">
          <span>{MOOD_EMOJI[pet.mood]}</span>
          <span className="mood-label">{pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}</span>
        </div>
        <p className="pet-message">{pet.message}</p>
      </div>
    </div>
  );
}
