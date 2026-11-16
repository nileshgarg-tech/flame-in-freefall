/**
 * Canonical Types for Flame in Freefall
 * Strict adherence to FEATURE_MAP.md (Lauren Tan's Trust Pyramid: Level 1)
 */

export type SafetyPillar = 'prevention' | 'detection' | 'suppression';

export type FuelPhase = 'solid' | 'liquid' | 'gas';

export type FlameRegime = 'diffusion' | 'premixed' | 'cool_flame' | 'smoldering' | 'droplet';

export type MissionEnvironmentId = 
  | 'moon_base' 
  | 'iss_transit' 
  | 'mars_habitat' 
  | 'eva_suit' 
  | 'terrestrial_sea_level';

export interface MissionEnvironmentProfile {
  id: MissionEnvironmentId;
  displayName: string;
  nominalPressureKpa: number;
  oxygenFraction: number;
  effectivePo2Kpa: number;
  nominalAirflowCmS: number;
  gravityG: number;
  primaryRiskFactor: string;
}

export interface ExperimentalRunSummary {
  runId: string;
  sourceFile: string;
  fuel?: string;
  oxygenFraction?: number;
  pressureKpa?: number;
  flowRateOrVelocity?: number;
  temperatureK?: number;
  burnDurationS?: number;
  extinctionDiameterMm?: number;
  rawRecord: Record<string, string | number | null>;
}

export interface PSIRunTableMetadata {
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
}

export interface PSIInvestigation {
  id: string; // e.g. "PSI-10"
  title: string;
  acronym: string;
  safetyPillar: SafetyPillar;
  fuelPhase: FuelPhase;
  projectType: string;
  hardware: string;
  flightExperiment: boolean; // 19 flight, 5 ground
  publishedArchiveSize: string; // e.g. "1.98 TB"
  objective: string;
  approach: string;
  description: string;
  totalRunCount: number;
  runTables: PSIRunTableMetadata[];
  sampleRuns: ExperimentalRunSummary[];
  tags: string[];
  pillarAlignment: {
    prevention: number; // 0.0 - 1.0
    detection: number;  // 0.0 - 1.0
    suppression: number;// 0.0 - 1.0
  };
  operationalInsights: string[];
}

export interface PSIDatabase {
  generatedAt: string;
  schemaVersion: string;
  totalInvestigations: number;
  flightCount: number;
  groundCount: number;
  totalRuns: number;
  investigations: PSIInvestigation[];
}

export interface RankingResult {
  investigation: PSIInvestigation;
  totalScore: number; // 0 - 100
  pillarScore: number;
  environmentAffinity: number;
  empiricalBonus: number;
  explanation: string;
}

export interface SimulationState {
  environment: MissionEnvironmentId;
  oxygenPercentage: number; // 10% - 85%
  pressureKpa: number; // 20 - 150 kPa
  ventilationCmS: number; // 0 - 50 cm/s
  fuelPhase: FuelPhase;
}
