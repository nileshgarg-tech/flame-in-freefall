# CONTEXT: Flame in Freefall — NASA Space Apps Challenge 2026

## 1. Executive Summary & Challenge Mandate

**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Event:** 2026 NASA Space Apps Challenge  
**Difficulty:** Advanced / Intermediate  
**Domain:** Space Exploration, Combustion Science, Habitability & Safety Engineering  
**Official Portal:** [spaceappschallenge.org/2026/challenges/flame-in-freefall](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)

### The Core Problem
For over three decades, NASA and international partners have conducted microgravity combustion experiments on the Space Shuttle, Mir, and the International Space Station (ISS). This has produced over **12.3 Terabytes** of experimental data preserved in the **Physical Science Informatics (PSI)** repository. 

However, this massive repository remains largely inaccessible for operational mission design:
- Data is fragmented across multiple specialized apparatuses (CIR, MDCA, MSG).
- Run tables, video streams, and sensor logs use disparate formats and terminology.
- Finding relevant research, cross-comparing parameters (e.g., oxygen concentration, airflow velocities, ambient pressures), and interpreting findings for new mission architectures is prohibitively difficult.

### The Objective
Design and build an **interactive, Super Intelligence (SI)-powered dashboard** that ingests, summarizes, ranks, and interprets microgravity combustion science investigations to deliver actionable fire safety insights for deep-space human exploration (Artemis Moon Base, pressurized rovers, Mars transit and surface habitats) and Earth applications.

---

## 2. Scientific & Engineering Context: Combustion in Microgravity

### 2.1 The Physics of Microgravity Flames
On Earth (\(1g\)), combustion is dominated by **natural convection**:
- Hot, buoyant combustion gases rise, drawing in fresh oxygen from the bottom and shearing the flame into an elongated, flickering teardrop.
- In freefall / microgravity (\(\mu g \approx 10^{-6}g\)), buoyant convection vanishes.
- **Diffusion-Controlled Regimes:** Without buoyant flow, oxygen reaches the flame front purely through molecular diffusion, and combustion products (CO, CO₂, soot) clear much more slowly.
- **Spherical Geometry:** Stationary candle or droplet flames form quiescent, spherical blue flames burning at lower temperatures and burning rates.
- **Cool Flames:** At low temperatures (~600–1000 K vs 1500–2000 K for hot flames), certain hydrocarbon fuels (n-alkanes like n-heptane, n-octane, n-dodecane) exhibit two-stage combustion or sustained low-temperature burning without visible luminescence. These "cool flames" are difficult to detect visually or with conventional optical sensors.

### 2.2 The Three Pillars of Spacecraft Fire Safety

```
                     ┌────────────────────────────────────────┐
                     │    SPACECRAFT FIRE SAFETY TRIAD        │
                     └───────────────────┬────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
  ┌──────────────┐               ┌───────────────┐               ┌───────────────┐
  │  PREVENTION  │               │   DETECTION   │               │  SUPPRESSION  │
  ├──────────────┤               ├───────────────┤               ├───────────────┤
  │• Material    │               │• Aerosol &    │               │• Dilution     │
  │  selection   │               │  smoke sizing │               │  (CO₂, He)    │
  │• Oxygen limit│               │• Obscuration  │               │• Extinction   │
  │  envelopes   │               │• Non-buoyant  │               │  diameters    │
  │• Airflow     │               │  transport    │               │• Fine water   │
  │  effects     │               │• Sensor aging │               │  mist         │
  └──────────────┘               └───────────────┘               └───────────────┘
```

1. **Prevention (Material Flammability & Atmosphere Limits):**
   - Solid materials (fabrics, polymers, wire insulation) burn differently under low-gravity forced flows.
   - Standard Earth flammability tests (NASA-STD-6001 Test 1: upward flame propagation) can be non-conservative; some materials that self-extinguish in \(1g\) can sustain combustion in low-speed forced flows in \(\mu g\).
   - Inhabited spacecraft environments utilize forced ventilation (typically 5 to 20 cm/s) to prevent CO₂ pooling around astronauts' faces; this airflow provides continuous oxidizer to smoldering or burning materials.

2. **Detection (Smoke Particle Dynamics & Aerosol Signatures):**
   - Without buoyant draft, smoke particles do not quickly rise to ceiling-mounted detectors.
   - Smoke particles agglomerate differently in \(\mu g\), producing larger mean particle diameters than terrestrial smoke.
   - Traditional ionization and optical smoke detectors calibrated for terrestrial fire signatures experience delayed response or false alarms in space.

