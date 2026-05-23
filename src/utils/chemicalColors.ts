export interface ChemicalVisualProps {
  color: string;      // CSS HSL string, e.g. "hsl(200, 70%, 90%)"
  h: number;          // Hue (0-360)
  s: number;          // Saturation (0-100)
  l: number;          // Lightness (0-100)
  opacity: number;    // 0.0 (clear) to 1.0 (opaque)
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  viscosity: number;  // 0.0 to 1.0 (water to thick syrup)
  isBubbling: boolean;
  isFuming: boolean;
  isMetallic: boolean;
}

const CHEMICAL_PRESETS: Record<string, Partial<ChemicalVisualProps>> = {
  // Elements
  'hydrogen': { h: 200, s: 10, l: 95, opacity: 0.1, state: 'gas', viscosity: 0.0 },
  'carbon': { h: 0, s: 0, l: 15, opacity: 1.0, state: 'solid', isMetallic: false },
  'nitrogen': { h: 210, s: 10, l: 90, opacity: 0.1, state: 'gas', viscosity: 0.0 },
  'oxygen': { h: 190, s: 20, l: 95, opacity: 0.1, state: 'gas', viscosity: 0.0 },
  'sodium': { h: 0, s: 0, l: 80, opacity: 1.0, state: 'solid', isMetallic: true },
  'magnesium': { h: 0, s: 0, l: 85, opacity: 1.0, state: 'solid', isMetallic: true },
  'phosphorus': { h: 15, s: 80, l: 40, opacity: 1.0, state: 'solid' },
  'sulfur': { h: 60, s: 90, l: 60, opacity: 1.0, state: 'solid' },
  'chlorine': { h: 80, s: 60, l: 75, opacity: 0.25, state: 'gas' },
  'potassium': { h: 260, s: 10, l: 75, opacity: 1.0, state: 'solid', isMetallic: true },
  'calcium': { h: 0, s: 0, l: 90, opacity: 1.0, state: 'solid', isMetallic: true },
  'iron': { h: 20, s: 10, l: 40, opacity: 1.0, state: 'solid', isMetallic: true },
  'copper': { h: 25, s: 70, l: 55, opacity: 1.0, state: 'solid', isMetallic: true },
  'zinc': { h: 0, s: 0, l: 70, opacity: 1.0, state: 'solid', isMetallic: true },
  'silver': { h: 0, s: 0, l: 95, opacity: 1.0, state: 'solid', isMetallic: true },
  'iodine': { h: 280, s: 50, l: 20, opacity: 1.0, state: 'solid', isFuming: true },
  'gold': { h: 45, s: 90, l: 60, opacity: 1.0, state: 'solid', isMetallic: true },
  'mercury': { h: 0, s: 0, l: 75, opacity: 1.0, state: 'liquid', isMetallic: true, viscosity: 0.9 },
  'lead': { h: 220, s: 5, l: 45, opacity: 1.0, state: 'solid', isMetallic: true },
  'fluorine': { h: 70, s: 50, l: 80, opacity: 0.2, state: 'gas' },
  'bromine': { h: 5, s: 80, l: 30, opacity: 0.9, state: 'liquid', isFuming: true, viscosity: 0.4 },

  // Simple Molecules
  'water': { h: 200, s: 30, l: 95, opacity: 0.3, state: 'liquid', viscosity: 0.1 },
  'carbon dioxide': { h: 200, s: 0, l: 95, opacity: 0.1, state: 'gas' },
  'ammonia': { h: 180, s: 10, l: 90, opacity: 0.2, state: 'gas', isFuming: true },
  'methane': { h: 120, s: 5, l: 95, opacity: 0.1, state: 'gas' },
  'hydrochloric acid': { h: 200, s: 10, l: 95, opacity: 0.4, state: 'liquid', isFuming: true, viscosity: 0.1 },
  'sodium hydroxide': { h: 200, s: 5, l: 95, opacity: 0.4, state: 'liquid', viscosity: 0.15 },
  'sulfuric acid': { h: 40, s: 15, l: 90, opacity: 0.6, state: 'liquid', viscosity: 0.5 },
  'nitric acid': { h: 50, s: 30, l: 85, opacity: 0.5, state: 'liquid', isFuming: true, viscosity: 0.2 },
  'acetic acid': { h: 0, s: 0, l: 95, opacity: 0.4, state: 'liquid', viscosity: 0.15 },
  'ethanol': { h: 200, s: 15, l: 95, opacity: 0.3, state: 'liquid', viscosity: 0.08 },
  
  // Organics
  'benzene': { h: 200, s: 5, l: 95, opacity: 0.35, state: 'liquid', viscosity: 0.1 },
  'phenol': { h: 10, s: 10, l: 90, opacity: 0.5, state: 'solid' },
  'salicylic acid': { h: 0, s: 0, l: 98, opacity: 1.0, state: 'solid' },
  'acetic anhydride': { h: 200, s: 5, l: 95, opacity: 0.4, state: 'liquid', viscosity: 0.12 },
  'aspirin': { h: 0, s: 0, l: 99, opacity: 1.0, state: 'solid' },
  'pure aspirin': { h: 0, s: 0, l: 99, opacity: 1.0, state: 'solid' },
  'acetaminophen': { h: 0, s: 0, l: 98, opacity: 1.0, state: 'solid' },
  'ibuprofen': { h: 0, s: 0, l: 98, opacity: 1.0, state: 'solid' },
  'caffeine': { h: 0, s: 0, l: 98, opacity: 1.0, state: 'solid' },
};

