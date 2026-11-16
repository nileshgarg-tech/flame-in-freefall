# AGENTS.md: Engineering Protocols & Constraint System

> **Governing Philosophy:** *Lauren Tan ("All Code Is Slop (Except Mine)")*  
> "Prose rules are weak constraints. Do not bloat this file with repetitive instructions when you can enforce constraints structurally through TypeScript types, Zod schemas, linters, and automated verification tests. Every repeated error must land in code, not in prose."

---

## 1. The Core Rule: Push Constraints Down into the Codebase

When an error, bug, or hallucination occurs during development:
1. **DO NOT** simply add another warning paragraph to this file.
2. **DO** push the correction down into the strongest possible layer of the trust pyramid:
   - **Layer 1 (Strongest):** Add a strict TypeScript type constraint or Zod schema rule so the invalid state is unrepresentable at compile time.
   - **Layer 2 (Strong):** Write an automated unit test in `tests/` that asserts the expected behavior and prevents regressions.
   - **Layer 3 (Medium):** Add a custom lint rule or static assertion.
   - **Layer 4 (Weakest):** Only if the constraint cannot be automated (e.g., subjective aesthetic tone or human review preference), note it here.

---

## 2. Canonical Vocabulary & The Feature Map

Before writing or modifying any data model, UI component, or algorithm:
- Consult `FEATURE_MAP.md`.
- You MUST use canonical keys:
  - `investigation_id`, `safety_pillar`, `fuel_phase`, `oxygen_fraction`, `pressure_kpa`, `air_velocity_cm_s`, `extinction_diameter_mm`.
- **STRICTLY FORBIDDEN:** Hallucinating custom metric names (e.g. `extinguish_speed`, `o2_ratio`, `flame_temp_celsius`).

---

## 3. Codebase Hygiene & Zero-Slop Standard

To prevent code bloat and preserve high-throughput reliability:
- **No Dead Code:** Delete unused functions, imports, and variables immediately.
- **No Placeholder Slop:** Never leave `// TODO: implement later` or placeholder dummy stubs in production paths. Write complete, functional implementations or throw an explicit domain error.
- **Strict Typing:** No `any`. If a type is unknown or dynamic, parse it through a Zod schema or use a discriminated union.
- **Ban Footgun Patterns:**
  - Avoid unconstrained React `useEffect` for data synchronization; use deterministic state derivation or explicit loaders.
  - Avoid mutating objects in place; maintain pure functional data flows.
  - Avoid loose magic numbers; reference physical constants from `src/constants/physics.ts`.

---

## 4. The Verification Loop (Mandatory for All Agent Tasks)

Before declaring any feature, fix, or refactor complete, you MUST execute the verification loop:

```bash
# 1. Typecheck the entire codebase
npm run typecheck

# 2. Run all unit and schema verification tests
npm test

# 3. Generate the verification artifact
npm run verify
```

### Review Verification Artifacts, Not Raw Code
- An agent's work is considered verified ONLY when `dist/verification-report.json` is generated with 0 failures and 100% schema compliance.
- Present the verification summary metrics in your response.
