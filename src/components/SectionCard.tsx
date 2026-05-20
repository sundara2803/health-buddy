import React from 'react';
import './SectionCard.css';
interface Props { icon: string; title: string; badge?: string; children: React.ReactNode; }
export default function SectionCard({ icon, title, badge, children }: Props) {
  return (
    <div className="section-card">
      <div className="section-card-header">
        <span className="section-card-icon">{icon}</span>
        <h2 className="section-card-title">{title}</h2>
        {badge && <span className="section-card-badge">{badge}</span>}
      </div>
      <div className="section-card-body">{children}</div>
    </div>
  );
}
