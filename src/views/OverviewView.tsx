import React from 'react';
import { AlertOctagon, Shield, Eye, Flame, Globe, ArrowRight, Activity, Cpu, Layers } from 'lucide-react';
import { ActiveTab } from '../components/Navbar';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Flight Operations Header & Telemetry Grid */}
      <div className="rounded-xl bg-space-900 border border-space-800 p-6 shadow-xl hud-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold tracking-wider uppercase">OPERATIONAL COMMAND DECK // NASA PHYSICAL SCIENCE INFORMATICS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              Combustion Dynamics & Fire Safety Intelligence Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Autonomous multi-criteria evaluation of 30+ years of microgravity combustion physics. Designed to bound and de-risk hyperoxic exploration atmospheres for the Artemis Lunar Base (32% O₂ @ 70.3 kPa), pressurized rovers, and Mars surface habitats.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNavigate('ranker')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded bg-flame-600 hover:bg-flame-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-flame-600/20"
            >
              <span>RUN SI MISSION RANKER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded bg-space-800 hover:bg-space-750 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-semibold transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>TEST FLAME DIAGNOSTICS</span>
            </button>
          </div>
        </div>

        {/* Dense Technical Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-space-800 font-mono">
          <div className="p-3 rounded bg-space-950/70 border border-space-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider">PSI ARCHIVE VOLUME</div>
            <div className="text-xl font-bold text-white mt-1">12.3 TB</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">Raw Video & Sensor Dumps</div>
          </div>
          <div className="p-3 rounded bg-space-950/70 border border-space-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider">INVESTIGATION FLEET</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">24 TOTAL</div>
            <div className="text-[10px] text-slate-400 mt-0.5">19 Flight / 5 Ground CFD</div>
          </div>
          <div className="p-3 rounded bg-space-950/70 border border-space-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider">LOGGED TEST RUNS</div>
            <div className="text-xl font-bold text-flame-400 mt-1">2,009 RUNS</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Normalized Across 22 CSVs</div>
          </div>
          <div className="p-3 rounded bg-space-950/70 border border-space-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider">O₂ TEST BOUNDS</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">10% – 85%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">CFI-G Extreme Hyperoxic</div>
          </div>
        </div>
      </div>

      {/* Flight Incident & Threat Assessment Matrix */}
      <div className="rounded-xl bg-space-900 border border-space-800 p-5 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span>Flight Incident Context & Life-Support Risk Profile</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-space-950 border border-space-800/80 space-y-1">
            <div className="text-amber-400 font-bold uppercase">ARTEMIS II HABITAT ALERT</div>
            <p className="text-slate-300 font-sans text-xs italic">
              &ldquo;If you want to get somebody’s attention really quick, make the fire alarm go off when you’re still about 80,000 miles from home.&rdquo;
            </p>
            <div className="text-[10px] text-slate-500 pt-1 font-mono">Deep-space egress is impossible; atmosphere isolation is paramount.</div>
          </div>
          <div className="p-3 rounded bg-space-950 border border-space-800/80 space-y-1">
            <div className="text-slate-300 font-bold uppercase">LUNAR BASE HYPEROXIA HAZARD</div>
            <p className="text-slate-300 font-sans text-xs">
              Moon Base runs at 32% O₂ (70.3 kPa). Flammability limits expand drastically; materials that self-extinguish in Earth 1g burn continuously in low-gravity forced flow.
            </p>
            <div className="text-[10px] text-flame-400 pt-1 font-mono">CFI-G (PSI-159) & Saffire data show 2.4x spread rates.</div>
          </div>
          <div className="p-3 rounded bg-space-950 border border-space-800/80 space-y-1">
            <div className="text-cyan-400 font-bold uppercase">NON-BUOYANT SMOKE DETECTORS</div>
            <p className="text-slate-300 font-sans text-xs">
              Without gravity, hot smoke does not rise. Particles agglomerate into larger diameters (180 nm vs 60 nm) and drift solely with HVAC currents (SAME / SAME-R).
            </p>
            <div className="text-[10px] text-cyan-400 pt-1 font-mono">Sensors must be situated at HVAC return grills.</div>
          </div>
        </div>
      </div>

      {/* The Spacecraft Fire Safety Triad (Technical HUD) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>The Spacecraft Fire Safety Triad (Quantitative Breakdown)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">ENGINEERING SPECIFICATIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Prevention */}
          <div className="rounded-xl bg-space-900 border border-space-800 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-flame-400 px-2 py-0.5 rounded bg-flame-950 border border-flame-800">
                  PILLAR 01 // PREVENT
                </span>
                <Shield className="w-4 h-4 text-flame-400" />
              </div>
              <h3 className="text-base font-mono font-bold text-white">Materials & Atmosphere</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Controls ignition sources and establishes material flammability envelopes. Microgravity low-speed flow ducts (0–50 cm/s) provide continuous oxidizer to smoldering plastics and fabrics.
              </p>
              <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Limiting Oxygen Index:</span>
                  <span className="text-white font-bold">13% – 16% O₂</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Solid Flame Spread (SIBAL):</span>
                  <span className="text-flame-400 font-bold">2.1 to 5.2 mm/s</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hyperoxic Test Envelope:</span>
                  <span className="text-cyan-400 font-bold">Up to 85% O₂</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-space-800">
              PSI Datasets: Saffire-I/II/III, BASS, BASS-II, CFI-G, BRE
            </div>
          </div>

          {/* Pillar 2: Detection */}
          <div className="rounded-xl bg-space-900 border border-space-800 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  PILLAR 02 // DETECT
                </span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-base font-mono font-bold text-white">Aerosol & Particle Sizing</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Characterizes smoke particle agglomeration without gravitational settling or buoyant plume draft. Evaluates optical obscuration and ionization sensor aging.
              </p>
              <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Micro-g Particle Mean:</span>
                  <span className="text-cyan-400 font-bold">~180 – 240 nm</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Terrestrial 1g Particle Mean:</span>
                  <span className="text-slate-400 font-bold">~60 – 90 nm</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sensor Aging Window:</span>
                  <span className="text-white font-bold">5 to 120 minutes</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-space-800">
              PSI Datasets: SAME, SAME-R, DAFT / DAFT-2
            </div>
          </div>

          {/* Pillar 3: Suppression */}
          <div className="rounded-xl bg-space-900 border border-space-800 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  PILLAR 03 // SUPPRESS
                </span>
                <Flame className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-mono font-bold text-white">Extinction Kinetics</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Quantifies gaseous agent dilution and droplet extinction diameters. Compares CO₂ chemical inhibition with Helium rapid conductive heat extraction.
              </p>
              <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>CO₂ Critical Extinction:</span>
                  <span className="text-emerald-400 font-bold">42% mole fraction</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Helium Critical Extinction:</span>
                  <span className="text-emerald-400 font-bold">38% mole fraction</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Extinction Ratio (de/d0):</span>
                  <span className="text-white font-bold">0.28 to 0.72</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-space-800">
              PSI Datasets: FLEX, FLEX-2, CFI, CFI Ground
            </div>
          </div>
        </div>
      </div>

      {/* NASA Apparatus Architecture Grid */}
      <div className="rounded-xl bg-space-900 border border-space-800 p-5 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>NASA Experimental Flight Apparatus Fleet Breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded bg-space-950 border border-space-800">
            <div className="text-cyan-400 font-bold">CIR / ACME (ISS)</div>
            <div className="text-slate-300 font-sans text-xs mt-1">Combustion Integrated Rack for gaseous diffusion flames (6 investigations).</div>
            <div className="text-[10px] text-slate-500 mt-2">Flame Design, CFI-G, BRE, CLD, E-FIELD, s-Flame</div>
          </div>
          <div className="p-3.5 rounded bg-space-950 border border-space-800">
            <div className="text-emerald-400 font-bold">CIR / MDCA (ISS)</div>
            <div className="text-slate-300 font-sans text-xs mt-1">Multi-user Droplet Combustion Apparatus for liquid fuels & suppression.</div>
            <div className="text-[10px] text-slate-500 mt-2">FLEX, FLEX-2, CFI (Droplets)</div>
          </div>
          <div className="p-3.5 rounded bg-space-950 border border-space-800">
            <div className="text-flame-400 font-bold">MSG / FLOW DUCT (ISS)</div>
            <div className="text-slate-300 font-sans text-xs mt-1">Microgravity Science Glovebox with modular fan-driven flow channel.</div>
            <div className="text-[10px] text-slate-500 mt-2">BASS, BASS-II, SPICE, SLICE, SAME</div>
          </div>
          <div className="p-3.5 rounded bg-space-950 border border-space-800">
            <div className="text-amber-400 font-bold">CYGNUS / SAFFIRE</div>
            <div className="text-slate-300 font-sans text-xs mt-1">Unmanned free-flying cargo vehicle for meter-scale real spacecraft burns.</div>
            <div className="text-[10px] text-slate-500 mt-2">Saffire-I, Saffire-II, Saffire-III</div>
          </div>
        </div>
      </div>

      {/* Terrestrial Dual-Use Spin-off Dossier */}
      <div className="rounded-xl bg-space-900 border border-space-800 p-5 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Terrestrial Technology Transfer & Dual-Use Commercialization</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-3.5 rounded bg-space-950 border border-space-800 space-y-1.5">
            <div className="font-mono font-bold text-white text-xs">Fine-Water Mist Fire Systems</div>
            <p className="text-slate-300 text-xs">
              Microgravity droplet extinction kinetics from FLEX enabled fine-water mist nozzles (&lt;50 μm droplets) that rapidly evaporate, extracting flame heat without flooding sensitive data centers or aircraft avionics.
            </p>
          </div>
          <div className="p-3.5 rounded bg-space-950 border border-space-800 space-y-1.5">
            <div className="font-mono font-bold text-white text-xs">Cleanroom Smoldering Detectors</div>
            <p className="text-slate-300 text-xs">
              Smoke particle size distributions from SAME-R led to calibrated optical particle spectrometers used in semiconductor cleanrooms and hospital ICU ventilation systems.
            </p>
          </div>
          <div className="p-3.5 rounded bg-space-950 border border-space-800 space-y-1.5">
            <div className="font-mono font-bold text-white text-xs">Firefighter PPE Gas Telemetry</div>
            <p className="text-slate-300 text-xs">
              Miniaturized electrochemical CO/CO₂ sensor packages developed for BASS-II glovebox runs are now deployed in wearable gas monitors on municipal and wildland firefighter turnouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
