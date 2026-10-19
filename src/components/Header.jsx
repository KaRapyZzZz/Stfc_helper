import React from 'react';
import { Shield, Database, Github, ExternalLink, Home } from 'lucide-react';
import officersData from '../data/officers.json';
import shipsData from '../data/ships.json';
import systemsData from '../data/systems.json';
import { openExternalUrl } from '../utils/openLink';

export default function Header({ onNavigateTab }) {
  const handleHomeClick = () => {
    if (onNavigateTab) {
      onNavigateTab('knowledge');
    }
  };

  return (
    <header className="glass-panel" style={{ margin: '16px 20px 0 20px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid rgba(56, 189, 248, 0.4)' }}>
      {/* Clickable Title & Insignia leading to Tab 1 */}
      <div 
        onClick={handleHomeClick}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '10px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        title="Нажмите, чтобы перейти на Вкладку №1 (База знаний и вопросы)"
      >
        <div style={{ 
          width: '46px', 
          height: '46px', 
          borderRadius: '10px', 
          background: 'linear-gradient(135deg, #1e3a8a, #0284c7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)'
        }}>
          <Shield size={28} color="#f8fafc" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', letterSpacing: '0.08em', margin: 0 }}>
              STFC COMMAND HELPER
            </h1>
            <span className="badge badge-epic" style={{ fontSize: '10px', padding: '2px 6px' }}>v1.0.0</span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
            База знаний, калькулятор экипажей и навигатор данных по Star Trek Fleet Command (Кликните для перехода на Вкладку 1)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick DB counters */}
        <div style={{ display: 'flex', gap: '14px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8' }}>{officersData.length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Офицеров</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>{shipsData.length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Кораблей</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{systemsData.length}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Систем</div>
          </div>
        </div>

        {/* Action Buttons with verified openExternalUrl */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => openExternalUrl('https://stfc.space')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            title="Открыть сайт stfc.space в браузере"
          >
            <Database size={15} color="#38bdf8" />
            <span>stfc.space</span>
            <ExternalLink size={12} color="#64748b" />
          </button>

          <button 
            onClick={() => openExternalUrl('https://github.com/KaRapyZzZz/Stfc_helper')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(2, 132, 199, 0.2))',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            title="Открыть репозиторий GitHub в браузере"
          >
            <Github size={15} />
            <span>GitHub</span>
            <ExternalLink size={12} color="#38bdf8" />
          </button>

          {/* Clickable Quick Home Icon in top right */}
          <button
            onClick={handleHomeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Перейти на Вкладку №1 (База знаний и поиск)"
          >
            <Home size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
