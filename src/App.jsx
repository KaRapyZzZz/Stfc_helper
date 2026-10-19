import React, { useState } from 'react';
import Header from './components/Header';
import KnowledgeTab from './components/KnowledgeTab';
import CalculatorTab from './components/CalculatorTab';
import ExplorerTab from './components/ExplorerTab';
import { HelpCircle, Calculator, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('knowledge'); // 'knowledge', 'calculator', 'explorer'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 10%, #172554 0%, #0a0d14 60%)' }}>
      <Header />

      {/* Main Tabs Navigation */}
      <nav style={{ padding: '16px 20px 0 20px' }}>
        <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <button
            onClick={() => setActiveTab('knowledge')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '8px',
              background: activeTab === 'knowledge' ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(30, 58, 138, 0.4))' : 'transparent',
              border: activeTab === 'knowledge' ? '1px solid #38bdf8' : '1px solid transparent',
              color: activeTab === 'knowledge' ? '#f8fafc' : '#94a3b8',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'knowledge' ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
            }}
          >
            <HelpCircle size={18} color={activeTab === 'knowledge' ? '#38bdf8' : '#64748b'} />
            <span>ВКЛАДКА 1: БАЗА ЗНАНИЙ И ВОПРОСЫ</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '8px',
              background: activeTab === 'calculator' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(180, 83, 9, 0.3))' : 'transparent',
              border: activeTab === 'calculator' ? '1px solid #f59e0b' : '1px solid transparent',
              color: activeTab === 'calculator' ? '#f8fafc' : '#94a3b8',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'calculator' ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none'
            }}
          >
            <Calculator size={18} color={activeTab === 'calculator' ? '#f59e0b' : '#64748b'} />
            <span>ВКЛАДКА 2: КАЛЬКУЛЯТОР И СИНЕРГИИ</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '8px',
              background: activeTab === 'explorer' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 95, 70, 0.3))' : 'transparent',
              border: activeTab === 'explorer' ? '1px solid #10b981' : '1px solid transparent',
              color: activeTab === 'explorer' ? '#f8fafc' : '#94a3b8',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'explorer' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
            }}
          >
            <Database size={18} color={activeTab === 'explorer' ? '#10b981' : '#64748b'} />
            <span>ВКЛАДКА 3: НАВИГАТОР STFC.SPACE</span>
          </button>
        </div>
      </nav>

      {/* Tab Viewport */}
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {activeTab === 'knowledge' && <KnowledgeTab />}
        {activeTab === 'calculator' && <CalculatorTab />}
        {activeTab === 'explorer' && <ExplorerTab />}
      </main>

      {/* Footer status bar */}
      <footer style={{
        padding: '10px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#64748b',
        background: '#090c14'
      }}>
        <div>Star Trek Fleet Command Helper • Репозиторий: KaRapyZzZz/Stfc_helper</div>
        <div>Offline Database Loaded: 293 Officers, 116 Ships, 500 Systems • STFC.SPACE API</div>
      </footer>
    </div>
  );
}
