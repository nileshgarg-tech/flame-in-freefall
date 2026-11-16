# ARCHITECTURE: SI-Powered Fire Safety Intelligence System

> **Philosophy Reference:** *Lauren Tan ("All Code Is Slop (Except Mine)")*  
> "The codebase itself must become the constraint system. When an AI agent makes a mistake, do not patch it with prose in `AGENTS.md`. Push the constraint down into types, linters, schemas, and deterministic verification tests."

---

## 1. System Overview & The Inverted Trust Pyramid

This project is built around the **Inverted Trust Pyramid** demonstrated by Lauren Tan:

```
                  ┌─────────────────────────────────────┐
                  │      PROSE & INTENT (Weakest)       │
                  │   AGENTS.md, Prompts, User Spec     │
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────▼──────────────────┐
                  │    CANONICAL FEATURE MAP & VOCAB    │
                  │  FEATURE_MAP.md (Single Source of   │
                  │  Truth for routes, keys, & metrics) │
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────▼──────────────────┐
                  │   VERIFICATION & ARTIFACTS STACK    │
                  │  Vitest unit & contract suites,     │
                  │  data ingestion checks, DOM/canvas  │
                  │  validation artifacts               │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────▼───────────────────────────┐
         │       CODEBASE & STATIC ANALYSIS (Strongest Base)     │
         │  Strict TypeScript (`strict: true`, no `any`),        │
         │  Zod runtime validation schemas, algebraic types,     │
         │  ban on footgun APIs (uncontrolled effects,           │
         │  loose mutations), zero-slop ESLint rules.           │
         └───────────────────────────────────────────────────────┘
```

---

## 2. Technical Stack Selection

| Component | Technology | Rationale & Guardrails |
|---|---|---|
| **Build System & Dev Server** | Vite 6 / React 18+ | Sub-second HMR, standard ESM, minimal build boilerplate, no bloated configuration slop. |
| **Language & Type System** | TypeScript 5+ (Strict Mode) | `noImplicitAny: true`, `strictNullChecks: true`, `exactOptionalPropertyTypes: true`. Makes illegal domain states unrepresentable. |
| **Runtime Data Contracts** | Zod 3+ | Validates all 24 NASA PSI JSONs and 22 CSV tables during build-time ingestion. |
| **Styling & Design System** | Tailwind CSS + Lucide Icons | Utility-first, zero dead CSS, standard spacing & color tokens (slate/cyan/amber/rose). |
| **Physics & Flame Rendering** | HTML5 Canvas 2D | Deterministic simulation of microgravity diffusion vs 1g buoyant flame morphology without heavyweight 3D engine overhead. |
| **Testing & Verification** | Vitest | Instant test execution, in-memory DOM simulation, generates deterministic verification artifacts. |
| **Data Ingestion Script** | Node.js + TypeScript | Compiles all 24 PSI directories, catalog records, and CSV tables into a validated, optimized JSON bundle (`psi_database.json`). |

---

## 3. Data Pipeline & Schema Validation

The 24 PSI investigations comprise raw CSVs with non-uniform column namings (e.g., `XO2` vs `X_O2`, `GMT date` vs `Test Date`). The architecture uses a two-phase data pipeline:

```
  Raw Files:
  data/catalog.json
  data/PSI-###/investigation.json ──────┐
  data/PSI-###/experimental-table/*.csv │
                                        ▼
                         ┌─────────────────────────────┐
                         │   Ingestion & Normalizer    │
                         │   (scripts/ingest-psi.ts)   │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │     Zod Schema Contract     │
                         │    (src/schemas/psi.ts)     │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │   Pre-compiled Static DB    │
                         │(src/data/psi_database.json) │
                         └──────────────┬──────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
        ┌───────────────────────┐               ┌───────────────────────┐
        │  SI Ranking Engine    │               │  Interactive UI Views │
        │  (src/engine/si.ts)   │               │  (src/views/*)        │
        └───────────────────────┘               └───────────────────────┘
```

### 3.1 Zod Schema Guardrails
Every ingested record must pass strict Zod validation:
- Any missing required field halts the build with an explicit error.
- Numeric ranges (e.g. oxygen fraction between 0.0 and 1.0) are enforced at parse time.
- All column name aliases are mapped into canonical keys defined in `FEATURE_MAP.md`.

---

## 4. Super Intelligence (SI) Architecture

The SI Engine is built on three deterministic, verifiable analytical modules:

1. **Relevance Matrix (`src/engine/relevanceMatrix.ts`)**:
   - Scores the degree to which an investigation addresses Prevention (solid/gas flammability), Detection (smoke particle sizing), or Suppression (extinction limits, CO₂/He dilution).
   - Flight experiments receive full empirical weighting; ground re-analyses serve as secondary theoretical context.

2. **Environmental Affinity Evaluator (`src/engine/environmentMatcher.ts`)**:
   - Matches candidate spacecraft atmospheres (\(X_{O_2}\), total pressure, ventilation speed) against the parameter space explored in PSI runs.
   - Computes empirical coverage: how closely does existing flight data bound the planned mission atmosphere?

3. **Synthesis & Guidance Generator (`src/engine/insightGenerator.ts`)**:
   - Produces deterministic, structured fire safety recommendations with exact citations:
     - "Based on 1,194 runs in CFI-G (PSI-159), materials exposed to >30% O₂ at 70 kPa exhibit flame spread rates up to 2.4x higher than sea-level standard."
     - "FLEX (PSI-69) demonstrates that CO₂ suppression requires a minimum mole fraction of 0.42 to extinguish droplet flames in 0g."

---

## 5. Automated Verification & Artifact Emission

Following Lauren Tan's mandate that **"Human code review shifts from reading raw lines of code to reviewing verification artifacts"**, the repository includes an automated verification runner:
- `npm run test`: Executes unit tests for schema contracts, data normalization, and SI scoring.
- `npm run verify`: Runs typecheck, linting, unit tests, and outputs a structured verification artifact: `dist/verification-report.json`.
- Any pull request or agent run must present a clean verification artifact before merge.
