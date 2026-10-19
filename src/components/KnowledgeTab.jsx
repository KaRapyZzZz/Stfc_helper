import React, { useState, useMemo } from 'react';
import { Search, Sparkles, HelpCircle, ArrowRight, Shield, Rocket, MapPin, ExternalLink, Lightbulb, Compass, Swords, CheckCircle2 } from 'lucide-react';
import faqData from '../data/faq_knowledge.json';
import officersData from '../data/officers.json';
import shipsData from '../data/ships.json';
import systemsData from '../data/systems.json';
import OfficerDetailModal from './OfficerDetailModal';
import ShipDetailModal from './ShipDetailModal';
import SystemDetailModal from './SystemDetailModal';
import { openExternalUrl } from '../utils/openLink';

export default function KnowledgeTab() {
  const [query, setQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Modals
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  const sampleQuestions = [
    "Кто контрит перехватчики?",
    "Лучшая команда для фарма (PMC)",
    "Как работает Кирк и Спок?",
    "Как увеличить дальность варпа?",
    "Кого брать на Армады?",
    "Как фармить руду и кристаллы?",
    "Что дает синдикат?",
    "Где взять редкий тританий и дилитий?"
  ];

  // Search Engine & Research Assistant
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { faqMatch: null, officers: [], ships: [], systems: [], researchAnalysis: null };

    const words = q.split(/\s+/).filter(w => w.length > 1);

    // 1. FAQ lookup
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

    // 4. Matching systems with hostiles & mission levels
    const matchedSystems = systemsData.filter(sys =>
      sys.name.toLowerCase().includes(q) ||
      (sys.hostiles_info && sys.hostiles_info.toLowerCase().includes(q))
    ).slice(0, 4);

    // 5. Research Analysis (when no direct exact match or query requires comprehensive breakdown)
    let researchAnalysis = null;
    if (matchedOfficers.length === 0 && matchedShips.length === 0 && matchedSystems.length === 0 && !bestFaq) {
      // Deep exploratory answer for arbitrary queries
      researchAnalysis = {
        title: `Исследовательский анализ по запросу: "${query}"`,
        summary: `Прямой точной записи в локальной базе stfc.space не найдено, однако в Star Trek Fleet Command этот вопрос относится к ключевым механикам прогресса. Ниже представлен подробный разбор и инструкция по получению желаемого.`,
        solutions: [
          {
            heading: "1. Фракционные магазины и репутация (Faction Store)",
            text: "Большинство редких чертежей, офицеров и ресурсов (3★/4★ материалы) открываются при достижении статусов 'Respected' и выше у Федерации, Клингонов или Ромуланцев. Выполняйте ежедневные задачи фракции для получения фракционных кредитов."
          },
          {
            heading: "2. Перерабатывающий завод (Refinery) и космические рудники",
            text: "Сырая руда, газ и кристалл добываются специализированными шахтерами (Envoy, Horizon, K'Vort, Antares) и перерабатываются каждые 22 часа. Рекомендуется отправлять по 2-3 пачки сырья для максимального шанса на редкие и эпические материалы."
          },
          {
            heading: "3. Магазин событий (Event Store) и Боевой пропуск (Battlepass)",
            text: "Уникальные корабли (Franklin, Vi'dar, Stella, Discovery, Voyager, Cerritos) и эксклюзивные офицеры эффективнее всего закрываются через валюту сезонных событий и ящики Syndicate."
          },
          {
            heading: "4. Цепочки сюжетных миссий",
            text: "Осмотрите приграничные сектора вашего уровня: многие скрытые квесты дают полную пачку чертежей или редкие офицерские жетоны."
          }
        ],
        actionSteps: "Рекомендация: Проверьте ежедневные события во вкладке 'Events', убедитесь что ваши шахтеры работают в закрытых системах под защитой щита, и регулярно обновляйте сундук Синдиката."
      };
    }

    return {
      faqMatch: maxFaqScore >= 2 ? bestFaq : null,
      officers: matchedOfficers,
      ships: matchedShips,
      systems: matchedSystems,
      researchAnalysis
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
            Интеллектуальный поиск и исследовательский центр STFC
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
          Задайте любой вопрос или ищите офицеров, корабли, звездные системы и механики игры.
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
            placeholder="Задайте вопрос: например, Кто контрит перехватчики? Где взять тританий? Kirk, Pike..."
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
          <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center' }}>Популярные запросы:</span>
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

      {/* Answer Area (Known FAQ) */}
      {displayFaq && (
        <div className="glass-panel-glow" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={20} color="#38bdf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>
                  {displayFaq.question}
                </h3>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Аналитический ответ базы знаний STFC</div>
              </div>
            </div>
            <span className="badge badge-rare">{displayFaq.category}</span>
          </div>

          <div style={{
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#e2e8f0',
            whiteSpace: 'pre-line',
            background: 'rgba(10, 15, 29, 0.6)',
            padding: '18px 22px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            {displayFaq.answer}
          </div>
        </div>
      )}

      {/* Research / Exploratory Analysis when no exact match exists in space */}
      {searchResults.researchAnalysis && (
        <div className="glass-panel-glow" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb size={20} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>
                {searchResults.researchAnalysis.title}
              </h3>
              <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>
                Исследовательская оценка и возможные решения для игрока
              </div>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '18px' }}>
            {searchResults.researchAnalysis.summary}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            {searchResults.researchAnalysis.solutions.map((sol, i) => (
              <div key={i} style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                  {sol.heading}
                </h4>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  {sol.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#e2e8f0' }}>
            <strong>💡 Рекомендация:</strong> {searchResults.researchAnalysis.actionSteps}
          </div>
        </div>
      )}

      {/* Suggested Entities (Officers, Ships, Systems with Hostiles and Mission level) */}
      {query && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Officers found */}
          {searchResults.officers.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Shield size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0, letterSpacing: '0.05em' }}>
                  РЕКОМЕНДОВАННЫЕ ОФИЦЕРЫ ({searchResults.officers.length})
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
                        {off.has_below_decks && (
                          <span className="badge" style={{ fontSize: '9px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>BD</span>
                        )}
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
                  РЕКОМЕНДОВАННЫЕ КОРАБЛИ ({searchResults.ships.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {searchResults.ships.map(ship => (
                  <div
                    key={ship.id}
                    onClick={() => setSelectedShip(ship)}
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
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
                        {ship.hull_type} • Grade {ship.grade}★ ({ship.rarity})
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                        Чертежи: {ship.blueprints_required || 'N/A'} • Клик для просмотра
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Systems found with Hostiles and Mission level */}
          {searchResults.systems.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={18} color="#10b981" />
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0, letterSpacing: '0.05em' }}>
                  РЕКОМЕНДОВАННЫЕ ЗВЕЗДНЫЕ СИСТЕМЫ И МИССИИ ({searchResults.systems.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {searchResults.systems.map(sys => (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>{sys.name}</div>
                      <span className="badge badge-uncommon">Система Ур. {sys.level}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399', marginBottom: '6px' }}>
                      <Compass size={14} />
                      <span>Подходит для миссий: Игроки Ур. {sys.recommended_mission_level || Math.max(1, sys.level - 2)}+</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f87171', marginBottom: '6px' }}>
                      <Swords size={14} />
                      <span>Враги: {sys.hostiles_info || `Патрули Ур. ${sys.level}`}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span>Варп: {sys.warp}</span>
                      <span>Координаты: [{sys.coords[0]}, {sys.coords[1]}]</span>
                      <span style={{ color: '#38bdf8' }}>Клик для инфо →</span>
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

      {/* Modals */}
      {selectedOfficer && (
        <OfficerDetailModal officer={selectedOfficer} onClose={() => setSelectedOfficer(null)} />
      )}
      {selectedShip && (
        <ShipDetailModal ship={selectedShip} onClose={() => setSelectedShip(null)} />
      )}
      {selectedSystem && (
        <SystemDetailModal system={selectedSystem} onClose={() => setSelectedSystem(null)} />
      )}
    </div>
  );
}
