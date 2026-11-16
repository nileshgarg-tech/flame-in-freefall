# Flame in Freefall: SI-Powered Fire Safety Intelligence Dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnileshgarg-tech%2Fflame-in-freefall)
[![GitHub Repository](https://img.shields.io/badge/GitHub-nileshgarg--tech%2Fflame--in--freefall-blue?logo=github)](https://github.com/nileshgarg-tech/flame-in-freefall)
[![NASA Space Apps 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-orange.svg)](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)
[![Verification Status](https://img.shields.io/badge/Verification%20Report-PASSED%20(100%25)-emerald.svg)](./dist/verification-report.json)
[![Architecture Standard](https://img.shields.io/badge/Engineering%20Standard-Lauren%20Tan%20Trust%20Pyramid-blue.svg)](./ARCHITECTURE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-blue.svg)](./tsconfig.json)

> **2026 NASA Space Apps Challenge:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
> **Engineering Methodology:** Architected strictly according to **Lauren Tan's (SpaceXSI)** engineering framework presented in *"All Code Is Slop (Except Mine)"* at the AI Engineer CODE Conference.

---

## 1. Executive Summary & Challenge Mandate

Over three decades of NASA microgravity experiments conducted aboard the Space Shuttle, Mir, and the International Space Station (ISS) have produced **12.3 Terabytes** of combustion science data stored in NASA's **Physical Science Informatics (PSI)** repository.

However, interpreting this vast experimental archive has historically been a bottleneck:
- Finding, comparing, and cross-analyzing disparate test matrices is difficult.
- Inhabited exploration environments (such as the planned **Lunar Moon Base** at 32% \(O_2\) and 70.3 kPa, or **EVA spacesuits** at 100% \(O_2\)) introduce severe hyperoxic fire hazards that violate Earth-normal \(1g\) rules.
- As the Artemis II Commander noted during a mission alarm: *&ldquo;If you want to get somebody’s attention really quick, make the fire alarm go off in your spacecraft when you’re still about 80,000 miles from home.&rdquo;*

**Flame in Freefall** is an interactive, Super Intelligence (SI)-powered intelligence platform that ingests, normalizes, ranks, and interprets all **24 combustion science investigations** in NASA PSI (19 flight experiments and 5 ground re-analyses, covering 2,009 experimental runs) to deliver actionable fire safety constraints for lunar habitats, Mars missions, and terrestrial dual-use applications.

---

## 2. Engineering Methodology: The Lauren Tan Framework

This project rejects speculatively generated "AI slop". It implements the **Inverted Trust Pyramid** introduced by **Lauren Tan (SpaceXSI / AI Engineer CODE)**:

```
                    ┌─────────────────────────────────────────┐
                    │        PROSE RULES & PROMPTS            │
                    │   AGENTS.md, instructions (Weakest)     │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │      CANONICAL FEATURE MAP              │
                    │   FEATURE_MAP.md (Single Source of      │
                    │   Truth: no hallucinated metric keys)   │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │     VERIFICATION STACK & ARTIFACTS      │
                    │   Vitest unit suites, Zod schema        │
                    │   contracts, dist/verification-report   │
                    └────────────────────┬────────────────────┘
                                         │
           ┌─────────────────────────────▼─────────────────────────────┐
           │        CODEBASE ARCHITECTURE & STATIC ANALYSIS (Base)     │
           │   TypeScript strict mode (`noImplicitAny`, no `any`),     │
           │   banned footgun patterns, pure functional state,        │
           │   runtime schema boundary checks. (Strongest)             │
           └───────────────────────────────────────────────────────────┘
```

### Core Engineering Tenets Enforced:
1. **The Codebase is the Constraint System:** We never attempt to fix repeated agent errors with another paragraph in `AGENTS.md`. We push corrections down into TypeScript types, Zod schemas, or automated tests so that invalid states are physically unrepresentable.
2. **Reviewing Artifacts, Not Code Slop:** Reviewers and autonomous agents do not inspect lines of generated code. They inspect deterministic **verification artifacts** (`dist/verification-report.json`, test coverage, build outputs).
3. **Canonical Feature Mapping:** All components, routes, and physics metrics conform strictly to [`FEATURE_MAP.md`](./FEATURE_MAP.md), eliminating terminology hallucinations.

---

## 3. The Spacecraft Fire Safety Triad

NASA combustion science is organized into three interconnected pillars:

| Pillar | Physical Focus | Key PSI Investigations | Exploration Safety Impact |
|---|---|---|---|
| **1. Prevention** | Material flammability, Limiting Oxygen Index (LOI), flame spread | **Saffire-I/II/III** (PSI-98/99/100), **BASS / BASS-II** (PSI-25/26), **CFI-G** (PSI-159), **BRE** (PSI-20) | Prevents ignition; models accelerated flame spread under Lunar 32% \(O_2\) atmospheres. |
| **2. Detection** | Smoke particle agglomeration, aerosol transport in forced flow | **SAME** (PSI-102), **SAME-R** (PSI-101), **DAFT / DAFT-2** (PSI-47) | Sizing detectors for larger \(\mu g\) smoke particles that do not rise via buoyancy. |
| **3. Suppression** | Extinguishment kinetics, gaseous diluent sizing (\(CO_2\), Helium) | **FLEX** (PSI-69), **FLEX-2** (PSI-68), **CFI** (PSI-39) | Determines critical mole fractions and droplet extinction diameters (\(d_e / d_0\)). |

---

## 4. Operational Exploration Profiles

The SI engine dynamically ranks all 24 investigations against 5 mission profiles:
1. **Lunar Moon Base / Pressurized Rover:** 70.3 kPa (10.2 psi), 32% \(O_2\), 10 cm/s HVAC. High hyperoxic risk; materials self-extinguishing on Earth burn continuously.
2. **ISS / Orion Transit Spacecraft:** 101.3 kPa (14.7 psi), 21% \(O_2\), 15 cm/s ventilation. Quiescent diffusion smoldering; absence of buoyant chimney draft.
3. **Martian Habitat:** 55.2 kPa (8.0 psi), 30% \(O_2\), 8 cm/s ventilation, \(0.38g\) partial gravity.
4. **EVA Spacesuit:** 29.6 kPa (4.3 psi), 100% pure \(O_2\). Catastrophic flash-fire risk; zero ignition tolerance.
5. **Terrestrial Standard:** 101.3 kPa (14.7 psi), 21% \(O_2\), \(1.0g\) buoyant reference.

---

## 5. System Architecture & Features

```
  SpaceApps_Project/
  ├── CONTEXT.md               # Scientific & mission context document
  ├── FEATURE_MAP.md           # Canonical domain taxonomy and UI specification
  ├── ARCHITECTURE.md          # Lauren Tan Inverted Trust Pyramid specification
  ├── PROJECT_PLAN.md          # Phased milestone tracker and exit criteria
  ├── AGENTS.md                # Zero-slop agent engineering protocols
  ├── skills/                  # Domain skills (flame-safety-expert)
  ├── data/                    # NASA PSI catalog (24 folders, 22 CSV tables)
  ├── scripts/
  │   ├── ingest-psi.py        # Python ingestion & normalization pipeline
  │   ├── ingest-psi.ts        # TypeScript Zod verification runner
  │   └── verify-all.ts        # Automated verification runner (produces artifact)
  ├── src/
  │   ├── types/psi.ts         # Strict TypeScript types
  │   ├── schemas/psi.ts       # Zod validation contracts
  │   ├── constants/           # Mission environments & physics constants
  │   ├── engine/              # SI Ranking, physics calculators, insights
  │   ├── views/               # Overview, Explorer, Ranker, Simulator
  │   └── App.tsx              # Main application shell
  └── tests/                   # Vitest schema contract & engine unit tests
```

### Key Application Modules:
- **Mission Overview:** Interactive Fire Safety Triad breakdown, Artemis II operational alerts, and terrestrial spin-offs.
- **PSI Data Explorer:** Searchable, filterable catalog of all 24 investigations with interactive run-table CSV viewers and direct links to NASA archives.
- **SI Mission Ranker:** Multi-criteria weighted ranking engine calculating composite safety scores (\(S_i(E)\)) with explainability badges.
- **Flame Simulator:** 60fps HTML5 Canvas 2D engine animating microgravity diffusion spheres vs Earth buoyant teardrops with real-time LOI extinction limits.

---

## 6. Verification & Reproducibility (The Verification Loop)

In accordance with Lauren Tan's framework, every pull request and build must pass the automated verification harness:

```bash
# 1. Install dependencies
npm install

# 2. Ingest and validate all 24 NASA PSI datasets
npm run ingest

# 3. Run static type checking (strict TypeScript)
npm run typecheck

# 4. Run automated test suites
npm test

# 5. Run complete verification harness and generate artifact
npm run verify

# 6. Launch local interactive dashboard
npm run dev
```

### Verification Artifact Output
The verification harness outputs [`dist/verification-report.json`](./dist/verification-report.json):
```json
{
  "timestamp": "2026-11-16T05:29:52.361Z",
  "overallStatus": "PASSED",
  "totalChecks": 3,
  "passedChecks": 3,
  "failedChecks": 0,
  "checks": [
    {
      "id": "SCHEMA_CONTRACT",
      "name": "Zod Schema Contract & Database Integrity",
      "status": "PASSED",
      "details": "Validated 24 investigations (19 flight, 5 ground), 2009 logged runs."
    },
    {
      "id": "TYPESCRIPT_STRICT",
      "name": "TypeScript Strict Mode Static Analysis",
      "status": "PASSED",
      "details": "0 type errors across src, scripts, and tests with strict: true."
    },
    {
      "id": "UNIT_AND_PHYSICS_TESTS",
      "name": "Vitest Unit & Combustion Physics Test Suite",
      "status": "PASSED",
      "details": "All test suites passed cleanly."
    }
  ]
}
```

---

## 7. Terrestrial Dual-Use Spin-offs

NASA microgravity combustion research yields tangible life-safety benefits on Earth:
1. **Fine-Water Mist Fire Extinguishers:** Replaced toxic Halon aboard the ISS; now deployed in commercial aircraft cabins, historic libraries, and server rooms to suppress fires without water flooding damage.
2. **Semiconductor & ICU Aerosol Detection:** Particle agglomeration physics from SAME inform next-generation smoldering detectors in cleanrooms and hospital ICU air handlers.
3. **Firefighter PPE Toxic Gas Sensors:** Sensor miniaturization from BASS-II glovebox gas telemetry is integrated into modern structural and wildland firefighter breathing apparatus.
