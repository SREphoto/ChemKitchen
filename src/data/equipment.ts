/**
 * 100 Laboratory Equipment Catalog
 */

export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

export const EQUIPMENT_CATALOG: Equipment[] = [
  // Glassware
  {
    id: 'eq-1',
    name: 'Beaker',
    description: 'A cylindrical container used for mixing, stirring, and heating liquids.',
    imageUrl: 'https://picsum.photos/seed/beaker/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-2',
    name: 'Erlenmeyer Flask',
    description: 'A conical flask with a flat bottom and a narrow neck, ideal for swirling liquids without spilling.',
    imageUrl: 'https://picsum.photos/seed/erlenmeyer/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-3',
    name: 'Volumetric Flask',
    description: 'Used for precise dilutions and preparation of standard solutions.',
    imageUrl: 'https://picsum.photos/seed/volumetric/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-4',
    name: 'Graduated Cylinder',
    description: 'A tall, narrow container used to measure the volume of liquids accurately.',
    imageUrl: 'https://picsum.photos/seed/cylinder/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-5',
    name: 'Test Tube',
    description: 'A small glass tube used to hold, mix, or heat small quantities of liquid or solid chemicals.',
    imageUrl: 'https://picsum.photos/seed/testtube/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-6',
    name: 'Petri Dish',
    description: 'A shallow cylindrical glass or plastic lidded dish used to culture cells or microorganisms.',
    imageUrl: 'https://picsum.photos/seed/petridish/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-7',
    name: 'Watch Glass',
    description: 'A circular concave piece of glass used as a surface to evaporate a liquid, or as a cover for a beaker.',
    imageUrl: 'https://picsum.photos/seed/watchglass/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-8',
    name: 'Burette',
    description: 'A graduated glass tube with a tap at one end, for delivering known volumes of a liquid, especially in titrations.',
    imageUrl: 'https://picsum.photos/seed/burette/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-9',
    name: 'Pipette',
    description: 'A laboratory tool used to transport a measured volume of liquid.',
    imageUrl: 'https://picsum.photos/seed/pipette/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-10',
    name: 'Condenser',
    description: 'Used to cool hot vapors or liquids, often used in distillation.',
    imageUrl: 'https://picsum.photos/seed/condenser/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-11',
    name: 'Separatory Funnel',
    description: 'Used in liquid-liquid extractions to separate the components of a mixture into two immiscible solvent phases.',
    imageUrl: 'https://picsum.photos/seed/sepfunnel/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-12',
    name: 'Desiccator',
    description: 'A sealed enclosure containing desiccants used for preserving moisture-sensitive items.',
    imageUrl: 'https://picsum.photos/seed/desiccator/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-13',
    name: 'Boiling Flask',
    description: 'Round-bottomed flask used for uniform heating, boiling, and distillation.',
    imageUrl: 'https://picsum.photos/seed/boilingflask/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-14',
    name: 'Crucible',
    description: 'A ceramic or metal container in which metals or other substances may be melted or subjected to very high temperatures.',
    imageUrl: 'https://picsum.photos/seed/crucible/400/300',
    category: 'Glassware'
  },
  {
    id: 'eq-15',
    name: 'Mortar and Pestle',
    description: 'Used to crush and grind substances into a fine paste or powder.',
    imageUrl: 'https://picsum.photos/seed/mortar/400/300',
    category: 'Glassware'
  },

  // Measurement
  {
    id: 'eq-16',
    name: 'Analytical Balance',
    description: 'Designed to measure small mass in the sub-milligram range.',
    imageUrl: 'https://picsum.photos/seed/balance/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-17',
    name: 'pH Meter',
    description: 'An electronic device used for measuring the pH (acidity or alkalinity) of a liquid.',
    imageUrl: 'https://picsum.photos/seed/phmeter/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-18',
    name: 'Thermometer',
    description: 'Used to measure temperature or temperature gradient.',
    imageUrl: 'https://picsum.photos/seed/thermometer/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-19',
    name: 'Spectrophotometer',
    description: 'Measures the intensity of light as a function of its wavelength.',
    imageUrl: 'https://picsum.photos/seed/spectro/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-20',
    name: 'Calorimeter',
    description: 'Used for measuring the heat of chemical reactions or physical changes.',
    imageUrl: 'https://picsum.photos/seed/calorimeter/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-21',
    name: 'Refractometer',
    description: 'Used to measure the refractive index of a substance.',
    imageUrl: 'https://picsum.photos/seed/refractometer/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-22',
    name: 'Viscometer',
    description: 'Used to measure the viscosity of a fluid.',
    imageUrl: 'https://picsum.photos/seed/viscometer/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-23',
    name: 'Conductivity Meter',
    description: 'Measures the electrical conductivity in a solution.',
    imageUrl: 'https://picsum.photos/seed/conductivity/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-24',
    name: 'Hygrometer',
    description: 'Used for measuring the humidity or amount of water vapor in the air.',
    imageUrl: 'https://picsum.photos/seed/hygrometer/400/300',
    category: 'Measurement'
  },
  {
    id: 'eq-25',
    name: 'Barometer',
    description: 'Used to measure atmospheric pressure.',
    imageUrl: 'https://picsum.photos/seed/barometer/400/300',
    category: 'Measurement'
  },

  // Heating & Cooling
  {
    id: 'eq-26',
    name: 'Bunsen Burner',
    description: 'Produces a single open gas flame, used for heating, sterilization, and combustion.',
    imageUrl: 'https://picsum.photos/seed/bunsen/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-27',
    name: 'Hot Plate',
    description: 'A portable self-contained tabletop small appliance that features one or more electric heating elements.',
    imageUrl: 'https://picsum.photos/seed/hotplate/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-28',
    name: 'Heating Mantle',
    description: 'Used to apply heat to containers, as an alternative to other forms of heated bath.',
    imageUrl: 'https://picsum.photos/seed/mantle/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-29',
    name: 'Laboratory Oven',
    description: 'Used for high-volume thermal convection applications such as drying and sterilizing.',
    imageUrl: 'https://picsum.photos/seed/oven/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-30',
    name: 'Muffle Furnace',
    description: 'A furnace in which the subject material is isolated from the fuel and all of the products of combustion.',
    imageUrl: 'https://picsum.photos/seed/furnace/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-31',
    name: 'Water Bath',
    description: 'Used to incubate samples in water at a constant temperature over a long period of time.',
    imageUrl: 'https://picsum.photos/seed/waterbath/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-32',
    name: 'Incubator',
    description: 'Used to grow and maintain microbiological cultures or cell cultures.',
    imageUrl: 'https://picsum.photos/seed/incubator/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-33',
    name: 'Autoclave',
    description: 'A strong, heated container used for chemical reactions and other processes using high pressure and temperature.',
    imageUrl: 'https://picsum.photos/seed/autoclave/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-34',
    name: 'Cryogenic Tank',
    description: 'Used for storing materials at extremely low temperatures.',
    imageUrl: 'https://picsum.photos/seed/cryo/400/300',
    category: 'Heating & Cooling'
  },
  {
    id: 'eq-35',
    name: 'Chilller',
    description: 'Removes heat from a liquid via a vapor-compression or absorption refrigeration cycle.',
    imageUrl: 'https://picsum.photos/seed/chiller/400/300',
    category: 'Heating & Cooling'
  },

  // Separation & Mixing
  {
    id: 'eq-36',
    name: 'Centrifuge',
    description: 'Uses centrifugal force to separate fluids, gas or liquid, based on density.',
    imageUrl: 'https://picsum.photos/seed/centrifuge/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-37',
    name: 'Magnetic Stirrer',
    description: 'Uses a rotating magnetic field to cause a stir bar immersed in a liquid to spin very quickly.',
    imageUrl: 'https://picsum.photos/seed/stirrer/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-38',
    name: 'Vortex Mixer',
    description: 'Used to mix small vials of liquid.',
    imageUrl: 'https://picsum.photos/seed/vortex/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-39',
    name: 'Rotary Evaporator',
    description: 'Used for the efficient and gentle removal of solvents from samples by evaporation.',
    imageUrl: 'https://picsum.photos/seed/rotovap/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-40',
    name: 'Orbital Shaker',
    description: 'Used to stir liquids in flasks or beakers by shaking them.',
    imageUrl: 'https://picsum.photos/seed/shaker/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-41',
    name: 'Homogenizer',
    description: 'Used for the homogenization of various types of material, such as tissue, plant, food, soil, and many others.',
    imageUrl: 'https://picsum.photos/seed/homogenizer/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-42',
    name: 'Ultrasonic Cleaner',
    description: 'Uses ultrasound and an appropriate cleaning solvent to clean delicate items.',
    imageUrl: 'https://picsum.photos/seed/ultrasonic/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-43',
    name: 'Fractional Distillation Column',
    description: 'Used to separate a mixture into its component parts, or fractions.',
    imageUrl: 'https://picsum.photos/seed/distillation/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-44',
    name: 'Buchner Funnel',
    description: 'Used in vacuum filtration to separate a solid from a liquid.',
    imageUrl: 'https://picsum.photos/seed/buchner/400/300',
    category: 'Separation & Mixing'
  },
  {
    id: 'eq-45',
    name: 'Chromatography Column',
    description: 'Used to separate chemical compounds by their different movement through the column.',
    imageUrl: 'https://picsum.photos/seed/chromatography/400/300',
    category: 'Separation & Mixing'
  },

  // Safety
  {
    id: 'eq-46',
    name: 'Safety Goggles',
    description: 'Protective eyewear that usually enclose or protect the area surrounding the eye.',
    imageUrl: 'https://picsum.photos/seed/goggles/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-47',
    name: 'Lab Coat',
    description: 'A knee-length overcoat/smock worn by professionals in the medical field or by those involved in laboratory work.',
    imageUrl: 'https://picsum.photos/seed/labcoat/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-48',
    name: 'Chemical Resistant Gloves',
    description: 'Protect the hands from hazardous chemicals.',
    imageUrl: 'https://picsum.photos/seed/gloves/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-49',
    name: 'Fume Hood',
    description: 'A type of local ventilation device that is designed to limit exposure to hazardous or toxic fumes, vapors or dusts.',
    imageUrl: 'https://picsum.photos/seed/fumehood/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-50',
    name: 'Eyewash Station',
    description: 'Used to flush the eyes with water in case of chemical exposure.',
    imageUrl: 'https://picsum.photos/seed/eyewash/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-51',
    name: 'Safety Shower',
    description: 'Used to wash off chemicals from the body in case of a spill.',
    imageUrl: 'https://picsum.photos/seed/shower/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-52',
    name: 'Fire Extinguisher',
    description: 'An active fire protection device used to extinguish or control small fires.',
    imageUrl: 'https://picsum.photos/seed/fireext/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-53',
    name: 'First Aid Kit',
    description: 'A collection of supplies and equipment that is used to give medical treatment.',
    imageUrl: 'https://picsum.photos/seed/firstaid/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-54',
    name: 'Biohazard Bin',
    description: 'Used for the disposal of biological waste.',
    imageUrl: 'https://picsum.photos/seed/biohazard/400/300',
    category: 'Safety'
  },
  {
    id: 'eq-55',
    name: 'Spill Kit',
    description: 'A collection of items used to clean up chemical spills.',
    imageUrl: 'https://picsum.photos/seed/spillkit/400/300',
    category: 'Safety'
  },

  // Analytical Instruments
  {
    id: 'eq-56',
    name: 'Gas Chromatograph (GC)',
    description: 'Used for separating and analyzing compounds that can be vaporized without decomposition.',
    imageUrl: 'https://picsum.photos/seed/gc/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-57',
    name: 'High-Performance Liquid Chromatograph (HPLC)',
    description: 'Used to separate, identify, and quantify each component in a mixture.',
    imageUrl: 'https://picsum.photos/seed/hplc/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-58',
    name: 'Mass Spectrometer (MS)',
    description: 'Measures the mass-to-charge ratio of ions.',
    imageUrl: 'https://picsum.photos/seed/massspec/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-59',
    name: 'Nuclear Magnetic Resonance (NMR) Spectrometer',
    description: 'Used to determine the structure of organic compounds.',
    imageUrl: 'https://picsum.photos/seed/nmr/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-60',
    name: 'FTIR Spectrometer',
    description: 'Used to obtain an infrared spectrum of absorption or emission of a solid, liquid or gas.',
    imageUrl: 'https://picsum.photos/seed/ftir/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-61',
    name: 'Atomic Absorption Spectrometer (AAS)',
    description: 'Used for determining the concentration of a particular metal element in a sample.',
    imageUrl: 'https://picsum.photos/seed/aas/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-62',
    name: 'X-ray Diffractometer (XRD)',
    description: 'Used for determining the atomic and molecular structure of a crystal.',
    imageUrl: 'https://picsum.photos/seed/xrd/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-63',
    name: 'Scanning Electron Microscope (SEM)',
    description: 'Produces images of a sample by scanning the surface with a focused beam of electrons.',
    imageUrl: 'https://picsum.photos/seed/sem/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-64',
    name: 'Transmission Electron Microscope (TEM)',
    description: 'A microscopy technique in which a beam of electrons is transmitted through an ultra-thin specimen.',
    imageUrl: 'https://picsum.photos/seed/tem/400/300',
    category: 'Analytical Instruments'
  },
  {
    id: 'eq-65',
    name: 'Fluorescence Spectrometer',
    description: 'Used to measure the fluorescence of a sample.',
    imageUrl: 'https://picsum.photos/seed/fluorescence/400/300',
    category: 'Analytical Instruments'
  },

  // General Tools
  {
    id: 'eq-66',
    name: 'Test Tube Rack',
    description: 'Used to hold multiple test tubes upright at the same time.',
    imageUrl: 'https://picsum.photos/seed/rack/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-67',
    name: 'Ring Stand',
    description: 'Used to hold or clamp laboratory glassware and other equipment in place.',
    imageUrl: 'https://picsum.photos/seed/ringstand/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-68',
    name: 'Utility Clamp',
    description: 'Used to hold glassware on a ring stand.',
    imageUrl: 'https://picsum.photos/seed/clamp/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-69',
    name: 'Wire Gauze',
    description: 'Placed on a ring stand to support a beaker or flask while being heated.',
    imageUrl: 'https://picsum.photos/seed/wiregauze/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-70',
    name: 'Clay Triangle',
    description: 'Used to support a crucible being heated by a Bunsen burner.',
    imageUrl: 'https://picsum.photos/seed/triangle/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-71',
    name: 'Spatula',
    description: 'Used for scraping, transferring, or applying powders and paste-like chemicals.',
    imageUrl: 'https://picsum.photos/seed/spatula/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-72',
    name: 'Scoopula',
    description: 'A spatula-like scoop utensil used primarily in chemistry lab settings to transfer solids.',
    imageUrl: 'https://picsum.photos/seed/scoopula/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-73',
    name: 'Tongs',
    description: 'Used for grasping and lifting vessels of heat-resistant material used in high temperature chemical reactions.',
    imageUrl: 'https://picsum.photos/seed/tongs/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-74',
    name: 'Forceps',
    description: 'Handheld, hinged instrument used for grasping and holding objects.',
    imageUrl: 'https://picsum.photos/seed/forceps/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-75',
    name: 'Glass Stirring Rod',
    description: 'Used to mix chemicals and liquids.',
    imageUrl: 'https://picsum.photos/seed/stirrod/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-76',
    name: 'Wash Bottle',
    description: 'A squeeze bottle with a nozzle, used to rinse various pieces of laboratory glassware.',
    imageUrl: 'https://picsum.photos/seed/washbottle/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-77',
    name: 'Dropper',
    description: 'Used to transfer small quantities of liquids.',
    imageUrl: 'https://picsum.photos/seed/dropper/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-78',
    name: 'Funnel',
    description: 'Used for guiding liquid or powder into a small opening.',
    imageUrl: 'https://picsum.photos/seed/funnel/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-79',
    name: 'Filter Paper',
    description: 'A semi-permeable paper barrier placed perpendicular to a liquid or air flow.',
    imageUrl: 'https://picsum.photos/seed/filterpaper/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-80',
    name: 'Rubber Stopper',
    description: 'Used to seal the openings of test tubes and flasks.',
    imageUrl: 'https://picsum.photos/seed/stopper/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-81',
    name: 'Cork',
    description: 'An impermeable buoyant material, used for bottle stoppers.',
    imageUrl: 'https://picsum.photos/seed/cork/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-82',
    name: 'Parafilm',
    description: 'A plastic paraffin film with a paper backing used for sealing or masking containers.',
    imageUrl: 'https://picsum.photos/seed/parafilm/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-83',
    name: 'Lab Notebook',
    description: 'Used by scientists to keep track of their experiments.',
    imageUrl: 'https://picsum.photos/seed/notebook/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-84',
    name: 'Label Maker',
    description: 'Used to create labels for samples and equipment.',
    imageUrl: 'https://picsum.photos/seed/labelmaker/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-85',
    name: 'Timer',
    description: 'Used to measure time intervals in experiments.',
    imageUrl: 'https://picsum.photos/seed/timer/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-86',
    name: 'Microscope',
    description: 'Used to see objects that are too small to be seen by the naked eye.',
    imageUrl: 'https://picsum.photos/seed/microscope/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-87',
    name: 'Telescoping Mirror',
    description: 'Used to inspect hard-to-reach areas of lab equipment.',
    imageUrl: 'https://picsum.photos/seed/mirror/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-88',
    name: 'Magnifying Glass',
    description: 'A convex lens that is used to produce a magnified image of an object.',
    imageUrl: 'https://picsum.photos/seed/magnifier/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-89',
    name: 'Flashlight',
    description: 'A portable hand-held electric light.',
    imageUrl: 'https://picsum.photos/seed/flashlight/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-90',
    name: 'Toolbox',
    description: 'Used to store and organize various hand tools used for lab maintenance.',
    imageUrl: 'https://picsum.photos/seed/toolbox/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-91',
    name: 'Wrench',
    description: 'Used to provide grip and mechanical advantage in applying torque to turn objects.',
    imageUrl: 'https://picsum.photos/seed/wrench/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-92',
    name: 'Screwdriver',
    description: 'Used for turning screws.',
    imageUrl: 'https://picsum.photos/seed/screwdriver/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-93',
    name: 'Pliers',
    description: 'Used to hold objects firmly.',
    imageUrl: 'https://picsum.photos/seed/pliers/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-94',
    name: 'Hammer',
    description: 'Used for delivering blows to an object.',
    imageUrl: 'https://picsum.photos/seed/hammer/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-95',
    name: 'Tape Measure',
    description: 'A flexible ruler used to measure distance.',
    imageUrl: 'https://picsum.photos/seed/tapemeasure/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-96',
    name: 'Level',
    description: 'Used to determine whether a surface is horizontal or vertical.',
    imageUrl: 'https://picsum.photos/seed/level/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-97',
    name: 'Calculator',
    description: 'Used for performing mathematical calculations.',
    imageUrl: 'https://picsum.photos/seed/calculator/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-98',
    name: 'Computer',
    description: 'Used for data analysis, simulation, and research.',
    imageUrl: 'https://picsum.photos/seed/computer/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-99',
    name: 'Printer',
    description: 'Used to print reports, labels, and data charts.',
    imageUrl: 'https://picsum.photos/seed/printer/400/300',
    category: 'General Tools'
  },
  {
    id: 'eq-100',
    name: 'Scanner',
    description: 'Used to digitize physical documents and images.',
    imageUrl: 'https://picsum.photos/seed/scanner/400/300',
    category: 'General Tools'
  }
];
