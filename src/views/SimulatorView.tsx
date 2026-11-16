import React, { useState, useEffect, useRef } from 'react';
import { Activity, Flame, Gauge, AlertTriangle, ShieldCheck } from 'lucide-react';
import { calculateFlameMorphology, calculateSolidFlameSpreadRate, calculateDropletExtinctionRatio } from '../engine/physicsCalculators';

export const SimulatorView: React.FC = () => {
  const [oxygenPct, setOxygenPct] = useState<number>(32); // Default to Lunar Moon Base 32%
  const [pressureKpa, setPressureKpa] = useState<number>(70.3); // 10.2 psi
  const [ventilationCmS, setVentilationCmS] = useState<number>(10);
  const [material, setMaterial] = useState<'SIBAL_fabric' | 'PMMA_plastic' | 'Nomex'>('SIBAL_fabric');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const oxygenFraction = oxygenPct / 100.0;
  const microgMorph = calculateFlameMorphology(oxygenFraction, pressureKpa, ventilationCmS, 0);
  const earthMorph = calculateFlameMorphology(oxygenFraction, pressureKpa, ventilationCmS, 1);
  const spreadRate = calculateSolidFlameSpreadRate(material, oxygenFraction, ventilationCmS);
  const extinctionRatio = calculateDropletExtinctionRatio(0.15, 0.05, oxygenFraction);

  // Canvas Flame Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const halfWidth = width / 2;

      // Divider line
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(halfWidth, 20);
      ctx.lineTo(halfWidth, height - 20);
      ctx.stroke();

      // Side Labels
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('MICROGRAVITY (0g) — DIFFUSION SPHERE', 30, 35);
      ctx.fillStyle = '#fb923c';
      ctx.fillText('EARTH REFERENCE (1g) — BUOYANT TEARDROP', halfWidth + 30, 35);

      // --- Left: Microgravity Flame (0g) ---
      const microX = halfWidth / 2;
      const microY = height / 2 + 20;

      // Burner tip / sample support
      ctx.fillStyle = '#475569';
      ctx.fillRect(microX - 4, microY + 50, 8, 40);

      if (!microgMorph.isExtinguished) {
        const radius = microgMorph.apparentDiameterMm * 2.2 + Math.sin(tick * 0.05) * 1.5;

        // Outer blue diffusion glow
        const radGrad = ctx.createRadialGradient(microX, microY, 2, microX, microY, radius * 1.6);
        radGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)'); // Core pale cyan
        radGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.7)'); // Sky blue
        radGrad.addColorStop(0.8, 'rgba(2, 132, 199, 0.3)'); // Deep blue
        radGrad.addColorStop(1, 'rgba(3, 105, 161, 0.0)');

        ctx.beginPath();
        ctx.arc(microX, microY, radius * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // High oxygen inner hot core (if O2 > 30%)
        if (oxygenFraction > 0.30) {
          const innerCore = ctx.createRadialGradient(microX, microY, 0, microX, microY, radius * 0.6);
          innerCore.addColorStop(0, 'rgba(254, 240, 138, 0.8)'); // Pale yellow
          innerCore.addColorStop(1, 'rgba(251, 146, 60, 0.0)');
          ctx.beginPath();
          ctx.arc(microX, microY, radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = innerCore;
          ctx.fill();
        }

        // Quiescent spherical soot particles
        ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
        for (let i = 0; i < 6; i++) {
          const angle = (tick * 0.02 + i * (Math.PI / 3));
          const dist = radius * 1.1 + Math.sin(tick * 0.03 + i) * 3;
          ctx.beginPath();
          ctx.arc(microX + Math.cos(angle) * dist, microY + Math.sin(angle) * dist, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px ui-monospace, monospace';
        ctx.fillText('EXTINGUISHED (SUB-LOI)', microX - 70, microY);
      }

      // --- Right: Earth Normal Flame (1g) ---
      const earthX = halfWidth + halfWidth / 2;
      const earthY = height / 2 + 50;

      // Burner tip
      ctx.fillStyle = '#475569';
      ctx.fillRect(earthX - 4, earthY, 8, 40);

      if (!earthMorph.isExtinguished) {
        const flameH = earthMorph.flameHeightMm * 2.8 + Math.sin(tick * 0.15) * 5;
        const flameW = earthMorph.apparentDiameterMm * 1.8 + Math.cos(tick * 0.1) * 2;

        // Upward flickering teardrop
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(earthX - flameW / 2, earthY);
        ctx.bezierCurveTo(
          earthX - flameW, earthY - flameH * 0.5,
          earthX - flameW * 0.4, earthY - flameH,
          earthX + Math.sin(tick * 0.2) * 4, earthY - flameH
        );
        ctx.bezierCurveTo(
          earthX + flameW * 0.4, earthY - flameH,
          earthX + flameW, earthY - flameH * 0.5,
          earthX + flameW / 2, earthY
        );
        ctx.closePath();

        const teardropGrad = ctx.createLinearGradient(earthX, earthY, earthX, earthY - flameH);
        teardropGrad.addColorStop(0, '#38bdf8'); // Blue base
        teardropGrad.addColorStop(0.3, '#f97316'); // Bright orange
        teardropGrad.addColorStop(0.7, '#facc15'); // Yellow soot luminous zone
        teardropGrad.addColorStop(1, 'rgba(239, 68, 68, 0.1)'); // Tip

        ctx.fillStyle = teardropGrad;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px ui-monospace, monospace';
        ctx.fillText('EXTINGUISHED', earthX - 40, earthY - 20);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [oxygenFraction, pressureKpa, ventilationCmS, microgMorph, earthMorph]);

  const applyPreset = (preset: 'lunar' | 'iss' | 'eva' | 'earth') => {
    if (preset === 'lunar') {
      setOxygenPct(32);
      setPressureKpa(70.3);
      setVentilationCmS(10);
    } else if (preset === 'iss') {
      setOxygenPct(21);
      setPressureKpa(101.3);
      setVentilationCmS(15);
    } else if (preset === 'eva') {
      setOxygenPct(100);
      setPressureKpa(29.6);
      setVentilationCmS(5);
    } else {
      setOxygenPct(21);
      setPressureKpa(101.3);
      setVentilationCmS(20);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4" />
          <span>Microgravity Physics Visualizer</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Microgravity Flame Morphology Simulator
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Observe how the absence of buoyant convection transforms flame geometry, soot production, and extinction boundaries under lunar and deep-space conditions.
        </p>
      </div>

      {/* Presets Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2">Quick Presets:</span>
        <button
          onClick={() => applyPreset('lunar')}
          className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-700 text-xs font-semibold text-white"
        >
          🌕 Moon Base (32% O₂, 70 kPa)
        </button>
        <button
          onClick={() => applyPreset('iss')}
          className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-700 text-xs font-semibold text-white"
        >
          🛰️ Space Station (21% O₂, 101 kPa)
        </button>
        <button
          onClick={() => applyPreset('eva')}
          className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-700 text-xs font-semibold text-white"
        >
          🧑‍🚀 EVA Suit (100% O₂, 30 kPa)
        </button>
        <button
          onClick={() => applyPreset('earth')}
          className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-700 text-xs font-semibold text-white"
        >
          🌍 Earth Reference (21% O₂, 1g)
        </button>
      </div>

      {/* Simulation Canvas */}
      <div className="rounded-2xl bg-space-900 border border-space-800 overflow-hidden shadow-2xl relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          className="w-full h-80 bg-space-950 block"
        />
        <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-500">
          Rendered via HTML5 Canvas 2D Physics Pipeline
        </div>
      </div>

      {/* Control Sliders & Physics Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-space-900 border border-space-800 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-flame-400" />
            Atmospheric Test Controls
          </h3>

          {/* Oxygen Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-flame-400">Oxygen Concentration (XO₂)</span>
              <span className="font-mono text-white font-bold">{oxygenPct}% O₂</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              step="1"
              value={oxygenPct}
              onChange={(e) => setOxygenPct(parseInt(e.target.value))}
              className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-flame-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>10% (Quench LOI)</span>
              <span>21% (Earth Standard)</span>
              <span>32% (Lunar Base)</span>
              <span>85% (CFI-G Max)</span>
            </div>
          </div>

          {/* Pressure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-cyan-400">Chamber Total Pressure</span>
              <span className="font-mono text-white font-bold">{pressureKpa} kPa</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="1"
              value={pressureKpa}
              onChange={(e) => setPressureKpa(parseFloat(e.target.value))}
              className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>29.6 kPa (Suit)</span>
              <span>70.3 kPa (Moon Base)</span>
              <span>101.3 kPa (1 atm)</span>
              <span>150 kPa</span>
            </div>
          </div>

          {/* Ventilation Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-400">Forced Ventilation Airflow</span>
              <span className="font-mono text-white font-bold">{ventilationCmS} cm/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={ventilationCmS}
              onChange={(e) => setVentilationCmS(parseInt(e.target.value))}
              className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 cm/s (Quiescent 0g)</span>
              <span>10 cm/s (Lunar HVAC)</span>
              <span>20 cm/s (Saffire-I)</span>
              <span>50 cm/s (BASS High)</span>
            </div>
          </div>

          {/* Material Select */}
          <div className="pt-2 border-t border-space-800 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Solid Test Fuel:</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as any)}
              className="px-3 py-1.5 bg-space-800 border border-space-700 rounded-lg text-xs text-white"
            >
              <option value="SIBAL_fabric">SIBAL Fabric (75% Cotton, 25% Fiberglass - Saffire)</option>
              <option value="PMMA_plastic">PMMA Clear Acrylic (BASS-II)</option>
              <option value="Nomex">Nomex Aerospace Aramid</option>
            </select>
          </div>
        </div>

        {/* Real-time Empirical Metrics Card */}
        <div className="p-6 rounded-2xl bg-space-900 border border-space-800 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Empirical Output Metrics
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-space-800/60 border border-space-700/60 flex justify-between items-center">
              <span className="text-slate-400">Flame Geometry:</span>
              <span className="text-cyan-400 font-bold capitalize">{microgMorph.flameShape}</span>
            </div>

            <div className="p-3 rounded-xl bg-space-800/60 border border-space-700/60 flex justify-between items-center">
              <span className="text-slate-400">Adiabatic Temp:</span>
              <span className="text-flame-400 font-bold">{microgMorph.colorTempK} K</span>
            </div>

            <div className="p-3 rounded-xl bg-space-800/60 border border-space-700/60 flex justify-between items-center">
              <span className="text-slate-400">Diffusion Diameter:</span>
              <span className="text-white font-bold">{microgMorph.apparentDiameterMm} mm</span>
            </div>

            <div className="p-3 rounded-xl bg-space-800/60 border border-space-700/60 flex justify-between items-center">
              <span className="text-slate-400">Solid Spread Rate:</span>
              <span className="text-emerald-400 font-bold">{spreadRate} mm/s</span>
            </div>

            <div className="p-3 rounded-xl bg-space-800/60 border border-space-700/60 flex justify-between items-center">
              <span className="text-slate-400">Droplet Extinction Ratio:</span>
              <span className="text-amber-400 font-bold">{extinctionRatio} (de/d0)</span>
            </div>
          </div>

          {/* Operational Advisory */}
          <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
            microgMorph.isExtinguished
              ? 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
              : oxygenPct > 30
              ? 'bg-amber-950/40 border border-amber-800/60 text-amber-300'
              : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
          }`}>
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              {microgMorph.isExtinguished ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{microgMorph.isExtinguished ? 'Extinction Condition' : oxygenPct > 30 ? 'Elevated Hyperoxic Hazard' : 'Quiescent Baseline'}</span>
            </div>
            <p className="leading-relaxed">
              {microgMorph.isExtinguished
                ? 'Atmosphere is below Limiting Oxygen Index (LOI) or airflow strain exceeds extinction limit. Self-extinguishing.'
                : oxygenPct > 30
                ? 'Oxygen concentration >30% accelerates solid flame spread up to 2.4x. Matches NASA CFI-G & Saffire hyperoxic regimes.'
                : 'Diffusion-dominated microgravity flame matches standard ISS ventilation envelope.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
