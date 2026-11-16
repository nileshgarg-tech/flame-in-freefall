import React, { useState, useMemo } from 'react';
import { BrainCircuit, Sliders, Award } from 'lucide-react';
import { PSIInvestigation, MissionEnvironmentId } from '../types/psi';
import { MISSION_ENVIRONMENTS } from '../constants/environments';
import { rankInvestigations, DEFAULT_WEIGHTS, RankingWeights } from '../engine/si';
import { generateSIReport } from '../engine/insightGenerator';

interface RankerViewProps {
  investigations: PSIInvestigation[];
}

export const RankerView: React.FC<RankerViewProps> = ({ investigations }) => {
  const [envId, setEnvId] = useState<MissionEnvironmentId>('moon_base');
  const [weights, setWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);

  const currentEnv = MISSION_ENVIRONMENTS[envId]!;

  const rankedResults = useMemo(() => {
    return rankInvestigations(investigations, currentEnv, weights);
  }, [investigations, currentEnv, weights]);

  const siReport = useMemo(() => {
    return generateSIReport(currentEnv, rankedResults);
  }, [currentEnv, rankedResults]);

  const envOptions: { id: MissionEnvironmentId; name: string; desc: string }[] = [
    { id: 'moon_base', name: 'Lunar Moon Base', desc: '32% O₂ @ 70.3 kPa (10.2 psi)' },
    { id: 'iss_transit', name: 'ISS / Transit Spacecraft', desc: '21% O₂ @ 101.3 kPa (14.7 psi)' },
    { id: 'mars_habitat', name: 'Martian Habitat', desc: '30% O₂ @ 55.2 kPa (8.0 psi)' },
    { id: 'eva_suit', name: 'EVA Spacesuit', desc: '100% O₂ @ 29.6 kPa (4.3 psi)' },
    { id: 'terrestrial_sea_level', name: 'Earth 1g Standard', desc: '21% O₂ @ 101.3 kPa (1.0 g)' },
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-flame-400 font-mono text-xs uppercase tracking-wider mb-1">
          <BrainCircuit className="w-4 h-4" />
          <span>Super Intelligence Optimization Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          SI Spacecraft Fire Safety Ranker
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Dynamically evaluate and prioritize the 24 NASA PSI investigations against your target mission atmospheric envelope.
        </p>
      </div>

      {/* Target Environment Selector */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Step 1: Select Mission Operational Environment
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {envOptions.map((opt) => {
            const isSelected = envId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setEnvId(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-space-850 border-flame-500 shadow-lg shadow-flame-500/10 ring-1 ring-flame-500'
                    : 'bg-space-900 border-space-800 hover:border-space-700 text-slate-400'
                }`}
              >
                <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {opt.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SI Interactive Weighting Sliders */}
      <div className="p-5 rounded-2xl bg-space-900 border border-space-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Step 2: Tune Safety Pillar Weightings
            </h3>
          </div>
          <button
            onClick={() => setWeights(DEFAULT_WEIGHTS)}
            className="text-xs text-slate-400 hover:text-white underline font-mono"
          >
            Reset to NASA Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Prevention Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-flame-400">Prevention Weight</span>
              <span className="font-mono text-slate-300">{Math.round(weights.preventionWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.preventionWeight}
              onChange={(e) => setWeights({ ...weights, preventionWeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-flame-500"
            />
            <p className="text-[11px] text-slate-500">Materials flammability, high O₂ testing, solid flame spread.</p>
          </div>

          {/* Detection Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-cyan-400">Detection Weight</span>
              <span className="font-mono text-slate-300">{Math.round(weights.detectionWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.detectionWeight}
              onChange={(e) => setWeights({ ...weights, detectionWeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[11px] text-slate-500">Smoke particle sizing, sensor aging, non-buoyant aerosol transport.</p>
          </div>

          {/* Suppression Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-400">Suppression Weight</span>
              <span className="font-mono text-slate-300">{Math.round(weights.suppressionWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.suppressionWeight}
              onChange={(e) => setWeights({ ...weights, suppressionWeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-slate-500">Gaseous CO₂/Helium dilution, droplet extinction diameters.</p>
          </div>
        </div>
      </div>

      {/* Grounded SI Insights Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-flame-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-flame-400 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Grounded SI Safety Assessment ({siReport.environmentName})</span>
        </div>
        <h3 className="text-xl font-bold text-white">{siReport.headline}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Critical Risks */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">Identified Critical Risks</span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {siReport.criticalRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitigation Guidelines */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Engineered Mitigation Guidelines</span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {siReport.mitigationGuidelines.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>{m.pillar}:</strong> {m.guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-space-800 text-xs text-slate-400 flex items-center justify-between">
          <span><strong>Terrestrial Dual-Use:</strong> {siReport.earthDualUseApplication}</span>
        </div>
      </div>

      {/* Ranked Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            Ranked Investigation Index ({rankedResults.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Sorted by SI Composite Score</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-space-800 bg-space-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-space-800 text-slate-300 font-mono">
              <tr>
                <th className="p-3 w-16 text-center">Rank</th>
                <th className="p-3">Investigation</th>
                <th className="p-3">Safety Pillar</th>
                <th className="p-3 w-36">SI Score</th>
                <th className="p-3">Pillar Align</th>
                <th className="p-3">Env Affinity</th>
                <th className="p-3">Operational Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800 font-mono text-slate-300">
              {rankedResults.map((res, idx) => {
                const rankNum = idx + 1;
                const inv = res.investigation;
                const isTop3 = rankNum <= 3;

                return (
                  <tr key={inv.id} className={`hover:bg-space-800/50 ${isTop3 ? 'bg-flame-950/10' : ''}`}>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold ${
                        rankNum === 1
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                          : rankNum === 2
                          ? 'bg-slate-300 text-black'
                          : rankNum === 3
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-400'
                      }`}>
                        {rankNum}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{inv.acronym}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{inv.id}: {inv.title}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                        inv.safetyPillar === 'prevention'
                          ? 'bg-flame-950 text-flame-400 border-flame-800'
                          : inv.safetyPillar === 'detection'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}>
                        {inv.safetyPillar}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-space-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-flame-500 h-full rounded-full"
                            style={{ width: `${res.totalScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-white">{res.totalScore}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{res.pillarScore}%</td>
                    <td className="p-3 text-cyan-400">{res.environmentAffinity}%</td>
                    <td className="p-3 text-[11px] text-slate-300 font-sans max-w-sm">
                      {res.investigation.operationalInsights[0] ?? res.explanation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
