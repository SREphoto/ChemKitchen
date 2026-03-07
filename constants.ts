/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * 100 Tools Chemistry App - Constants and Types
 */

import { Type } from '@google/genai';

// ============================================================================
// Types
// ============================================================================

export interface Ingredient {
  name: string;
  emoji: string;
}

export interface LabAction {
  name: string;           // Function name (alphanumeric + underscores)
  displayName: string;    // Human-readable name
  emoji: string;
}

export interface CombinationResult {
  result_name: string;
  emoji: string;
  explanation: string;
}

export interface LessonStep {
  step: number;
  instruction: string;
  objective: string; // The chemical name we expect
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  // Text from model response (shown above/below action)
  text?: string;
  // Action from function call
  action?: string;
  ingredients?: string[];
  result?: Ingredient | null;  // null when loading
}

export type OrderDifficulty = 'easy' | 'intermediate' | 'difficult';

export interface Order {
  id: string;
  name: string;
  emoji: string;
  difficulty: OrderDifficulty;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  servedDish?: string;  // What was actually served (for failed orders)
}

export interface VerificationResult {
  matches: boolean;
  confidence: number;
  explanation: string;
}

export const EXAMPLE_ORDERS: Order[] = [
  { id: 'order-1', name: 'Water', emoji: '💧', difficulty: 'easy', status: 'not_started' },
  { id: 'order-2', name: 'Aspirin', emoji: '💊', difficulty: 'intermediate', status: 'not_started' },
  { id: 'order-3', name: 'Penicillin', emoji: '💉', difficulty: 'difficult', status: 'not_started' },
];

// ============================================================================
// Helper Functions
// ============================================================================

