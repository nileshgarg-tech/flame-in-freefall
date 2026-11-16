import { z } from 'zod';

export const SafetyPillarSchema = z.enum(['prevention', 'detection', 'suppression']);
export const FuelPhaseSchema = z.enum(['solid', 'liquid', 'gas']);
export const FlameRegimeSchema = z.enum(['diffusion', 'premixed', 'cool_flame', 'smoldering', 'droplet']);

export const MissionEnvironmentIdSchema = z.enum([
  'moon_base',
  'iss_transit',
  'mars_habitat',
  'eva_suit',
  'terrestrial_sea_level',
]);

export const MissionEnvironmentProfileSchema = z.object({
  id: MissionEnvironmentIdSchema,
  displayName: z.string().min(1),
  nominalPressureKpa: z.number().positive(),
  oxygenFraction: z.number().min(0).max(1),
  effectivePo2Kpa: z.number().positive(),
  nominalAirflowCmS: z.number().nonnegative(),
  gravityG: z.number().nonnegative(),
  primaryRiskFactor: z.string().min(1),
});

export const ExperimentalRunSummarySchema = z.object({
  runId: z.string(),
  sourceFile: z.string(),
  fuel: z.string().optional(),
  oxygenFraction: z.number().min(0).max(1).optional(),
  pressureKpa: z.number().positive().optional(),
  flowRateOrVelocity: z.number().optional(),
  temperatureK: z.number().positive().optional(),
  burnDurationS: z.number().nonnegative().optional(),
  extinctionDiameterMm: z.number().nonnegative().optional(),
  rawRecord: z.record(z.union([z.string(), z.number(), z.null()])),
});

export const PSIRunTableMetadataSchema = z.object({
  fileName: z.string(),
  rowCount: z.number().nonnegative(),
  columnCount: z.number().nonnegative(),
  columns: z.array(z.string()),
});

export const PSIInvestigationSchema = z.object({
  id: z.string().regex(/^PSI-\d+$/),
  title: z.string().min(1),
  acronym: z.string().min(1),
  safetyPillar: SafetyPillarSchema,
  fuelPhase: FuelPhaseSchema,
  projectType: z.string(),
  hardware: z.string(),
  flightExperiment: z.boolean(),
  publishedArchiveSize: z.string(),
  objective: z.string(),
  approach: z.string(),
  description: z.string(),
  totalRunCount: z.number().nonnegative(),
  runTables: z.array(PSIRunTableMetadataSchema),
  sampleRuns: z.array(ExperimentalRunSummarySchema),
  tags: z.array(z.string()),
  pillarAlignment: z.object({
    prevention: z.number().min(0).max(1),
    detection: z.number().min(0).max(1),
    suppression: z.number().min(0).max(1),
  }),
  operationalInsights: z.array(z.string()),
});

export const PSIDatabaseSchema = z.object({
  generatedAt: z.string(),
  schemaVersion: z.string(),
  totalInvestigations: z.number().int().positive(),
  flightCount: z.number().int().positive(),
  groundCount: z.number().int().nonnegative(),
  totalRuns: z.number().int().positive(),
  investigations: z.array(PSIInvestigationSchema),
});
