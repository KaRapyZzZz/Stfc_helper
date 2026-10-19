import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, X, ArrowLeftRight, Trash2, CheckCircle2, AlertCircle, Search, Users } from 'lucide-react';
import officersData from '../data/officers.json';
import synergiesData from '../data/synergies.json';

export default function CalculatorTab() {
  const [captain, setCaptain] = useState(null);
  const [officerLeft, setOfficerLeft] = useState(null);
  const [officerRight, setOfficerRight] = useState(null);
  const [belowDecks, setBelowDecks] = useState([null, null, null]);

  // Picker drawer state
  const [activeSlotTarget, setActiveSlotTarget] = useState(null); // 'captain', 'left', 'right', 'bd-0', 'bd-1', 'bd-2'
  const [pickerFilter, setPickerFilter] = useState('');
  const [pickerClass, setPickerClass] = useState('All');
  const [pickerRarity, setPickerRarity] = useState('All');

  // Dragging state
  const [draggedOfficer, setDraggedOfficer] = useState(null);
  const [isDragOverSlot, setIsDragOverSlot] = useState(null);

  // Initialize with PMC preset
  React.useEffect(() => {
    const pike = officersData.find(o => o.name.toLowerCase().includes('pike'));
    const cath = officersData.find(o => o.name.toLowerCase().includes('cath') || o.name.toLowerCase().includes('moreau'));
    const chen = officersData.find(o => o.name.toLowerCase().includes('chen'));
    if (pike) setCaptain(pike);
    if (cath) setOfficerLeft(cath);
    if (chen) setOfficerRight(chen);
  }, []);

  // Compute Synergy & Bonuses
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

    // Check Bridge synergy
    // If left officer matches class or group
    if (officerLeft) {
      const classMatch = officerLeft.class !== captain.class; // In STFC diverse classes often trigger captain synergy
      const groupMatch = officerLeft.group && captain.group && officerLeft.group === captain.group;
      if (groupMatch) {
        synergyPercent += 30;
        effects.push(`Синергия группы: ${officerLeft.name} (+30%)`);
      } else {
        synergyPercent += 20;
        effects.push(`Синергия мостика: ${officerLeft.name} (+20%)`);
      }
    }

    // If right officer matches class or group
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

    // Check special known presets
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
      label: synergyPercent >= 100 ? 'МАКСИМАЛЬНАЯ СИНЕРГИЯ' : synergyPercent > 0 ? `СИНЕРГИЯ МОСТИКА: +${synergyPercent}%` : 'БЕЗ СИНЕРГИИ',
      details: matchedPreset ? matchedPreset.description : `Текущий экипаж обеспечивает +${synergyPercent}% к капитанскому маневру ${captain.name}.`,
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

  // Place officer in slot
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

  // Filtered officers for picker
  const filteredPickerOfficers = useMemo(() => {
    return officersData.filter(o => {
      const matchesSearch = !pickerFilter || 
        o.name.toLowerCase().includes(pickerFilter.toLowerCase()) ||
        o.group.toLowerCase().includes(pickerFilter.toLowerCase()) ||
        o.faction.toLowerCase().includes(pickerFilter.toLowerCase());
      const matchesClass = pickerClass === 'All' || o.class === pickerClass;
      const matchesRarity = pickerRarity === 'All' || o.rarity === pickerRarity;
      return matchesSearch && matchesClass && matchesRarity;
    });
  }, [pickerFilter, pickerClass, pickerRarity]);

  // Slot component renderer
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
          flex: 1
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: '700', color: isCaptain ? '#f59e0b' : '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {title}
        </div>

        <div
          onClick={() => setActiveSlotTarget(slotKey)}
          style={{
            width: isCaptain ? '130px' : '110px',
            height: isCaptain ? '150px' : '130px',
            borderRadius: '14px',
            background: officer ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.4)',
            border: `2px dashed ${borderGlow}`,
            boxShadow: isDragOver ? '0 0 25px rgba(56, 189, 248, 0.6)' : officer ? '0 4px 15px rgba(0,0,0,0.4)' : 'none',
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
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
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
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Left: Bridge & Synergy Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Preset Selector */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

        {/* The Bridge (3 slots) */}
        <div className="glass-panel-glow" style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.8), rgba(10, 15, 29, 0.9))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0, letterSpacing: '0.08em' }}>
              ГЛАВНЫЙ МОСТИК КОРАБЛЯ
            </h3>
            <span className="badge badge-epic" style={{ padding: '4px 10px' }}>
              {synergyEvaluation.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
            {renderSlot('Офицер Мостика 1', officerLeft, 'left')}
            {renderSlot('Капитан (Центр)', captain, 'captain', true)}
            {renderSlot('Офицер Мостика 2', officerRight, 'right')}
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
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '14px', letterSpacing: '0.05em' }}>
            НИЖНИЕ ПАЛУБЫ (BELOW DECKS)
          </h4>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {belowDecks.map((bdOff, i) => renderSlot(`Слот ${i + 1}`, bdOff, `bd-${i}`))}
          </div>
        </div>
      </div>

      {/* Right: Drag & Drop Officer Palette / Search Drawer */}
      <div className="glass-panel" style={{ width: '380px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0 }}>
              ОФИЦЕРЫ ({filteredPickerOfficers.length})
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Перетяните на мостик</span>
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
              onClick={() => {
                if (activeSlotTarget) {
                  placeOfficerInSlot(activeSlotTarget, officer);
                  setActiveSlotTarget(null);
                }
              }}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'grab',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'; }}
            >
              <img
                src={officer.image}
                alt={officer.name}
                style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', background: '#0a0d14' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {officer.name}
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
    </div>
  );
}
