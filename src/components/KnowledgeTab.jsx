import React, { useState, useMemo } from 'react';
import { Search, Sparkles, HelpCircle, ArrowRight, Shield, Rocket, MapPin, ExternalLink } from 'lucide-react';
import faqData from '../data/faq_knowledge.json';
import officersData from '../data/officers.json';
import shipsData from '../data/ships.json';
import systemsData from '../data/systems.json';
import OfficerDetailModal from './OfficerDetailModal';

export default function KnowledgeTab() {
  const [query, setQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const sampleQuestions = [
    "Кто контрит перехватчики?",
    "Лучшая команда для фарма (PMC)",
    "Как работает Кирк и Спок?",
    "Как увеличить дальность варпа?",
    "Кого брать на Армады?",
    "Как фармить руду и кристаллы?",
    "Что дает синдикат?"
  ];

  // Intelligent Search Engine
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { faqMatch: null, officers: [], ships: [], systems: [] };

    const words = q.split(/\s+/).filter(w => w.length > 1);

    // 1. Check FAQ matching
    let bestFaq = null;
    let maxFaqScore = 0;
    for (const item of faqData) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) score += 3;
        for (const w of words) {
          if (kw.includes(w) || w.includes(kw)) score += 2;
        }
      }
      if (item.question.toLowerCase().includes(q)) score += 5;
      if (item.answer.toLowerCase().includes(q)) score += 2;

      if (score > maxFaqScore) {
        maxFaqScore = score;
        bestFaq = item;
      }
    }

    // 2. Matching officers
    const matchedOfficers = officersData.filter(o => 
      o.name.toLowerCase().includes(q) ||
      o.group.toLowerCase().includes(q) ||
      o.class.toLowerCase().includes(q) ||
      o.faction.toLowerCase().includes(q) ||
      (o.bio && o.bio.toLowerCase().includes(q))
    ).slice(0, 6);

    // 3. Matching ships
    const matchedShips = shipsData.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.hull_type.toLowerCase().includes(q) ||
      s.rarity.toLowerCase().includes(q)
    ).slice(0, 4);

    // 4. Matching systems
    const matchedSystems = systemsData.filter(s =>
      s.name.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      faqMatch: maxFaqScore >= 2 ? bestFaq : null,
      officers: matchedOfficers,
      ships: matchedShips,
      systems: matchedSystems
    };
  }, [query]);

  const displayFaq = activeFaq || searchResults.faqMatch;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Question Box */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.7))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={20} color="#38bdf8" />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
            Интеллектуальный поиск и база ответов STFC
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
          Задайте любой вопрос по офицерам, кораблям, системам, механикам или тактикам игры.
        </p>

        {/* Input bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} color="#64748b" style={{ position: 'absolute', left: '16px' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveFaq(null);
            }}
            placeholder="Например: Кто контрит перехватчики? или Kirk, Pike, Руда, Варп..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'rgba(10, 15, 29, 0.9)',
              color: '#f8fafc',
              fontSize: '15px',
              outline: 'none',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setActiveFaq(null); }}
              style={{
                position: 'absolute',
                right: '14px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Очистить
            </button>
          )}
        </div>

        {/* Sample chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center' }}>Популярные вопросы:</span>
          {sampleQuestions.map((qText, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(qText);
                const found = faqData.find(f => f.question === qText);
                if (found) setActiveFaq(found);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#38bdf8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#cbd5e1'; }}
            >
              {qText}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Area */}
      {displayFaq && (
        <div className="glass-panel-glow" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={18} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '17px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>
                {displayFaq.question}
              </h3>
            </div>
            <span className="badge badge-rare">{displayFaq.category}</span>
          </div>

          <div style={{
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#e2e8f0',
            whiteSpace: 'pre-line',
            background: 'rgba(10, 15, 29, 0.6)',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            {displayFaq.answer}
          </div>
        </div>
      )}

      {/* Search Matches: Officers, Ships, Systems */}
      {query && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Officers found */}
          {searchResults.officers.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Shield size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0, letterSpacing: '0.05em' }}>
                  НАЙДЕННЫЕ ОФИЦЕРЫ ({searchResults.officers.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {searchResults.officers.map(off => (
                  <div
                    key={off.id}
                    onClick={() => setSelectedOfficer(off)}
                    className="glass-panel"
                    style={{
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <img 
                      src={off.image} 
                      alt={off.name} 
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#0a0d14' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {off.name}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <span className="badge badge-rare" style={{ fontSize: '9px', padding: '1px 5px' }}>{off.class}</span>
                        <span className="badge" style={{ fontSize: '9px', padding: '1px 5px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>{off.faction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ships found */}
          {searchResults.ships.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Rocket size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0, letterSpacing: '0.05em' }}>
                  НАЙДЕННЫЕ КОРАБЛИ ({searchResults.ships.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {searchResults.ships.map(ship => (
                  <div
                    key={ship.id}
                    className="glass-panel"
                    style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <img 
                      src={ship.image} 
                      alt={ship.name} 
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain', background: '#0a0d14' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{ship.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {ship.hull_type} • Grade {ship.grade} ({ship.rarity})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Systems found */}
          {searchResults.systems.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={18} color="#10b981" />
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0, letterSpacing: '0.05em' }}>
                  НАЙДЕННЫЕ СИСТЕМЫ ({searchResults.systems.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {searchResults.systems.map(sys => (
                  <div key={sys.id} className="glass-panel" style={{ padding: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{sys.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      Уровень {sys.level} • Варп {sys.warp}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      Координаты: [{sys.coords[0]}, {sys.coords[1]}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Default FAQs if no query */}
      {!query && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <HelpCircle size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>
              Часто задаваемые вопросы по STFC
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {faqData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(item)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: activeFaq === item ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: activeFaq === item ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-card)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; }}
                onMouseLeave={(e) => { if (activeFaq !== item) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-rare" style={{ fontSize: '10px' }}>{item.category}</span>
                  <ArrowRight size={14} color="#64748b" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
                  {item.question}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOfficer && (
        <OfficerDetailModal officer={selectedOfficer} onClose={() => setSelectedOfficer(null)} />
      )}
    </div>
  );
}
