import React from 'react';
import { Flame, Compass, BrainCircuit, Activity, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'overview' | 'explorer' | 'ranker' | 'simulator';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Mission Overview', icon: Flame },
    { id: 'explorer' as ActiveTab, label: 'PSI Data Explorer', icon: Compass },
    { id: 'ranker' as ActiveTab, label: 'SI Mission Ranker', icon: BrainCircuit },
    { id: 'simulator' as ActiveTab, label: 'Flame Simulator', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 bg-space-900/90 backdrop-blur-md border-b border-space-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & NASA Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-flame-600 to-amber-400 flex items-center justify-center shadow-lg shadow-flame-500/20">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide text-white flex items-center gap-2">
                FLAME IN FREEFALL
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  NASA 2026
                </span>
              </span>
              <p className="text-xs text-slate-400 font-mono">SI-Powered Spacecraft Fire Safety</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-flame-600 text-white shadow-md shadow-flame-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-space-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Verification Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>SI Trust Stack: Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
};
