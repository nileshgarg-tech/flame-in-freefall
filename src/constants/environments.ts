import { MissionEnvironmentProfile } from '../types/psi';

export const MISSION_ENVIRONMENTS: Record<string, MissionEnvironmentProfile> = {
  moon_base: {
    id: 'moon_base',
    displayName: 'Lunar Moon Base / Pressurized Rover',
    nominalPressureKpa: 70.3, // 10.2 psi
    oxygenFraction: 0.32,     // 32% O2
    effectivePo2Kpa: 22.5,
    nominalAirflowCmS: 10.0,
    gravityG: 0.166,
    primaryRiskFactor: 'Elevated flammability due to hyperoxic atmosphere (>30% O2); lower ignition energy.',
  },
  iss_transit: {
    id: 'iss_transit',
    displayName: 'ISS / Deep Space Transit Spacecraft',
    nominalPressureKpa: 101.3, // 14.7 psi
    oxygenFraction: 0.21,      // 21% O2
    effectivePo2Kpa: 21.3,
    nominalAirflowCmS: 15.0,
    gravityG: 0.0,
    primaryRiskFactor: 'CO2 pooling, quiet spherical smoldering, absence of buoyant chimney effect for smoke detection.',
  },
  mars_habitat: {
    id: 'mars_habitat',
    displayName: 'Martian Surface Habitat',
    nominalPressureKpa: 55.2, // 8.0 psi
    oxygenFraction: 0.30,     // 30% O2
    effectivePo2Kpa: 16.5,
    nominalAirflowCmS: 8.0,
    gravityG: 0.380,
    primaryRiskFactor: 'Low total pressure boundary combined with elevated O2; partial buoyancy transitions.',
  },
  eva_suit: {
    id: 'eva_suit',
    displayName: 'EVA Mobility Unit (Spacesuit)',
    nominalPressureKpa: 29.6, // 4.3 psi
    oxygenFraction: 1.00,     // 100% O2
    effectivePo2Kpa: 29.6,
    nominalAirflowCmS: 5.0,
    gravityG: 0.166,
    primaryRiskFactor: 'Catastrophic pure-oxygen combustion hazard; flash-fire vulnerability across solid materials.',
  },
  terrestrial_sea_level: {
    id: 'terrestrial_sea_level',
    displayName: 'Terrestrial Standard (Earth 1g Reference)',
    nominalPressureKpa: 101.3, // 14.7 psi
    oxygenFraction: 0.21,      // 21% O2
    effectivePo2Kpa: 21.3,
    nominalAirflowCmS: 20.0,
    gravityG: 1.0,
    primaryRiskFactor: 'Standard buoyancy-driven upward convective flame propagation.',
  },
};
