# Python script to generate chemical research files
import os, sys

# Use UTF-8 for output
sys.stdout.reconfigure(encoding='utf-8')

chemicals = {
    "Hydrogen": {"formula": "H2", "mass": 2, "mp": -259.16, "bp": -252.87, "state": "gas", "hazard": "Extremely flammable", "desc": "Colorless, odorless, tasteless diatomic gas. Lightest element. Highly flammable, forms explosive mixtures with air (4-74% H2)."},
    "Carbon": {"formula": "C", "mass": 12, "mp": 3550, "bp": 4827, "state": "solid", "hazard": "Combustible dust", "desc": "Exists as graphite (black, slippery) or diamond (clear, hard). Also amorphous carbon (soot, charcoal). Essential for organic chemistry."},
    "Nitrogen": {"formula": "N2", "mass": 28, "mp": -210, "bp": -195.8, "state": "gas", "hazard": "Asphyxiant", "desc": "Colorless, odorless, tasteless gas. Makes up 78% of Earth's atmosphere. Chemically inert under standard conditions due to strong triple bond."},
    "Oxygen": {"formula": "O2", "mass": 32, "mp": -218.8, "bp": -183, "state": "gas", "hazard": "Oxidizer, fire risk", "desc": "Colorless, odorless, tasteless gas. Supports combustion. Essential for respiration. Liquid oxygen is pale blue."},
    "Sodium": {"formula": "Na", "mass": 23, "mp": 97.8, "bp": 883, "state": "solid", "hazard": "Reactive metal, corrosive", "desc": "Soft, silvery-white alkali metal. Extremely reactive with water (produces H2, exothermic). Stored under oil."},
    "Magnesium": {"formula": "Mg", "mass": 24, "mp": 650, "bp": 1090, "state": "solid", "hazard": "Flammable metal", "desc": "Light, silvery-white alkaline earth metal. Burns with brilliant white flame. Essential for chlorophyll."},
    "Phosphorus": {"formula": "P", "mass": 31, "mp": 44.2, "bp": 280, "state": "solid", "hazard": "Pyrophoric, toxic", "desc": "White phosphorus: waxy, yellow-white, glows in dark, ignites in air. Red phosphorus: more stable."},
    "Sulfur": {"formula": "S", "mass": 32, "mp": 115.2, "bp": 444.6, "state": "solid", "hazard": "Flammable, irritant", "desc": "Yellow crystalline solid. Distinctive odor (as H2S). Burns with blue flame producing SO2."},
    "Chlorine": {"formula": "Cl2", "mass": 71, "mp": -101.5, "bp": -34.0, "state": "gas", "hazard": "Toxic, corrosive, oxidizer", "desc": "Greenish-yellow gas with pungent, choking odor. Highly toxic and reactive. Used for water disinfection."},
    "Potassium": {"formula": "K", "mass": 39, "mp": 63.5, "bp": 759, "state": "solid", "hazard": "Extremely reactive", "desc": "Soft, silvery alkali metal. More reactive than sodium. Reacts violently with water (ignites H2). Stored under oil."},
    "Calcium": {"formula": "Ca", "mass": 40, "mp": 842, "bp": 1484, "state": "solid", "hazard": "Reactive metal, irritant", "desc": "Silvery-gray alkaline earth metal. Reacts with water producing H2. Essential for bones, teeth."},
    "Iron": {"formula": "Fe", "mass": 56, "mp": 1538, "bp": 2861, "state": "solid", "hazard": "Low toxicity", "desc": "Silvery-gray transition metal. Magnetic. Rusts in presence of O2 and water (Fe2O3). Essential for hemoglobin."},
    "Copper": {"formula": "Cu", "mass": 64, "mp": 1085, "bp": 2562, "state": "solid", "hazard": "Low acute toxicity", "desc": "Reddish-orange ductile metal. Excellent electrical conductor. Tarnishes green (patina). Essential trace element."},
    "Zinc": {"formula": "Zn", "mass": 65, "mp": 419.5, "bp": 907, "state": "solid", "hazard": "Combustible dust", "desc": "Bluish-white metal. Reacts with acids producing H2. Used for galvanizing steel. Essential enzyme cofactor."},
    "Silver": {"formula": "Ag", "mass": 108, "mp": 961.8, "bp": 2162, "state": "solid", "hazard": "Low toxicity", "desc": "Shiny white precious metal. Best electrical/thermal conductor. Tarnishes black (Ag2S). Antimicrobial."},
    "Iodine": {"formula": "I2", "mass": 254, "mp": 113.7, "bp": 184.3, "state": "solid", "hazard": "Corrosive, toxic", "desc": "Purple-black crystalline solid. Sublimes to purple vapor. Essential for thyroid function. Used as antiseptic."},
    "Gold": {"formula": "Au", "mass": 197, "mp": 1064, "bp": 2856, "state": "solid", "hazard": "Inert, non-toxic", "desc": "Shiny yellow precious metal. Extremely malleable. Chemically inert. Used in electronics and jewelry."},
    "Mercury": {"formula": "Hg", "mass": 201, "mp": -38.83, "bp": 356.7, "state": "liquid", "hazard": "Highly toxic, bioaccumulative", "desc": "Silvery liquid metal. Only metal liquid at room temp. Dense (13.5 g/mL). Toxic by vapor inhalation."},
    "Lead": {"formula": "Pb", "mass": 207, "mp": 327.5, "bp": 1749, "state": "solid", "hazard": "Toxic, cumulative poison", "desc": "Dense, soft, bluish-gray metal. Malleable. Toxic to nervous system. Previously used in pipes and paint."},
    "Fluorine": {"formula": "F2", "mass": 38, "mp": -219.7, "bp": -188.1, "state": "gas", "hazard": "Extremely toxic, corrosive", "desc": "Pale yellow gas. Most electronegative element. Reacts with almost everything. Used in fluorochemicals."},
    "Bromine": {"formula": "Br2", "mass": 160, "mp": -7.2, "bp": 58.8, "state": "liquid", "hazard": "Toxic, corrosive", "desc": "Reddish-brown fuming liquid. Pungent, choking odor. Corrosive to skin. Used in flame retardants."},
    "Water": {"formula": "H2O", "mass": 18, "mp": 0, "bp": 100, "state": "liquid", "hazard": "Non-hazardous", "desc": "Colorless, odorless, tasteless liquid. Universal solvent. Essential for all known life. High specific heat."},
    "Carbon Dioxide": {"formula": "CO2", "mass": 44, "mp": -78.5, "bp": -56.6, "state": "gas", "hazard": "Asphyxiant", "desc": "Colorless, odorless gas. Sublimes at -78.5C. Product of combustion. Greenhouse gas. Used in carbonation."},
    "Ammonia": {"formula": "NH3", "mass": 17, "mp": -77.7, "bp": -33.3, "state": "gas", "hazard": "Toxic, corrosive", "desc": "Colorless gas with sharp, pungent odor. Strong base in aqueous solution. Used in fertilizer."},
    "Methane": {"formula": "CH4", "mass": 16, "mp": -182.5, "bp": -161.5, "state": "gas", "hazard": "Extremely flammable", "desc": "Colorless, odorless gas. Main component of natural gas. Strong greenhouse gas. Simplest hydrocarbon."},
    "Hydrochloric Acid": {"formula": "HCl (aq)", "mass": 36.5, "mp": -27.3, "bp": 110, "state": "liquid", "hazard": "Corrosive, toxic fumes", "desc": "Colorless to pale yellow liquid. Strong acid (pKa = -7). 37% concentrated solution. Stomach acid component."},
    "Sodium Hydroxide": {"formula": "NaOH", "mass": 40, "mp": 318, "bp": 1388, "state": "solid", "hazard": "Corrosive", "desc": "White waxy solid (pellets/flakes). Strong base (pH ~14 in 1M). Hygroscopic. Exothermic dissolution."},
    "Sulfuric Acid": {"formula": "H2SO4", "mass": 98, "mp": 10, "bp": 337, "state": "liquid", "hazard": "Corrosive, dehydrating", "desc": "Colorless, oily liquid. Strong acid. Most-produced industrial chemical. Used in batteries."},
    "Nitric Acid": {"formula": "HNO3", "mass": 63, "mp": -42, "bp": 83, "state": "liquid", "hazard": "Corrosive, oxidizer", "desc": "Colorless to yellow liquid. Strong acid and powerful oxidizer. Used in explosives and fertilizers."},
    "Acetic Acid": {"formula": "CH3COOH", "mass": 60, "mp": 16.6, "bp": 118, "state": "liquid", "hazard": "Corrosive (conc)", "desc": "Colorless liquid with pungent vinegar odor. Weak acid (pKa = 4.76). Glacial acetic acid is >=99%."},
    "Ethanol": {"formula": "C2H5OH", "mass": 46, "mp": -114.1, "bp": 78.4, "state": "liquid", "hazard": "Flammable", "desc": "Colorless liquid with alcoholic odor. Common solvent. Beverage alcohol. Denatured for industrial use."},
    "Benzene": {"formula": "C6H6", "mass": 78, "mp": 5.5, "bp": 80.1, "state": "liquid", "hazard": "Carcinogenic, flammable", "desc": "Colorless to yellow liquid with sweet odor. Known carcinogen (leukemia). Used as industrial solvent."},
    "Phenol": {"formula": "C6H5OH", "mass": 94, "mp": 40.5, "bp": 181.7, "state": "solid", "hazard": "Toxic, corrosive", "desc": "White crystalline solid with sweet, tarry odor. Weak acid (pKa = 10). Burns skin. Used in antiseptics."},
    "Salicylic Acid": {"formula": "C7H6O3", "mass": 138, "mp": 158.6, "bp": 211, "state": "solid", "hazard": "Irritant, toxic in high doses", "desc": "White crystalline powder. Weak acid (pKa = 2.97). Precursor to aspirin. Used in skincare."},
    "Acetic Anhydride": {"formula": "(CH3CO)2O", "mass": 102, "mp": -73.1, "bp": 139.8, "state": "liquid", "hazard": "Corrosive, lachrymator", "desc": "Colorless liquid with sharp acetic odor. Reacts violently with water. Used in acetylation. Regulated."},
    "Acetaminophen": {"formula": "C8H9NO2", "mass": 151, "mp": 169, "bp": 420, "state": "solid", "hazard": "Hepatotoxic in overdose", "desc": "White crystalline powder. Analgesic and antipyretic. Overdose causes liver failure. Sold as Tylenol."},
    "Ibuprofen": {"formula": "C13H18O2", "mass": 206, "mp": 75, "bp": 157, "state": "solid", "hazard": "Low acute toxicity", "desc": "White crystalline powder. NSAID. Sold as Advil, Motrin. Analgesic, anti-inflammatory."},
    "Caffeine": {"formula": "C8H10N4O2", "mass": 194, "mp": 238, "bp": 178, "state": "solid", "hazard": "Low toxicity, stimulant", "desc": "White crystalline powder. Alkaloid. CNS stimulant. Found in coffee, tea. GRAS substance."},
    "Propanoic Acid": {"formula": "C2H5COOH", "mass": 74, "mp": -20.5, "bp": 141, "state": "liquid", "hazard": "Corrosive", "desc": "Colorless oily liquid with pungent, rancid odor. Weak acid. Food preservative (E280)."},
    "Methylamine": {"formula": "CH3NH2", "mass": 31, "mp": -93.4, "bp": -6.6, "state": "gas", "hazard": "Flammable, toxic", "desc": "Colorless gas with fishy/ammonia odor. Strong base. Used in pharmaceuticals."},
    "Phenylacetone": {"formula": "C6H5CH2COCH3", "mass": 134, "mp": -15, "bp": 214, "state": "liquid", "hazard": "Irritant, regulated precursor", "desc": "Colorless to pale yellow liquid with sweet odor. DEA List I precursor. Regulated."},
    "Aluminum Chloride": {"formula": "AlCl3", "mass": 133.5, "mp": 192.6, "bp": 180, "state": "solid", "hazard": "Corrosive, moisture-sensitive", "desc": "White to yellow powder. Sublimes at 180C. Strong Lewis acid. Used in Friedel-Crafts reactions."},
    "Lithium Aluminum Hydride": {"formula": "LiAlH4", "mass": 38, "mp": 125, "bp": 150, "state": "solid", "hazard": "Pyrophoric", "desc": "White to gray powder. Strong reducing agent. Reacts violently with water. Store under inert atmosphere."},
}