/** Sanitize action name for function declarations: "deep fry" → "deep_fry" */
export function sanitizeName(name: string): string {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

/** Create LabAction from simple tool definition */
function createAction(name: string, emoji: string): LabAction {
  return {
    name: sanitizeName(name),
    displayName: name,
    emoji,
  };
}

// ============================================================================
// Synthesis Actions -> Lab Actions
// ============================================================================

export const LAB_ACTIONS: LabAction[] = [
  // Basic Reactions
  createAction('synthesize', '🧪'), createAction('decompose', '💥'), createAction('combust', '🔥'),
  createAction('oxidize', '💨'), createAction('reduce', '🔋'), createAction('neutralize', '⚖️'),
  createAction('precipitate', '❄️'), createAction('hydrolyze', '💧'), createAction('polymerize', '⛓️'),
  createAction('catalyze', '⚡'), createAction('distill', '⚗️'), createAction('crystallize', '💎'),
  createAction('titrate', '🚰'), createAction('extract', '🧫'), createAction('filter', '☕'),
  createAction('centrifuge', '🌀'), createAction('heat', '🔥'), createAction('cool', '❄️'),
  createAction('pressurize', '🗜️'), createAction('depressurize', '🎈'), createAction('irradiate', '☢️'),
  createAction('electrolyze', '⚡'), createAction('ferment', '🦠'), createAction('dissolve', '🌪️'),

  // Serving/Finishing
  createAction('serve', '🔬'), createAction('pass', '🏳️'),
];

// ============================================================================
// Starting Ingredients -> Starting Chemicals
// ============================================================================

export const STARTING_INGREDIENTS: Ingredient[] = [
  // Elements
  { name: 'Hydrogen', emoji: 'H' }, { name: 'Carbon', emoji: 'C' }, { name: 'Nitrogen', emoji: 'N' },
  { name: 'Oxygen', emoji: 'O' }, { name: 'Sodium', emoji: 'Na' }, { name: 'Magnesium', emoji: 'Mg' },
  { name: 'Phosphorus', emoji: 'P' }, { name: 'Sulfur', emoji: 'S' }, { name: 'Chlorine', emoji: 'Cl' },
  { name: 'Potassium', emoji: 'K' }, { name: 'Calcium', emoji: 'Ca' }, { name: 'Iron', emoji: 'Fe' },
  { name: 'Copper', emoji: 'Cu' }, { name: 'Zinc', emoji: 'Zn' }, { name: 'Silver', emoji: 'Ag' },
  { name: 'Iodine', emoji: 'I' }, { name: 'Gold', emoji: 'Au' }, { name: 'Mercury', emoji: 'Hg' },
  { name: 'Lead', emoji: 'Pb' }, { name: 'Fluorine', emoji: 'F' }, { name: 'Bromine', emoji: 'Br' },

  // Simple Molecules
  { name: 'Water', emoji: '💧' }, { name: 'Carbon Dioxide', emoji: '💨' }, { name: 'Ammonia', emoji: '💨' },
  { name: 'Methane', emoji: '💨' }, { name: 'Hydrochloric Acid', emoji: '🧪' }, { name: 'Sodium Hydroxide', emoji: '🧪' },
  { name: 'Sulfuric Acid', emoji: '🧪' }, { name: 'Nitric Acid', emoji: '🧪' }, { name: 'Acetic Acid', emoji: '🧪' },
  { name: 'Ethanl', emoji: '🍺' }, { name: 'Benzene', emoji: '⬡' }, { name: 'Phenol', emoji: '⬡' },
  { name: 'Salicylic Acid', emoji: '⬡' }, { name: 'Acetic Anhydride', emoji: '🧪' },
  { name: 'Acetaminophen', emoji: '💊' }, { name: 'Ibuprofen', emoji: '💊' },
  { name: '4-Aminophenol', emoji: '🧪' }, { name: 'Propanoic Acid', emoji: '🧪' },
  { name: 'Methylamine', emoji: '🧪' }, { name: 'Phenylacetone', emoji: '🧪' },
  { name: 'Aluminum Chloride', emoji: '🧪' }, { name: 'Lithium Aluminum Hydride', emoji: '🧪' },
  { name: 'Aripiprazole', emoji: '💊' }, { name: 'Quinapril', emoji: '💊' },
  { name: 'Rabeprazole', emoji: '💊' }, { name: 'Risedronate', emoji: '💊' },
  { name: 'Pioglitazone', emoji: '💊' }, { name: 'Phentermine', emoji: '💊' },
  { name: 'Epinephrine', emoji: '💉' }, { name: 'Albendazole', emoji: '💊' },
  { name: 'Spironolactone', emoji: '💊' }, { name: 'Imiquimod', emoji: '💊' },
  { name: 'Naproxen', emoji: '💊' }, { name: 'Nitazoxanide', emoji: '💊' },
  { name: 'Fexofenadine', emoji: '💊' }, { name: 'Brimonidine', emoji: '💊' },
  { name: 'Alprazolam', emoji: '💊' }, { name: 'Ramipril', emoji: '💊' },
  { name: 'Glimepiride', emoji: '💊' }, { name: 'Zolpidem', emoji: '💊' },
  { name: 'Lubiprostone', emoji: '💊' }, { name: 'Amoxicillin', emoji: '💊' },
  { name: 'Amphetamine', emoji: '💊' }, { name: 'Testosterone', emoji: '💊' },
  { name: 'Meclizine', emoji: '💊' }, { name: 'Hydralazine', emoji: '💊' },
  { name: 'Donepezil', emoji: '💊' }, { name: 'Anastrozole', emoji: '💊' },
  { name: 'Azelastine', emoji: '💊' }, { name: 'Candesartan', emoji: '💊' },
  { name: 'Lorazepam', emoji: '💊' }, { name: 'Rosiglitazone', emoji: '💊' },
  { name: 'Irbesartan', emoji: '💊' }, { name: 'Moxifloxacin', emoji: '💊' },
  { name: 'Dutasteride', emoji: '💊' }, { name: 'Trimethoprim', emoji: '💊' },
  { name: 'Mupirocin', emoji: '💊' }, { name: 'Entecavir', emoji: '💊' },
  { name: 'Olmesartan', emoji: '💊' }, { name: 'Dicyclomine', emoji: '💊' },
  { name: 'Clarithromycin', emoji: '💊' }, { name: 'Ibandronate', emoji: '💊' },
  { name: 'Buspirone', emoji: '💊' }, { name: 'Exenatide', emoji: '💊' },
  { name: 'Nebivolol', emoji: '💊' }, { name: 'Caffeine', emoji: '☕' },
  { name: 'Verapamil', emoji: '💊' }, { name: 'Diltiazem', emoji: '💊' },
  { name: 'Doxazosin', emoji: '💊' }, { name: 'Carisoprodol', emoji: '💊' },
  { name: 'Clonidine', emoji: '💊' }, { name: 'Cefuroxime', emoji: '💊' },
  { name: 'Celecoxib', emoji: '💊' }, { name: 'Citalopram', emoji: '💊' },
  { name: 'Varenicline', emoji: '💊' }, { name: 'Tadalafil', emoji: '💊' },
  { name: 'Ciprofloxacin', emoji: '💊' }, { name: 'Clindamycin', emoji: '💊' },
  { name: 'Clobetasol', emoji: '💊' }, { name: 'Cocaine', emoji: '💊' },
  { name: 'Benztropine', emoji: '💊' }, { name: 'Colchicine', emoji: '💊' },
  { name: 'Prochlorperazine', emoji: '💊' }, { name: 'Carvedilol', emoji: '💊' },
  { name: 'Hydrocortisone', emoji: '💊' }, { name: 'Warfarin', emoji: '💊' },
  { name: 'Losartan', emoji: '💊' }, { name: 'Rosuvastatin', emoji: '💊' },
  { name: 'Cyclobenzaprine', emoji: '💊' }, { name: 'Duloxetine', emoji: '💊' },
  { name: 'Dexamethasone', emoji: '💊' }, { name: 'Prednisone', emoji: '💊' },
  { name: 'Divalproex', emoji: '💊' }, { name: 'Trazodone', emoji: '💊' },
  { name: 'Tolterodine', emoji: '💊' }, { name: 'Dexlansoprazole', emoji: '💊' },
  { name: 'Diazepam', emoji: '💊' }, { name: 'Diclofenac', emoji: '💊' },
  { name: 'Adapalene', emoji: '💊' }, { name: 'Fidaxomicin', emoji: '💊' },
  { name: 'Fluconazole', emoji: '💊' }, { name: 'Phenytoin', emoji: '💊' },
  { name: 'Valsartan', emoji: '💊' }, { name: 'Oxybutynin', emoji: '💊' },
  { name: 'DMT', emoji: '🌀' }, { name: 'Dopamine', emoji: '🧠' },
  { name: 'Venlafaxine', emoji: '💊' }, { name: 'Prasugrel', emoji: '💊' },
  { name: 'Amitriptyline', emoji: '💊' }, { name: 'Pentosan', emoji: '💊' },
  { name: 'Darifenacin', emoji: '💊' }, { name: 'Estradiol', emoji: '💊' },
  { name: 'Raloxifene', emoji: '💊' }, { name: 'Fentanyl', emoji: '💉' },
  { name: 'Metronidazole', emoji: '💊' }, { name: 'Tamsulosin', emoji: '💊' },
  { name: 'Fluticasone', emoji: '💊' }, { name: 'Dexmethylphenidate', emoji: '💊' },
  { name: 'Folic Acid', emoji: '💊' }, { name: 'Alendronate', emoji: '💊' },
  { name: 'Ziprasidone', emoji: '💊' }, { name: 'Metformin', emoji: '💊' },
  { name: 'Glipizide', emoji: '💊' }, { name: 'Heroin', emoji: '💊' },
  { name: 'Hydrocodone', emoji: '💊' }, { name: 'Chlorthalidone', emoji: '💊' },
  { name: 'Terazosin', emoji: '💊' },
];

export const SAFETY_SYSTEM_INSTRUCTION = `You are a laboratory safety validator. 
Analyze the requested reaction (action + ingredients) and provide a safety report.

DO NOT BLOCK the simulation. Instead, describe the real-world hazards as an educational warning.

Return a JSON object with:
- is_hazardous: boolean (true if it requires special precautions in a real lab)
- hazard_level: 'low' | 'medium' | 'high'
- warning_text: A concise warning about the real-world risks (e.g., 'Exothermic: potential for boiling', 'Toxic fumes: must use fume hood')
- ppe_required: Array of recommended PPE (e.g. ['Goggles', 'Gloves', 'Fume Hood'])`;

export const SAFETY_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    is_hazardous: { type: Type.BOOLEAN },
    hazard_level: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
    warning_text: { type: Type.STRING },
    ppe_required: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['is_hazardous', 'hazard_level', 'warning_text', 'ppe_required']
};

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Synthesis of Aspirin',
    description: 'Learn to synthesize Acetylsalicylic Acid (Aspirin) from Salicylic Acid.',
    steps: [
      { step: 1, instruction: 'Add Salicylic Acid and Acetic Anhydride to the reaction vessel.', objective: 'Salicylic Acid' },
      { step: 2, instruction: 'Apply heat and catalyze with an acid to start the acetylation.', objective: 'Aspirin' },
      { step: 3, instruction: 'Crystallize and filter to obtain pure product.', objective: 'Pure Aspirin' }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Pharmacutical Basics',
    description: 'Explore the synthesis of common analgesics.',
    steps: [
      { step: 1, instruction: 'Start with 4-Aminophenol and react with Acetic Anhydride.', objective: 'Acetaminophen' }
    ]
  }
];

