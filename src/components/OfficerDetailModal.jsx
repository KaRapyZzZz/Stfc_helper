import React from 'react';
import { X, ExternalLink, Shield, Award, Users, Star } from 'lucide-react';

export default function OfficerDetailModal({ officer, onClose }) {
  if (!officer) return null;

  const openUrl = (url) => {
    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'Epic': return 'badge-epic';
      case 'Rare': return 'badge-rare';
      case 'Uncommon': return 'badge-uncommon';
      default: return 'badge-common';
    }
  };

  const getClassColor = (c) => {
    switch (c) {
      case 'Command': return '#3b82f6';
      case 'Science': return '#06b6d4';
      case 'Engineering': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        className="glass-panel"
        style={{
          width: '640px',
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0d1322',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Top Info */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'rgba(15, 23, 42, 0.8)',
            border: `2px solid ${getClassColor(officer.class)}`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${getClassColor(officer.class)}33`
          }}>
            <img 
              src={officer.image} 
              alt={officer.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className={`badge ${getRarityBadge(officer.rarity)}`}>{officer.rarity}</span>
              <span className="badge" style={{ background: `${getClassColor(officer.class)}22`, color: getClassColor(officer.class), border: `1px solid ${getClassColor(officer.class)}44` }}>
                {officer.class}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                {officer.faction}
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
              {officer.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '13px', fontWeight: '600' }}>
              <Users size={14} />
              <span>Группа: {officer.group || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

        {/* Capabilities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Капитанский маневр</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: officer.has_captain_ability ? '#34d399' : '#64748b' }}>
              {officer.has_captain_ability ? '✓ Доступен' : '✗ Нет маневра'}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Нижние палубы (Below Decks)</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: officer.has_below_decks ? '#38bdf8' : '#64748b' }}>
              {officer.has_below_decks ? '✓ Есть способность' : '✗ Только мостик'}
            </div>
          </div>
        </div>

        {/* Biography & Lore */}
        {officer.bio && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em' }}>
              ОПИСАНИЕ И ИСТОРИЯ
            </h4>
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.4)', 
              padding: '14px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              lineHeight: '1.6', 
              color: '#cbd5e1',
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              whiteSpace: 'pre-line'
            }}>
              {officer.bio}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => openUrl(`https://stfc.space/officers/${officer.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            <span>Подробнее на stfc.space</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
