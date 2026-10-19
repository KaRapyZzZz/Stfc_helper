import React from 'react';
import { X, ExternalLink, Rocket, Shield, Award, Layers } from 'lucide-react';
import { openExternalUrl } from '../utils/openLink';

export default function ShipDetailModal({ ship, onClose }) {
  if (!ship) return null;

  const getHullColor = (type) => {
    switch (type) {
      case 'Interceptor': return '#f59e0b';
      case 'Explorer': return '#38bdf8';
      case 'Battleship': return '#ef4444';
      case 'Survey': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const getCounterInfo = (type) => {
    switch (type) {
      case 'Interceptor': return 'Силен против Исследователей (Explorers), уязвим перед Линейными кораблями (Battleships)';
      case 'Explorer': return 'Силен против Линейных кораблей (Battleships), уязвим перед Перехватчиками (Interceptors)';
      case 'Battleship': return 'Силен против Перехватчиков (Interceptors), уязвим перед Исследователями (Explorers)';
      case 'Survey': return 'Добывающий / Разведывательный корабль с увеличенным трюмом, уязвим в бою';
      default: return 'Боевой корабль специального назначения';
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
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.15)'
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
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'rgba(15, 23, 42, 0.8)',
            border: `2px solid ${getHullColor(ship.hull_type)}`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px'
          }}>
            <img 
              src={ship.image} 
              alt={ship.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: `${getHullColor(ship.hull_type)}22`, color: getHullColor(ship.hull_type), border: `1px solid ${getHullColor(ship.hull_type)}55` }}>
                {ship.hull_type}
              </span>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                Grade {ship.grade}★
              </span>
              <span className="badge badge-common">
                {ship.rarity}
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
              {ship.name}
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              ID: #{ship.id} • Чертежей требуется: {ship.blueprints_required || 'Специальное получение'}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Максимальный Тир</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
              Tier {ship.max_tier}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Макс. Уровень Корабля</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8' }}>
              Ур. {ship.max_level}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Чертежи (Blueprints)</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>
              {ship.blueprints_required > 0 ? `${ship.blueprints_required} шт.` : 'Спец. проект'}
            </div>
          </div>
        </div>

        {/* Tactical Info */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em' }}>
            ТАКТИЧЕСКАЯ РОЛЬ И БОЕВОЙ ТРЕУГОЛЬНИК
          </h4>
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.4)', 
            padding: '14px', 
            borderRadius: '10px', 
            fontSize: '13px', 
            lineHeight: '1.6', 
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.04)'
          }}>
            {getCounterInfo(ship.hull_type)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => openExternalUrl(`https://stfc.space/ships/${ship.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#f59e0b',
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
