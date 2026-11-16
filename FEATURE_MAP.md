# FEATURE_MAP: Canonical Domain Taxonomy & UI Specification

> **Philosophy Reference:** *Lauren Tan ("All Code Is Slop (Except Mine)")*  
> "Maintain a single source of truth for features and domain vocabulary so that AI agents never invent synthetic component names, metric keys, or ungrounded data structures."

---

## 1. Canonical Domain Vocabulary & Metric Keys

All agents, parsers, algorithms, and frontend components MUST use these exact keys and definitions. Do NOT invent synonyms (e.g., do not use `extinguish_speed` for `extinction_diameter`, or `flame_temp` for `adiabatic_flame_temperature_k`).

| Canonical Key | Type | Unit | Allowed Values / Range | Description |
|---|---|---|---|---|
| `investigation_id` | `string` | - | `PSI-10`, `PSI-20`, ... | Unique NASA PSI accession identifier. |
| `investigation_title`| `string` | - | - | Official published title of the investigation. |
| `investigation_acronym`| `string`| - | `BASS`, `Saffire-I`, `FLEX`, ... | Standard NASA mission acronym. |
| `safety_pillar` | `enum` | - | `'prevention'`, `'detection'`, `'suppression'` | Primary spacecraft fire safety category. |
| `fuel_phase` | `enum` | - | `'solid'`, `'liquid'`, `'gas'` | Physical state of the combustion fuel. |
| `fuel_name` | `string` | - | `SIBAL`, `PMMA`, `Methane`, `Propane`, `n-Dodecane`, ... | Chemical or commercial material name. |
| `flame_regime` | `enum` | - | `'diffusion'`, `'premixed'`, `'cool_flame'`, `'smoldering'`, `'droplet'` | Combustion kinetic regime. |
| `oxygen_fraction` | `number` | ratio (0.0–1.0)| `0.10` to `0.85` | Ambient oxygen mole fraction (\(X_{O_2}\)). |
| `pressure_kpa` | `number` | kPa | `20.0` to `200.0` | Chamber total static pressure. |
| `ambient_diluent` | `enum` | - | `'N2'`, `'CO2'`, `'He'`, `'Air'` | Main inert background gas. |
| `air_velocity_cm_s` | `number`| cm/s | `0.0` to `60.0` | Forced flow ventilation speed across sample. |
| `droplet_diameter_initial_mm` | `number` | mm | `0.5` to `5.0` | Initial liquid fuel droplet diameter (\(d_0\)). |
| `extinction_diameter_mm` | `number` | mm | `0.1` to `3.0` | Droplet diameter at extinction (\(d_e\)). |
| `burn_duration_s` | `number` | seconds | `0.5` to `300.0` | Time from steady ignition to flame extinction. |
| `flame_spread_rate_mm_s` | `number` | mm/s | `0.0` to `15.0` | Linear velocity of flame front propagation. |
| `smoke_count_median_diameter_nm` | `number` | nm | `20.0` to `800.0` | Particle sizing for fire detector trigger. |
| `relevance_score` | `number` | 0.0–100.0 | Calculated by SI algorithm | Overall mission safety relevance index. |

---

## 2. Mission Target Environments (Operational Profiles)

All scoring models and simulation presets MUST adhere to these exact environment definitions:

```typescript
export interface MissionEnvironmentProfile {
  id: 'moon_base' | 'iss_transit' | 'mars_habitat' | 'eva_suit' | 'terrestrial_sea_level';
  displayName: string;
  nominalPressureKpa: number;
  oxygenFraction: number;
  effectivePo2Kpa: number;
  nominalAirflowCmS: number;
  gravityG: number;
  primaryRiskFactor: string;
}
```

1. **`moon_base` (Lunar Habitat / Pressurized Rover)**:
   - Pressure: `70.3 kPa` (10.2 psi)
   - Oxygen Fraction: `0.32` (32% \(O_2\))
   - Effective \(P_{O_2}\): `22.5 kPa`
   - Ventilation: `10.0 cm/s`
   - Gravity: `0.166 g`
   - Primary Risk: **Hyperoxic solid material ignition & accelerated flame spread**.

2. **`iss_transit` (Space Station / Deep Space Transit Spacecraft)**:
   - Pressure: `101.3 kPa` (14.7 psi)
   - Oxygen Fraction: `0.21` (21% \(O_2\))
   - Effective \(P_{O_2}\): `21.3 kPa`
   - Ventilation: `15.0 cm/s`
   - Gravity: `0.000 g` (\(\mu g\))
   - Primary Risk: **CO₂ pooling, quiet diffusion smoldering, lack of buoyant draft for smoke detectors**.

3. **`mars_habitat` (Surface Martian Habitat)**:
   - Pressure: `55.2 kPa` (8.0 psi)
   - Oxygen Fraction: `0.30` (30% \(O_2\))
   - Effective \(P_{O_2}\): `16.5 kPa`
   - Ventilation: `8.0 cm/s`
   - Gravity: `0.380 g`
   - Primary Risk: **Low pressure boundary with high \(O_2\) fraction; partial-gravity flame buoyancy transition**.