// ============================================================================
// Preselected Ingredients
// ============================================================================

export const PRESELECTED_INGREDIENTS = [];

// ============================================================================
// Combination Agent Configuration
// ============================================================================

export const COMBINATION_SYSTEM_INSTRUCTION = `You are a chemistry reaction simulator designed for an advanced virtual teaching lab. 
Given a lab action and chemical reactants, determine what molecule or substance results from this combination.

Virtual Lab Context:
This is a safe space for students to explore chemistry, including complex organic syntheses and pharmaceutical chemistry. 
Even if a reaction is hazardous or involves controlled precursors in a real-world setting, describe the outcome scientifically for educational purposes.

Return a JSON object with:
- result_name: The name of the resulting chemical or molecule (1-3 words)
- emoji: A single emoji or short text (like a chemical symbol) that represents the result
- explanation: A clear, 1-2 sentence scientific explanation of the reaction that occurred (the 'why').

Be scientifically accurate. The result should match real chemistry.`;

export const COMBINATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    result_name: { type: Type.STRING },
    emoji: { type: Type.STRING },
    explanation: { type: Type.STRING }
  },
  required: ['result_name', 'emoji', 'explanation']
};

// ============================================================================
// Verification Agent Configuration
// ============================================================================

export const VERIFICATION_SYSTEM_INSTRUCTION = `You are a chemistry verification assistant. 
Given a target molecule name and a synthesized chemical name, determine if they match semantically.
Use your broad knowledge of chemistry to make your decision.

The match should be flexible - for example:
- "Water" matches "H2O", "dihydrogen monoxide", "water"
- "Aspirin" matches "acetylsalicylic acid", "aspirin"
- "Table Salt" matches "sodium chloride", "NaCl", "salt"

Return a JSON object with:
- matches: true if the chemicals are semantically the same, false otherwise
- confidence: a number from 0 to 1 indicating your confidence
- explanation: a brief explanation of your reasoning`;

