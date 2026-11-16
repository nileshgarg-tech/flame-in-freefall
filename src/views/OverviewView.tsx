import React from 'react';
import { AlertTriangle, Shield, Eye, Flame, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { ActiveTab } from '../components/Navbar';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-space-900 via-space-850 to-space-900 border border-space-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-flame-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-flame-500/10 border border-flame-500/30 text-flame-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>2026 NASA Space Apps Challenge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Flame in Freefall
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
            Super Intelligence (SI)-Powered Fire Safety Insights from <strong className="text-white font-medium">30+ Years</strong> of NASA Microgravity Combustion Data. Transforming 12.3 TB of Physical Science Informatics (PSI) into actionable mission design rules for the Moon, Mars, and deep space habitats.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('ranker')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-flame-600 hover:bg-flame-500 text-white font-semibold transition-all shadow-lg shadow-flame-600/30 hover:shadow-flame-600/50"
            >
              <span>Launch SI Mission Ranker</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 font-semibold transition-all"
            >
              <Flame className="w-5 h-5 text-flame-400" />
              <span>Simulate Micro-g Flame</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-space-800/80">
          <div>
            <div className="text-3xl font-extrabold text-white">24</div>
            <div className="text-xs text-slate-400 font-mono">PSI Investigations</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-cyan-400">19</div>
            <div className="text-xs text-slate-400 font-mono">Flight Experiments (ISS/Cygnus)</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-flame-400">12.3 TB</div>
            <div className="text-xs text-slate-400 font-mono">NASA Published Video & Telemetry</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-400">2,009</div>
            <div className="text-xs text-slate-400 font-mono">Normalized Test Runs Logged</div>
          </div>
        </div>
      </div>

      {/* Historical Alert Callout */}
      <div className="rounded-xl bg-amber-950/30 border border-amber-800/50 p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold text-amber-200 uppercase tracking-wider font-mono">
            Operational Criticality: Why Fire Safety Dictates Exploration Architectures
          </div>
          <p className="text-sm text-slate-300 italic">
            &ldquo;If you want to get somebody’s attention really quick, make the fire alarm go off in your spacecraft when you’re still about 80,000 miles from home.&rdquo;
            <span className="block text-xs font-semibold text-amber-400 not-italic mt-1">— Artemis II Commander comment on deep-space habitability</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Historical milestones like the Apollo 1 tragedy, Apollo 13 oxygen tank rupture, and the 1997 Mir solid oxygen generator fire remind us that fire in an enclosed spacecraft atmosphere is an immediate existential threat.
          </p>
        </div>
      </div>

      {/* The Spacecraft Fire Safety Triad */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Spacecraft Fire Safety Triad
          </h2>
          <p className="text-sm text-slate-400">
            How NASA structures combustion research across prevention, detection, and suppression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Prevention */}
          <div className="rounded-xl bg-space-900 border border-space-800 p-6 hover:border-flame-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-flame-500/10 text-flame-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">1. Prevention</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Material selection and Limiting Oxygen Index (LOI). Because the Lunar Base operates at ~32% O₂ (10.2 psi), materials that self-extinguish on Earth sustain vigorous burning in space.
            </p>
            <div className="text-xs font-mono text-flame-400 pt-2 border-t border-space-800">
              Key Datasets: Saffire-I/II/III, BASS, BASS-II, CFI-G, BRE
            </div>
          </div>

          {/* Pillar 2: Detection */}
          <div className="rounded-xl bg-space-900 border border-space-800 p-6 hover:border-cyan-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">2. Detection</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Without gravity, hot air does not rise. Smoke particles do not travel to ceiling detectors; instead, they agglomerate into larger particles that drift solely with forced HVAC currents.
            </p>
            <div className="text-xs font-mono text-cyan-400 pt-2 border-t border-space-800">
              Key Datasets: SAME, SAME-R, DAFT/DAFT-2
            </div>
          </div>

          {/* Pillar 3: Suppression */}
          <div className="rounded-xl bg-space-900 border border-space-800 p-6 hover:border-emerald-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">3. Suppression</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditional water and chemical foams cannot be used in microgravity. Gaseous suppression with CO₂ (chemical inhibition) and Helium (thermal cooling) requires precise extinction envelopes.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-2 border-t border-space-800">
              Key Datasets: FLEX, FLEX-2, CFI
            </div>
          </div>
        </div>
      </div>

      {/* Terrestrial Spin-offs & Dual-Use */}
      <div className="rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-space-800 p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Terrestrial Dual-Use Spin-offs</h2>
        </div>
        <p className="text-sm text-slate-300">
          NASA’s microgravity combustion discoveries do not stay in orbit. They actively save lives and infrastructure on Earth:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-space-800/50 border border-space-700/60 space-y-2">
            <h4 className="font-semibold text-white text-base">Fine-Water Mist Fire Extinguishers</h4>
            <p className="text-xs text-slate-400">
              Developed for the ISS to replace toxic Halon. Deployed today in aircraft cabins, marine vessels, and data centers to suppress fires without water-damage deluge.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-space-800/50 border border-space-700/60 space-y-2">
            <h4 className="font-semibold text-white text-base">Advanced Cleanroom Detection</h4>
            <p className="text-xs text-slate-400">
              Aerosol agglomeration physics from SAME provide early-warning smoldering detection in semiconductor cleanrooms and hospital ICU air handlers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-space-800/50 border border-space-700/60 space-y-2">
            <h4 className="font-semibold text-white text-base">Firefighter PPE Gas Sensors</h4>
            <p className="text-xs text-slate-400">
              Micro-sensor telemetry miniaturized for BASS-II glovebox gas monitoring now powers real-time toxic gas detectors integrated into modern firefighter breathing apparatus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