// Generates a hash-based color and visual properties for dynamically synthesized chemicals
export function getChemicalVisuals(name: string): ChemicalVisualProps {
  const normalized = name.toLowerCase().trim();
  
  // 1. Check presets
  if (CHEMICAL_PRESETS[normalized]) {
    const preset = CHEMICAL_PRESETS[normalized];
    const h = preset.h ?? 200;
    const s = preset.s ?? 50;
    const l = preset.l ?? 50;
    const opacity = preset.opacity ?? 0.8;
    return {
      color: `hsl(${h}, ${s}%, ${l}%)`,
      h, s, l,
      opacity,
      state: preset.state ?? 'liquid',
      viscosity: preset.viscosity ?? 0.1,
      isBubbling: preset.isBubbling ?? false,
      isFuming: preset.isFuming ?? false,
      isMetallic: preset.isMetallic ?? false,
    };
  }

  // 2. Fallback heuristic rules based on keywords
  let state: 'solid' | 'liquid' | 'gas' | 'aqueous' = 'liquid';
  let isBubbling = false;
  let isFuming = false;
  let isMetallic = false;
  let opacity = 0.8;
  let viscosity = 0.1;

  if (normalized.includes('gas') || normalized.includes('vapour') || normalized.includes('vapor') || ['methane', 'ethane', 'propane', 'butane', 'helium', 'argon'].some(g => normalized.includes(g))) {
    state = 'gas';
    opacity = 0.15;
    viscosity = 0.0;
  } else if (normalized.includes('acid') || normalized.includes('solution') || normalized.endsWith('aq') || normalized.includes('liquid') || normalized.includes('oil')) {
    state = 'liquid';
    opacity = 0.5;
  } else if (normalized.includes('powder') || normalized.includes('crystal') || normalized.includes('salt') || normalized.endsWith('ide') || normalized.endsWith('ate') || normalized.endsWith('ite') || ['precipitate', 'solid', 'metal'].some(s => normalized.includes(s))) {
    state = 'solid';
    opacity = 1.0;
  }

  if (normalized.includes('fuming') || normalized.includes('smoke') || normalized.includes('nitric')) {
    isFuming = true;
  }
  if (normalized.includes('boiling') || normalized.includes('carbonated') || normalized.includes('effervescent') || normalized.includes('fizz')) {
    isBubbling = true;
  }
  if (normalized.includes('metal') || normalized.includes('alloy') || ['iron', 'gold', 'silver', 'copper', 'zinc', 'lead', 'platinum', 'steel'].some(m => normalized.includes(m))) {
    isMetallic = true;
  }

  // Generate deterministic hue, saturation, and lightness from the name string
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const h = hash % 360;
  // Chemistries usually look nicer with slightly desaturated or themed palettes
  // Let's bias saturation to 40% - 90% and lightness to 40% - 80%
  const s = 40 + (hash % 50);
  const l = 45 + (hash % 35);
  
  if (state === 'gas') {
    opacity = 0.1 + (hash % 15) / 100;
  } else if (state === 'liquid') {
    opacity = 0.3 + (hash % 40) / 100;
    viscosity = 0.05 + (hash % 45) / 100;
  }

  return {
    color: `hsl(${h}, ${s}%, ${l}%)`,
    h, s, l,
    opacity,
    state,
    viscosity,
    isBubbling,
    isFuming,
    isMetallic,
  };
}
