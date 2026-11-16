import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PSIDatabaseSchema } from '../src/schemas/psi';

describe('Data Ingestion & Schema Contracts (Trust Pyramid Level 1)', () => {
  const dbPath = path.resolve(__dirname, '../src/data/psi_database.json');

  it('psi_database.json exists and is valid JSON', () => {
    expect(fs.existsSync(dbPath)).toBe(true);
    const raw = fs.readFileSync(dbPath, 'utf-8');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it('validates strictly against PSIDatabaseSchema (Zod)', () => {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(raw);
    const parsed = PSIDatabaseSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it('contains exactly 24 investigations (19 flight, 5 ground)', () => {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    expect(db.totalInvestigations).toBe(24);
    expect(db.flightCount).toBe(19);
    expect(db.groundCount).toBe(5);
    expect(db.investigations.length).toBe(24);
  });

  it('correctly maps all 3 Spacecraft Fire Safety Pillars', () => {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    const pillars = new Set(db.investigations.map((i: any) => i.safetyPillar));
    expect(pillars.has('prevention')).toBe(true);
    expect(pillars.has('detection')).toBe(true);
    expect(pillars.has('suppression')).toBe(true);
  });

  it('includes key landmark investigations with correct attributes', () => {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    const invMap = new Map<string, any>(db.investigations.map((i: any) => [i.id, i]));

    // CFI-G (High Oxygen Gas Flames)
    const cfig = invMap.get('PSI-159');
    expect(cfig).toBeDefined();
    expect(cfig.acronym).toContain('CFI-G');
    expect(cfig.safetyPillar).toBe('prevention');
    expect(cfig.flightExperiment).toBe(true);

    // FLEX (Liquid Extinction & Suppression)
    const flex = invMap.get('PSI-69');
    expect(flex).toBeDefined();
    expect(flex.acronym).toBe('FLEX');
    expect(flex.safetyPillar).toBe('suppression');

    // Saffire-I (Large scale spacecraft solid fires)
    const saffire1 = invMap.get('PSI-98');
    expect(saffire1).toBeDefined();
    expect(saffire1.acronym.toUpperCase()).toBe('SAFFIRE-I');
    expect(saffire1.fuelPhase).toBe('solid');

    // SAME (Smoke & Aerosol Detection)
    const same = invMap.get('PSI-102');
    expect(same).toBeDefined();
    expect(same.acronym.toUpperCase()).toBe('SAME');
    expect(same.safetyPillar).toBe('detection');
  });

  it('has parsed experimental run tables with non-zero row counts', () => {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    expect(db.totalRuns).toBeGreaterThan(1500);

    // Verify sample runs are properly structured
    const flex = db.investigations.find((i: any) => i.id === 'PSI-69');
    expect(flex.sampleRuns.length).toBeGreaterThan(0);
    expect(flex.runTables.length).toBeGreaterThan(0);
  });
});