4. **`eva_suit` (Extravehicular Mobility Unit)**:
   - Pressure: `29.6 kPa` (4.3 psi)
   - Oxygen Fraction: `1.00` (100% \(O_2\))
   - Effective \(P_{O_2}\): `29.6 kPa`
   - Ventilation: `5.0 cm/s`
   - Gravity: `0.000 g` / `0.166 g`
   - Primary Risk: **Catastrophic 100% pure-oxygen combustion; violent flash fire vulnerability**.

5. **`terrestrial_sea_level` (Earth Reference)**:
   - Pressure: `101.3 kPa` (14.7 psi)
   - Oxygen Fraction: `0.21` (21% \(O_2\))
   - Effective \(P_{O_2}\): `21.3 kPa`
   - Ventilation: Buoyant natural convection + ambient
   - Gravity: `1.000 g`
   - Primary Risk: Standard industrial/residential fire spread.

---

## 3. UI Component & View Hierarchy

The web application is structured into the following distinct views and components:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Navigation / Header                         │
│  [Overview]  [PSI Explorer]  [SI Scoring Engine]  [Mission Simulator]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│   Overview Dashboard   │  │  PSI Dataset Explorer  │  │   SI Mission Ranker    │
│ (View: `overview`)     │  │ (View: `explorer`)     │  │ (View: `ranker`)       │
├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤
│• Mission KPI Cards     │  │• 24 Investigation Grid │  │• Mission Environment   │
│• 3 Safety Pillars Tree │  │• Filter by Phase,      │  │  Selector              │
│• Micro-g Flame Physics │  │  Hardware, & Oxygen    │  │• Weighted Scoring Slid-│
│  Hero Visualizer       │  │• Run-log CSV Inspector │  │  ers (Pillar weights)  │
│• Terrestrial Dual-Use  │  │• Raw Video/Archive Meta│  │• Real-time Ranked Table│
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
                                    │
                                    ▼
                    ┌────────────────────────────────────────┐
                    │      Microgravity Fire Simulator       │
                    │      (View: `simulator`)               │
                    ├────────────────────────────────────────┤
                    │• Pressure & Oxygen Slider Controls     │
                    │• Airflow Velocity Drag Adjuster        │
                    │• Canvas 2D/3D Flame Morphology Viewer  │
                    │  (Spherical vs Buoyant Flame Display)  │
                    │• Critical Extinction Limit Calculator  │
                    │• SI Recommendation Synthesis Box       │
                    └────────────────────────────────────────┘
```

### 3.1 Views (`views/`)
1. **`OverviewView` (`src/views/OverviewView.tsx`)**:
   - Executive mission context, Artemis II fire alarm alert citation, Apollo 1 / Mir historical lessons.
   - The Three Pillars breakdown with interactive drilldown.
   - High-level metrics: 24 Investigations, 19 Flight experiments, 12.3 TB archive, 3,000+ logged test burns.

2. **`ExplorerView` (`src/views/ExplorerView.tsx`)**:
   - Filterable, searchable table & card grid of all 24 investigations.
   - Quick filters: `Hardware` (CIR, MDCA, MSG, Cygnus), `Fuel Phase` (Solid, Liquid, Gas), `Safety Pillar` (Prevention, Detection, Suppression).
   - Modal drawer (`InvestigationDetailModal.tsx`) showing:
     - Full NASA objectives and experimental approach.
     - Interactive table of individual test runs from `experimental-table/*.csv`.
     - Direct citations and links to `psi.nasa.gov`.

3. **`RankerView` (`src/views/RankerView.tsx`)**:
   - The Super Intelligence (SI) ranking engine interface.
   - Environment preset selectors (`moon_base`, `iss_transit`, `mars_habitat`, `eva_suit`).
   - Dynamic weighting sliders: Prevention weight (0–100%), Detection weight (0–100%), Suppression weight (0–100%), Oxygen matching penalty.
   - Ranked investigation list with explainability badges (why this investigation was ranked #1 for this operational profile).

4. **`SimulatorView` (`src/views/SimulatorView.tsx`)**:
   - Interactive parameter simulator allowing engineers to test arbitrary spacecraft atmospheric conditions.
   - Visual simulation canvas: demonstrates diffusion-limited spherical flame vs Earth convective flame under varying \(X_{O_2}\) and flow velocities.
   - Extinction boundary indicators derived from FLEX and CFI-G empirical data.
   - Automated SI Insights synthesis based on closest empirical PSI runs.

---

## 4. Super Intelligence (SI) Ranking Algorithm Specification

The SI ranking score \(S_i(E)\) of investigation \(i\) for environment \(E\) is mathematically defined as:

\[
S_i(E) = 100 \times \left( w_{prev} \cdot P_i + w_{det} \cdot D_i + w_{supp} \cdot S_i \right) \times \Phi_{env}(i, E) \times \Gamma_{data}(i)
\]

Where:
- \(w_{prev}, w_{det}, w_{supp}\): User-adjusted pillar weightings (\(\sum w = 1.0\)).
- \(P_i, D_i, S_i\): Normalized pillar alignment coefficients \(\in [0, 1]\).
- \(\Phi_{env}(i, E)\): Environmental atmospheric affinity factor based on oxygen fraction and pressure proximity:
  \[
  \Phi_{env}(i, E) = \exp\left( - \frac{(X_{O_2, \text{test}} - X_{O_2, E})^2}{2 \sigma_{O_2}^2} \right)
  \]
- \(\Gamma_{data}(i)\): Empirical validity factor (Flight experiment = 1.0; Ground re-analysis = 0.75).
