import os

equipment_data = {
    "cool": {
        "purpose": "To decrease the temperature of a substance or reaction mixture. Cooling is used to slow or stop reactions, promote crystallization, control exothermic reactions, condense vapors, and preserve thermally sensitive materials.",
        "how": "Heat is removed from the system by conduction to a colder medium. Common cooling methods: ice baths (0°C), ice/salt mixtures (-5 to -18°C), dry ice/acetone (-78°C), liquid nitrogen (-196°C), or recirculating chillers (programmable). The greater the temperature difference, the faster the cooling rate.",
        "setup": "Cooling bath in appropriate container (styrofoam or dewar). Reaction vessel immersed in bath. Thermometer to monitor temperature. Stirring for even cooling.", 
        "usage": "1. Prepare cooling bath. 2. Place reaction vessel in bath. 3. Stir mixture for even cooling. 4. Monitor temperature. 5. Add cooling agent as needed to maintain temperature.",
        "results": "Target temperature reached and maintained. Reaction rate slowed or stopped. Crystals formed (if cooling for crystallization).",
        "completion": "When target temperature is reached. For reactions: when cooling period is complete.",
        "materials": "Dewar flasks, styrofoam containers, glass or metal vessels, coolants (ice, dry ice, liquid N2, alcohols)",
        "cost": "Ice bath: $0. Dry ice: $20-50/kg. Liquid N2: $50-200/dewar. Recirculating chiller: $2000-10000.",
        "safety": "Use cryogenic gloves for extreme cold. Avoid skin contact with coolants. Ensure ventilation for dry ice (CO2 asphyxiation risk). Use face shield for liquid nitrogen."
    },
    "pressurize": {
        "purpose": "To increase pressure above atmospheric within a reaction vessel. Used to accelerate gas-phase reactions, increase gas solubility in liquids, promote reactions involving gaseous reagents (hydrogenation, carbonylation), and study pressure effects.",
        "how": "Pressure is increased by introducing gas (H2, CO, N2, air) from a cylinder or compressor into a sealed pressure vessel, or by heating a sealed vessel containing volatile components. The pressure vessel (autoclave, Parr bomb, high-pressure reactor) is designed to safely contain elevated pressures.",
        "setup": "Pressure vessel (autoclave, Parr bomb) rated for required pressure. Gas cylinder with regulator. Pressure gauge. Rupture disk. Relief valve. Temperature controller. Stirring mechanism.",
        "usage": "1. Load reactants into pressure vessel. 2. Seal vessel. 3. Flush with inert gas if needed. 4. Introduce pressurized gas. 5. Monitor pressure and temperature. 6. Maintain conditions for reaction time. 7. Depressurize slowly. 8. Open and collect product.",
        "safety": "CRITICAL: Never exceed rated pressure. Use blast shield. Inspect vessel regularly. Use proper relief devices. Depressurize slowly. Training required."
    },
    "depressurize": {
        "purpose": "To safely release pressure from a pressurized system. Required after high-pressure reactions, before opening vessels, and for sample recovery.",
        "how": "Pressure is released through a controlled vent valve, regulator, or relief device. Slow depressurization prevents violent boiling, foaming, or aerosol formation. Vapors may be vented to fume hood or collected in a trap.",
        "setup": "Vent line to fume hood or collection system. Needle valve for controlled release. Pressure gauge. Cold trap for volatile collection.",
        "usage": "1. Ensure system is at safe temperature. 2. Open vent valve slowly. 3. Monitor pressure gauge. 4. Control release rate. 5. Vent to fume hood. 6. When pressure equals atmospheric, system is ready to open.",
        "safety": "Always depressurize slowly. Vent to fume hood. Wear face shield. Ensure no flammable atmosphere. Never leave pressurized system unattended during depressurization."
    },
    "irradiate": {
        "purpose": "To expose a substance to radiation (UV, visible, gamma, X-ray, or microwave) to initiate photochemical reactions, sterilization, or material modification.",
        "how": "Photons or particles interact with molecules, exciting electrons to higher energy states, breaking bonds, or generating reactive species (free radicals). Different wavelengths produce different effects. UV (200-400 nm) is common for photochemistry. Gamma rays are used for sterilization.",
        "setup": "Radiation source (UV lamp, gamma source, X-ray tube, microwave reactor). Sample holder (quartz for UV, glass for visible). Shielding. Cooling system. Timer. Monochromator (for wavelength selection).",
        "usage": "1. Place sample in appropriate vessel. 2. Position in radiation beam. 3. Set wavelength/intensity. 4. Expose for required duration. 5. Monitor reaction progress. 6. Turn off source. 7. Remove sample (with proper shielding if radioactive).",
        "safety": "UV radiation can cause eye and skin damage. Gamma/X-ray: requires specialized training, monitoring badges, and shielding. Never look directly at UV lamps. Use appropriate PPE."
    },
    "electrolyze": {
        "purpose": "To drive a non-spontaneous chemical reaction using electrical energy. Used for water splitting (H2 production), metal plating, electro-synthesis, and analytical electrochemistry.",
        "how": "Direct current (DC) is applied between two electrodes immersed in an electrolyte solution. At the cathode, reduction occurs (e.g., H+ to H2). At the anode, oxidation occurs (e.g., H2O to O2). The applied voltage must exceed the thermodynamic potential plus overpotentials.",
        "setup": "DC power supply (potentiostat/galvanostat). Electrochemical cell with two or three electrodes. Working electrode, counter electrode, reference electrode (for three-electrode setup). Electrolyte solution. Magnetic stirrer.",
        "usage": "1. Prepare electrolyte solution. 2. Insert electrodes. 3. Connect to power supply. 4. Set voltage or current. 5. Begin electrolysis. 6. Monitor current/voltage. 7. Collect products (gases via collection, solids from electrodes). 8. Turn off power when complete.",
        "safety": "Can produce H2 and O2 (explosive mixture). Ensure ventilation. Use blast shield for high-current work. Acidic or basic electrolytes are corrosive. Wear appropriate PPE."
    },
    "ferment": {
        "purpose": "To use microorganisms (yeasts, bacteria, fungi) or enzymes to convert substrates into desired products through metabolic processes. Used for ethanol production, lactic acid, antibiotics, and specialty chemicals.",
        "how": "Microorganisms metabolize substrates in a controlled environment, producing target compounds as metabolic byproducts. Key parameters: temperature (typically 25-37°C), pH, oxygen level (aerobic or anaerobic), nutrient concentration, and sterility.",
        "setup": "Fermenter/bioreactor (sterile vessel). Temperature control. pH probe and controller. Aeration system (for aerobic). Stirring. Sampling port. Sterile air filter (for aerobic). Feed and harvest lines.",
        "usage": "1. Sterilize fermenter and medium. 2. Inoculate with culture. 3. Set temperature, pH, aeration. 4. Monitor growth (OD600) and product formation. 5. Add nutrients as needed (fed-batch). 6. Harvest when product concentration is optimal. 7. Extract and purify product.",
        "safety": "Use aseptic technique. Autoclave biohazard waste. Some microorganisms are pathogenic - BSL-2 or higher required. Handle with appropriate containment."
    },
    "dissolve": {
        "purpose": "To form a homogeneous solution by dispersing a solute (solid, liquid, or gas) uniformly throughout a solvent. Essential for reactions, analysis, and purification.",
        "how": "Solute particles separate and become surrounded by solvent molecules (solvation). Rate depends on temperature, surface area (particle size), stirring, and solvent choice. 'Like dissolves like' - polar solvents dissolve polar solutes.",
        "setup": "Vessel (beaker, flask). Solvent. Solute. Stirrer (magnetic or overhead). Heating (if needed).",
        "usage": "1. Add solvent to vessel. 2. Add solute while stirring. 3. Heat if needed (increases solubility). 4. Continue until all solute is dissolved. 5. For saturation: add solute until no more dissolves. 6. Filter if needed.",
        "safety": "Some dissolution processes are highly exothermic (acid in water). Always add acid to water, not water to acid. Use fume hood for volatile solvents."
    },
    "serve": {
        "purpose": "To present or transfer prepared chemical products in a controlled manner for analysis, use, or distribution. Typically involves aliquoting, labeling, and proper container selection.",
        "how": "Products are transferred from bulk containers to appropriate serving vessels (vials, bottles, test tubes) with proper labeling and closure. QC samples may be taken. Documentation of lot/batch numbers.",
        "setup": "Clean containers. Labels. Transfer tools (spatulas, pipettes, funnels). Balance (for solids). Documentation.",
        "usage": "1. Select appropriate container. 2. Label with contents, concentration, date, hazards. 3. Transfer product. 4. Seal container. 5. Document transfer.",
        "safety": "Proper labeling is essential. Use appropriate containers (chemical compatibility). Never serve chemicals in food containers."
    },
    "pass": {
        "purpose": "To indicate a null operation or allow a process to continue without action. In chemical processing: allows a step to proceed or indicates quality check acceptance.",
        "how": "No chemical transformation. Sample meets required specifications or process conditions are acceptable. Represents a control flow operation or quality checkpoint.",
        "setup": "No specific setup. Depends on preceding operation.",
        "usage": "Verify conditions are acceptable. Allow process to continue. Document pass/fail status.",
        "safety": "Ensure all safety checks have been completed before passing process to next step."
    },
    "mix": {
        "purpose": "To combine two or more substances to achieve uniform composition. Mixing is essential for reactions, dilutions, and sample preparation.",
        "how": "Mechanical agitation (stirring, shaking, vortexing, blending, sonication) distributes components evenly. Effectiveness depends on viscosity, immiscibility, and mixing energy. Magnetic stirring is common for solutions.",
        "setup": "Vessel. Stirring device (magnetic stirrer, overhead stirrer, vortex mixer, shaker, homogenizer). Stir bar or paddle.",
        "usage": "1. Add components to vessel. 2. Position stirring device. 3. Start at appropriate speed. 4. Continue until homogeneous. 5. For viscous samples: use overhead stirrer. 6. For small volumes: vortex.",
        "safety": "Avoid splash hazards. Use appropriate speed to avoid spillage. For volatile solvents: mix in fume hood. Secure vessel."
    },
    "evaporate": {
        "purpose": "To remove solvent from a solution, concentrating the solute or isolating a solid product. Used in workup procedures, sample preparation, and purification.",
        "how": "Solvent is converted to vapor by heating, reduced pressure (rotary evaporation), or gas flow (blow-down). Rotary evaporation uses vacuum to lower boiling point, enabling gentle solvent removal. Rate depends on temperature, pressure, and surface area.",
        "setup": "Rotary evaporator (rotovap): round-bottom flask, water bath, condenser, vacuum pump, collection flask. Or: hot plate, beaker, fume hood. Or: nitrogen blow-down manifold.",
        "usage": "1. Place solution in appropriate flask. 2. For rotovap: attach to evaporator, lower into water bath, apply vacuum, rotate. 3. Collect condensed solvent. 4. When dry: release vacuum, remove flask.",
        "safety": "Use bump trap to prevent solution from entering condenser. Ensure system is properly assembled. Use fume hood. Watch for bumping (sudden violent boiling). Never rotary evaporate explosive/energetic materials."
    },
    "measure_time": {
        "purpose": "To precisely measure elapsed time for chemical reactions, processes, or kinetics studies. Essential for reproducible reaction conditions and rate measurements.",
        "how": "Stopwatches, timers, or data logging systems measure elapsed time. Automated systems use internal clocks. Accuracy ranges from seconds to milliseconds depending on the device.",
        "setup": "Timer/stopwatch (digital or analog). Or: automated system with timing capability.",
        "usage": "1. Start timer when reaction is initiated. 2. Monitor elapsed time. 3. Record time points for observations. 4. Stop timer at completion.",
        "models": "Digital stopwatch ($10-50), Lab timer ($20-100), Data logging timer ($100-500), PC-based timing (with DAQ)",
        "safety": "No specific safety concerns."
    },
    "measure_temp": {
        "purpose": "To measure the temperature of a substance, reaction mixture, or environment. Essential for controlling reaction conditions, monitoring processes, and determining physical properties.",
        "how": "Temperature measurement devices: thermocouples (Type K, J, T), resistance temperature detectors (RTDs), thermistors, liquid-in-glass thermometers (mercury, alcohol), infrared pyrometers. Each has different range, accuracy, and response time.",
        "setup": "Temperature probe or thermometer. Meter or display. Calibration reference.",
        "usage": "1. Select appropriate probe for temperature range and chemical compatibility. 2. Insert probe into substance. 3. Wait for reading to stabilize. 4. Record temperature. 5. For non-contact: aim IR pyrometer at surface.",
        "models": "Mercury thermometer ($10-50), Digital thermocouple ($50-300), RTD probe ($100-500), IR pyrometer ($100-1000), Data logging thermometer ($200-1000)",
        "safety": "Mercury thermometers contain toxic mercury - use mercury-free alternatives. Use thermocouple sheaths for corrosive materials."
    },
    "measure_mass": {
        "purpose": "To determine the mass of a substance with precision. Essential for quantitative chemistry: preparing solutions, calculating yields, and stoichiometric analysis.",
        "how": "Analytical balances measure mass by comparing unknown mass to calibrated reference masses using electromagnetic force compensation. Precision depends on balance type: top-loading (0.001-0.01g) vs analytical (0.0001g).",
        "setup": "Balance on stable, vibration-free surface. Level balance. Calibration weights. Weighing vessels (weigh paper, boats, beakers).",
        "usage": "1. Tare empty vessel. 2. Add substance. 3. Read mass. 4. Record. 5. For analytical balance: use draft shield, close doors.",
        "models": "Top-loading balance ($200-2000, 0.001-0.01g precision), Analytical balance ($1000-5000, 0.0001g), Microbalance ($3000-10000, 0.000001g), Semi-micro balance ($2000-8000)",
        "safety": "Do not weigh chemicals directly on balance pan. Use appropriate containers. Clean spills immediately. Corrosive chemicals damage balance components."
    },
    "measure_length": {
        "purpose": "To measure dimensions of solid objects, distances between points, or size of particles/materials in the lab. Used in materials characterization, apparatus setup, and sample preparation.",
        "how": "Instruments: rulers, calipers (vernier, digital), micrometers, or laser distance meters. For microscopic measurements: stage micrometers and calibrated eyepiece graticules.",
        "setup": "Measuring instrument appropriate for required precision. Calibration standard.",
        "usage": "1. Select appropriate instrument. 2. Zero/calibrate. 3. Measure object. 4. Read measurement. 5. Record.",
        "models": "Ruler ($2-20, 1mm precision), Vernier caliper ($20-100, 0.1mm), Digital caliper ($30-200, 0.01mm), Micrometer ($50-500, 0.001mm), Laser measure ($50-500)",
        "safety": "No specific safety concerns. Use care with sharp measuring instruments."
    },
    "measure_volume": {
        "purpose": "To precisely measure the volume of liquids and gases. Essential for preparing solutions, dispensing reagents, and quantitative analysis.",
        "how": "Volumetric glassware (volumetric flasks, graduated cylinders, pipettes, burettes) is calibrated for specific volumes and tolerances. Volumetric measurements rely on observing the meniscus at the calibration mark.",
        "setup": "Volumetric glassware (clean and dry). Pipette filler or bulb. Filler for burette. Clamp and stand.",
        "usage": "1. Select appropriate volumetric instrument. 2. For glassware: fill to calibration mark observing meniscus at eye level. 3. For pipettes: fill to mark, transfer, touch off. 4. For burettes: fill, zero, titrate. 5. Record volume.",
        "models": "Volumetric flask ($20-100, precision 0.02-0.4%), Graduated cylinder ($10-50, 0.5-2%), Pipette ($5-50, glass; $100-500, adjustable), Burette ($50-200), Micropipette ($100-500, 0.1-1000 uL)",
        "safety": "Use pipette filler - never mouth pipette. Use fume hood for volatile liquids. Use appropriate glassware for pressure/vacuum applications."
    },
    "measure_data": {
        "purpose": "To collect, record, and analyze experimental measurements systematically. Data measurement encompasses logging instrument readings, sensor outputs, and observations for analysis.",
        "how": "Modern labs use data acquisition (DAQ) systems, chart recorders, or manual logging. Sensors convert physical/chemical signals to electrical signals, which are digitized and recorded for analysis. LIMS (Laboratory Information Management Systems) organize and store data.",
        "setup": "Sensors/instruments. DAQ hardware. Computer with software (LabVIEW, Python, proprietary). Data storage. Network connection (for LIMS).",
        "usage": "1. Configure sensors and instruments. 2. Set sampling rate and parameters. 3. Start data acquisition. 4. Monitor in real-time. 5. Stop acquisition. 6. Export and analyze data. 7. Document in lab notebook.",
        "models": "Manual logging (lab notebook), Chart recorder ($500-2000), DAQ module ($200-2000), LIMS ($5000-50000+), Cloud-based lab data platforms",
        "safety": "Ensure data integrity. Maintain calibration records. Follow lab data management protocols. Back up data."
    }
}

