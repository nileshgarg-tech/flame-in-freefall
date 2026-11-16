---
name: flame-safety-expert
description: Specialized domain expertise in microgravity combustion science, NASA Physical Science Informatics (PSI) datasets, and spacecraft fire safety protocols (prevention, detection, suppression).
---

# Flame Safety Expert Skill

## Purpose
This skill provides authoritative guidance on interpreting microgravity combustion physics, evaluating the 24 NASA PSI combustion science investigations, and executing the Super Intelligence (SI) fire safety ranking algorithms for space habitats (Moon, Mars, ISS, EVA suits) and terrestrial applications.

## Key Physical Principles
1. **Buoyancy Vanishing in Microgravity (\(\mu g\)):**
   - Natural convection is suppressed; transport is governed by molecular diffusion and forced ventilation.
   - Flames are spherical, cooler, and sootier in quiescent atmospheres.
   - Forced airflow (5–20 cm/s) alters the Damköhler number and can sustain combustion of solid materials that self-extinguish in \(1g\).

2. **Hyperoxic Environments (Moon Base & EVA Suits):**
   - The Moon Base operates at ~70.3 kPa (10.2 psi) and 30–34% \(O_2\).
   - This increases material flammability and burning rate significantly compared to Earth air (21% \(O_2\) at 101.3 kPa).
   - The CFI-G investigation (PSI-159) provides unique empirical data up to 85% \(O_2\).

3. **Gaseous Extinguishment (Suppression):**
   - FLEX (PSI-69) and FLEX-2 (PSI-68) provide the definitive extinction diameters and critical suppressant mole fractions for \(CO_2\) and Helium in \(\mu g\).
   - Helium suppresses via high thermal conduction (flame cooling); \(CO_2\) suppresses via chemical kinetics and thermal heat capacity.

## PSI Investigation Mapping
- **Solid Materials Flammability:** BASS (PSI-26), BASS-II (PSI-25), Saffire-I/II/III (PSI-98, 99, 100), BRE (PSI-20).
- **Aerosol & Smoke Detection:** SAME (PSI-102), SAME-R (PSI-101), DAFT/DAFT-2 (PSI-47).
- **Suppression Kinetics:** FLEX (PSI-69), FLEX-2 (PSI-68), CFI (PSI-39).
- **High-Oxygen & Gaseous Flames:** CFI-G (PSI-159), Flame Design (PSI-10), CLD Flame (PSI-21), s-Flame (PSI-23).
- **Partial Gravity Proxy:** E-FIELD Flames (PSI-22).

## Operational Guidelines
- Always verify data points against `data/catalog.json` and the corresponding `experimental-table/*.csv`.
- Never hallucinate non-existent test runs; cite the exact investigation accession (e.g. `PSI-159`) and test parameters.
- Use `FEATURE_MAP.md` canonical keys for all variable names and metrics.
