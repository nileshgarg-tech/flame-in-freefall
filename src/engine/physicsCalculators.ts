/**
 * Physical Science Informatics (PSI) Microgravity Combustion Physics Models
 * Grounded in empirical laws from NASA microgravity flight experiments:
 * - Saffire-I/II/III & BASS (Solid materials & flame spread)
 * - FLEX & FLEX-2 (Droplet extinction diameters & suppression)
 * - CFI-G & Flame Design (High-oxygen limits & spherical diffusion)
 * - SAME & SAME-R (Smoke aerosol agglomeration)
 */

export interface FlameMorphology {
  flameShape: 'spherical' | 'ellipsoidal' | 'buoyant_teardrop';
  colorTempK: number;
  apparentDiameterMm: number;
  flameHeightMm: number;
  sootTendency: 'low' | 'moderate' | 'high' | 'extreme';
  isExtinguished: boolean;
  extinctionCause?: 'oxygen_starvation' | 'high_dilution' | 'excess_strain' | 'normal_quench';
}

/**
 * Calculates flame morphology under given atmospheric conditions.
 * Compares microgravity (g=0) diffusion flame with terrestrial (g=1) buoyant flame.
 */
export function calculateFlameMorphology(
  oxygenFraction: number, // 0.10 - 0.85
  pressureKpa: number,    // 20 - 150 kPa
  ventilationCmS: number, // 0 - 50 cm/s
  gravityG: number = 0    // 0 = microgravity, 1 = Earth 1g
): FlameMorphology {
  // Limiting Oxygen Index (LOI) threshold
  // Under zero flow in microgravity, LOI is higher (~15-18% O2) because convection doesn't supply oxygen.
  const effectiveLoi = gravityG === 0 
    ? (ventilationCmS < 2.0 ? 0.16 : 0.13)
    : 0.14;

  if (oxygenFraction < effectiveLoi) {
    return {
      flameShape: 'spherical',
      colorTempK: 800,
      apparentDiameterMm: 0,
      flameHeightMm: 0,
      sootTendency: 'low',
      isExtinguished: true,
      extinctionCause: 'oxygen_starvation',
    };
  }

  // High ventilation blow-off limit (excess aerodynamic strain)
  if (ventilationCmS > 45.0 && oxygenFraction < 0.25) {
    return {
      flameShape: 'ellipsoidal',
      colorTempK: 1200,
      apparentDiameterMm: 2.0,
      flameHeightMm: 4.0,
      sootTendency: 'low',
      isExtinguished: true,
      extinctionCause: 'excess_strain',
    };
  }

  // Flame shape depends on Froude number (inertial/buoyant force ratio)
  let shape: 'spherical' | 'ellipsoidal' | 'buoyant_teardrop';
  if (gravityG > 0.5) {
    shape = 'buoyant_teardrop';
  } else if (ventilationCmS > 10.0) {
    shape = 'ellipsoidal';
  } else {
    shape = 'spherical';
  }

  // Flame temperature estimation based on oxygen fraction and pressure
  // High O2 tests (e.g. CFI-G up to 85%) exhibit significantly elevated flame temperatures.
  const baselineTempK = 1400;
  const tempFromO2 = (oxygenFraction - 0.21) * 1200;
  const tempFromPress = (pressureKpa / 101.3 - 1.0) * 150;
  const colorTempK = Math.max(900, Math.min(2600, Math.round(baselineTempK + tempFromO2 + tempFromPress)));

  // Characteristic flame size
  // In 0g quiescent, diffusion flame expands into a large spherical zone
  let diameterMm = 12.0;
  if (gravityG === 0) {
    // Zero gravity: flame diameter scales inversely with ventilation (diffusion ball)
    diameterMm = Math.max(6.0, 24.0 / (1.0 + ventilationCmS * 0.1));
  } else {
    // 1g: buoyant pinch narrows diameter
    diameterMm = 8.0;
  }

  // Flame height: elongated by buoyancy in 1g, elongated by forced flow in 0g
  let heightMm = diameterMm;
  if (gravityG > 0.5) {
    heightMm = diameterMm * 3.6; // Buoyant convective updraft stretches flame vertically
  } else if (ventilationCmS > 5.0) {
    heightMm = diameterMm * (1.0 + ventilationCmS * 0.05);
  }

  // Soot tendency: Microgravity flames exhibit longer residence times, increasing soot agglomeration
  let sootTendency: 'low' | 'moderate' | 'high' | 'extreme' = 'moderate';
  if (oxygenFraction > 0.40) {
    sootTendency = 'high';
  }
  if (gravityG === 0 && ventilationCmS < 5.0 && oxygenFraction > 0.30) {
    sootTendency = 'extreme';
  }

  return {
    flameShape: shape,
    colorTempK,
    apparentDiameterMm: Math.round(diameterMm * 10) / 10,
    flameHeightMm: Math.round(heightMm * 10) / 10,
    sootTendency,
    isExtinguished: false,
  };
}

/**
 * Droplet extinction diameter prediction derived from FLEX (PSI-69) data:
 * d_e / d_0 = A * (1 - Y_suppressant)^b
 */
export function calculateDropletExtinctionRatio(
  co2Fraction: number,
  heFraction: number,
  oxygenFraction: number
): number {
  const totalSuppressant = co2Fraction + heFraction;
  if (totalSuppressant >= 0.55 || oxygenFraction < 0.13) {
    return 1.0; // Instant extinction at initial diameter
  }
  // Empirical fit to FLEX microgravity droplet burns
  const baseRatio = 0.28;
  const co2Effect = co2Fraction * 0.95;
  const heEffect = heFraction * 1.15; // Helium cools flame faster via high thermal conductivity
  return Math.min(1.0, Math.max(0.15, baseRatio + co2Effect + heEffect));
}

/**
 * Solid flame spread rate estimation (mm/s) based on BASS-II & Saffire data:
 * S = S_0 * (X_O2 / 0.21)^1.8 * (U_flow / 10)^0.5
 */
export function calculateSolidFlameSpreadRate(
  material: 'SIBAL_fabric' | 'PMMA_plastic' | 'Nomex',
  oxygenFraction: number,
  ventilationCmS: number
): number {
  const baseRates = {
    SIBAL_fabric: 2.1,  // mm/s at 21% O2, 10 cm/s flow (Saffire-I)
    PMMA_plastic: 0.8,  // mm/s (BASS-II)
    Nomex: 0.05,        // Self-extinguishing at 21% O2, but flammable at >30% O2
  };

  const base = baseRates[material];
  if (oxygenFraction < 0.15) return 0.0; // Extinguished

  const o2Multiplier = Math.pow(oxygenFraction / 0.21, 1.85);
  const flowMultiplier = Math.sqrt(Math.max(1.0, ventilationCmS) / 10.0);

  return Math.round(base * o2Multiplier * flowMultiplier * 100) / 100;
}
