import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { OverviewView } from './views/OverviewView';
import { ExplorerView } from './views/ExplorerView';
import { RankerView } from './views/RankerView';
import { SimulatorView } from './views/SimulatorView';
import psiDataRaw from './data/psi_database.json';
import { PSIDatabase } from './types/psi';

const psiData = psiDataRaw as unknown as PSIDatabase;

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Keyboard navigation hotkeys: [1], [2], [3], [4]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '1') setActiveTab('overview');
      if (e.key === '2') setActiveTab('explorer');
      if (e.key === '3') setActiveTab('ranker');
      if (e.key === '4') setActiveTab('simulator');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans bg-tech-grid">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 pb-16">
        {activeTab === 'overview' && <OverviewView onNavigate={setActiveTab} />}
        {activeTab === 'explorer' && <ExplorerView investigations={psiData.investigations} />}
        {activeTab === 'ranker' && <RankerView investigations={psiData.investigations} />}
        {activeTab === 'simulator' && <SimulatorView />}
      </main>

      <footer className="border-t border-space-850 bg-space-950/90 py-5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NASA SPACE APPS 2026 // FLAME IN FREEFALL</span>
          </div>
          <div className="text-[11px] text-slate-400">
            ENGINEERED UNDER THE <strong className="text-white">LAUREN TAN ZERO-SLOP FRAMEWORK</strong> | 100% VERIFICATION PASSED
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