output_dir = "research/equipment"
os.makedirs(output_dir, exist_ok=True)

for name, data in equipment_data.items():
    content = f"""# {name.capitalize()} - Chemistry Lab Operation

## Purpose
{data['purpose']}

## How It Works
{data['how']}

## Setup
{data['setup']}

## Usage
{data['usage']}

## Results
{data.get('results', 'Results vary by specific application and conditions.')}

## Completion
{data.get('completion', 'When the target condition is achieved or the specified time has elapsed.')}

## Manufacturers
Varies by specific equipment used. Common brands: Thermo Scientific, IKA, Cole-Parmer, Buchi, Parr Instrument, Eppendorf.

## Materials
{data.get('materials', 'Varies by specific application. Common materials: borosilicate glass, stainless steel, PTFE.')}

## Power
Varies by equipment. Manual operations: no power. Powered equipment: 50-3000W depending on device.

## Cost
{data.get('cost', '$50-$10,000+ depending on equipment complexity.')}

## Models
{data.get('models', 'Various models exist from manual to fully automated.')}

## Display / Memory / USB / Connectivity / Voice / Buttons
- Basic manual setups: no electronics
- Powered instruments: LED/LCD displays showing parameters
- Modern instruments: USB for data export, Ethernet for network integration
- Voice capabilities: not standard
- Buttons: power, parameter control, start/stop

## Ventilation
Depends on materials used. Use fume hood for volatile, toxic, or flammable substances.

## Limitations
Performance is limited by equipment specifications, material properties, and experimental conditions. Always consult manufacturer specifications.

## Cleaning
Clean equipment after each use. Use appropriate solvents and methods for the materials handled. Follow manufacturer cleaning instructions.

## Storage
Store equipment clean and dry. Protect sensitive instruments from dust, moisture, and temperature extremes.

## Disposal
Equipment: electronic waste or metal recycling per institutional guidelines. Consumables: chemical waste per safety protocols.

## Lab Usage
{data.get('lab_usage', 'Common laboratory operation.')}

## Common Mistakes
- Not following standard operating procedures
- Inadequate equipment preparation
- Incorrect parameter settings
- Poor documentation

## Common Problems
- Equipment malfunction
- Contamination
- Incorrect measurements
- Safety incidents from improper handling

## Fixes
- Consult manufacturer troubleshooting guides
- Re-calibrate instruments
- Clean contaminated equipment
- Follow institutional maintenance procedures

## Safety
{data.get('safety', 'Always wear appropriate PPE (lab coat, safety glasses, gloves). Follow institutional safety protocols. Consult SDS for any chemicals used.')}
"""

    filename = f"{name}.md"
    with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {filename}")

print(f"\nTotal files created: {len(equipment_data)}")
print("Done!")