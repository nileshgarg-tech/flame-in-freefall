import React, { useState, useMemo } from 'react';
import { Sliders, Award, AlertTriangle, CheckSquare, Target } from 'lucide-react';
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

  const envOptions: { id: MissionEnvironmentId; name: string; tag: string; pO2: string }[] = [
    { id: 'moon_base', name: 'LUNAR MOON BASE', tag: '32% O₂ @ 70.3 kPa', pO2: '22.5 kPa' },
    { id: 'iss_transit', name: 'ISS / ORION TRANSIT', tag: '21% O₂ @ 101.3 kPa', pO2: '21.3 kPa' },
    { id: 'mars_habitat', name: 'MARTIAN SURFACE', tag: '30% O₂ @ 55.2 kPa', pO2: '16.5 kPa' },
    { id: 'eva_suit', name: 'EVA SPACESUIT', tag: '100% O₂ @ 29.6 kPa', pO2: '29.6 kPa' },
    { id: 'terrestrial_sea_level', name: 'EARTH 1G BASELINE', tag: '21% O₂ @ 101.3 kPa', pO2: '21.3 kPa' },
  ];

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-space-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-bold tracking-wider uppercase">SI EVALUATION CORE // MULTI-CRITERIA DECISION MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Mission Atmospheric Risk Ranker & SI Advisory
          </h2>
        </div>
        <div className="text-[11px] text-slate-400">
          ALGORITHM: <span className="text-cyan-400 font-bold">Si(E) = 100 × [∑ w·P] × Φenv × Γdata</span>
        </div>
      </div>

      {/* Target Operational Environment Dial */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-flame-400" />
          <span>Select Target Spacecraft / Habitat Atmosphere Profile</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {envOptions.map((opt) => {
            const isSelected = envId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setEnvId(opt.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-space-900 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                    : 'bg-space-950 border-space-800 hover:border-space-700 text-slate-400'
                }`}
              >
                <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {opt.name}
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">{opt.tag}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">PO₂: {opt.pO2}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Tuning Console */}
      <div className="p-4 rounded-xl bg-space-900 border border-space-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-white font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pillar Weight Coefficients (Normalized)</span>
          </div>
          <button
            onClick={() => setWeights(DEFAULT_WEIGHTS)}
            className="text-[10px] text-slate-400 hover:text-white underline"
          >
            RESET DEFAULTS
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Prevention Slider */}
          <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800">
            <div className="flex justify-between">
              <span className="text-flame-400 font-bold">W_PREVENTION</span>
              <span className="text-white font-bold">{Math.round(weights.preventionWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.preventionWeight}
              onChange={(e) => setWeights({ ...weights, preventionWeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-space-800 rounded appearance-none cursor-pointer accent-flame-500"
            />
            <div className="text-[10px] text-slate-500">Solid/gas flammability, high O₂ testing.</div>
          </div>

          {/* Detection Slider */}
          <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800">
            <div className="flex justify-between">
              <span className="text-cyan-400 font-bold">W_DETECTION</span>
              <span className="text-white font-bold">{Math.round(weights.detectionWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.detectionWeight}
              onChange={(e) => setWeights({ ...weights, detectionWeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-space-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-[10px] text-slate-500">Aerosol sizing & non-buoyant transport.</div>
          </div>

          {/* Suppression Slider */}
          <div className="space-y-1.5 p-3 rounded bg-space-950 border border-space-800">
            <div className="flex justify-between">
              <span className="text-emerald-400 font-bold">W_SUPPRESSION</span>
              <span className="text-white font-bold">{Math.round(weights.suppressionWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.suppressionWeight}
              onChange={(e) => setWeights({ ...weights, suppressionWeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-space-800 rounded appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="text-[10px] text-slate-500">CO₂ & Helium droplet extinction bounds.</div>
          </div>
        </div>
      </div>

      {/* Grounded SI Advisory Report */}
      <div className="rounded-xl bg-space-900 border border-space-700 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-space-800 pb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-flame-400">
            <Award className="w-4 h-4" />
            <span>SI TACTICAL ADVISORY REPORT // {siReport.environmentName.toUpperCase()}</span>
          </div>
          <span className="text-[10px] text-slate-400">INTEGRITY: GROUNDED IN PSI DATA</span>
        </div>

        <div className="text-sm font-bold text-white font-sans">
          {siReport.headline}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {/* Critical Risks */}
          <div className="p-3.5 rounded bg-space-950 border border-space-800 space-y-2">
            <div className="font-mono text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Identified Life-Support Vulnerabilities</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {siReport.criticalRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-mono font-bold">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitigation Guidelines */}
          <div className="p-3.5 rounded bg-space-950 border border-space-800 space-y-2">
            <div className="font-mono text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Engineered Countermeasure Guidelines</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {siReport.mitigationGuidelines.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-mono font-bold">✓</span>
                  <span><strong>{m.pillar}:</strong> {m.guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ranked Investigations Table */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white uppercase tracking-wider">
            Ranked Investigation Roster ({rankedResults.length} In-Scope)
          </span>
          <span className="text-slate-500 text-[11px]">SORTED BY SI SCORE (DESCENDING)</span>
        </div>

        <div className="rounded-xl border border-space-800 bg-space-900 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-space-950 text-slate-400 border-b border-space-800">
                <tr>
                  <th className="p-2.5 w-12 text-center">RANK</th>
                  <th className="p-2.5 w-24">ID</th>
                  <th className="p-2.5 w-32">ACRONYM</th>
                  <th className="p-2.5 w-36">SI SCORE</th>
                  <th className="p-2.5 w-24">PILLAR</th>
                  <th className="p-2.5 w-24">ENV FIT</th>
                  <th className="p-2.5">OPERATIONAL RELEVANCE JUSTIFICATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800 text-slate-300">
                {rankedResults.map((res, idx) => {
                  const rank = idx + 1;
                  const inv = res.investigation;
                  const isTop = rank <= 3;
                  return (
                    <tr key={inv.id} className={`hover:bg-space-850 ${isTop ? 'bg-cyan-950/20' : ''}`}>
                      <td className="p-2.5 text-center font-bold">
                        <span className={`inline-block w-5 h-5 rounded text-[11px] leading-5 text-center ${
                          rank === 1 ? 'bg-amber-500 text-black font-extrabold' : rank <= 3 ? 'bg-cyan-700 text-white' : 'text-slate-500'
                        }`}>
                          {rank}
                        </span>
                      </td>
                      <td className="p-2.5 text-cyan-400 font-bold">{inv.id}</td>
                      <td className="p-2.5 font-bold text-white">{inv.acronym}</td>
                      <td className="p-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-space-950 rounded h-1.5 overflow-hidden">
                            <div className="bg-cyan-400 h-full" style={{ width: `${res.totalScore}%` }} />
                          </div>
                          <span className="font-bold text-white">{res.totalScore}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-300">{res.pillarScore}%</td>
                      <td className="p-2.5 text-cyan-400">{res.environmentAffinity}%</td>
                      <td className="p-2.5 font-sans text-xs text-slate-200 max-w-sm truncate">
                        {inv.operationalInsights[0] ?? res.explanation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
