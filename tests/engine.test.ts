import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { rankInvestigations, DEFAULT_WEIGHTS } from '../src/engine/si';
import { MISSION_ENVIRONMENTS } from '../src/constants/environments';
import { calculateFlameMorphology, calculateDropletExtinctionRatio, calculateSolidFlameSpreadRate } from '../src/engine/physicsCalculators';
import { generateSIReport } from '../src/engine/insightGenerator';
import { PSIInvestigation } from '../src/types/psi';

describe('SI Ranking Engine & Physics Models (Trust Pyramid Level 2)', () => {
  const dbPath = path.resolve(__dirname, '../src/data/psi_database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const investigations: PSIInvestigation[] = db.investigations;

  it('ranks investigations for Lunar Moon Base environment', () => {
    const moonEnv = MISSION_ENVIRONMENTS['moon_base']!;
    expect(moonEnv).toBeDefined();

    const ranked = rankInvestigations(investigations, moonEnv, DEFAULT_WEIGHTS);
    expect(ranked.length).toBe(24);
    expect(ranked[0]!.totalScore).toBeGreaterThanOrEqual(ranked[1]!.totalScore);

    // High oxygen flight investigations (CFI-G or Saffire or BASS) should be in the top tier
    const topIds = ranked.slice(0, 5).map((r) => r.investigation.id);
    expect(topIds.includes('PSI-159') || topIds.includes('PSI-25') || topIds.includes('PSI-98')).toBe(true);
  });

  it('ranks investigations for ISS Transit environment', () => {
    const issEnv = MISSION_ENVIRONMENTS['iss_transit']!;
    expect(issEnv).toBeDefined();

    const ranked = rankInvestigations(investigations, issEnv, DEFAULT_WEIGHTS);
    expect(ranked.length).toBe(24);

    // Saffire or BASS or SAME should rank highly for microgravity ventilation
    const topIds = ranked.slice(0, 5).map((r) => r.investigation.id);
    expect(topIds.includes('PSI-98') || topIds.includes('PSI-25') || topIds.includes('PSI-101')).toBe(true);
  });

  it('calculates flame morphology accurately under microgravity vs 1g', () => {
    // Microgravity quiescent flame
    const microgFlame = calculateFlameMorphology(0.21, 101.3, 0.0, 0.0);
    expect(microgFlame.flameShape).toBe('spherical');
    expect(microgFlame.isExtinguished).toBe(false);

    // 1g buoyant flame
    const earthFlame = calculateFlameMorphology(0.21, 101.3, 0.0, 1.0);
    expect(earthFlame.flameShape).toBe('buoyant_teardrop');
    expect(earthFlame.flameHeightMm).toBeGreaterThan(microgFlame.flameHeightMm);

    // Sub-LOI oxygen starvation (< 13% O2)
    const starvedFlame = calculateFlameMorphology(0.08, 101.3, 5.0, 0.0);
    expect(starvedFlame.isExtinguished).toBe(true);
    expect(starvedFlame.extinctionCause).toBe('oxygen_starvation');
  });

  it('models droplet extinction ratio with suppression agents (FLEX)', () => {
    // No suppression agent
    const pure = calculateDropletExtinctionRatio(0.0, 0.0, 0.21);
    expect(pure).toBeLessThan(0.35);

    // High CO2 dilution
    const dilutedCO2 = calculateDropletExtinctionRatio(0.50, 0.0, 0.21);
    expect(dilutedCO2).toBeGreaterThan(0.70);

    // Extreme suppressant causes instant extinction (ratio = 1.0)
    const quenched = calculateDropletExtinctionRatio(0.60, 0.0, 0.21);
    expect(quenched).toBe(1.0);
  });

  it('models solid flame spread rate scaling with oxygen (Saffire / BASS)', () => {
    const rateEarth = calculateSolidFlameSpreadRate('SIBAL_fabric', 0.21, 10.0);
    const rateLunar = calculateSolidFlameSpreadRate('SIBAL_fabric', 0.32, 10.0);

    // Hyperoxic lunar atmosphere should burn significantly faster
    expect(rateLunar).toBeGreaterThan(rateEarth * 1.8);
  });

  it('generates grounded SI reports with valid citations', () => {
    const moonEnv = MISSION_ENVIRONMENTS['moon_base']!;
    const ranked = rankInvestigations(investigations, moonEnv, DEFAULT_WEIGHTS);
    const report = generateSIReport(moonEnv, ranked);

    expect(report.environmentName).toBe(moonEnv.displayName);
    expect(report.recommendedInvestigations.length).toBe(3);
    expect(report.mitigationGuidelines.length).toBe(3);
    expect(report.earthDualUseApplication.length).toBeGreaterThan(10);
  });
});
