import React from 'react';
import { X, ExternalLink, Skull, Swords, MapPin, Shield } from 'lucide-react';
import { openExternalUrl } from '../utils/openLink';

export default function HostileDetailModal({ hostile, onClose, onSelectSystem }) {
  if (!hostile) return null;

  const getHullColor = (type) => {
    switch (type) {
      case 'Interceptor': return '#f59e0b';
      case 'Explorer': return '#38bdf8';
      case 'Battleship': return '#ef4444';
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
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 68, 68, 0.15)'
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
            background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.6), rgba(239, 68, 68, 0.3))',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
          }}>
            <Skull size={38} color="#f87171" />
          </div>

          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: `${getHullColor(hostile.hull_type)}22`, color: getHullColor(hostile.hull_type), border: `1px solid ${getHullColor(hostile.hull_type)}55` }}>
                {hostile.hull_type}
              </span>
              <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                Уровень {hostile.level}
              </span>
              <span className="badge badge-common">
                {hostile.faction}
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
              {hostile.name}
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              Сила корабля: ~{hostile.strength ? hostile.strength.toLocaleString() : 'N/A'} • ID: #{hostile.id}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Уровень противника</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
              Ур. {hostile.level}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Боевая мощь</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f87171' }}>
              {hostile.strength ? hostile.strength.toLocaleString() : 'Обычная'}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Варп для перелета</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8' }}>
              Варп {hostile.warp || 1}
            </div>
          </div>
        </div>

        {/* Systems where hostile spawns */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <MapPin size={16} color="#34d399" />
            <h4 style={{ fontSize: '13px', color: '#94a3b8', margin: 0, letterSpacing: '0.05em' }}>
              СИСТЕМЫ ОБИТАНИЯ ДАННОГО ВРАГА
            </h4>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {hostile.systems && hostile.systems.length > 0 ? (
              hostile.systems.map((sName, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {sName}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Враг патрулирует общие приграничные сектора в зависимости от уровня
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => openExternalUrl(`https://stfc.space/hostiles/${hostile.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#ef4444',
              color: '#ffffff',
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
