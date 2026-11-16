import { MissionEnvironmentProfile, RankingResult } from '../types/psi';

export interface SIInsightReport {
  environmentName: string;
  headline: string;
  criticalRisks: string[];
  recommendedInvestigations: {
    id: string;
    acronym: string;
    keyTakeaway: string;
  }[];
  mitigationGuidelines: {
    pillar: 'Prevention' | 'Detection' | 'Suppression';
    guideline: string;
  }[];
  earthDualUseApplication: string;
}

/**
 * Generates an evidence-grounded SI safety assessment based on top-ranked PSI investigations.
 */
export function generateSIReport(
  environment: MissionEnvironmentProfile,
  rankedResults: RankingResult[]
): SIInsightReport {
  const topRanked = rankedResults.slice(0, 3);

  const envId = environment.id;

  if (envId === 'moon_base') {
    return {
      environmentName: environment.displayName,
      headline: 'Hyperoxic Atmosphere Signatures Demand Elevated Flammability Margins (32% O2 @ 70.3 kPa)',
      criticalRisks: [
        'Materials self-extinguishing in Earth 1g standard (21% O2) burn continuously in 32% O2 lunar atmospheres.',
        'HVAC ventilation velocities (5-15 cm/s) provide sustained oxidizer transport, preventing flame suffocating diffusion balls.',
        'Lower total pressure (70.3 kPa) reduces convective cooling, concentrating heat at the solid pyrolysis front.',
      ],
      recommendedInvestigations: topRanked.map((r) => ({
        id: r.investigation.id,
        acronym: r.investigation.acronym,
        keyTakeaway: r.investigation.operationalInsights[0] ?? r.explanation,
      })),
      mitigationGuidelines: [
        {
          pillar: 'Prevention',
          guideline: 'Benchmark all habitat polymers against CFI-G (PSI-159) elevated O2 flammability limits and Saffire large-scale spread rates rather than Earth 1g upward flammability tests.',
        },
        {
          pillar: 'Detection',
          guideline: 'Calibrate smoke detectors for enlarged particle diameters produced under micro/partial gravity as characterized in SAME-R (PSI-101).',
        },
        {
          pillar: 'Suppression',
          guideline: 'Ensure CO2 suppression systems provide at least 45% local molar concentration to account for enhanced burning rates at 32% O2 (derived from FLEX PSI-69 data).',
        },
      ],
      earthDualUseApplication: 'Hyperbaric medical oxygen chamber safety and high-altitude mining enclosure fire protection protocols.',
    };
  }

  if (envId === 'eva_suit') {
    return {
      environmentName: environment.displayName,
      headline: 'Extreme 100% Pure Oxygen Fire Hazard in Reduced-Pressure Spacesuit (29.6 kPa)',
      criticalRisks: [
        'Zero tolerance for ignition sources: 100% O2 drastically lowers minimum ignition energies (MIE).',
        'Fabric fibers exhibit flash-burning behavior with propagation speeds exceeding 10x standard Earth rates.',
      ],
      recommendedInvestigations: topRanked.map((r) => ({
        id: r.investigation.id,
        acronym: r.investigation.acronym,
        keyTakeaway: r.investigation.operationalInsights[0] ?? r.explanation,
      })),
      mitigationGuidelines: [
        {
          pillar: 'Prevention',
          guideline: 'Exclude all combustible polymers and unshielded organic elastomeric seals from pure oxygen pressurized volumes (guided by BASS-II PSI-25 and CFI-G PSI-159 limits).',
        },
        {
          pillar: 'Detection',
          guideline: 'Deploy multi-wavelength optical UV/IR and fast-response pressure differential sensors inside suit umbilical lines.',
        },
        {
          pillar: 'Suppression',
          guideline: 'Rapid depressurization and inert purge line protocol remains the only viable emergency mitigation for internal suit fires.',
        },
      ],
      earthDualUseApplication: 'Commercial diving deep-sea saturation gas mixtures and hospital hyperbaric safety standards.',
    };
  }

  // Default / ISS Transit / Mars
  return {
    environmentName: environment.displayName,
    headline: `Microgravity Combustion Constraints for ${environment.displayName}`,
    criticalRisks: [
      environment.primaryRiskFactor,
      'Absence of natural buoyancy produces quiescent spherical flames that generate elevated soot concentrations.',
      'Smoldering combustion can persist undetected in low-flow pockets behind equipment racks.',
    ],
    recommendedInvestigations: topRanked.map((r) => ({
      id: r.investigation.id,
      acronym: r.investigation.acronym,
      keyTakeaway: r.investigation.operationalInsights[0] ?? r.explanation,
    })),
    mitigationGuidelines: [
      {
        pillar: 'Prevention',
        guideline: 'Enforce materials screening with Saffire-I/II/III realistic spacecraft fire spread benchmarks.',
      },
      {
        pillar: 'Detection',
        guideline: 'Position dual optical obscuration and ionization sensors along HVAC return ducts to capture non-buoyant smoke plumes.',
      },
      {
        pillar: 'Suppression',
        guideline: 'Utilize fine water mist or CO2 gaseous flooding according to FLEX (PSI-69) extinction envelope sizing.',
      },
    ],
    earthDualUseApplication: 'Terrestrial cleanroom smoldering detection and fine-water mist fire suppression in high-density data centers.',
  };
}
