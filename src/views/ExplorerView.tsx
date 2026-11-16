import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, HardDrive, Table, X, Info } from 'lucide-react';
import { PSIInvestigation } from '../types/psi';

interface ExplorerViewProps {
  investigations: PSIInvestigation[];
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ investigations }) => {
  const [search, setSearch] = useState('');
  const [pillarFilter, setPillarFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [flightOnly, setFlightOnly] = useState<boolean>(false);
  const [selectedInv, setSelectedInv] = useState<PSIInvestigation | null>(null);

  const filtered = useMemo(() => {
    return investigations.filter((inv) => {
      const q = search.toLowerCase();
      const matchSearch =
        inv.id.toLowerCase().includes(q) ||
        inv.acronym.toLowerCase().includes(q) ||
        inv.title.toLowerCase().includes(q) ||
        inv.hardware.toLowerCase().includes(q) ||
        inv.tags.some((t) => t.toLowerCase().includes(q));

      const matchPillar = pillarFilter === 'all' || inv.safetyPillar === pillarFilter;
      const matchPhase = phaseFilter === 'all' || inv.fuelPhase === phaseFilter;
      const matchFlight = !flightOnly || inv.flightExperiment;

      return matchSearch && matchPillar && matchPhase && matchFlight;
    });
  }, [investigations, search, pillarFilter, phaseFilter, flightOnly]);

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            NASA Physical Science Informatics Explorer
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse the 24 combustion science investigations, inspect local run tables, and explore test conditions.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-space-800 border border-space-700 text-slate-300 self-start md:self-auto">
          Showing <span className="text-flame-400 font-bold">{filtered.length}</span> of {investigations.length} investigations
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-xl bg-space-900 border border-space-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, acronym, fuel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-space-800 border border-space-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-flame-500"
            />
          </div>

          {/* Safety Pillar */}
          <div>
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value)}
              className="w-full px-3 py-2 bg-space-800 border border-space-700 rounded-lg text-sm text-white focus:outline-none focus:border-flame-500"
            >
              <option value="all">All Safety Pillars</option>
              <option value="prevention">Prevention (Materials & Atmosphere)</option>
              <option value="detection">Detection (Smoke & Aerosols)</option>
              <option value="suppression">Suppression (Extinguishment)</option>
            </select>
          </div>

          {/* Fuel Phase */}
          <div>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full px-3 py-2 bg-space-800 border border-space-700 rounded-lg text-sm text-white focus:outline-none focus:border-flame-500"
            >
              <option value="all">All Fuel Phases</option>
              <option value="solid">Solid (Polymers, Fabrics)</option>
              <option value="liquid">Liquid (Droplets)</option>
              <option value="gas">Gas (Burners)</option>
            </select>
          </div>

          {/* Flight Only Toggle */}
          <div className="flex items-center space-x-2 px-2">
            <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={flightOnly}
                onChange={(e) => setFlightOnly(e.target.checked)}
                className="w-4 h-4 rounded text-flame-600 focus:ring-flame-500 bg-space-800 border-space-700"
              />
              <span>Flight Experiments Only (19)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Investigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inv) => {
          const pillarBadgeColor =
            inv.safetyPillar === 'prevention'
              ? 'bg-flame-950/80 text-flame-400 border-flame-800'
              : inv.safetyPillar === 'detection'
              ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
              : 'bg-emerald-950/80 text-emerald-400 border-emerald-800';

          return (
            <div
              key={inv.id}
              onClick={() => setSelectedInv(inv)}
              className="group rounded-xl bg-space-900 border border-space-800 hover:border-flame-500/60 p-5 space-y-4 cursor-pointer transition-all hover:shadow-xl hover:shadow-flame-500/5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">{inv.id}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-flame-400 transition-colors">
                      {inv.acronym}
                    </h3>
                  </div>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${pillarBadgeColor}`}>
                    {inv.safetyPillar}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {inv.title}
                </p>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-500">Hardware:</span>
                    <span className="truncate">{inv.hardware}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-500">Fuel:</span>
                    <span className="capitalize">{inv.fuelPhase}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {inv.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-slate-400 border border-space-700/60 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-space-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center space-x-1.5">
                  <Table className="w-3.5 h-3.5 text-flame-400" />
                  <span>{inv.totalRunCount} logged runs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{inv.publishedArchiveSize}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal Drawer */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-space-900 border border-space-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-space-800 flex items-start justify-between bg-space-850">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-flame-400 font-bold">{selectedInv.id}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-space-800 border border-space-700 text-slate-300">
                    {selectedInv.flightExperiment ? 'Flight Experiment' : 'Ground Study'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{selectedInv.title}</h3>
                <div className="text-xs text-slate-400 font-mono">
                  Hardware: {selectedInv.hardware} | Archive Size: {selectedInv.publishedArchiveSize}
                </div>
              </div>
              <button
                onClick={() => setSelectedInv(null)}
                className="p-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Objectives */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Objective</h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-space-800/40 p-4 rounded-xl border border-space-800">
                  {selectedInv.objective}
                </p>
              </div>

              {/* Operational Safety Insights */}
              {selectedInv.operationalInsights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-flame-400 font-mono flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Operational Fire Safety Takeaway
                  </h4>
                  <div className="bg-flame-950/20 border border-flame-800/40 p-4 rounded-xl text-sm text-flame-200">
                    {selectedInv.operationalInsights[0]}
                  </div>
                </div>
              )}

              {/* Run Tables Overview */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  Experimental Tables ({selectedInv.runTables.length})
                </h4>
                {selectedInv.runTables.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No CSV run tables published for this ground study.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedInv.runTables.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-space-800 border border-space-700 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-mono font-semibold text-white">{t.fileName}</span>
                          <span className="text-slate-400 ml-2">({t.rowCount} data rows, {t.columnCount} columns)</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">Columns: {t.columns.slice(0, 4).join(', ')}...</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sample Runs Data Preview */}
              {selectedInv.sampleRuns.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Sample Test Run Points (First {selectedInv.sampleRuns.length} Runs)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-space-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-space-800 text-slate-300 font-mono">
                        <tr>
                          <th className="p-2.5">Run ID</th>
                          <th className="p-2.5">Fuel</th>
                          <th className="p-2.5">O2 Fraction</th>
                          <th className="p-2.5">Pressure</th>
                          <th className="p-2.5">Flow/Velocity</th>
                          <th className="p-2.5">Extinction / Burn Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-space-800 font-mono text-slate-300">
                        {selectedInv.sampleRuns.slice(0, 8).map((run, rIdx) => (
                          <tr key={rIdx} className="hover:bg-space-800/40">
                            <td className="p-2.5 text-flame-400">{run.runId}</td>
                            <td className="p-2.5">{run.fuel ?? 'N/A'}</td>
                            <td className="p-2.5">{run.oxygenFraction !== undefined ? `${Math.round(run.oxygenFraction * 100)}%` : 'N/A'}</td>
                            <td className="p-2.5">{run.pressureKpa !== undefined ? `${run.pressureKpa} kPa` : 'N/A'}</td>
                            <td className="p-2.5">{run.flowRateOrVelocity !== undefined ? run.flowRateOrVelocity : 'N/A'}</td>
                            <td className="p-2.5">
                              {run.extinctionDiameterMm !== undefined 
                                ? `${run.extinctionDiameterMm} mm (ext)` 
                                : run.burnDurationS !== undefined 
                                ? `${run.burnDurationS} s` 
                                : 'Recorded'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-space-800 bg-space-850 flex justify-between items-center">
              <a
                href={`https://psi.nasa.gov/physci/repo/data/investigations/${selectedInv.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <span>View on NASA PSI Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedInv(null)}
                className="px-4 py-2 rounded-lg bg-space-700 hover:bg-space-600 text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