3. **Suppression (Extinguishment Kinetics & Gaseous Agents):**
   - Conventional gravity-dependent suppression methods (blanketing foams, standard liquid streams) fail or create severe cleanup/toxicity hazards in microgravity.
   - Gaseous suppression relies on inert gas dilution (CO₂, Nitrogen, or Helium). Helium offers high thermal conductivity, extracting heat from the flame zone rapidly, while CO₂ acts via heat capacity and chemical inhibition.
   - Droplet combustion tests (FLEX, FLEX-2) provide the exact extinction limits (limiting oxygen index, critical suppression agent mole fractions) required to extinguish fires without suffocating crew.

---

## 3. Mission Environments & Atmospheric Regimes

The SI dashboard must evaluate combustion data against specific exploration architectures:

| Environment | Pressure (kPa / psi) | Oxygen Fraction (\(X_{O_2}\)) | Effective \(P_{O_2}\) (kPa) | Airflow Regimes | Fire Risk Profile |
|---|---|---|---|---|---|
| **Earth Sea Level** | 101.3 kPa (14.7 psi) | 20.9% | 21.2 kPa | Natural buoyant convection | Baseline standard |
| **ISS / Orion Transit** | 101.3 kPa (14.7 psi) | 21.0% | 21.3 kPa | Forced ventilation (5–20 cm/s) | Flammability bounds set by ventilation |
| **Lunar Gateway / Moon Base** | 70.3 kPa (10.2 psi) | 30.0%–34.0% | 21.1–23.9 kPa | Low gravity (\(0.166g\)) + forced HVAC | **Significantly elevated flammability**; lower ignition energy |
| **Lunar EVA Suit (Spacesuit)** | 29.6 kPa (4.3 psi) | 100.0% | 29.6 kPa | Internal suit purge flow | **Extreme oxygen hazard**; 100% \(O_2\) requires stringent materials exclusion |
| **Mars Habitat / Surface** | 55.2–68.9 kPa (8–10 psi)| 28.0%–32.0% | ~17.5–22.0 kPa | Partial gravity (\(0.38g\)) + HVAC | Intermediate between lunar and terrestrial |

> [!IMPORTANT]
> The transition from Earth-normal atmospheres (21% \(O_2\) at 14.7 psi) to Lunar Exploration atmospheres (30–34% \(O_2\) at 10.2 psi) reduces astronaut pre-breathe time for EVAs, but dramatically expands material flammability envelopes. Materials deemed "non-flammable" at 21% \(O_2\) burn vigorously at 32% \(O_2\).

---

## 4. NASA Physical Science Informatics (PSI) Dataset Inventory

The local dataset contains the complete catalog metadata and experimental run tables for all **24 combustion science investigations** (19 flight experiments and 5 ground re-analyses):

### 4.1 ACME Gas Flame Investigations (Combustion Integrated Rack - CIR)
*Hardware: ACME (Advanced Combustion via Microgravity Experiments) modular gas burner platform in the CIR.*
- **PSI-10 (Flame Design):** 327 runs. Spherical diffusion flames (normal & inverse) burning \(CH_4\), \(C_2H_4\), \(C_3H_8\) in \(O_2/N_2\) atmospheres. Investigates soot limits, stoichiometric mixture fraction (\(Z_{st}\)), and adiabatic flame temperature.
- **PSI-159 (CFI-G - Cool Flames Investigation with Gases):** 1,194 runs. **Highest oxygen levels in PSI (up to 85% \(O_2\))**. Normal and inverse cool flames burning propane, n-butane, and n-pentane. Fundamental data for hyperoxic safety limits.
- **PSI-20 (BRE - Burning Rate Emulator):** 18 runs. Gaseous fuel burner acting as a flat/curved emulator of solid material burning in still atmospheres. Directly models solid material flammability without complex solid-phase pyrolysis variations.
- **PSI-21 (CLD Flame):** 32 runs. Co-flow laminar diffusion flames across wide fuel dilution ranges.
- **PSI-22 (E-FIELD Flames):** 32 runs. Applies high-voltage DC electric fields to ion-rich flame zones. Serves as a **partial-gravity proxy** via controlled ionic body forces.
- **PSI-23 (s-Flame):** 18 runs. Spherical diffusion flames measuring soot structure, radiation, and flame extinction.

