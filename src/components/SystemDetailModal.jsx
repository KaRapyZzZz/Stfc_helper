import React from 'react';
import { X, ExternalLink, MapPin, Shield, Compass, Swords, Pickaxe } from 'lucide-react';
import { openExternalUrl } from '../utils/openLink';

export default function SystemDetailModal({ system, onClose }) {
  if (!system) return null;

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
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
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

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.6), rgba(16, 185, 129, 0.3))',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
          }}>
            <MapPin size={38} color="#34d399" />
          </div>

          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-uncommon">Система Ур. {system.level}</span>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                Варп: {system.warp}
              </span>
              {system.is_deep_space && (
                <span className="badge badge-epic">Deep Space</span>
              )}
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
              {system.name}
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              Координаты: [{system.coords ? system.coords[0] : 0}, {system.coords ? system.coords[1] : 0}] • ID: #{system.id}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

        {/* Level and Mission Recommendation Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Compass size={14} color="#38bdf8" />
              <span>Рекомендуемый уровень миссий</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#34d399' }}>
              Игроки Ур. {system.recommended_mission_level || Math.max(1, system.level - 2)}+
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Оптимально для выполнения заданий и сюжетных цепочек
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Swords size={14} color="#ef4444" />
              <span>Враги в этой системе</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
              {system.hostiles_info || `Враги Ур. ${system.level}`}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Примерная сила: ~{system.hostile_strength ? system.hostile_strength.toLocaleString() : (system.level * 15000).toLocaleString()} мощи
            </div>
          </div>
        </div>

        {/* Resources / Mines Info */}
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Pickaxe size={16} color="#f59e0b" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>ШАХТЫ И РЕСУРСЫ</span>
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
            {system.has_mines 
              ? '✓ В системе присутствуют активные узлы добычи (руда, газ или кристалл). Рекомендуется отправлять фракционные шахтеры с офицерами Stonn, Barot или Dupont.'
              : '✗ В системе нет стандартных шахт ресурсов. Система предназначена преимущественно для боевых патрулей и выполнения миссий.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => openExternalUrl(`https://stfc.space/systems/${system.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#10b981',
              color: '#090d16',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px'
            }}
          >
            <span>Открыть на stfc.space</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
