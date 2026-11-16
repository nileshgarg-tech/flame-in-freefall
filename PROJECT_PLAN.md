# PROJECT_PLAN: SI-Powered Spacecraft Fire Safety Intelligence Dashboard

> **Guiding Principle:** *Lauren Tan ("All Code Is Slop (Except Mine)")*  
> "Break work into deterministic, verifiable milestones where success is measured by executable verification artifacts rather than speculative code volume."

---

## Milestone Overview & Progress Tracker

| Milestone | Objective | Key Deliverables | Verification Exit Criteria |
|---|---|---|---|
| **Phase 0** | **Tooling, Types & Guardrails** | Git repo, `package.json`, `tsconfig.json` (strict), Vitest, ESLint | `npm run typecheck` passes with zero errors; git repo clean. |
| **Phase 1** | **Data Ingestion & Schemas** | Zod schemas, ingestion script, normalized `psi_database.json` | 24 investigations & 22 CSVs validated; ingestion tests pass. |
| **Phase 2** | **SI Engine & Math Models** | Ranking algorithms, environmental matcher, flame physics | Unit tests verify ranking math, boundary conditions, zero hallucinations. |
| **Phase 3** | **Interactive UI & Visualizer** | React dashboard, Overview, Explorer, Ranker, Canvas Simulator | Component rendering tests pass; zero console errors; smooth 60fps canvas. |
| **Phase 4** | **Verification Harness** | Automated `npm run verify` pipeline, verification artifact output | Generates `dist/verification-report.json` with 100% test passing rate. |
| **Phase 5** | **Documentation & Submission** | Clean README, user guide, NASA Space Apps submission dossier | Complete documentation, runnable locally in one command. |

---

## Detailed Milestone Breakdown

### Phase 0: Tooling, Types & Codebase Hygiene (Base of Trust Pyramid)
- [x] Analyze challenge scope, constraints, and data assets.
- [x] Author core context documents (`CONTEXT.md`, `ARCHITECTURE.md`, `FEATURE_MAP.md`).
- [ ] Initialize Git repository with professional `.gitignore` and semantic initial commits.
- [ ] Setup modern Node/TypeScript project (`package.json`, `tsconfig.json`).
- [ ] Configure strict TypeScript compiler options (`strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`).
- [ ] Configure Vitest test runner.
- **Exit Criteria:** `npm run typecheck` and `npm test` execute cleanly without warnings or errors.

### Phase 1: Data Ingestion & Schema Normalization Pipeline
- [ ] Write Zod schemas for PSI investigations, run tables, and metadata contracts (`src/schemas/psi.ts`).
- [ ] Implement robust ingestion script (`scripts/ingest-psi.ts` or Python pipeline) that parses:
  - `data/catalog.json` (24 investigations)
  - Individual `data/PSI-###/investigation.json`
  - 22 raw CSV tables in `data/PSI-###/experimental-table/`
- [ ] Normalize column aliases into canonical keys defined in `FEATURE_MAP.md`.
- [ ] Compile into optimized `src/data/psi_database.json`.
- [ ] Write ingestion unit tests (`tests/ingestion.test.ts`) validating 100% data fidelity.
- **Exit Criteria:** Ingestion test verifies all 24 investigations, all 22 CSV tables parsed, zero unhandled schemas, exact row counts match `DATASETS.md`.

### Phase 2: Super Intelligence (SI) Ranking & Physics Engine
- [ ] Implement `src/engine/relevanceMatrix.ts`: Quantitative mapping of investigations against Prevention, Detection, and Suppression.
- [ ] Implement `src/engine/environmentMatcher.ts`: Multi-parameter distance metric comparing Moon Base, Mars Habitat, ISS, and EVA suit environments against empirical test envelopes.
- [ ] Implement `src/engine/physicsCalculators.ts`:
  - Limiting Oxygen Index (LOI) estimation.
  - Flame spread rate scaling with forced flow velocity.
  - Droplet extinction diameter modeling (\(d_e / d_0\)).
  - Smoke particle agglomeration scaling in \(\mu g\) vs \(1g\).
- [ ] Implement `src/engine/insightGenerator.ts`: Deterministic, grounded natural language synthesis with direct PSI accession citations.
- [ ] Write unit tests (`tests/engine.test.ts`) covering all scoring edge cases.
- **Exit Criteria:** Engine tests achieve 100% branch coverage on scoring formulas; ranking order strictly matches NASA domain expectations (e.g., Saffire & BASS rank highest for Lunar Moon Base solid flammability; FLEX ranks highest for suppression).

### Phase 3: Interactive Web Dashboard & Physics Simulation
- [ ] Configure Tailwind CSS design system with aerospace aesthetic (slate/cyan/emerald/amber/rose palettes).
- [ ] Build Navigation and Shell (`src/App.tsx`, `src/components/Navbar.tsx`).
- [ ] Build **Overview View** (`src/views/OverviewView.tsx`):
  - Executive briefing, Apollo 1 / Mir / Artemis II historical alerts.
  - Interactive Fire Safety Triad Explorer.
  - Terrestrial spin-offs showcase.
- [ ] Build **Explorer View** (`src/views/ExplorerView.tsx`):
  - 24-investigation card grid with multi-attribute filtering (Hardware, Fuel Phase, Pillar).
  - Detail drawer showing full NASA objectives, methodology, and run-table CSV browser.
- [ ] Build **SI Ranker View** (`src/views/RankerView.tsx`):
  - Mission environment presets (Moon Base, Mars Habitat, ISS, EVA Suit).
  - Dynamic weight sliders with real-time recalculation.
  - Ranked table with score explainability breakdown badges.
- [ ] Build **Simulator View** (`src/views/SimulatorView.tsx`):
  - Interactive canvas rendering 0g spherical flame vs 1g buoyant teardrop flame.
  - Real-time adjustment of Oxygen % (10% to 85%), Pressure (20 to 150 kPa), and Ventilation (0 to 50 cm/s).
  - Critical safety boundary warnings (e.g., hyperoxic runaway, extinction limits).
- **Exit Criteria:** Dashboard builds cleanly via `npm run build`; canvas visualizer animates smoothly; responsive across screen sizes.

### Phase 4: Automated Verification Harness & Artifact Emission
- [ ] Create verification script (`scripts/verify-all.ts`).
- [ ] Output structured verification artifact: `dist/verification-report.json`.
- [ ] Generate markdown verification summary with test counts, schema integrity, and performance metrics.
- **Exit Criteria:** `npm run verify` runs typecheck, lint, unit tests, and outputs a verification artifact with status `PASSED`.

### Phase 5: Repository Polish, Documentation & Submission Dossier
- [ ] Comprehensive `README.md` with visual architecture diagrams, setup instructions, and feature guide.
- [ ] Add NASA Space Apps challenge submission alignment section.
- [ ] Clean git commit history with descriptive semantic commits.
- **Exit Criteria:** Project ready for submission; cloning and running `npm install && npm run dev` launches the full dashboard instantly.
