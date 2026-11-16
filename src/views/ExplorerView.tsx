import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Table, X, Info, LayoutGrid, List, ArrowLeftRight } from 'lucide-react';
import { PSIInvestigation } from '../types/psi';

interface ExplorerViewProps {
  investigations: PSIInvestigation[];
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ investigations }) => {
  const [search, setSearch] = useState('');
  const [pillarFilter, setPillarFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [flightOnly, setFlightOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedInv, setSelectedInv] = useState<PSIInvestigation | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

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

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1]!, id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const comparedInvs = useMemo(() => {
    return compareIds.map((id) => investigations.find((i) => i.id === id)!).filter(Boolean);
  }, [compareIds, investigations]);

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Matrix Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-bold tracking-wider uppercase">NASA PHYSICAL SCIENCE INFORMATICS // DATA MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight mt-0.5">
            24 Investigation Combustion Science Catalog
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {compareIds.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>COMPARE ({compareIds.length}/2)</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-space-900 border border-space-800 p-1 rounded font-mono text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-space-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-space-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Card Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-xl bg-space-900 border border-space-800 space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="SEARCH BY ID, ACRONYM, FUEL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-space-950 border border-space-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Safety Pillar */}
          <div>
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value)}
              className="w-full px-3 py-2 bg-space-950 border border-space-800 rounded text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">ALL SAFETY PILLARS</option>
              <option value="prevention">PREVENTION (MATERIALS & O₂)</option>
              <option value="detection">DETECTION (SMOKE & DUST)</option>
              <option value="suppression">SUPPRESSION (EXTINCTION)</option>
            </select>
          </div>

          {/* Fuel Phase */}
          <div>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full px-3 py-2 bg-space-950 border border-space-800 rounded text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">ALL FUEL PHASES</option>
              <option value="solid">SOLID (FABRICS, PLASTICS)</option>
              <option value="liquid">LIQUID (DROPLETS)</option>
              <option value="gas">GAS (DIFFUSION BURNERS)</option>
            </select>
          </div>

          {/* Flight Only Toggle */}
          <div className="flex items-center space-x-2 px-1">
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={flightOnly}
                onChange={(e) => setFlightOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-space-950 border-space-700 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-[11px]">FLIGHT EXPERIMENTS ONLY (19)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-space-800/80 text-[11px] text-slate-400">
          <span>MATCHING RECORDS: <strong className="text-white">{filtered.length}</strong> / {investigations.length}</span>
          <span className="text-slate-500">TIP: Click any row for run logs; click checkbox to compare.</span>
        </div>
      </div>

      {/* Main Content: Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-space-800 bg-space-900 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-space-950 text-slate-300 border-b border-space-800">
                <tr>
                  <th className="p-3 w-10 text-center">CMP</th>
                  <th className="p-3 w-24">ACCESSION</th>
                  <th className="p-3 w-32">ACRONYM</th>
                  <th className="p-3">INVESTIGATION TITLE</th>
                  <th className="p-3 w-28">HARDWARE</th>
                  <th className="p-3 w-24">PILLAR</th>
                  <th className="p-3 w-20">PHASE</th>
                  <th className="p-3 w-24 text-right">LOGGED RUNS</th>
                  <th className="p-3 w-24 text-right">ARCHIVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800 text-slate-300">
                {filtered.map((inv) => {
                  const isChecked = compareIds.includes(inv.id);
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInv(inv)}
                      className="hover:bg-space-850 cursor-pointer transition-colors group"
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleCompare(inv.id, e as any)}
                          className="w-3.5 h-3.5 rounded bg-space-950 border-space-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-cyan-400 font-bold">{inv.id}</td>
                      <td className="p-3 font-bold text-white group-hover:text-cyan-300">{inv.acronym}</td>
                      <td className="p-3 text-slate-200 font-sans truncate max-w-sm">{inv.title}</td>
                      <td className="p-3 text-slate-400 truncate max-w-[140px]">{inv.hardware}</td>
                      <td className="p-3">
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          inv.safetyPillar === 'prevention'
                            ? 'bg-flame-950 text-flame-400 border border-flame-800'
                            : inv.safetyPillar === 'detection'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {inv.safetyPillar}
                        </span>
                      </td>
                      <td className="p-3 capitalize text-slate-400">{inv.fuelPhase}</td>
                      <td className="p-3 text-right font-bold text-white">{inv.totalRunCount}</td>
                      <td className="p-3 text-right text-slate-400">{inv.publishedArchiveSize}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Matrix View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((inv) => {
            const isChecked = compareIds.includes(inv.id);
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInv(inv)}
                className="rounded-xl bg-space-900 border border-space-800 hover:border-cyan-500/60 p-4 space-y-3 cursor-pointer transition-all hover:bg-space-850 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">{inv.id}</span>
                      <h3 className="text-base font-mono font-bold text-white">{inv.acronym}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCompare(inv.id, e as any)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 rounded bg-space-950 border-space-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        inv.safetyPillar === 'prevention'
                          ? 'bg-flame-950 text-flame-400 border border-flame-800'
                          : inv.safetyPillar === 'detection'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {inv.safetyPillar}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                    {inv.title}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                    <div>Hardware: <strong className="text-slate-300">{inv.hardware}</strong></div>
                    <div>Fuel: <strong className="text-slate-300 capitalize">{inv.fuelPhase}</strong></div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-space-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{inv.totalRunCount} logged runs</span>
                  <span>{inv.publishedArchiveSize}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Investigation Details Modal */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-space-950 border border-space-700 rounded-xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            {/* Header */}
            <div className="p-5 border-b border-space-800 flex items-start justify-between bg-space-900">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">{selectedInv.id}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-white font-bold">{selectedInv.acronym}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700">
                    {selectedInv.flightExperiment ? 'FLIGHT EXPERIMENT' : 'GROUND STUDY'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans">{selectedInv.title}</h3>
                <div className="text-[11px] text-slate-400">
                  Hardware: <strong className="text-slate-300">{selectedInv.hardware}</strong> | Archive: <strong className="text-slate-300">{selectedInv.publishedArchiveSize}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedInv(null)}
                className="p-1.5 rounded bg-space-800 hover:bg-space-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Objective */}
              <div className="space-y-1.5">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">NASA Objective</div>
                <p className="font-sans text-xs text-slate-200 bg-space-900 p-3.5 rounded border border-space-800 leading-relaxed">
                  {selectedInv.objective}
                </p>
              </div>

              {/* Operational Safety Takeaway */}
              {selectedInv.operationalInsights.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-flame-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Fire Safety Operational Takeaway</span>
                  </div>
                  <div className="p-3.5 rounded bg-flame-950/20 border border-flame-800/40 text-flame-200 font-sans text-xs leading-relaxed">
                    {selectedInv.operationalInsights[0]}
                  </div>
                </div>
              )}

              {/* Run Tables */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5" />
                  <span>Published Experimental Run Tables ({selectedInv.runTables.length})</span>
                </div>
                {selectedInv.runTables.map((t, idx) => (
                  <div key={idx} className="p-3 rounded bg-space-900 border border-space-800 flex justify-between items-center text-[11px]">
                    <div>
                      <span className="font-bold text-white">{t.fileName}</span>
                      <span className="text-slate-400 ml-2">({t.rowCount} data rows, {t.columnCount} columns)</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Headers: {t.columns.slice(0, 3).join(', ')}...</span>
                  </div>
                ))}
              </div>

              {/* Sample Runs Preview */}
              {selectedInv.sampleRuns.length > 0 && (
                <div className="space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    Empirical Run Data Points ({selectedInv.sampleRuns.length} Sample Records)
                  </div>
                  <div className="overflow-x-auto rounded border border-space-800 bg-space-900">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-space-950 text-slate-400 border-b border-space-800">
                        <tr>
                          <th className="p-2">RUN ID</th>
                          <th className="p-2">FUEL</th>
                          <th className="p-2">O₂ FRACTION</th>
                          <th className="p-2">PRESSURE</th>
                          <th className="p-2">FLOW / VELOCITY</th>
                          <th className="p-2">BURN TIME / EXTINCTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-space-800 text-slate-300">
                        {selectedInv.sampleRuns.slice(0, 8).map((run, rIdx) => (
                          <tr key={rIdx} className="hover:bg-space-850">
                            <td className="p-2 text-cyan-400 font-bold">{run.runId}</td>
                            <td className="p-2">{run.fuel ?? 'N/A'}</td>
                            <td className="p-2">{run.oxygenFraction !== undefined ? `${Math.round(run.oxygenFraction * 100)}%` : 'N/A'}</td>
                            <td className="p-2">{run.pressureKpa !== undefined ? `${run.pressureKpa} kPa` : 'N/A'}</td>
                            <td className="p-2">{run.flowRateOrVelocity !== undefined ? run.flowRateOrVelocity : 'N/A'}</td>
                            <td className="p-2">
                              {run.extinctionDiameterMm !== undefined 
                                ? `${run.extinctionDiameterMm} mm` 
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

            {/* Footer */}
            <div className="p-4 border-t border-space-800 bg-space-900 flex justify-between items-center">
              <a
                href={`https://psi.nasa.gov/physci/repo/data/investigations/${selectedInv.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold"
              >
                <span>OPEN NASA PSI REPOSITORY RECORD</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedInv(null)}
                className="px-4 py-1.5 rounded bg-space-800 hover:bg-space-700 text-white font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && comparedInvs.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-space-950 border border-cyan-800 rounded-xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            <div className="p-4 border-b border-space-800 flex items-center justify-between bg-space-900">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <ArrowLeftRight className="w-4 h-4" />
                <span>SIDE-BY-SIDE TECHNICAL COMPARISON</span>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded bg-space-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 gap-6">
              {comparedInvs.map((inv) => (
                <div key={inv.id} className="space-y-4 p-4 rounded bg-space-900 border border-space-800">
                  <div className="border-b border-space-800 pb-3">
                    <span className="text-cyan-400 font-bold">{inv.id}</span>
                    <h3 className="text-lg font-bold text-white">{inv.acronym}</h3>
                    <p className="text-xs text-slate-300 font-sans mt-1">{inv.title}</p>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-space-800">
                      <span className="text-slate-400">Safety Pillar:</span>
                      <span className="font-bold text-white uppercase">{inv.safetyPillar}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-space-800">
                      <span className="text-slate-400">Fuel Phase:</span>
                      <span className="font-bold text-white uppercase">{inv.fuelPhase}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-space-800">
                      <span className="text-slate-400">Hardware Apparatus:</span>
                      <span className="font-bold text-slate-200">{inv.hardware}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-space-800">
                      <span className="text-slate-400">Total Run Count:</span>
                      <span className="font-bold text-flame-400">{inv.totalRunCount}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-space-800">
                      <span className="text-slate-400">NASA Archive Size:</span>
                      <span className="font-bold text-cyan-400">{inv.publishedArchiveSize}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Operational Impact:</span>
                    <p className="font-sans text-xs text-slate-300 bg-space-950 p-2.5 rounded border border-space-800">
                      {inv.operationalInsights[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