### 4.2 Liquid Droplet Extinction & Suppression (MDCA in CIR)
*Hardware: Multi-user Droplet Combustion Apparatus.*
- **PSI-69 (FLEX - Flame Extinguishment Experiment):** 274 runs. Droplets of heptane, methanol, and alkane mixtures burned in atmospheres diluted with \(CO_2\), \(N_2\), and Helium. **Core dataset for gaseous fire suppression sizing and extinction diameters.**
- **PSI-68 (FLEX-2):** 8 run matrices. Droplet combustion arrays and bicomponent fuels under varying flows and oxygen concentrations.
- **PSI-39 (CFI - Cool Flames Investigation):** 87 runs. Isolated n-dodecane droplets discovering low-temperature quasi-steady burning after hot-flame extinction.

### 4.3 Solid Materials & Glovebox Investigations (Microgravity Science Glovebox - MSG)
*Hardware: SPICE flow duct inside the MSG.*
- **PSI-25 (BASS-II - Burning and Suppression of Solids II):** 129 runs. Combustion of solid plastic slabs, cotton fabrics, and PMMA under controlled forced flow (0 to 55 cm/s) and ambient oxygen levels. Includes pre- and post-burn CO and \(CO_2\) gas sensor telemetry.
- **PSI-26 (BASS):** 122 runs. Precursor solid flammability tests establishing ignition limits in low-speed forced flows.
- **PSI-107 (SPICE):** 469 runs. Smoke point experiments examining smoke production thresholds in co-flow ducts.
- **PSI-106 (SLICE):** 12 runs. Liftoff and flame stability of laminar diffusion flames.

### 4.4 Large-Scale Realistic Spacecraft Fires (Cygnus Saffire Series)
*Hardware: Autonomous combustion chamber aboard departing unmanned Orbital ATK / Northrop Grumman Cygnus cargo spacecraft.*
- **PSI-98 (Saffire-I):** 4 large-scale burns. Tested large-format SIBAL fabric (75% cotton, 25% fiberglass, 0.4 m wide \(\times\) 1.0 m long) in realistic spacecraft ventilation (20 cm/s). First large-scale spacecraft fire test in history.
- **PSI-99 (Saffire-II):** 15 runs. Evaluated mixed fabrics, PMMA, Nomex, and silicone samples; directly compared \(0g\) flame spread against NASA-STD-6001 \(1g\) upward flammability ratings.
- **PSI-100 (Saffire-III):** 2 high-flow burns. SIBAL fabric under accelerated forced flow (30 cm/s).

### 4.5 Detection & Aerosol Measurement
- **PSI-102 (SAME):** 8 runs. Sizing smoke particles generated from overheated spacecraft materials (Teflon, Kapton, silicone, Pyrel foam).
- **PSI-101 (SAME-R):** 109 runs. Reflight of SAME with expanded material aging and inlet velocities.
- **PSI-47 (DAFT / DAFT-2):** 2 runs. Feasibility of using smoke detection particle counters to monitor lunar/martian cabin dust.

### 4.6 Ground Re-Analyses & CFD Validation
- **PSI-115:** Numerical modeling of gravity-dependent smoke aerosol dynamics (reuses SAME).
- **PSI-117:** Computational fluid dynamics of droplet cool flame perturbation (reuses FLEX).
- **PSI-142:** Meta-analysis of cool-flame extinction limits (reuses FLEX).
- **PSI-60:** Soot formation modeling between \(1g\) and \(\mu g\) (reuses SPICE).
- **PSI-62:** Flame spread rate analytical modeling over solid fuels (reuses BASS).

---

## 5. Dual-Use Terrestrial Impact

Microgravity combustion research provides critical technological spin-offs for Earth:
1. **Fine-Water-Mist Fire Suppression:** Developed to replace ozone-depleting Halon systems in space, now deployed in aircraft cabins, marine vessels, and heritage museums to suppress fires without water-damage deluge.
2. **Advanced Aerosol Detectors:** Particle agglomeration dynamics from SAME have informed early smoldering detectors in terrestrial cleanrooms, data centers, and hospital ICU environments.
3. **Firefighter Thermal & Toxic Gas Monitors:** Sensor miniaturization and CO/CO₂ telemetry from BASS-II have directly enhanced civilian wildland and structural firefighter personal protection equipment (PPE).