def generate_chemical_md(name, data):
    d = data
    content = f"""# {name} - Chemical Compound Research

## Basic Properties
- **Molecular Formula:** {d['formula']}
- **Molecular Mass:** {d['mass']} g/mol (rounded to nearest whole number)
- **State at Room Temperature:** {d['state'].capitalize()}
- **Melting Point:** {d['mp']}°C
- **Boiling Point:** {d['bp']}°C
- **Color:** {d['desc'].split('.')[0]}.
- **Odor:** {d['desc'].split('. ')[1] if '. ' in d['desc'] else 'See description.'}

## Safety and Hazards
- **Primary Hazard:** {d['hazard']}
- **Safety Protocols:** Requires appropriate PPE including lab coat, safety glasses, and chemical-resistant gloves. Work in well-ventilated area. Consult SDS before handling.
- **HMIS/NFPA Rating:** Depends on concentration. Always check SDS.
- **Legality:** {'Regulated substance - check local regulations' if 'regulated' in d.get('hazard', '').lower() or 'precursor' in d.get('hazard', '').lower() else 'Generally legal with standard laboratory restrictions.'}
- **Insurance Needs:** Standard laboratory insurance required.

## Description
{d['desc']}

## Solubility
Consult SDS for specific solubility data. Solubility varies by solvent and conditions.

## Reactivity Summary
Reactivity depends on chemical environment. Consult SDS for detailed information.

## Common Uses
Used in chemical synthesis, research, and industrial applications.

## Procurement
Available from chemical suppliers (Sigma-Aldrich, Fisher Scientific, VWR).

## Synthesis
May be commercially available or synthesized through established routes.

## Lab Usage
Standard laboratory chemical. Handle with appropriate safety precautions.

## Common Mistakes in Handling
- Not checking SDS before use
- Inadequate PPE
- Improper storage
- Improper disposal

## Safety Protocols
- Use in fume hood
- Wear appropriate PPE
- Have spill kit available
- Know locations of safety equipment
- Follow institutional chemical hygiene plan
"""
    return content

output_dir = "research/chemicals"
os.makedirs(output_dir, exist_ok=True)

for name, data in chemicals.items():
    filename = f"{name.replace(' ', '_')}.md"
    content = generate_chemical_md(name, data)
    with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {filename}")

print(f"\nTotal files created: {len(chemicals)}")
print("Done!")