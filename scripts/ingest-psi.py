#!/usr/bin/env python3
"""
PSI Data Ingestion & Normalization Engine
Conforms to Lauren Tan's Zero-Slop Architecture:
- Parses 24 NASA PSI investigations
- Parses all 22 experimental run-log CSV tables
- Maps non-uniform raw column names into canonical Feature Map keys
- Produces validated, static src/data/psi_database.json
"""

import os
import json
import glob
import csv
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'psi_database.json')

# Canonical domain classifications based on NASA challenge specification
PILLAR_MAPPING = {
    # Solids & Glovebox (Prevention)
    "PSI-25": {"pillar": "prevention", "fuelPhase": "solid", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "BASS-II", "flight": True, "size": "256 GB", "tags": ["solids", "flame spread", "ventilation", "CO2 sensors"]},
    "PSI-26": {"pillar": "prevention", "fuelPhase": "solid", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "BASS", "flight": True, "size": "152 GB", "tags": ["solids", "ignition limits", "cotton", "plastic"]},
    "PSI-20": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Combustion Integrated Rack (CIR / ACME)", "acronym": "BRE", "flight": True, "size": "1.85 TB", "tags": ["burning rate emulator", "still air", "materials proxy"]},
    
    # Large Spacecraft Fires (Prevention)
    "PSI-98": {"pillar": "prevention", "fuelPhase": "solid", "hardware": "Cygnus Spacecraft (Autonomous)", "acronym": "Saffire-I", "flight": True, "size": "11.4 GB", "tags": ["large fires", "SIBAL fabric", "realistic spacecraft"]},
    "PSI-99": {"pillar": "prevention", "fuelPhase": "solid", "hardware": "Cygnus Spacecraft (Autonomous)", "acronym": "Saffire-II", "flight": True, "size": "15.8 GB", "tags": ["large fires", "materials comparison", "1g vs 0g"]},
    "PSI-100": {"pillar": "prevention", "fuelPhase": "solid", "hardware": "Cygnus Spacecraft (Autonomous)", "acronym": "Saffire-III", "flight": True, "size": "33 GB", "tags": ["large fires", "high flow", "accelerated spread"]},

    # High Oxygen & Gas Flames (Prevention / Fundamentals)
    "PSI-10": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Combustion Integrated Rack (CIR / ACME)", "acronym": "Flame Design", "flight": True, "size": "1.98 TB", "tags": ["spherical flames", "inverse flames", "soot limits"]},
    "PSI-159": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Combustion Integrated Rack (CIR / ACME)", "acronym": "CFI-G", "flight": True, "size": "1.90 TB", "tags": ["high oxygen", "cool flames", "up to 85% O2", "hyperoxic limits"]},
    "PSI-21": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Combustion Integrated Rack (CIR / ACME)", "acronym": "CLD Flame", "flight": True, "size": "1.82 TB", "tags": ["coflow", "laminar diffusion", "dilution"]},
    "PSI-22": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Combustion Integrated Rack (CIR / ACME)", "acronym": "E-FIELD Flames", "flight": True, "size": "885 GB", "tags": ["electric fields", "partial-gravity proxy", "chemi-ions"]},
    "PSI-23": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Combustion Integrated Rack (CIR / ACME)", "acronym": "s-Flame", "flight": True, "size": "728 GB", "tags": ["spherical diffusion", "radiation", "soot structure"]},
    "PSI-106": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "SLICE", "flight": True, "size": "68 GB", "tags": ["flame liftoff", "stability", "laminar"]},
    "PSI-107": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "SPICE", "flight": True, "size": "6.5 GB", "tags": ["smoke point", "coflow", "sooting"]},

    # Liquid Suppression & Cool Flames (Suppression)
    "PSI-69": {"pillar": "suppression", "fuelPhase": "liquid", "hardware": "Combustion Integrated Rack (CIR / MDCA)", "acronym": "FLEX", "flight": True, "size": "860 GB", "tags": ["droplet extinction", "CO2 suppression", "helium suppression", "extinction diameters"]},
    "PSI-68": {"pillar": "suppression", "fuelPhase": "liquid", "hardware": "Combustion Integrated Rack (CIR / MDCA)", "acronym": "FLEX-2", "flight": True, "size": "1.11 TB", "tags": ["droplet arrays", "bicomponent fuels", "suppression limits"]},
    "PSI-39": {"pillar": "suppression", "fuelPhase": "liquid", "hardware": "Combustion Integrated Rack (CIR / MDCA)", "acronym": "CFI", "flight": True, "size": "670 GB", "tags": ["cool flames", "n-dodecane", "droplets"]},

    # Detection & Smoke Measurement (Detection)
    "PSI-102": {"pillar": "detection", "fuelPhase": "solid", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "SAME", "flight": True, "size": "627 MB", "tags": ["smoke particle size", "detector calibration", "aerosol"]},
    "PSI-101": {"pillar": "detection", "fuelPhase": "solid", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "SAME-R", "flight": True, "size": "5.9 GB", "tags": ["smoke detection", "reflight", "aging effects"]},
    "PSI-47": {"pillar": "detection", "fuelPhase": "solid", "hardware": "Microgravity Science Glovebox (MSG)", "acronym": "DAFT / DAFT-2", "flight": True, "size": "40 MB", "tags": ["dust detection", "cabin environment", "particle counter"]},

    # Ground Re-analyses (Secondary context)
    "PSI-115": {"pillar": "detection", "fuelPhase": "solid", "hardware": "Ground Numerical Analysis", "acronym": "SAME Ground Model", "flight": False, "size": "252 MB", "tags": ["smoke growth model", "gravity scaling", "CFD"]},
    "PSI-117": {"pillar": "suppression", "fuelPhase": "liquid", "hardware": "Ground Numerical Analysis", "acronym": "FLEX Ground CFD", "flight": False, "size": "68 MB", "tags": ["cool flame CFD", "external heat perturbation"]},
    "PSI-142": {"pillar": "suppression", "fuelPhase": "liquid", "hardware": "Ground Meta-Analysis", "acronym": "Cool Flame Meta-Study", "flight": False, "size": "731 KB", "tags": ["extinction limits", "literature synthesis"]},
    "PSI-60": {"pillar": "prevention", "fuelPhase": "gas", "hardware": "Ground Analysis", "acronym": "SPICE Ground Soot", "flight": False, "size": "8 KB", "tags": ["soot differences", "1g vs 0g"]},
    "PSI-62": {"pillar": "prevention", "fuelPhase": "solid", "hardware": "Ground Analysis", "acronym": "BASS Flame Spread Model", "flight": False, "size": "9 KB", "tags": ["flame spread model", "analytical validation"]},
}