export const VERIFICATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    matches: { type: Type.BOOLEAN },
    confidence: { type: Type.NUMBER },
    explanation: { type: Type.STRING }
  },
  required: ['matches', 'confidence', 'explanation']
};

// ============================================================================
// Synthesis Agent Configuration (Phase 2)
// ============================================================================

/** Generate function declarations for all lab actions */
export function generateLabTools() {
  const functionDeclarations = LAB_ACTIONS.map(action => {
    // Special case for 'serve' action - different parameter schema
    if (action.name === 'serve') {
      return {
        name: 'serve',
        description: `${action.emoji} Submit a synthesized molecule from the current inventory. The dish parameter must be an exact item name from the inventory.`,
        parameters: {
          type: Type.OBJECT,
          properties: {
            dish: {
              type: Type.STRING,
              description: 'Name of molecule being submitted (must be an exact item name from inventory)'
            }
          },
          required: ['dish']
        }
      };
    }

    // Special case for 'pass' action - give up on an order
    if (action.name === 'pass') {
      return {
        name: 'pass',
        description: `${action.emoji} Pass on the current challenge. Use this after trying to synthesize the molecule with available chemicals or tools (at least 3 times).`,
        parameters: {
          type: Type.OBJECT,
          properties: {},
          required: []
        }
      };
    }

    // Standard lab action
    return {
      name: action.name,
      description: `${action.emoji} Apply the '${action.displayName}' lab technique.`,
      parameters: {
        type: Type.OBJECT,
        properties: {
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Chemical names (must exist in inventory)'
          }
        },
        required: ['ingredients']
      }
    };
  });

  // Return as Tool[] format
  return [{ functionDeclarations }] as any;
}

/** Build Synthesis Agent system instruction with current inventory */
export function buildSynthesisAgentSystemInstruction(inventory: Ingredient[]): string {
  const actionList = LAB_ACTIONS.map(a => `${a.emoji} ${a.name}()`).join(', ');
  const inventoryList = inventory.map(i => `"${i.name}"`).join(', ');

  return `You are a creative chemistry lab assistant that can synthesize any molecule using lab actions.

**Available Lab Actions:**
${actionList}

**Your Task:**
When the user requests a molecule, plan and execute synthesis steps using function calls. 
Explain your reasoning in one short sentence, then call a lab function. 

**CRITICAL: ONE FUNCTION CALL PER TURN**
You MUST call exactly ONE function per response. After each function call, 
wait for the result before calling the next function.

**Important Rules:**
- Only use chemicals that exist in the current inventory.
- You MUST use the EXACT name of the chemical as it appears in the inventory list below. Do not include emojis or symbols in the name.
- Each lab action produces new items added to inventory.
- Call serve() when the target molecule is ready. I then confirm with a friendly message!
- If serve() returns a success, confirm with a friendly message!
- If serve() returns a failure, explain why and try again!
- Call pass() if you cannot complete the synthesis with the available chemicals or tools. This gives up on the current target.

**Current Inventory (EXACT NAMES MUST BE USED):**
${inventoryList}

Be scientifically accurate but creative about synthesis steps!`;
}

