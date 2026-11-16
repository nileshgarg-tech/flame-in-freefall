import React from 'react';
import { Terminal, Database, SlidersHorizontal, Activity, ShieldCheck, Radio } from 'lucide-react';

export type ActiveTab = 'overview' | 'explorer' | 'ranker' | 'simulator';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'MISSION CONSOLE', hotkey: '1', icon: Terminal },
    { id: 'explorer' as ActiveTab, label: 'PSI DATA MATRIX', hotkey: '2', icon: Database },
    { id: 'ranker' as ActiveTab, label: 'SI TACTICAL RANKER', hotkey: '3', icon: SlidersHorizontal },
    { id: 'simulator' as ActiveTab, label: 'FLAME DIAGNOSTICS', hotkey: '4', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 bg-space-950/95 border-b border-space-800/80 backdrop-blur-md">
      {/* Top Telemetry Status Bar */}
      <div className="border-b border-space-850 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-space-900/60">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="font-bold">NASA-PSI NETWORK // LINK ACTIVE</span>
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">CIR: <strong className="text-slate-300">ONLINE</strong></span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">MDCA: <strong className="text-slate-300">NOMINAL</strong></span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">MSG DUCT: <strong className="text-slate-300">STANDBY</strong></span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-500 hidden md:inline">2026 NASA SPACE APPS CHALLENGE</span>
          <span className="flex items-center space-x-1 text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
            <ShieldCheck className="w-3 h-3" />
            <span>LAUREN TAN TRUST PYRAMID: VERIFIED</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Callout */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onTabChange('overview')}
          >
            <div className="w-8 h-8 rounded bg-space-800 border border-flame-500/60 flex items-center justify-center text-flame-400 font-mono font-bold text-sm shadow-inner group-hover:border-flame-400 transition-colors">
              μg
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sm tracking-wider text-white">
                  FLAME<span className="text-flame-500">·</span>IN<span className="text-cyan-400">·</span>FREEFALL
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-space-800 border border-space-700 text-slate-300">
                  v1.2.0
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                Microgravity Combustion Telemetry & Fire Safety SI
              </div>
            </div>
          </div>

          {/* Segmented Tactical Tabs */}
          <nav className="flex space-x-1 sm:space-x-1.5 bg-space-900/80 p-1 rounded-lg border border-space-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-space-800 text-white border border-cyan-500/60 shadow-sm font-semibold text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-space-850 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded ${isActive ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-space-850 text-slate-500'}`}>
                    {tab.hotkey}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
