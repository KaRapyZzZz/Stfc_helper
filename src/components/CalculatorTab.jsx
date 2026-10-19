import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, X, ArrowLeftRight, Trash2, CheckCircle2, Search, Users, Anchor, Info, Award } from 'lucide-react';
import officersData from '../data/officers.json';
import synergiesData from '../data/synergies.json';

export default function CalculatorTab() {
  const [captain, setCaptain] = useState(null);
  const [officerLeft, setOfficerLeft] = useState(null);
  const [officerRight, setOfficerRight] = useState(null);
  const [belowDecks, setBelowDecks] = useState([null, null, null]);

  // Picker drawer state
  const [activeSlotTarget, setActiveSlotTarget] = useState(null);
  const [pickerFilter, setPickerFilter] = useState('');
  const [pickerClass, setPickerClass] = useState('All');
  const [pickerRarity, setPickerRarity] = useState('All');

  // Dragging state
  const [draggedOfficer, setDraggedOfficer] = useState(null);
  const [isDragOverSlot, setIsDragOverSlot] = useState(null);

  // Hovered officer for tooltip / characteristics
  const [hoveredOfficer, setHoveredOfficer] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Initialize with PMC preset
  React.useEffect(() => {
    const pike = officersData.find(o => o.name.toLowerCase().includes('pike'));
    const cath = officersData.find(o => o.name.toLowerCase().includes('cath') || o.name.toLowerCase().includes('moreau'));
    const chen = officersData.find(o => o.name.toLowerCase().includes('chen'));
    if (pike) setCaptain(pike);
    if (cath) setOfficerLeft(cath);
    if (chen) setOfficerRight(chen);
  }, []);

  // Calculate synergy values for Left and Right connectors
  const leftSynergyVal = useMemo(() => {
    if (!captain || !officerLeft) return 0;
    if (officerLeft.group && captain.group && officerLeft.group === captain.group) return 30;
    return 20;
  }, [captain, officerLeft]);

  const rightSynergyVal = useMemo(() => {
    if (!captain || !officerRight) return 0;
    if (officerRight.group && captain.group && officerRight.group === captain.group) return 30;
    return 20;
  }, [captain, officerRight]);

  // Compute overall Synergy & Bonuses
  const synergyEvaluation = useMemo(() => {
    if (!captain) {
      return {
        percent: 0,
        label: 'Нет капитана',
        details: 'Выберите капитана для расчета синергии мостика.',
        specialPreset: null,
        activeEffects: []
      };
    }

    let synergyPercent = 0;
    const effects = [];

    if (officerLeft) {
      const groupMatch = officerLeft.group && captain.group && officerLeft.group === captain.group;
      if (groupMatch) {
        synergyPercent += 30;
        effects.push(`Синергия группы: ${officerLeft.name} (+30%)`);
      } else {
        synergyPercent += 20;
        effects.push(`Синергия мостика: ${officerLeft.name} (+20%)`);
      }
    }

    if (officerRight) {
      const groupMatch = officerRight.group && captain.group && officerRight.group === captain.group;
      if (groupMatch) {
        synergyPercent += 30;
        effects.push(`Синергия группы: ${officerRight.name} (+30%)`);
      } else {
        synergyPercent += 20;
        effects.push(`Синергия мостика: ${officerRight.name} (+20%)`);
      }
    }

    // Special presets
    const capName = captain.name.toLowerCase();
    const lName = officerLeft ? officerLeft.name.toLowerCase() : '';
    const rName = officerRight ? officerRight.name.toLowerCase() : '';

    let matchedPreset = null;
    if (capName.includes('pike') && (lName.includes('cath') || lName.includes('moreau') || rName.includes('cath') || rName.includes('moreau'))) {
      if (lName.includes('chen') || rName.includes('chen')) {
        matchedPreset = synergiesData.find(s => s.id === 'pmc');
        synergyPercent = 100;
      } else if (lName.includes("t'laan") || rName.includes("t'laan")) {
        matchedPreset = synergiesData.find(s => s.id === 'pmt');
        synergyPercent = 100;
      }
    } else if (capName.includes('kirk')) {
      if ((lName.includes('spock') || rName.includes('spock')) && (lName.includes('mccoy') || rName.includes('mccoy') || lName.includes('bones') || rName.includes('bones'))) {
        matchedPreset = synergiesData.find(s => s.id === 'kirk_spock_bones');
        synergyPercent = 100;
      }
    } else if (capName.includes('khan')) {
      matchedPreset = synergiesData.find(s => s.id === 'khan_crit');
    }

    return {
      percent: Math.min(100, synergyPercent),
      label: synergyPercent >= 100 ? 'МАКСИМАЛЬНАЯ СИНЕРГИЯ (+100%)' : synergyPercent > 0 ? `СИНЕРГИЯ МОСТИКА: +${synergyPercent}%` : 'БЕЗ СИНЕРГИИ',
      details: matchedPreset ? matchedPreset.description : `Текущий экипаж обеспечивает +${synergyPercent}% к капитанскому маневру офицера ${captain.name}.`,
      specialPreset: matchedPreset,
      activeEffects: effects
    };
  }, [captain, officerLeft, officerRight]);

  // Load a preset
  const loadPreset = (presetId) => {
    if (presetId === 'pmc') {
      const pike = officersData.find(o => o.name.toLowerCase().includes('pike'));
      const moreau = officersData.find(o => o.name.toLowerCase().includes('cath') || o.name.toLowerCase().includes('moreau'));
      const chen = officersData.find(o => o.name.toLowerCase().includes('chen'));
      setCaptain(pike || null);
      setOfficerLeft(moreau || null);
      setOfficerRight(chen || null);
    } else if (presetId === 'pmt') {
      const pike = officersData.find(o => o.name.toLowerCase().includes('pike'));
      const moreau = officersData.find(o => o.name.toLowerCase().includes('cath') || o.name.toLowerCase().includes('moreau'));
      const tlaan = officersData.find(o => o.name.toLowerCase().includes("t'laan"));
      setCaptain(pike || null);
      setOfficerLeft(moreau || null);
      setOfficerRight(tlaan || null);
    } else if (presetId === 'kirk_spock_bones') {
      const kirk = officersData.find(o => o.name.toLowerCase().includes('kirk'));
      const spock = officersData.find(o => o.name.toLowerCase().includes('spock') && !o.name.toLowerCase().includes('ambassador'));
      const bones = officersData.find(o => o.name.toLowerCase().includes('mccoy') || o.name.toLowerCase().includes('bones'));
      setCaptain(kirk || null);
      setOfficerLeft(spock || null);
      setOfficerRight(bones || null);
    } else if (presetId === 'khan_crit') {
      const khan = officersData.find(o => o.name.toLowerCase().includes('khan'));
      const joachim = officersData.find(o => o.name.toLowerCase().includes('joachim'));
      const marla = officersData.find(o => o.name.toLowerCase().includes('marla'));
      setCaptain(khan || null);
      setOfficerLeft(joachim || null);
      setOfficerRight(marla || null);
    } else if (presetId === 'mining_crew') {
      const stonn = officersData.find(o => o.name.toLowerCase().includes('stonn'));
      const dupont = officersData.find(o => o.name.toLowerCase().includes('dupont'));
      const barot = officersData.find(o => o.name.toLowerCase().includes('barot'));
      setCaptain(stonn || null);
      setOfficerLeft(dupont || null);
      setOfficerRight(barot || null);
    }
  };

  const placeOfficerInSlot = (slotKey, officer) => {
    if (slotKey === 'captain') setCaptain(officer);
    else if (slotKey === 'left') setOfficerLeft(officer);
    else if (slotKey === 'right') setOfficerRight(officer);
    else if (slotKey.startsWith('bd-')) {
      const idx = parseInt(slotKey.split('-')[1], 10);
      setBelowDecks(prev => {
        const copy = [...prev];
        copy[idx] = officer;
        return copy;
      });
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (officer) => {
    setDraggedOfficer(officer);
  };

  const handleDragOver = (e, slotKey) => {
    e.preventDefault();
    setIsDragOverSlot(slotKey);
  };

  const handleDragLeave = () => {
    setIsDragOverSlot(null);
  };

  const handleDrop = (e, slotKey) => {
    e.preventDefault();
    setIsDragOverSlot(null);
    if (draggedOfficer) {
      placeOfficerInSlot(slotKey, draggedOfficer);
      setDraggedOfficer(null);
    }
  };

  // Tooltip mouse handlers
  const handleOfficerMouseEnter = (e, officer) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.right + 12, y: rect.top });
    setHoveredOfficer(officer);
  };

  const handleOfficerMouseLeave = () => {
    setHoveredOfficer(null);
  };

  // Filter & SORT officers for picker (SYNERGY OFFICERS FIRST!)
  const filteredPickerOfficers = useMemo(() => {
    return officersData
      .filter(o => {
        const matchesSearch = !pickerFilter || 
          o.name.toLowerCase().includes(pickerFilter.toLowerCase()) ||
          o.group.toLowerCase().includes(pickerFilter.toLowerCase()) ||
          o.faction.toLowerCase().includes(pickerFilter.toLowerCase());
        const matchesClass = pickerClass === 'All' || o.class === pickerClass;
        const matchesRarity = pickerRarity === 'All' || o.rarity === pickerRarity;
        return matchesSearch && matchesClass && matchesRarity;
      })
      .map(o => {
        let synergyScore = 0;
        let synergyBadge = null;
        if (captain && o.id !== captain.id) {
          if (o.group && captain.group && o.group === captain.group) {
            synergyScore = 200; // top priority
            synergyBadge = '+30% Синергия группы';
          } else {
            synergyScore = 50;
            synergyBadge = '+20% Синергия мостика';
          }
        }
        return { ...o, synergyScore, synergyBadge };
      })
      .sort((a, b) => b.synergyScore - a.synergyScore);
  }, [pickerFilter, pickerClass, pickerRarity, captain]);

  const renderSlot = (title, officer, slotKey, isCaptain = false) => {
    const isDragOver = isDragOverSlot === slotKey;
    const borderGlow = isDragOver ? '#38bdf8' : isCaptain ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)';

    return (
      <div
        onDragOver={(e) => handleDragOver(e, slotKey)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, slotKey)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 2,
          position: 'relative'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: '700', color: isCaptain ? '#f59e0b' : '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {title}
        </div>

        <div
          onClick={() => setActiveSlotTarget(slotKey)}
          onMouseEnter={(e) => officer && handleOfficerMouseEnter(e, officer)}
          onMouseLeave={handleOfficerMouseLeave}
          style={{
            width: isCaptain ? '135px' : '110px',
            height: isCaptain ? '155px' : '130px',
            borderRadius: '14px',
            background: officer ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.4)',
            border: `2px dashed ${borderGlow}`,
            boxShadow: isDragOver ? '0 0 25px rgba(56, 189, 248, 0.6)' : isCaptain ? '0 0 20px rgba(245, 158, 11, 0.25)' : '0 4px 15px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s',
            transform: isDragOver ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {officer ? (
            <>
              <img
                src={officer.image}
                alt={officer.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Below Decks icon indicator */}
              {officer.has_below_decks && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    background: 'rgba(14, 165, 233, 0.9)',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    fontSize: '9px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    boxShadow: '0 0 6px rgba(14, 165, 233, 0.6)'
                  }}
                  title="Имеет способность нижней палубы (Below Deck)"
                >
                  <Anchor size={10} />
                  <span>BD</span>
                </div>
              )}

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
                padding: '16px 6px 6px 6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {officer.name}
                </div>
                <div style={{ fontSize: '9px', color: officer.class === 'Command' ? '#60a5fa' : officer.class === 'Science' ? '#38bdf8' : '#f87171' }}>
                  {officer.class}
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  placeOfficerInSlot(slotKey, null);
                }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: '#ef4444',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Убрать офицера"
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '24px', color: '#64748b', marginBottom: '4px' }}>+</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Нажмите или перетяните</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
      {/* Left: Bridge & Synergy Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Preset Selector */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#f59e0b" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>ГОТОВЫЕ МЕТА-СБОРКИ:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => loadPreset('pmc')}
              style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              PMC (Фарм PvE)
            </button>
            <button
              onClick={() => loadPreset('pmt')}
              style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer' }}
            >
              PMT (Перехватчики)
            </button>
            <button
              onClick={() => loadPreset('kirk_spock_bones')}
              style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer' }}
            >
              Kirk + Spock
            </button>
            <button
              onClick={() => loadPreset('khan_crit')}
              style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer' }}
            >
              Khan (Армады)
            </button>
            <button
              onClick={() => loadPreset('mining_crew')}
              style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer' }}
            >
              Шахтеры (Майнинг)
            </button>
            <button
              onClick={() => {
                setCaptain(null);
                setOfficerLeft(null);
                setOfficerRight(null);
                setBelowDecks([null, null, null]);
              }}
              style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}
              title="Очистить весь мостик"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* The Bridge (With Visual Dashed Synergy Connector Lines) */}
        <div className="glass-panel-glow" style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.8), rgba(10, 15, 29, 0.9))', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0, letterSpacing: '0.08em' }}>
              ГЛАВНЫЙ МОСТИК КОРАБЛЯ
            </h3>
            <span className="badge badge-epic" style={{ padding: '4px 10px', fontSize: '12px' }}>
              {synergyEvaluation.label}
            </span>
          </div>

          {/* Bridge Slots Container with SVG connector lines */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '190px' }}>
            {/* SVG Connecting Dashed Lines */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <defs>
                <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Left Line */}
              {captain && officerLeft && (
                <line
                  x1="32%"
                  y1="55%"
                  x2="48%"
                  y2="55%"
                  stroke={leftSynergyVal >= 30 ? '#38bdf8' : '#60a5fa'}
                  strokeWidth="3"
                  strokeDasharray="6, 6"
                  filter="url(#glow-line)"
                />
              )}

              {/* Right Line */}
              {captain && officerRight && (
                <line
                  x1="52%"
                  y1="55%"
                  x2="68%"
                  y2="55%"
                  stroke={rightSynergyVal >= 30 ? '#38bdf8' : '#60a5fa'}
                  strokeWidth="3"
                  strokeDasharray="6, 6"
                  filter="url(#glow-line)"
                />
              )}
            </svg>

            {/* Left Slot */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {renderSlot('Офицер Мостика 1', officerLeft, 'left')}
            </div>

            {/* Left Synergy Value Pill */}
            {captain && officerLeft && (
              <div style={{
                position: 'absolute',
                left: '38%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: leftSynergyVal >= 30 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(30, 58, 138, 0.9)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '800',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                zIndex: 3
              }}>
                +{leftSynergyVal}%
              </div>
            )}

            {/* Center Captain Slot */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {renderSlot('Капитан (Центр)', captain, 'captain', true)}
            </div>

            {/* Right Synergy Value Pill */}
            {captain && officerRight && (
              <div style={{
                position: 'absolute',
                left: '62%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: rightSynergyVal >= 30 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(30, 58, 138, 0.9)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '800',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                zIndex: 3
              }}>
                +{rightSynergyVal}%
              </div>
            )}

            {/* Right Slot */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {renderSlot('Офицер Мостика 2', officerRight, 'right')}
            </div>
          </div>

          {/* Swap button between wing officers */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button
              onClick={() => {
                const temp = officerLeft;
                setOfficerLeft(officerRight);
                setOfficerRight(temp);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeftRight size={13} />
              <span>Поменять боковых офицеров местами</span>
            </button>
          </div>
        </div>

        {/* Synergy Details Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <CheckCircle2 size={18} color="#34d399" />
            <h4 style={{ fontSize: '15px', color: '#f8fafc', margin: 0 }}>
              АНАЛИЗ БОЕВЫХ ЭФФЕКТОВ И СИНЕРГИЙ
            </h4>
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '14px' }}>
            {synergyEvaluation.details}
          </p>

          {synergyEvaluation.activeEffects.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {synergyEvaluation.activeEffects.map((eff, i) => (
                <span key={i} className="badge badge-rare" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  ✓ {eff}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Below Decks Slots */}
        <div className="glass-panel" style={{ padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Anchor size={16} color="#38bdf8" />
            <h4 style={{ fontSize: '14px', color: '#94a3b8', margin: 0, letterSpacing: '0.05em' }}>
              НИЖНИЕ ПАЛУБЫ (BELOW DECKS) — СПОСОБНОСТИ СТАТОВ
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {belowDecks.map((bdOff, i) => renderSlot(`Палуба ${i + 1}`, bdOff, `bd-${i}`))}
          </div>
        </div>
      </div>

      {/* Right: Drag & Drop Officer Palette / Search Drawer */}
      <div className="glass-panel" style={{ width: '400px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0 }}>
              ОФИЦЕРЫ ({filteredPickerOfficers.length})
            </h3>
          </div>
          {captain && (
            <span className="badge badge-rare" style={{ fontSize: '9px' }}>
              Синергии подняты наверх ↑
            </span>
          )}
        </div>

        {/* Search input in palette */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            value={pickerFilter}
            onChange={(e) => setPickerFilter(e.target.value)}
            placeholder="Поиск по имени или группе..."
            style={{
              width: '100%',
              padding: '8px 10px 8px 34px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(10, 15, 29, 0.8)',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {['All', 'Command', 'Science', 'Engineering'].map(cls => (
            <button
              key={cls}
              onClick={() => setPickerClass(cls)}
              style={{
                flex: 1,
                padding: '4px',
                borderRadius: '4px',
                background: pickerClass === cls ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: pickerClass === cls ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                color: pickerClass === cls ? '#38bdf8' : '#94a3b8',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {cls === 'All' ? 'Все' : cls}
            </button>
          ))}
        </div>

        {/* Officers Scroll List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
          {filteredPickerOfficers.slice(0, 80).map(officer => (
            <div
              key={officer.id}
              draggable
              onDragStart={() => handleDragStart(officer)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38bdf8';
                handleOfficerMouseEnter(e, officer);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = officer.synergyScore > 50 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.06)';
                handleOfficerMouseLeave();
              }}
              onClick={() => {
                if (activeSlotTarget) {
                  placeOfficerInSlot(activeSlotTarget, officer);
                  setActiveSlotTarget(null);
                }
              }}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: officer.synergyScore > 50 ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(15, 23, 42, 0.7))' : 'rgba(15, 23, 42, 0.6)',
                border: officer.synergyScore > 50 ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'grab',
                transition: 'all 0.15s',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={officer.image}
                  alt={officer.name}
                  style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', background: '#0a0d14' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {officer.has_below_decks && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: '#0284c7',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 5px rgba(0,0,0,0.8)'
                    }}
                    title="Имеет способность нижней палубы (Below Deck)"
                  >
                    <Anchor size={9} />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {officer.name}
                  </span>
                  {officer.synergyBadge && (
                    <span className="badge badge-epic" style={{ fontSize: '8px', padding: '1px 4px' }}>
                      {officer.synergyBadge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {officer.class} • {officer.rarity}
                </div>
              </div>

              <span className="badge" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                {officer.faction}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Hover Tooltip for Officer Stats & Abilities */}
      {hoveredOfficer && (
        <div
          className="glass-panel-glow"
          style={{
            position: 'fixed',
            left: `${Math.min(window.innerWidth - 320, tooltipPos.x)}px`,
            top: `${Math.min(window.innerHeight - 280, Math.max(20, tooltipPos.y - 40))}px`,
            width: '300px',
            background: 'rgba(10, 15, 29, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            borderRadius: '12px',
            padding: '14px',
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(56, 189, 248, 0.2)'
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <img 
              src={hoveredOfficer.image} 
              alt={hoveredOfficer.name} 
              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{hoveredOfficer.name}</div>
              <div style={{ fontSize: '11px', color: '#38bdf8' }}>{hoveredOfficer.class} • {hoveredOfficer.rarity}</div>
            </div>
          </div>

          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
            Группа: {hoveredOfficer.group || 'General'}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <div style={{ color: hoveredOfficer.has_captain_ability ? '#34d399' : '#64748b' }}>
              <strong>Капитанский маневр:</strong> {hoveredOfficer.has_captain_ability ? '✓ Активен в центре' : '✗ Нет'}
            </div>
            <div style={{ color: hoveredOfficer.has_below_decks ? '#38bdf8' : '#64748b' }}>
              <strong>Нижние палубы:</strong> {hoveredOfficer.has_below_decks ? '✓ Способность доступна' : '✗ Только мостик'}
            </div>
          </div>

          {hoveredOfficer.bio && (
            <div style={{ marginTop: '8px', fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', maxHeight: '70px', overflow: 'hidden' }}>
              {hoveredOfficer.bio.slice(0, 150)}...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
