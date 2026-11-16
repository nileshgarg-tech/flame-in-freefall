# Combustion datasets for Flame in Freefall

Local copy of the catalog layer for the 24 NASA PSI investigations whose research area is Combustion Science. These are the investigations in scope for the 2026 NASA Space Apps challenge [Flame in Freefall](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/).

Downloaded on 14 Nov 2026 from the [PSI data repository](https://psi.nasa.gov/physci/repo/search?q=&data_source=psi&data_type=investigation). License on the records is CC0.

## What is in this folder

Each `PSI-###/` directory contains:

- `investigation.json` — title, dates, objectives, approach, hardware, and the published total size
- `metadata/` — the PSI investigation-metadata zip, plus the extracted ISA text files
- `experimental-table/` — the run-log CSV, when NASA published one

**513 KB** of those files were downloaded (about **1.0 MB** on disk after unzipping). The published archive behind them is **12.3 TB**. That remainder is raw flame video and instrument dumps, mostly zip files of 10–30 GB per test point. It was not downloaded.

Also left on PSI, and not in this folder: analyzed spreadsheets (about 1.1 GB, mostly SAME and SAME-R), engineering drawings, reports, and presentations.

Four ground studies have metadata only and no experimental table: PSI-60, PSI-62, PSI-115, and PSI-117.

## How to read the 24

**19 are flight experiments.** These are the datasets to rank and summarize. **5 are ground re-analyses** of those flights. They are context, not new experiments.

| Group | Investigations | What they answer for fire safety |
|---|---|---|
| Solid materials, glovebox | BASS (PSI-26), BASS-II (PSI-25) | Ignition, spread, and extinction of fabrics and plastics in a fan-driven flow |
| Large spacecraft fires | Saffire-I, II, III (PSI-98, PSI-99, PSI-100) | How fast a large fire grows in low gravity, and how that compares with NASA’s 1g flammability test |
| Liquid-fuel extinction | FLEX (PSI-69), FLEX-2 (PSI-68), CFI (PSI-39) | Droplet flammability limits; suppression with CO₂ and helium; cool flames |
| Gas flames, same ACME hardware | Flame Design (PSI-10), CFI-G (PSI-159), BRE (PSI-20), CLD Flame (PSI-21), E-FIELD Flames (PSI-22), s-Flame (PSI-23) | Soot limits, high oxygen (CFI-G up to 85%), material-like burning (BRE), and electric fields as a stand-in for partial gravity (E-FIELD) |
| Soot and liftoff, same glovebox duct | SPICE (PSI-107), SLICE (PSI-106) | Smoke point and flame stability for gaseous fuels |
| Smoke and dust detection | SAME (PSI-102), SAME-R (PSI-101), DAFT / DAFT-2 (PSI-47) | Smoke particle size in microgravity, and the same instrument used on dust |
| Ground re-analyses | PSI-115, PSI-117, PSI-142, PSI-60, PSI-62 | Models and papers that reuse SAME, FLEX, SPICE, or BASS |

There is no partial-gravity combustion data in PSI yet. The challenge points to future sets (LUCI, FM2) for the Moon.

## Flight experiments

Sizes in the “On PSI” column are NASA’s published totals, almost all raw video. “Runs” is the number of data rows in the local experimental table.

### ACME gas flames (Combustion Integrated Rack)

| ID | Name | On PSI | Local table | Runs | Table records |
|---|---|---|---|---|---|
| [PSI-10](https://psi.nasa.gov/physci/repo/data/investigations/PSI-10) | Flame Design | 1.98 TB | 2 CSVs, 43 KB | 327 | Normal and inverse spherical diffusion flames: fuel, flow rates, oxygen, pressure, stoichiometric mixture fraction, adiabatic flame temperature |
| [PSI-159](https://psi.nasa.gov/physci/repo/data/investigations/PSI-159) | CFI-G | 1.90 TB | 2 CSVs, 60 KB | 1,194 | Highest oxygen in the set (up to about 85%). Normal and inverse cool and hot flames for propane, n-butane, and n-pentane: oxygen, pressure, flow, burn time, extinction |
| [PSI-20](https://psi.nasa.gov/physci/repo/data/investigations/PSI-20) | BRE | 1.85 TB | 1 CSV, 1 KB | 18 | Burning Rate Emulator. Burner size, oxygen percent, flames ignited. Used as a stand-in for solid-material flammability in still air |
| [PSI-21](https://psi.nasa.gov/physci/repo/data/investigations/PSI-21) | CLD Flame | 1.82 TB | 1 CSV, 2 KB | 32 | Coflow laminar diffusion flames across a wide fuel-dilution range |
| [PSI-22](https://psi.nasa.gov/physci/repo/data/investigations/PSI-22) | E-FIELD Flames | 885 GB | 1 CSV, 2 KB | 32 | Electric-field voltage, mesh polarity, and fuel concentration. The challenge treats the field as a partial-gravity stand-in |
| [PSI-23](https://psi.nasa.gov/physci/repo/data/investigations/PSI-23) | s-Flame | 728 GB | 1 CSV, 2 KB | 18 | Structure of spherical diffusion flames: atmosphere, fuel, flames ignited |

### Droplets (Multi-user Droplet Combustion Apparatus, same rack)

| ID | Name | On PSI | Local table | Runs | Table records |
|---|---|---|---|---|---|
| [PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) | FLEX | 860 GB | 1 CSV, 24 KB | 274 | Fuel, pressure, O₂/N₂/CO₂/He, droplet diameter, extinction diameter, burning rate, burn time. This is the suppression dataset (CO₂ and helium) |
| [PSI-68](https://psi.nasa.gov/physci/repo/data/investigations/PSI-68) | FLEX-2 | 1.11 TB | 1 CSV, 1 KB | 8 | Fuel type, droplet diameter, ambient mixture, oxygen mole fraction, pressure, flow. A conditions matrix, not one row per burn |
| [PSI-39](https://psi.nasa.gov/physci/repo/data/investigations/PSI-39) | CFI | 670 GB | 1 CSV, 8 KB | 87 | n-dodecane droplets. Pressure, oxygen, nitrogen, helium, fuel |

### Solids and soot (Microgravity Science Glovebox, SPICE flow duct)

| ID | Name | On PSI | Local table | Runs | Table records |
|---|---|---|---|---|---|
| [PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25) | BASS-II | 256 GB | 1 CSV, 16 KB | 129 | Material, flow, oxygen, CO₂, and CO before and after the burn |
| [PSI-26](https://psi.nasa.gov/physci/repo/data/investigations/PSI-26) | BASS | 152 GB | 1 CSV, 5 KB | 122 | Date, test number, sample number, material |
| [PSI-107](https://psi.nasa.gov/physci/repo/data/investigations/PSI-107) | SPICE | 6.5 GB | 1 CSV, 30 KB | 469 | Fuel, nozzle, fuel flow, air speed. The smoke-point experiment |
| [PSI-106](https://psi.nasa.gov/physci/repo/data/investigations/PSI-106) | SLICE | 68 GB | 1 CSV, 1 KB | 12 | Test date and fuel type only. Structure and liftoff of laminar diffusion flames |

### Large fires on Cygnus after it left the station

| ID | Name | On PSI | Local table | Runs | Table records |
|---|---|---|---|---|---|
| [PSI-98](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | Saffire-I | 11.4 GB | 1 CSV, 0.5 KB | 4 | SIBAL fabric (75% cotton, 25% fiberglass). Thickness, size, air flow, oxygen, ignition, burn time |
| [PSI-99](https://psi.nasa.gov/physci/repo/data/investigations/PSI-99) | Saffire-II | 15.8 GB | 1 CSV, 2 KB | 15 | Several materials. Same columns as Saffire-I, plus 0g and 1g burn length and spread |
| [PSI-100](https://psi.nasa.gov/physci/repo/data/investigations/PSI-100) | Saffire-III | 33 GB | 1 CSV, 0.2 KB | 2 | SIBAL again, at a higher flow (30 cm/s versus 20 cm/s on Saffire-I) |

### Detection

| ID | Name | On PSI | Local table | Runs | Table records |
|---|---|---|---|---|---|
| [PSI-102](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102) | SAME | 627 MB | 1 CSV, 0.3 KB | 8 | Material, air flow, weight-loss rate, aging time. Smoke droplet size for detector design |
| [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | SAME-R | 5.9 GB | 1 CSV, 6 KB | 109 | Sample, date, inlet velocity, aging and mixing times. Reflight of SAME |
| [PSI-47](https://psi.nasa.gov/physci/repo/data/investigations/PSI-47) | DAFT / DAFT-2 | 40 MB | 1 CSV, 0.5 KB | 2 | Session, hardware, material, location. Same particle counter as SAME, pointed at dust instead of smoke |

## Ground re-analyses

| ID | On PSI | Local | What it reuses |
|---|---|---|---|
| [PSI-115](https://psi.nasa.gov/physci/repo/data/investigations/PSI-115) | 252 MB | metadata only | SAME. Simulations of how gravity changes pyrolysis-smoke growth |
| [PSI-117](https://psi.nasa.gov/physci/repo/data/investigations/PSI-117) | 68 MB | metadata only | FLEX. CFD of how outside heat and flow perturb droplet cool flames |
| [PSI-142](https://psi.nasa.gov/physci/repo/data/investigations/PSI-142) | 731 KB | metadata + an 8-row pointer table | FLEX. Cool-flame extinction limits; the CSV points at papers and figures, not burns |
| [PSI-60](https://psi.nasa.gov/physci/repo/data/investigations/PSI-60) | 8 KB | metadata only | SPICE. Soot differences between 1g and 0g |
| [PSI-62](https://psi.nasa.gov/physci/repo/data/investigations/PSI-62) | 9 KB | metadata only | BASS and BASS-II. A flame-spread model checked against those images |

## Where the bytes actually are

| | Published on PSI | In this folder |
|---|---|---|
| 19 flight experiments | 12.27 TB | metadata + run tables |
| 5 ground studies | 320 MB | metadata, plus one small pointer table |
| **24 together** | **12.3 TB** | **513 KB downloaded** |

The six ACME sets plus FLEX, FLEX-2, and CFI are about 11.7 TB of that 12.3 TB. Saffire, BASS, SLICE, SPICE, SAME, and DAFT together are about 550 GB.
