import React, { useState, useMemo } from 'react';
import { Search, Shield, Rocket, MapPin, Sparkles, ExternalLink, Skull, Swords, Compass } from 'lucide-react';
import officersData from '../data/officers.json';
import shipsData from '../data/ships.json';
import systemsData from '../data/systems.json';
import hostilesData from '../data/hostiles.json';
import synergiesData from '../data/synergies.json';
import OfficerDetailModal from './OfficerDetailModal';
import ShipDetailModal from './ShipDetailModal';
import SystemDetailModal from './SystemDetailModal';
import HostileDetailModal from './HostileDetailModal';
import { openExternalUrl } from '../utils/openLink';

export default function ExplorerTab() {
  const [subTab, setSubTab] = useState('officers'); // 'officers', 'ships', 'hostiles', 'systems', 'synergies'
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [hullFilter, setHullFilter] = useState('All');

  // Modals
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedHostile, setSelectedHostile] = useState(null);

  // Filtered Officers
  const filteredOfficers = useMemo(() => {
    return officersData.filter(o => {
      const matchSearch = !search ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.group.toLowerCase().includes(search.toLowerCase()) ||
        o.faction.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === 'All' || o.class === classFilter;
      const matchRarity = rarityFilter === 'All' || o.rarity === rarityFilter;
      return matchSearch && matchClass && matchRarity;
    });
  }, [search, classFilter, rarityFilter]);

  // Filtered Ships
  const filteredShips = useMemo(() => {
    return shipsData.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
      const matchHull = hullFilter === 'All' || s.hull_type === hullFilter;
      const matchRarity = rarityFilter === 'All' || s.rarity === rarityFilter;
      return matchSearch && matchHull && matchRarity;
    });
  }, [search, hullFilter, rarityFilter]);

  // Filtered Hostiles
  const filteredHostiles = useMemo(() => {
    return hostilesData.filter(h => {
      const matchSearch = !search || 
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        (h.systems && h.systems.some(sys => sys.toLowerCase().includes(search.toLowerCase())));
      const matchHull = hullFilter === 'All' || h.hull_type === hullFilter;
      return matchSearch && matchHull;
    });
  }, [search, hullFilter]);

  // Filtered Systems
  const filteredSystems = useMemo(() => {
    return systemsData.filter(sys => {
      return !search || 
        sys.name.toLowerCase().includes(search.toLowerCase()) ||
        (sys.hostiles_info && sys.hostiles_info.toLowerCase().includes(search.toLowerCase()));
    });
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Tabs Bar */}
      <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'officers', label: `Офицеры (${officersData.length})`, icon: Shield, color: '#38bdf8' },
            { id: 'ships', label: `Корабли (${shipsData.length})`, icon: Rocket, color: '#f59e0b' },
            { id: 'hostiles', label: `Враги / Противники (${hostilesData.length})`, icon: Skull, color: '#ef4444' },
            { id: 'systems', label: `Звездные Системы (${systemsData.length})`, icon: MapPin, color: '#10b981' },
            { id: 'synergies', label: `Мета-Синергии (${synergiesData.length})`, icon: Sparkles, color: '#a855f7' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setSubTab(tab.id); setSearch(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isActive ? `1px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? tab.color : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} color={isActive ? tab.color : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live stfc.space button */}
        <button
          onClick={() => openExternalUrl(`https://stfc.space/${subTab === 'systems' ? 'systems' : subTab === 'ships' ? 'ships' : subTab === 'hostiles' ? 'hostiles' : 'officers'}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '6px',
            background: 'transparent',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <span>Смотреть раздел на stfc.space</span>
          <ExternalLink size={13} />
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Поиск в разделе ${subTab}...`}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(10, 15, 29, 0.8)',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Dynamic filters based on subTab */}
        {subTab === 'officers' && (
          <>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '13px' }}
            >
              <option value="All">Все классы</option>
              <option value="Command">Command (Синий)</option>
              <option value="Science">Science (Голубой)</option>
              <option value="Engineering">Engineering (Красный)</option>
            </select>

            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '13px' }}
            >
              <option value="All">Любая редкость</option>
              <option value="Epic">Epic</option>
              <option value="Rare">Rare</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Common">Common</option>
            </select>
          </>
        )}

        {(subTab === 'ships' || subTab === 'hostiles') && (
          <select
            value={hullFilter}
            onChange={(e) => setHullFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '13px' }}
          >
            <option value="All">Все типы корпусов</option>
            <option value="Interceptor">Перехватчик (Interceptor)</option>
            <option value="Explorer">Исследователь (Explorer)</option>
            <option value="Battleship">Линейный корабль (Battleship)</option>
            <option value="Survey">Шахтер / Разведчик (Survey)</option>
          </select>
        )}
      </div>

      {/* Grid: Officers */}
      {subTab === 'officers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {filteredOfficers.map(officer => (
            <div
              key={officer.id}
              onClick={() => setSelectedOfficer(officer)}
              className="glass-panel"
              style={{
                padding: '14px',
                display: 'flex',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img
                src={officer.image}
                alt={officer.name}
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', background: '#0a0d14' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {officer.name}
                </div>
                <div style={{ display: 'flex', gap: '6px', margin: '4px 0' }}>
                  <span className={`badge badge-${officer.rarity.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {officer.rarity}
                  </span>
                  <span className="badge" style={{ fontSize: '9px', padding: '1px 5px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                    {officer.class}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {officer.group || 'General'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid: Ships (Clickable with ShipDetailModal) */}
      {subTab === 'ships' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredShips.map(ship => (
            <div 
              key={ship.id} 
              onClick={() => setSelectedShip(ship)}
              className="glass-panel" 
              style={{ 
                padding: '14px', 
                display: 'flex', 
                gap: '14px', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img
                src={ship.image}
                alt={ship.name}
                style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'contain', background: '#0a0d14', padding: '4px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>{ship.name}</div>
                <div style={{ display: 'flex', gap: '6px', margin: '4px 0' }}>
                  <span className="badge badge-rare" style={{ fontSize: '10px' }}>{ship.hull_type}</span>
                  <span className="badge" style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    Grade {ship.grade}★
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Чертежи: {ship.blueprints_required || 'Спец.'} • Клик для инфо →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid: Hostiles (New Section! Clickable with HostileDetailModal) */}
      {subTab === 'hostiles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {filteredHostiles.map(hostile => (
            <div
              key={hostile.id}
              onClick={() => setSelectedHostile(hostile)}
              className="glass-panel"
              style={{
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>{hostile.name}</div>
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  Ур. {hostile.level}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                <span className="badge badge-rare" style={{ fontSize: '10px' }}>{hostile.hull_type}</span>
                <span style={{ color: '#f87171', fontWeight: '600' }}>
                  Сила: ~{hostile.strength ? hostile.strength.toLocaleString() : 'N/A'}
                </span>
              </div>

              {/* Systems list */}
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                <strong style={{ color: '#cbd5e1' }}>Системы: </strong>
                {hostile.systems && hostile.systems.length > 0 
                  ? hostile.systems.slice(0, 3).join(', ') + (hostile.systems.length > 3 ? ` (+еще ${hostile.systems.length - 3})` : '')
                  : 'Патрулирует приграничный космос'}
              </div>

              <div style={{ fontSize: '10px', color: '#38bdf8', alignSelf: 'flex-end', marginTop: '4px' }}>
                Подробнее о противнике →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid: Systems (Clickable with SystemDetailModal) */}
      {subTab === 'systems' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredSystems.map(sys => (
            <div 
              key={sys.id} 
              onClick={() => setSelectedSystem(sys)}
              className="glass-panel" 
              style={{ 
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>{sys.name}</div>
                <span className="badge badge-rare" style={{ fontSize: '10px' }}>Ур. {sys.level}</span>
              </div>

              <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '4px' }}>
                Варп-дальность: {sys.warp}
              </div>

              <div style={{ fontSize: '11px', color: '#34d399', marginBottom: '4px' }}>
                Миссии: Игроки Ур. {sys.recommended_mission_level || Math.max(1, sys.level - 2)}+
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Враги: {sys.hostiles_info || `Патрули Ур. ${sys.level}`}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '8px' }}>
                <span>Координаты: [{sys.coords[0]}, {sys.coords[1]}]</span>
                <span style={{ color: '#10b981' }}>Клик для инфо →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid: Synergies */}
      {subTab === 'synergies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {synergiesData.map(syn => (
            <div key={syn.id} className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '16px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>{syn.name}</h4>
                <span className="badge badge-epic">{syn.type}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600', marginBottom: '10px' }}>
                Капитан: {syn.captain} | Офицеры: {syn.officer1}, {syn.officer2}
              </div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
                {syn.description}
              </p>
              <div style={{ background: 'rgba(10, 15, 29, 0.6)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#94a3b8' }}>
                <div><strong>Цели:</strong> {syn.target_type}</div>
                <div><strong>Бонус:</strong> {syn.synergy_bonus}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Modals for All Entities */}
      {selectedOfficer && (
        <OfficerDetailModal officer={selectedOfficer} onClose={() => setSelectedOfficer(null)} />
      )}
      {selectedShip && (
        <ShipDetailModal ship={selectedShip} onClose={() => setSelectedShip(null)} />
      )}
      {selectedSystem && (
        <SystemDetailModal system={selectedSystem} onClose={() => setSelectedSystem(null)} />
      )}
      {selectedHostile && (
        <HostileDetailModal hostile={selectedHostile} onClose={() => setSelectedHostile(null)} />
      )}
    </div>
  );
}