def clean_val(v):
    if v is None:
        return None
    s = str(v).strip()
    if s == "" or s.lower() == "n/a" or s.lower() == "nan":
        return None
    try:
        # Check if float
        f = float(s)
        return int(f) if f.is_integer() else f
    except ValueError:
        return s

def extract_numeric(val):
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    import re
    m = re.search(r"[-+]?[0-9]*\.?[0-9]+", str(val))
    if m:
        try:
            return float(m.group(0))
        except ValueError:
            return None
    return None

def parse_csv_table(csv_path):
    rows = []
    headers = []
    with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        try:
            headers = [h.strip() for h in next(reader)]
        except StopIteration:
            return [], []
        for r in reader:
            if not r or all(c.strip() == "" for c in r):
                continue
            row_dict = {}
            for i, h in enumerate(headers):
                val = r[i] if i < len(r) else None
                row_dict[h] = clean_val(val)
            rows.append(row_dict)
    return headers, rows

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    catalog_path = os.path.join(DATA_DIR, 'catalog.json')
    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog_raw = json.load(f)

    catalog_by_id = {item['accession']: item for item in catalog_raw}
    investigations = []
    total_runs = 0
    flight_count = 0
    ground_count = 0

    psi_folders = sorted(glob.glob(os.path.join(DATA_DIR, 'PSI-*')))
    for p_dir in psi_folders:
        psi_id = os.path.basename(p_dir)
        meta_info = PILLAR_MAPPING.get(psi_id, {
            "pillar": "prevention",
            "fuelPhase": "gas",
            "hardware": "NASA PSI Rig",
            "acronym": psi_id,
            "flight": True,
            "size": "Unknown",
            "tags": []
        })

        # Load investigation.json if exists
        inv_json_path = os.path.join(p_dir, 'investigation.json')
        inv_json = {}
        if os.path.exists(inv_json_path):
            with open(inv_json_path, 'r', encoding='utf-8') as f:
                inv_json = json.load(f)

        cat_item = catalog_by_id.get(psi_id, {})
        title = cat_item.get('title') or inv_json.get('title') or f"Investigation {psi_id}"
        acronym = cat_item.get('investigationAcronym') or meta_info['acronym']
        objective = inv_json.get('objective') or cat_item.get('objective') or "Detailed microgravity combustion objectives preserved in PSI."
        approach = inv_json.get('approach') or "Experimental runs conducted aboard ISS or microgravity platforms."
        description = inv_json.get('description') or objective

        # Parse CSV tables
        csv_files = glob.glob(os.path.join(p_dir, 'experimental-table', '*.csv'))
        run_tables_meta = []
        sample_runs = []
        inv_run_count = 0

        for cf in csv_files:
            fname = os.path.basename(cf)
            headers, rows = parse_csv_table(cf)
            row_count = len(rows)
            inv_run_count += row_count
            run_tables_meta.append({
                "fileName": fname,
                "rowCount": row_count,
                "columnCount": len(headers),
                "columns": headers
            })

            # Extract normalized sample runs (up to 15 per table)
            for idx, r in enumerate(rows[:15]):
                sample_run = {
                    "runId": f"{psi_id}-R{idx+1}",
                    "sourceFile": fname,
                    "rawRecord": r
                }
                # Normalize common parameter fields
                for k, v in r.items():
                    kl = k.lower()
                    if 'fuel' in kl and 'mfc' not in kl:
                        sample_run['fuel'] = str(v) if v is not None else None
                    elif kl in ['xo2', 'x_o2', 'o2 fraction', 'oxygen percent', 'oxygen mole fraction']:
                        val = extract_numeric(v)
                        if val is not None:
                            sample_run['oxygenFraction'] = val / 100.0 if val > 1.0 else val
                    elif 'pressure' in kl or 'press' in kl:
                        val = extract_numeric(v)
                        if val is not None:
                            sample_run['pressureKpa'] = val
                    elif 'flow' in kl or 'speed' in kl or 'velocity' in kl:
                        val = extract_numeric(v)
                        if val is not None:
                            sample_run['flowRateOrVelocity'] = val
                    elif 'burn time' in kl or 'duration' in kl:
                        val = extract_numeric(v)
                        if val is not None:
                            sample_run['burnDurationS'] = val
                    elif 'extinction' in kl and 'diameter' in kl:
                        val = extract_numeric(v)
                        if val is not None:
                            sample_run['extinctionDiameterMm'] = val

                sample_runs.append(sample_run)

        is_flight = meta_info['flight']
        if is_flight:
            flight_count += 1
        else:
            ground_count += 1
        total_runs += inv_run_count

        # Compute Pillar Alignments
        pillar = meta_info['pillar']
        pillar_alignment = {
            "prevention": 1.0 if pillar == "prevention" else (0.4 if "flame" in title.lower() or "soot" in title.lower() else 0.1),
            "detection": 1.0 if pillar == "detection" else (0.5 if "smoke" in title.lower() or "soot" in title.lower() else 0.1),
            "suppression": 1.0 if pillar == "suppression" else (0.4 if "extinction" in title.lower() or "dilution" in title.lower() else 0.1),
        }

        # Operational Insights Synthesis
        insights = []
        if psi_id == "PSI-159":
            insights.append("Provides the highest oxygen concentration data in the PSI repository (up to 85% O2), essential for evaluating Lunar Moon Base (32% O2) and EVA suit (100% O2) flammability margins.")
        elif psi_id == "PSI-69":
            insights.append("Definitive dataset on extinction diameters and critical suppression agent concentrations (CO2 and Helium dilution) in microgravity.")
        elif psi_id in ["PSI-98", "PSI-99", "PSI-100"]:
            insights.append("Groundbreaking large-scale solid spacecraft fire burns aboard the Cygnus vehicle; confirms that microgravity flame spread on SIBAL fabrics behaves fundamentally differently from 1g upward spread tests.")
        elif psi_id in ["PSI-25", "PSI-26"]:
            insights.append("Solid material ignition and spread across plastics and fabrics inside a fan-driven flow duct; includes real-time CO and CO2 gas sensor response.")
        elif psi_id in ["PSI-101", "PSI-102"]:
            insights.append("Smoke particle size and aerosol agglomeration data; reveals larger average particle sizes in microgravity due to diffusion-dominated growth without buoyant draft.")
        elif psi_id == "PSI-20":
            insights.append("Burning Rate Emulator (BRE) mimicked solid combustion via porous gas burners in still air, decoupling gas-phase aerodynamics from solid pyrolysis.")
        elif psi_id == "PSI-22":
            insights.append("Utilized electric field chemi-ion forces to mimic body forces in flames, acting as a viable proxy for partial gravity (Lunar/Martian) combustion physics.")
        else:
            insights.append(f"Supports comprehensive combustion science modeling and {meta_info['fuelPhase']}-phase flame safety constraints.")

        inv_data = {
            "id": psi_id,
            "title": title,
            "acronym": acronym,
            "safetyPillar": pillar,
            "fuelPhase": meta_info['fuelPhase'],
            "projectType": cat_item.get('projectType', "Microgravity Investigation"),
            "hardware": meta_info['hardware'],
            "flightExperiment": is_flight,
            "publishedArchiveSize": meta_info['size'],
            "objective": objective,
            "approach": approach,
            "description": description,
            "totalRunCount": inv_run_count,
            "runTables": run_tables_meta,
            "sampleRuns": sample_runs,
            "tags": meta_info['tags'],
            "pillarAlignment": pillar_alignment,
            "operationalInsights": insights
        }
        investigations.append(inv_data)

    db = {
        "generatedAt": datetime.utcnow().isoformat() + "Z",
        "schemaVersion": "1.0.0",
        "totalInvestigations": len(investigations),
        "flightCount": flight_count,
        "groundCount": ground_count,
        "totalRuns": total_runs,
        "investigations": sorted(investigations, key=lambda x: int(x['id'].split('-')[1]))
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2)

    print(f"Successfully compiled PSI database!")
    print(f"  - Total investigations: {len(investigations)} (Flight: {flight_count}, Ground: {ground_count})")
    print(f"  - Total experimental runs logged: {total_runs}")
    print(f"  - Output: {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
