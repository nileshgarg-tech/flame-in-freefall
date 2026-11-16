import { PSIInvestigation, MissionEnvironmentProfile, RankingResult } from '../types/psi';
import { calculateEnvironmentAffinity } from './environmentMatcher';

export interface RankingWeights {
  preventionWeight: number; // 0.0 - 1.0
  detectionWeight: number;  // 0.0 - 1.0
  suppressionWeight: number;// 0.0 - 1.0
  flightBonusWeight: number;// 0.0 - 1.0
}

export const DEFAULT_WEIGHTS: RankingWeights = {
  preventionWeight: 0.40,
  detectionWeight: 0.30,
  suppressionWeight: 0.30,
  flightBonusWeight: 0.20,
};

/**
 * Super Intelligence (SI) Multi-Criteria Fire Safety Ranking Engine
 * Ranks all 24 PSI investigations for a designated mission environment.
 */
export function rankInvestigations(
  investigations: PSIInvestigation[],
  environment: MissionEnvironmentProfile,
  weights: RankingWeights = DEFAULT_WEIGHTS
): RankingResult[] {
  // Normalize weights
  const totalWeight = weights.preventionWeight + weights.detectionWeight + weights.suppressionWeight;
  const wPrev = totalWeight > 0 ? weights.preventionWeight / totalWeight : 0.33;
  const wDet = totalWeight > 0 ? weights.detectionWeight / totalWeight : 0.33;
  const wSupp = totalWeight > 0 ? weights.suppressionWeight / totalWeight : 0.33;

  const results: RankingResult[] = investigations.map((inv) => {
    // 1. Pillar Alignment Score (0 - 100)
    const pillarScore = (
      inv.pillarAlignment.prevention * wPrev +
      inv.pillarAlignment.detection * wDet +
      inv.pillarAlignment.suppression * wSupp
    ) * 100;

    // 2. Environmental Affinity Score (0 - 100)
    const { affinityScore, reason } = calculateEnvironmentAffinity(inv, environment);

    // 3. Flight Empirical Factor (Flight = 100, Ground = 70)
    const empiricalBonus = inv.flightExperiment ? 100 : 70;

    // 4. Composite Total Score (Weighted sum)
    // 45% Pillar Alignment, 40% Environment Affinity, 15% Empirical Data Bonus
    const totalScore = Math.round(
      pillarScore * 0.45 +
      affinityScore * 0.40 +
      empiricalBonus * 0.15
    );

    // Build human-interpretable explanation
    const explanation = `Ranked with score ${totalScore}/100 for ${environment.displayName}. Pillar alignment: ${Math.round(pillarScore)}%, Environmental affinity: ${affinityScore}%. ${reason}`;

    return {
      investigation: inv,
      totalScore,
      pillarScore: Math.round(pillarScore),
      environmentAffinity: affinityScore,
      empiricalBonus,
      explanation,
    };
  });

  // Sort descending by totalScore
  return results.sort((a, b) => b.totalScore - a.totalScore);
}
