import { PSIInvestigation, MissionEnvironmentProfile } from '../types/psi';

/**
 * Calculates environmental affinity factor between an investigation and a mission environment.
 * Evaluates how closely the test conditions bound the target atmospheric conditions:
 * - Oxygen concentration overlap
 * - Pressure range compatibility
 * - Ventilation / Flow regime relevance
 */
export function calculateEnvironmentAffinity(
  investigation: PSIInvestigation,
  env: MissionEnvironmentProfile
): { affinityScore: number; reason: string } {
  let score = 50; // Neutral baseline
  const reasons: string[] = [];

  const isMoon = env.id === 'moon_base';
  const isEva = env.id === 'eva_suit';
  const isIss = env.id === 'iss_transit';
  const isMars = env.id === 'mars_habitat';

  // 1. High Oxygen Scenarios (Moon Base >30% O2, EVA suit 100% O2)
  if (isMoon || isEva) {
    if (investigation.id === 'PSI-159') {
      // CFI-G tested up to 85% O2
      score += 45;
      reasons.push('Directly tested extreme hyperoxic conditions (up to 85% O2) in microgravity.');
    } else if (investigation.id === 'PSI-20') {
      score += 30;
      reasons.push('Tested burning rate emulator under wide oxygen variation in still atmospheres.');
    } else if (investigation.id === 'PSI-25' || investigation.id === 'PSI-99') {
      score += 25;
      reasons.push('Evaluated solid material flammability under varying oxygen and airflow envelopes.');
    }
  }

  // 2. Microgravity Spacecraft Ventilation (ISS Transit)
  if (isIss) {
    if (investigation.id === 'PSI-98' || investigation.id === 'PSI-100') {
      score += 40;
      reasons.push('Full-scale spacecraft fire tests inside Cygnus at standard ventilation speeds (20-30 cm/s).');
    } else if (investigation.id === 'PSI-25' || investigation.id === 'PSI-26') {
      score += 35;
      reasons.push('Fan-driven forced flow duct testing in Microgravity Science Glovebox.');
    } else if (investigation.id === 'PSI-101' || investigation.id === 'PSI-102') {
      score += 35;
      reasons.push('Smoke detector sizing under microgravity forced airflow.');
    }
  }

  // 3. Partial Gravity Scenarios (Moon / Mars)
  if (isMoon || isMars) {
    if (investigation.id === 'PSI-22') {
      score += 40;
      reasons.push('E-FIELD Flames used DC electric fields on flame ions as a physical proxy for partial gravity.');
    }
  }

  // 4. Suppression Requirements (All Inhabited Enclosures)
  if (investigation.safetyPillar === 'suppression') {
    if (investigation.id === 'PSI-69') {
      score += 35;
      reasons.push('FLEX establishes minimum CO2 and Helium dilution levels for microgravity fire extinguishment.');
    }
  }

  // Cap score between 10 and 100
  const normalizedScore = Math.max(10, Math.min(100, score));

  return {
    affinityScore: normalizedScore,
    reason: reasons.length > 0 ? reasons.join(' ') : 'General combustion physics principles apply.',
  };
}
