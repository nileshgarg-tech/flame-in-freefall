import React, { useState, useEffect, useRef } from 'react';
import { Flame, Gauge, AlertTriangle, ShieldCheck } from 'lucide-react';
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

  // Derived non-dimensional numbers (Damköhler & Reynolds)
  const reynoldsNumber = Math.round((ventilationCmS * 0.01 * 0.02) / (1.5e-5) * 10) / 10;
  const damkohlerNumber = microgMorph.isExtinguished ? 0.2 : Math.round((2.5 / Math.max(0.1, ventilationCmS * 0.1)) * 10) / 10;

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

      // Coordinate Grid Lines (Technical Reticle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Divider line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(halfWidth, 10);
      ctx.lineTo(halfWidth, height - 10);
      ctx.stroke();

      // Side Labels with Technical Badges
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('[CH 01] μg-DIFFUSION REGIME (g ≈ 0)', 24, 28);
      ctx.fillStyle = '#fb923c';
      ctx.fillText('[CH 02] 1g-BUOYANT CONVECTIVE PLUME (g = 1)', halfWidth + 24, 28);

      // --- Left: Microgravity Flame (0g) ---
      const microX = halfWidth / 2;
      const microY = height / 2 + 15;

      // Millimeter Scale Ruler (Reticle)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(microX - 60, microY + 80);
      ctx.lineTo(microX + 60, microY + 80);
      ctx.stroke();
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fillText('-30mm', microX - 60, microY + 95);
      ctx.fillText('0', microX - 2, microY + 95);
      ctx.fillText('+30mm', microX + 35, microY + 95);

      // Burner tip / sample support
      ctx.fillStyle = '#334155';
      ctx.fillRect(microX - 4, microY + 45, 8, 35);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(microX - 2, microY + 45, 4, 3);

      if (!microgMorph.isExtinguished) {
        const radius = microgMorph.apparentDiameterMm * 2.1 + Math.sin(tick * 0.04) * 1.2;

        // Isotherm outer gradient ring
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(microX, microY, radius * 1.8, 0, Math.PI * 2);
        ctx.stroke();

        // Blue diffusion sphere glow
        const radGrad = ctx.createRadialGradient(microX, microY, 2, microX, microY, radius * 1.5);
        radGrad.addColorStop(0, 'rgba(186, 230, 253, 0.95)'); // Core pale cyan
        radGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.7)'); // Sky blue
        radGrad.addColorStop(0.75, 'rgba(2, 132, 199, 0.3)'); // Deep blue
        radGrad.addColorStop(1, 'rgba(3, 105, 161, 0.0)');

        ctx.beginPath();
        ctx.arc(microX, microY, radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // High oxygen inner hot core (if O2 > 30%)
        if (oxygenFraction > 0.30) {
          const innerCore = ctx.createRadialGradient(microX, microY, 0, microX, microY, radius * 0.6);
          innerCore.addColorStop(0, 'rgba(254, 240, 138, 0.85)'); // Pale yellow
          innerCore.addColorStop(1, 'rgba(251, 146, 60, 0.0)');
          ctx.beginPath();
          ctx.arc(microX, microY, radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = innerCore;
          ctx.fill();
        }

        // Quiescent soot shell particles
        ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
        for (let i = 0; i < 6; i++) {
          const angle = (tick * 0.02 + i * (Math.PI / 3));
          const dist = radius * 1.15 + Math.sin(tick * 0.03 + i) * 2;
          ctx.beginPath();
          ctx.arc(microX + Math.cos(angle) * dist, microY + Math.sin(angle) * dist, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillText('CRITICAL: EXTINCTION (SUB-LOI)', microX - 90, microY);
      }

      // --- Right: Earth Normal Flame (1g) ---
      const earthX = halfWidth + halfWidth / 2;
      const earthY = height / 2 + 45;

      // Reticle
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(earthX - 60, earthY + 50);
      ctx.lineTo(earthX + 60, earthY + 50);
      ctx.stroke();
      ctx.fillStyle = 'rgba(251, 146, 60, 0.6)';
      ctx.fillText('-30mm', earthX - 60, earthY + 65);
      ctx.fillText('0', earthX - 2, earthY + 65);
      ctx.fillText('+30mm', earthX + 35, earthY + 65);

      // Burner tip
      ctx.fillStyle = '#334155';
      ctx.fillRect(earthX - 4, earthY + 5, 8, 40);

      if (!earthMorph.isExtinguished) {
        const flameH = earthMorph.flameHeightMm * 2.8 + Math.sin(tick * 0.15) * 4;
        const flameW = earthMorph.apparentDiameterMm * 1.7 + Math.cos(tick * 0.1) * 2;

        // Upward flickering teardrop
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(earthX - flameW / 2, earthY + 5);
        ctx.bezierCurveTo(
          earthX - flameW, earthY - flameH * 0.5,
          earthX - flameW * 0.35, earthY - flameH,
          earthX + Math.sin(tick * 0.25) * 3, earthY - flameH
        );
        ctx.bezierCurveTo(
          earthX + flameW * 0.35, earthY - flameH,
          earthX + flameW, earthY - flameH * 0.5,
          earthX + flameW / 2, earthY + 5
        );
        ctx.closePath();

        const teardropGrad = ctx.createLinearGradient(earthX, earthY + 5, earthX, earthY - flameH);
        teardropGrad.addColorStop(0, '#38bdf8'); // Blue base
        teardropGrad.addColorStop(0.3, '#f97316'); // Bright orange
        teardropGrad.addColorStop(0.7, '#facc15'); // Yellow soot luminous zone
        teardropGrad.addColorStop(1, 'rgba(239, 68, 68, 0.05)');

        ctx.fillStyle = teardropGrad;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillText('EXTINGUISHED', earthX - 45, earthY - 20);
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
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-space-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-bold tracking-wider uppercase">COMBUSTION BENCH // DUAL-CHAMBER OPTICAL RETICLE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Microgravity Flame Physics & Extinction Diagnostics
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400">ATMOSPHERIC PRESETS:</span>
          <button
            onClick={() => applyPreset('lunar')}
            className="px-2.5 py-1 rounded bg-space-900 hover:bg-space-800 border border-cyan-800 text-[10px] text-cyan-300 font-bold"
          >
            LUNAR (32%)
          </button>
          <button
            onClick={() => applyPreset('iss')}
            className="px-2.5 py-1 rounded bg-space-900 hover:bg-space-800 border border-space-700 text-[10px] text-slate-300"
          >
            ISS (21%)
          </button>
          <button
            onClick={() => applyPreset('eva')}
            className="px-2.5 py-1 rounded bg-space-900 hover:bg-space-800 border border-flame-800 text-[10px] text-flame-400 font-bold"
          >
            EVA (100%)
          </button>
          <button
            onClick={() => applyPreset('earth')}
            className="px-2.5 py-1 rounded bg-space-900 hover:bg-space-800 border border-space-700 text-[10px] text-slate-400"
          >
            EARTH 1G
          </button>
        </div>
      </div>

      {/* Optical Scale Visualizer Canvas */}
      <div className="rounded-xl bg-space-950 border border-space-800 overflow-hidden shadow-2xl relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-72 bg-space-950 block"
        />
        <div className="p-2 border-t border-space-800/80 bg-space-900/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>OPTICAL RETICLE: 1 DIV = 10 mm // DUAL CAMERA RIG // CFD VALIDATION MATRIX</span>
          <span className="text-cyan-400 font-bold">REYNOLDS: {reynoldsNumber} | DAMKÖHLER: {damkohlerNumber}</span>
        </div>
      </div>

      {/* Control Racks & Real-Time Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sliders Console */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-space-900 border border-space-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
            <Flame className="w-4 h-4 text-flame-400" />
            <span>Atmospheric Chamber Parameter Knobs</span>
          </div>

          {/* Oxygen Slider */}
          <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800">
            <div className="flex justify-between text-xs">
              <span className="text-flame-400 font-bold">OXYGEN MOLE FRACTION (XO₂)</span>
              <span className="text-white font-bold">{oxygenPct}% O₂</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              step="1"
              value={oxygenPct}
              onChange={(e) => setOxygenPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded appearance-none cursor-pointer accent-flame-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10% (Sub-LOI Quench)</span>
              <span>21% (Earth Standard)</span>
              <span>32% (Lunar Moon Base)</span>
              <span>85% (NASA CFI-G Limit)</span>
            </div>
          </div>

          {/* Pressure Slider */}
          <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400 font-bold">CHAMBER TOTAL STATIC PRESSURE</span>
              <span className="text-white font-bold">{pressureKpa} kPa</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="1"
              value={pressureKpa}
              onChange={(e) => setPressureKpa(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>29.6 kPa (Spacesuit)</span>
              <span>70.3 kPa (Moon Base)</span>
              <span>101.3 kPa (1 atm)</span>
              <span>150 kPa</span>
            </div>
          </div>

          {/* Ventilation Airflow */}
          <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-400 font-bold">FORCED DUCT VENTILATION SPEED</span>
              <span className="text-white font-bold">{ventilationCmS} cm/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={ventilationCmS}
              onChange={(e) => setVentilationCmS(parseInt(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 cm/s (Quiescent)</span>
              <span>10 cm/s (Lunar HVAC)</span>
              <span>20 cm/s (Saffire-I)</span>
              <span>50 cm/s (BASS High)</span>
            </div>
          </div>

          {/* Solid Material Specimen */}
          <div className="p-3 rounded bg-space-950 border border-space-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">SOLID TEST SPECIMEN:</span>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as any)}
              className="px-2.5 py-1 bg-space-900 border border-space-700 rounded text-xs text-white font-mono"
            >
              <option value="SIBAL_fabric">SIBAL Fabric (75% Cotton, 25% Fiberglass — Saffire)</option>
              <option value="PMMA_plastic">PMMA Clear Acrylic Slab (BASS-II)</option>
              <option value="Nomex">Nomex Aerospace Aramid Fabric</option>
            </select>
          </div>
        </div>

        {/* Real-time Diagnostics HUD Card */}
        <div className="p-5 rounded-xl bg-space-900 border border-space-800 space-y-4 text-xs">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider">
            <Gauge className="w-4 h-4" />
            <span>Telemetry Diagnostic Readouts</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-space-950 border border-space-800 flex justify-between items-center">
              <span className="text-slate-400">FLAME REGIME:</span>
              <span className="text-cyan-400 font-bold uppercase">{microgMorph.flameShape}</span>
            </div>

            <div className="p-2.5 rounded bg-space-950 border border-space-800 flex justify-between items-center">
              <span className="text-slate-400">ADIABATIC TEMPERATURE:</span>
              <span className="text-flame-400 font-bold">{microgMorph.colorTempK} K</span>
            </div>

            <div className="p-2.5 rounded bg-space-950 border border-space-800 flex justify-between items-center">
              <span className="text-slate-400">DIFFUSION DIAMETER:</span>
              <span className="text-white font-bold">{microgMorph.apparentDiameterMm} mm</span>
            </div>

            <div className="p-2.5 rounded bg-space-950 border border-space-800 flex justify-between items-center">
              <span className="text-slate-400">SOLID FLAME SPREAD:</span>
              <span className="text-emerald-400 font-bold">{spreadRate} mm/s</span>
            </div>

            <div className="p-2.5 rounded bg-space-950 border border-space-800 flex justify-between items-center">
              <span className="text-slate-400">DROPLET EXTINCTION:</span>
              <span className="text-amber-400 font-bold">{extinctionRatio} (de/d0)</span>
            </div>
          </div>

          {/* Safety Status Banner */}
          <div className={`p-3 rounded border text-[11px] space-y-1 ${
            microgMorph.isExtinguished
              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
              : oxygenPct > 30
              ? 'bg-amber-950/40 border-amber-800 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}>
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              {microgMorph.isExtinguished ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{microgMorph.isExtinguished ? 'EXTINCTION LIMIT TRIGGERED' : oxygenPct > 30 ? 'HYPEROXIC FLAMMABILITY HAZARD' : 'NOMINAL DIFFUSION STATE'}</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed">
              {microgMorph.isExtinguished
                ? 'Atmosphere is below Limiting Oxygen Index (LOI < 13%) or aerodynamic strain exceeds blow-off threshold.'
                : oxygenPct > 30
                ? 'Elevated oxygen (>30%) accelerates flame spread up to 2.4x. Validated against CFI-G (PSI-159) and Saffire flight burns.'
                : 'Steady diffusion sphere matches standard ISS rack ventilation envelopes.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
