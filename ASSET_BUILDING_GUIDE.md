# ChemKitchen Asset Building Guide

> A comprehensive guide to all research completed, asset specifications, and the build pipeline for creating 3D lab equipment and chemical visualizations for ChemKitchen.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Research Archive Summary](#2-research-archive-summary)
3. [Asset Categories & Build Priorities](#3-asset-categories--build-priorities)
4. [3D Modeling Pipeline](#4-3d-modeling-pipeline)
5. [Chemical Visual Representation Specs](#5-chemical-visual-representation-specs)
6. [Equipment Visual Specs](#6-equipment-visual-specs)
7. [App Integration Map](#7-app-integration-map)
8. [Implementation Phases](#8-implementation-phases)
9. [Technical Setup](#9-technical-setup)
10. [Reference Materials](#10-reference-materials)

---

## 1. Project Overview

**ChemKitchen** is a virtual chemistry lab powered by Google Gemini AI. Users synthesize molecules by combining chemicals using lab actions (like `synthesize()`, `distill()`, `catalyze()`). The app currently runs on a text/emoji-based interface — the goal is to replace this with 3D visualizations.

### Key Files & Architecture

| File | Purpose |
|------|---------|
| `constants.ts` | Lab actions (26 total), starting ingredients (130+), AI system prompts, lesson definitions |
| `types.ts` | TypeScript types for the Gemini console, log events, display modes |
| `App.tsx` | Main app component |
| `index.html` | Entry point |
| `package.json` | Dependencies (Three.js already installed) |

### The 26 Lab Actions (from `constants.ts`)

| Action | Emoji | Category |
|--------|-------|----------|
| `synthesize` | 🧪 | Reactions |
| `decompose` | 💥 | Reactions |
| `combust` | 🔥 | Reactions |
| `oxidize` | 💨 | Reactions |
| `reduce` | 🔋 | Reactions |
| `neutralize` | ⚖️ | Reactions |
| `precipitate` | ❄️ | Reactions |
| `hydrolyze` | 💧 | Reactions |
| `polymerize` | ⛓️ | Reactions |
| `catalyze` | ⚡ | Reactions |
| `distill` | ⚗️ | Reactions |
| `crystallize` | 💎 | Reactions |
| `titrate` | 🚰 | Analysis |
| `extract` | 🧫 | Separation |
| `filter` | ☕ | Separation |
| `centrifuge` | 🌀 | Separation |
| `heat` | 🔥 | Thermal |
| `cool` | ❄️ | Thermal |
| `pressurize` | 🗜️ | Pressure |
| `depressurize` | 🎈 | Pressure |
| `irradiate` | ☢️ | Energy |
| `electrolyze` | ⚡ | Energy |
| `ferment` | 🦠 | Biological |
| `dissolve` | 🌪️ | Mixing |
| `serve` | 🔬 | Submit |
| `pass` | 🏳️ | Skip |

---

## 2. Research Archive Summary

All research is stored in the `/research/` directory.

### 2.1 Chemical Compounds — `research/chemicals/` (140+ files)

Each `.md` file contains detailed research on one compound including:
- Properties (formula, mass, state, melting/boiling points, color, odor)
- Safety (hazards, PPE, HMIS/NFPA, legality, insurance)
- Description, solubility, reactivity
- Common uses, procurement, synthesis, lab usage
- Common mistakes, safety protocols

**Categories of chemicals researched:**
- **Elements (21):** Hydrogen, Carbon, Nitrogen, Oxygen, Sodium, Magnesium, Phosphorus, Sulfur, Chlorine, Potassium, Calcium, Iron, Copper, Zinc, Silver, Iodine, Gold, Mercury, Lead, Fluorine, Bromine
- **Simple Molecules (9):** Water, Carbon Dioxide, Ammonia, Methane, Hydrochloric Acid, Sodium Hydroxide, Sulfuric Acid, Nitric Acid, Acetic Acid
- **Organic/Pharmaceutical (110+):** Ethanol, Benzene, Phenol, Salicylic Acid, Acetic Anhydride, Acetaminophen, Ibuprofen, Caffeine, Cocaine, Fentanyl, Heroin, Diazepam, Aspirin, and many more

**Usage in the app:**
All of these are defined as `STARTING_INGREDIENTS` in `constants.ts`. The AI uses them as the chemical inventory for reactions.

### 2.2 Lab Equipment & Operations — `research/equipment/` (36 files)

Each `.md` file contains detailed research on one lab operation including:
- Purpose, how it works
- Setup & usage procedures
- Results, completion criteria
- Manufacturers, materials, cost
- Models & variants
- Power requirements, display types
- Connectivity (USB, Bluetooth, WiFi)
- Limitations, cleaning, storage, disposal
- Common mistakes, problems, fixes
- Safety protocols

**Equipment files cover all 26 lab actions plus additional operations.**

### 2.3 3D Asset Research — `research/3d_research_plan.md` (556 lines)

A comprehensive guide covering:
- **Blender 4.5.5** — installed at `R:\Blender\blender-4.5.5-windows-x64\`
- **Modeling techniques** — subdivision surface, boolean, lathe/screw modifier, extrude, loop cut, bevel, mirror, array
- **Materials** — glass (Roughness=0, Transmission=1, IOR=1.45), metal (Roughness=0.1-0.3, Metallic=1), plastic (Roughness=0.3-0.6), liquid (Transmission=0.8-1, IOR=1.33)
- **Export pipeline** — glTF 2.0 (.glb) with Draco compression
- **React Three Fiber** integration code
- **Performance** — InstancedMesh, LOD, frustum culling
- **Animation** — keyframe export via glTF, `useAnimations` hook

### 2.4 Drug Database — `ChemMate Drug Database We Need to Add.md` (2000+ lines)

Maps 200+ brand-name drugs to their generic chemical names:
```
Abilify → Aripiprazole
Accupril → Quinapril
Adipex-P → Phentermine
Aleve → Naproxen
Ambien → Zolpidem
... etc.
```

---

## 3. Asset Categories & Build Priorities

### Priority Matrix

| Priority | Asset | Why | Research File |
|----------|-------|-----|---------------|
| **P0** | **Beaker** | Most fundamental lab vessel; teaches glass modeling | `equipment/synthesize.md`, `3d_research_plan.md` |
| **P0** | **Test Tube** | Second most common; teaches lathe/screw modifier | `equipment/centrifuge.md` |
| **P0** | **Round-Bottom Flask** | Required for synthesis, heating, distillation | `equipment/synthesize.md`, `equipment/heat.md` |
| **P0** | **Bunsen Burner** | Used for heat, combust operations | `equipment/combust.md`, `equipment/heat.md` |
| **P1** | **Centrifuge** | Major interactive machine with spinning rotor | `equipment/centrifuge.md` |
| **P1** | **Distillation Apparatus** | Complex multi-part assembly | `equipment/distill.md` |
| **P1** | **Filter Funnel + Büchner** | For filter operation | `equipment/filter.md` |
| **P1** | **Erlenmeyer Flask** | Common mixing/storage vessel | `equipment/mix.md` |
| **P1** | **Graduated Cylinder** | For measure_volume | `equipment/measure_volume.md` |
| **P2** | **Hot Plate / Heating Mantle** | For heat operation | `equipment/heat.md` |
| **P2** | **Thermometer** | For measure_temp | `equipment/measure_temp.md` |
| **P2** | **Microscope** | For serve/view results | `research.md` |
| **P2** | **Pipette** | For precise liquid handling | General |
| **P3** | **Burette** | For titrate operation | `equipment/titrate.md` |
| **P3** | **Crystallization Dish** | For crystallize operation | `equipment/crystallize.md` |
| **P3** | **Separatory Funnel** | For extract operation | `equipment/extract.md` |
| **P3** | **Electrolysis Apparatus** | For electrolyze operation | `equipment/electrolyze.md` |
| **P4** | **Spectrophotometer** | For measure_data | Analytical equipment |
| **P4** | **Autoclave** | For pressurize | `equipment/pressurize.md` |
| **P4** | **Fermentation Vessel** | For ferment | `equipment/ferment.md` |
| **P4** | **Lab Bench / Workspace** | Environment asset | General |

### Summary of All Assets Needed

#### Glassware (P0-P1)
- [ ] Beaker (100ml, 250ml, 500ml sizes)
- [ ] Test Tube (standard 15cm × 1.5cm)  
- [ ] Round-Bottom Flask (50ml, 250ml, 500ml)
- [ ] Erlenmeyer Flask (125ml, 250ml)
- [ ] Volumetric Flask
- [ ] Graduated Cylinder (10ml, 100ml)
- [ ] Watch Glass
- [ ] Pipette (volumetric + graduated)

#### Equipment/Machines (P1-P3)
- [ ] Bunsen Burner (with flame)
- [ ] Centrifuge (with rotor and lid)
- [ ] Distillation Apparatus (flask + condenser + receiving flask)
- [ ] Hot Plate / Heating Mantle
- [ ] Filter Funnel (Büchner + Hirsch)
- [ ] Separatory Funnel
- [ ] Burette (with stopcock)
- [ ] Crucible + Tongs
- [ ] Mortar & Pestle

#### Advanced Equipment (P3-P4)
- [ ] Electrolysis Apparatus
- [ ] Crystallization Dish
- [ ] Fermentation Vessel
- [ ] Autoclave / Pressure Vessel
- [ ] Spectrophotometer
- [ ] Microscope
- [ ] Magnetic Stirrer

#### Environment Assets
- [ ] Lab Bench / Table
- [ ] Fume Hood
- [ ] Lab Sink
- [ ] Chemical Storage Rack
- [ ] Test Tube Rack
- [ ] Ring Stand + Clamps

#### Chemical Visualizations (Procedural/Shader-based)
- [ ] Liquid volume in glassware (dynamic fill level)
- [ ] Liquid color (varies by chemical)
- [ ] Bubbling effect (reactions)
- [ ] Precipitation particles
- [ ] Gas/vapor particles
- [ ] Flame effect (Bunsen burner, combustion)
- [ ] Crystals forming (crystallization)
- [ ] Color change animation (reactions)
- [ ] Centrifuge spinning animation
- [ ] Filtered liquid flowing

---

## 4. 3D Modeling Pipeline

### 4.1 Toolchain

| Tool | Purpose | Status |
|------|---------|--------|
| **Blender 4.5.5** | Modeling, texturing, animation | ✅ Installed at `R:\Blender\blender-4.5.5-windows-x64\` |
| **React Three Fiber** | 3D rendering in React | 🔲 Need to install |
| **@react-three/drei** | Helper components | 🔲 Need to install |
| **@react-three/postprocessing** | Post-processing effects | 🔲 Need to install |
| **glTF 2.0** | 3D file format for web | Standard |

### 4.2 Coordinate System

| Aspect | Blender | Three.js | Conversion |
|--------|---------|----------|------------|
| Up Axis | Z-up | Y-up | Auto via glTF export |
| Forward | -Y forward | -Z forward | Auto via glTF export |
| Unit Scale | 1 unit = 1 meter | 1 unit = 1 meter | Direct 1:1 |
| Handedness | Right-handed | Right-handed | Same |

**Important:** Model at real-world scale. A 100ml beaker should be ~9cm tall in Blender → 0.09 units.

### 4.3 Modeling Workflow for Lab Equipment

#### General Approach
1. Reference the research file for real-world specs
2. Block out basic shapes (primitives)
3. Add modifiers (subdivision surface, solidify, bevel)
4. Apply materials (glass, metal, plastic)
5. UV unwrap for labels/decals
6. Export as glTF with Draco compression

#### Key Modifier Stack
```
Base Mesh
  → Mirror (for symmetrical equipment)
  → Subdivision Surface (for smooth glass)
  → Solidify (for wall thickness on glassware)
  → Bevel (for rounded edges on metal/plastic)
  → Boolean (for cutouts, holes)
```

#### Quick Reference: Model Measurements

| Equipment | Real Size | Blender Units | Vertices Target |
|-----------|-----------|---------------|-----------------|
| Beaker (100ml) | Φ6cm × H9cm | 0.06 × 0.09 | ~500-1000 |
| Test Tube | Φ1.5cm × H15cm | 0.015 × 0.15 | ~300-500 |
| Round-Bottom Flask (250ml) | ~Φ8cm × H12cm | 0.08 × 0.12 | ~800-1500 |
| Erlenmeyer Flask (250ml) | ~Φ8cm × H14cm | 0.08 × 0.14 | ~600-1200 |
| Bunsen Burner | Φ4cm × H12cm | 0.04 × 0.12 | ~1000-2000 |
| Centrifuge | ~Φ30cm × H25cm | 0.3 × 0.25 | ~3000-5000 |

### 4.4 Material Reference Library

These are the material presets needed for ChemKitchen assets:

#### Glass (most common — beakers, flasks, test tubes)
```json
{
  "type": "Principled BSDF",
  "Roughness": 0.0,
  "Transmission": 1.0,
  "IOR": 1.45,
  "Alpha": 0.9
}
```

#### Borosilicate Glass (lab grade — slightly tinted)
```json
{
  "type": "Principled BSDF",
  "Roughness": 0.05,
  "Transmission": 0.95,
  "IOR": 1.47,
  "Alpha": 0.9,
  "Base Color": "#d4e8f0"
}
```

#### Stainless Steel (centrifuge, clamps, stands)
```json
{
  "type": "Principled BSDF",
  "Roughness": 0.2,
  "Metallic": 1.0,
  "Base Color": "#c0c0c0"
}
```

#### Plastic (pipette tips, casings, tube racks)
```json
{
  "type": "Principled BSDF",
  "Roughness": 0.4,
  "Metallic": 0.0,
  "Base Color": "#f0f0f0"
}
```

#### Clear Plastic (safety shields, some containers)
```json
{
  "type": "Principled BSDF",
  "Roughness": 0.1,
  "Transmission": 0.5,
  "IOR": 1.4,
  "Alpha": 0.8
}
```

#### Liquid Inside Glassware (procedural, varies by chemical)
```json
{
  "type": "Principled BSDF",
  "Roughness": 0.0,
  "Transmission": 0.8,
  "IOR": 1.33,
  "Base Color": "[varies by chemical]"
}
```

#### Flame (Bunsen burner, combustion — particle system or animated mesh)
```json
{
  "type": "Emission Principled BSDF",
  "Emission Color": "#ff6600",
  "Emission Strength": 10.0
}
```

### 4.5 Export Settings (Blender → glTF)

| Setting | Value |
|---------|-------|
| Format | **glTF Binary** (.glb) |
| Selected Objects | ✅ Yes |
| Transform | +Y Up |
| Materials | PBR (KHR_materials_pbrSpecularGlossiness) |
| Data | Include UVs ✅, Normals ✅, Vertex Colors ✅ |
| Compression | **Draco** (mesh compression) |
| Animation | Include if animated |
| Images | Embed (for .glb) or Separate (for .gltf) |

**File naming convention:** `models/{equipment_name}.glb`  
**Example:** `models/beaker.glb`, `models/centrifuge.glb`

### 4.6 Recommended Blender Addons

| Addon | Purpose | How to Enable |
|-------|---------|---------------|
| **Node Wrangler** | Quick shader node setup (`Ctrl+Shift+T`) | Edit → Preferences → Add-ons |
| **3D-Print Toolbox** | Check mesh for errors, wall thickness | Edit → Preferences → Add-ons |
| **MeasureIt** | Display measurements in 3D view | Edit → Preferences → Add-ons |
| **Loop Tools** | Advanced loop editing (circle, bridge) | Edit → Preferences → Add-ons |
| **Bool Tool** | Easier boolean operations | Edit → Preferences → Add-ons |

### 4.7 Blender Python API — Procedural Generation Snippets

Use these scripts in Blender's Scripting workspace or via `blender --background --python script.py`:

**Creating a Beaker:**
```python
import bpy, math

def create_beaker(height=0.09, radius=0.03, thickness=0.002):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32, radius=radius, depth=height,
        location=(0, 0, height/2)
    )
    beaker = bpy.context.active_object
    beaker.name = "Beaker"
    
    # Add solidify for wall thickness
    bpy.ops.object.modifier_add(type='SOLIDIFY')
    beaker.modifiers["Solidify"].thickness = thickness
    
    # Add glass material
    mat = bpy.data.materials.new(name="Glass")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    principled.inputs["Roughness"].default_value = 0.0
    principled.inputs["Transmission"].default_value = 1.0
    principled.inputs["IOR"].default_value = 1.45
    beaker.data.materials.append(mat)
    
    return beaker
```

**Creating a Test Tube:**
```python
def create_test_tube(height=0.15, radius=0.015):
    # Use screw modifier for round bottom
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=16, radius=radius, depth=height,
        location=(0, 0, height/2)
    )
    tube = bpy.context.active_object
    tube.name = "TestTube"
    
    # Round bottom with screw modifier
    # (Alternative: use sphere bottom half + cylinder)
    
    # Glass material (same as above)
    mat = bpy.data.materials.new(name="Glass")
    mat.use_nodes = True
    # ... setup Principled BSDF ...
    tube.data.materials.append(mat)
    return tube
```

---

## 5. Chemical Visual Representation Specs

### 5.1 Color Reference for Common Chemicals

Based on the research data, here are the visual properties for representing chemicals in the app:

| Chemical | State at RT | Color | Emoji | Visual Treatment |
|----------|-------------|-------|-------|------------------|
| Water | Liquid | Colorless | 💧 | Clear glass with subtle blue tint |
| Hydrochloric Acid | Liquid | Colorless | 🧪 | Clear, fuming if concentrated |
| Sulfuric Acid | Liquid | Colorless (syrupy) | 🧪 | Clear, viscous, slight yellow tinge |
| Nitric Acid | Liquid | Colorless/pale yellow | 🧪 | Fuming, pale yellow if concentrated |
| Sodium Hydroxide | Liquid (aq) | Colorless | 🧪 | Clear solution |
| Ethanol | Liquid | Colorless | 🍺 | Clear, volatile |
| Benzene | Liquid | Colorless | ⬡ | Clear, refractive index 1.50 |
| Acetaminophen | Solid | White crystalline | 💊 | White powder/crystals |
| Ibuprofen | Solid | White crystalline | 💊 | White powder |
| Caffeine | Solid | White crystalline | ☕ | White crystals |
| Cocaine | Solid | White crystalline | 💊 | White powder |
| Fentanyl | Solid | White powder | 💉 | White powder |
| Heroin | Solid | White/off-white | 💊 | White to brown powder |
| Copper | Solid | Reddish-orange metal | Cu | Metallic copper color |
| Iron | Solid | Gray-silver metal | Fe | Dark metallic gray |
| Gold | Solid | Yellow metal | Au | Bright yellow metallic |
| Mercury | Liquid | Silver-white | Hg | Liquid metal, mirror-like |
| Iodine | Solid | Dark purple/black | I | Purple crystals, violet vapor |
| Sulfur | Solid | Yellow | S | Bright yellow solid |
| Bromine | Liquid | Red-brown | Br | Dark red liquid, red vapor |
| Chlorine | Gas | Yellow-green gas | Cl | Greenish gas |

### 5.2 State Indicators

Each chemical should visually indicate its state of matter:

| State | Visual Treatment | Animation |
|-------|-----------------|-----------|
| **Solid** | Defined mesh shape or particle pile | Static, maybe slight settling |
| **Liquid** | Volume fill inside container, meniscus | Gentle slosh/surface movement |
| **Gas** | Semi-transparent volume or particle system | Rising, diffusing particles |
| **Aqueous** | Dissolved particles in liquid | Uniform color, no visible particles |

### 5.3 Reaction Visual Effects

Mapped from the research in `3d_research_plan.md`:

| Effect | Technique | Used For |
|--------|-----------|----------|
| **Color Change** | Shader uniform lerp between colors | Reactions, pH indicators |
| **Bubbling** | Voronoi noise + time in fragment shader | Boiling, gas evolution, reactions |
| **Precipitation** | Particle system falling/settling | Precipitate operation |
| **Gas Release** | Translucent rising particles | Gas-producing reactions |
| **Heating Glow** | Emissive pulse shader effect | Heat operation, combustion |
| **Mixing Swirl** | Rotating UV coordinates | Mix operation |
| **Crystal Growth** | Procedural geometry growth | Crystallize operation |
| **Fizzing** | Small rapid bubble particles | Acid-base reactions |
| **Smoke/Vapor** | Billboard particle system | Fuming acids, cold vapor |

### 5.4 Liquid Fill Logic

For glassware with variable liquid levels:
```
Liquid Fill = Current_Volume / Max_Volume
```
- Implement as a cylinder/stretched sphere child of the container
- Adjust Y-scale (Three.js) or Z-scale (Blender) to simulate fill level
- Apply a slight offset from container bottom
- Add a meniscus curve at the top surface
- Color determined by the chemical being held

---

## 6. Equipment Visual Specs

### 6.1 Equipment-to-Action Mapping

Each lab action in `constants.ts` maps to one or more equipment models:

| Action | Primary Equipment | Secondary/Alternative |
|--------|------------------|---------------------|
| `synthesize` | Round-Bottom Flask + Heating Mantle | Reaction Vessel |
| `decompose` | Round-Bottom Flask + Heat Source | Decomposition Chamber |
| `combust` | Bunsen Burner | Combustion Chamber |
| `oxidize` | Bunsen Burner / Open Vessel | — |
| `reduce` | Electrolysis Apparatus | — |
| `neutralize` | Beaker + Stirrer | — |
| `precipitate` | Test Tube + Centrifuge | Filter Funnel |
| `hydrolyze` | Round-Bottom Flask + Condenser | — |
| `polymerize` | Round-Bottom Flask | Reaction Vessel |
| `catalyze` | Round-Bottom Flask | Any reaction vessel |
| `distill` | Distillation Apparatus | — |
| `crystallize` | Crystallization Dish | Evaporating Dish |
| `titrate` | Burette + Erlenmeyer Flask | — |
| `extract` | Separatory Funnel | — |
| `filter` | Büchner Funnel + Filter Flask | Gravity Funnel |
| `centrifuge` | Centrifuge Machine | — |
| `heat` | Bunsen Burner / Hot Plate | Heating Mantle |
| `cool` | Ice Bath / Cooling Bath | Refrigerated Chamber |
| `pressurize` | Autoclave / Pressure Vessel | — |
| `depressurize` | Vacuum Chamber / Desiccator | — |
| `irradiate` | UV Lamp / Irradiation Chamber | — |
| `electrolyze` | Electrolysis Apparatus | — |
| `ferment` | Fermentation Vessel | — |
| `dissolve` | Beaker + Magnetic Stirrer | — |
| `serve` | Microscope / Lab Bench | — |

### 6.2 Detailed Equipment Specs (from Research)

#### Beaker
| Property | Value |
|----------|-------|
| Materials | Borosilicate glass |
| Key Visual Features | Cylindrical, flat bottom, spout, measurement marks |
| Moving Parts | None |
| Color | Transparent (slight blue tint for borosilicate) |
| Size Variants | 100ml (Φ6cm × 9cm), 250ml (Φ7cm × 12cm), 500ml (Φ9cm × 15cm) |

#### Test Tube
| Property | Value |
|----------|-------|
| Materials | Borosilicate glass or plastic |
| Key Visual Features | Cylindrical, round bottom, open top, rim |
| Moving Parts | None |
| Color | Transparent |
| Size | 15cm tall × 1.5cm diameter |

#### Round-Bottom Flask
| Property | Value |
|----------|-------|
| Materials | Borosilicate glass |
| Key Visual Features | Spherical body, cylindrical neck, ground glass joint |
| Moving Parts | None |
| Color | Transparent |
| Size Variants | 50ml, 250ml, 500ml |

#### Bunsen Burner
| Property | Value |
|----------|-------|
| Materials | Brass (barrel, gas nozzle), Stainless steel (base) |
| Key Visual Features | Cylindrical barrel, gas intake tube at base, air adjustment collar, rubber gas hose |
| Moving Parts | Gas valve (manual), air adjustment collar (rotates) |
| Color | Brass/gold tone for barrel, black/steel for base |
| Animation | Flame (particle system or animated mesh) |
| Size | ~4cm diameter × 12cm height |

#### Centrifuge
| Property | Value |
|----------|-------|
| Materials | Steel housing, aluminum/titanium rotor, polycarbonate lid |
| Key Visual Features | Cylindrical body, hinged lid, digital display, rotor with tube holders |
| Moving Parts | Rotor (spins), lid (hinges open/close) |
| Color | White/cream body, clear lid, silver rotor |
| Animation | Rotor spin (high speed), lid open/close |
| Size | ~30cm diameter × 25cm height (benchtop) |
| Display | LCD showing RPM, time, temperature |
| Buttons | Start, Stop/Open, Speed +/- , Time +/-, Emergency Stop |

#### Distillation Apparatus
| Property | Value |
|----------|-------|
| Components | Round-bottom flask (boiling), distillation head, condenser (Liebig), receiving flask, hoses (in/out water), thermometer adapter |
| Materials | Borosilicate glass, PTFE joints |
| Key Visual Features | Complex glass assembly, water flowing through condenser jacket, condensed liquid dripping |
| Moving Parts | None (all glass joints) |
| Color | Transparent glass |
| Animation | Liquid boiling in flask → vapor rising → condensing → liquid dripping into receiver |

#### Filter Funnel (Büchner)
| Property | Value |
|----------|-------|
| Materials | Porcelain or glass funnel, rubber adapter, filter paper |
| Key Visual Features | Flat perforated plate, conical body, side-arm filter flask |
| Moving Parts | None |
| Color | White porcelain or transparent glass |
| Animation | Liquid passing through filter, vacuum applied |

### 6.3 Animation Reference

| Equipment | Animations Needed | Research Source |
|-----------|-------------------|-----------------|
| Centrifuge | Rotor spin (variable speed), lid open/close, brake | `equipment/centrifuge.md` |
| Bunsen Burner | Flame (flickering), gas valve adjustment | `equipment/combust.md` |
| Distillation | Bubbling in flask, condensation dripping | `equipment/distill.md` |
| Heating | Glow effect on hot plate, liquid heating | `equipment/heat.md` |
| Filter | Liquid level decreasing in funnel | `equipment/filter.md` |
| Stirring | Stir bar rotation, liquid swirling | `equipment/mix.md` |
| Titration | Burette stopcock opening, drop falling | `equipment/titrate.md` |

---

## 7. App Integration Map

### 7.1 File Structure for 3D Assets

```
public/
  models/
    glassware/
      beaker.glb
      beaker_250ml.glb
      beaker_500ml.glb
      test_tube.glb
      round_bottom_flask.glb
      round_bottom_flask_250ml.glb
      round_bottom_flask_500ml.glb
      erlenmeyer_flask.glb
      volumetric_flask.glb
      graduated_cylinder.glb
      watch_glass.glb
      pipette.glb
    equipment/
      bunsen_burner.glb
      centrifuge.glb
      distillation_apparatus.glb
      hot_plate.glb
      buchner_funnel.glb
      separatory_funnel.glb
      burette.glb
      crucible.glb
      mortar_pestle.glb
    environment/
      lab_bench.glb
      fume_hood.glb
      test_tube_rack.glb
      ring_stand.glb
  textures/
    lab_tiles.png
    measurement_marks.png
    label_decals.png
  hdri/
    laboratory.exr
    studio.exr
```

### 7.2 React Three Fiber Component Structure

```
src/
  components/
    LabScene.tsx              — Main 3D scene wrapper
    LabBench.tsx              — Environment / lab bench
    Equipment/
      Beaker.tsx              — Beaker model + liquid fill logic
      TestTube.tsx            — Test tube model
      RoundBottomFlask.tsx    — Flask model
      BunsenBurner.tsx        — Burner with flame animation
      Centrifuge.tsx          — Centrifuge with rotor animation
      DistillationApparatus.tsx — Multi-part distillation setup
      HotPlate.tsx            — Hot plate with glow effect
      FilterFunnel.tsx        — Funnel + filter flask
    Effects/
      LiquidFill.tsx          — Dynamic liquid in glassware
      BubbleEffect.tsx        — Particle system for bubbling
      FlameEffect.tsx         — Flame particle or mesh
      ColorChange.tsx         — Shader-based color transition
      PrecipitationEffect.tsx — Falling/settling particles
    UI/
      EquipmentCard.tsx       — 3D preview in equipment catalog
      InventoryItem.tsx       — Chemical item with 3D representation
      ReactionViewer.tsx      — Full reaction visualization
    hooks/
      useModelLoader.ts       — GLTF loading with progress
      useAnimationController.ts — Equipment animation control
      useLiquidFill.ts        — Liquid level management
    utils/
      chemicalColors.ts       — Color mapping for all chemicals
      materialLibrary.ts      — Material presets (glass, metal, plastic)
      scaleReference.ts       — Real-world scale constants
```

### 7.3 Data Flow

```
User Action
    ↓
Gemini AI (decides which lab action + chemicals)
    ↓
Function Call (e.g., heat(["Water", "Beaker"]))
    ↓
3D Scene Update:
    - Equipment appears/animates (e.g., beaker on hot plate)
    - Liquid fills/handles (e.g., water heating)
    - Effects play (e.g., bubbling, steam)
    - Color changes (if reaction occurs)
    ↓
Result Display (AI response shows what was synthesized)
    ↓
New Chemical Added to Inventory

```

### 7.4 Chemical-Color Mapping Implementation

Create a `chemicalColors.ts` utility that maps every chemical from `STARTING_INGREDIENTS` to a visual representation:

```typescript
export interface ChemicalVisual {
  color: string;        // Hex color for liquid/solid representation
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  opacity: number;      // 0-1, for transparency
  emissive?: string;    // Glow color (for reactive/hot substances)
  particleEffect?: 'bubbles' | 'smoke' | 'sparkle' | 'none';
}

export const CHEMICAL_VISUALS: Record<string, ChemicalVisual> = {
  'Water': { color: '#e8f4f8', state: 'liquid', opacity: 0.85 },
  'Hydrochloric Acid': { color: '#f0f8ff', state: 'liquid', opacity: 0.7 },
  'Sulfuric Acid': { color: '#fff8dc', state: 'liquid', opacity: 0.8, particleEffect: 'smoke' },
  'Copper': { color: '#b87333', state: 'solid', opacity: 1.0 },
  'Bromine': { color: '#8b0000', state: 'liquid', opacity: 0.9, particleEffect: 'smoke' },
  'Iodine': { color: '#4b0082', state: 'solid', opacity: 1.0, particleEffect: 'smoke' },
  'Sulfur': { color: '#fff44f', state: 'solid', opacity: 1.0 },
  'Mercury': { color: '#c0c0c0', state: 'liquid', opacity: 0.95 },
  'Chlorine': { color: '#90ee90', state: 'gas', opacity: 0.3, particleEffect: 'smoke' },
  // ... all 130+ chemicals
};
```

---

## 8. Implementation Phases

### Phase 0: Dependencies & Setup (Week 1)

- [ ] Install `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- [ ] Install `three-stdlib` for GLTFLoader
- [ ] Set up basic LabScene.tsx with Canvas, OrbitControls, lighting
- [ ] Enable Blender addons (Node Wrangler, 3D-Print, MeasureIt, LoopTools)
- [ ] Create `public/models/` directory structure

### Phase 1: Core Glassware (Week 2)

- [ ] Model Beaker in Blender (with 3 variants)
- [ ] Model Test Tube
- [ ] Model Round-Bottom Flask
- [ ] Create glass material preset
- [ ] Set up glTF export pipeline with Draco compression
- [ ] Create `useModelLoader.ts` hook
- [ ] Display beaker in 3D scene
- [ ] Implement OrbitControls

### Phase 2: Liquid System (Week 3)

- [ ] Create `LiquidFill.tsx` component (dynamic fill level in glassware)
- [ ] Implement meniscus curve at liquid surface
- [ ] Create `chemicalColors.ts` with all 130+ chemical mappings
- [ ] Implement color change on reaction
- [ ] Create glass refraction/distortion effect

### Phase 3: Effects & Reactions (Week 4)

- [ ] Create `BubbleEffect.tsx` (voronoi noise shader)
- [ ] Create `FlameEffect.tsx` (Bunsen burner)
- [ ] Create `PrecipitationEffect.tsx` (falling particles)
- [ ] Create `ColorChange.tsx` (shader-based lerp)
- [ ] Implement gas/vapor particle system

### Phase 4: Equipment Models (Week 5-6)

- [ ] Model Bunsen Burner (with flame)
- [ ] Model Centrifuge (with spinning rotor)
- [ ] Model Distillation Apparatus (multi-part)
- [ ] Model Hot Plate (with glow)
- [ ] Model Büchner Funnel + Filter Flask
- [ ] Model Separatory Funnel
- [ ] Create animations in Blender for each

### Phase 5: Environment & UI (Week 7)

- [ ] Model Lab Bench (with surface, texture)
- [ ] Model Test Tube Rack
- [ ] Model Ring Stand + Clamps
- [ ] Create `EquipmentCard.tsx` (small 3D previews)
- [ ] Create `InventoryItem.tsx` (3D chemical bottle)
- [ ] Implement click-to-select equipment
- [ ] Add drag behaviors for placing items on bench

### Phase 6: Integration (Week 8)

- [ ] Wire up lab actions to trigger 3D animations
- [ ] Replace emoji/text interface with 3D scene
- [ ] Reaction sequencing (multi-step synthesis)
- [ ] Lessons mode with 3D visualizations
- [ ] Performance optimization (LOD, InstancedMesh)
- [ ] Test on target devices

---

## 9. Technical Setup

### 9.1 Required npm Packages

```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing
npm install three-stdlib
```

These are in addition to existing dependencies (Three.js v0.182.0 already installed).

### 9.2 Basic LabScene Component (Starting Template)

```tsx
// src/components/LabScene.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import { LabBench } from './LabBench'
import { Beaker } from './Equipment/Beaker'

export function LabScene() {
  return (
    <Canvas
      camera={{ position: [2, 1.5, 2], fov: 45 }}
      dpr={[1, 2]} // Responsive pixel ratio
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      
      {/* Environment (HDRI reflections on glass) */}
      <Environment preset="studio" />
      
      {/* Scene Content */}
      <Suspense fallback={null}>
        <LabBench />
        <Beaker position={[0, 0.5, 0]} scale={1} />
      </Suspense>
      
      {/* Ground shadow */}
      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={5} blur={2} />
      
      {/* Controls */}
      <OrbitControls enableDamping dampingFactor={0.1} />
    </Canvas>
  )
}
```

### 9.3 Model Loader Hook

```tsx
// src/components/hooks/useModelLoader.ts
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'

export function useModelLoader(path: string) {
  const { scene } = useGLTF(path) as GLTF
  return scene
}

// Preload models for faster loading
useGLTF.preload('/models/glassware/beaker.glb')
useGLTF.preload('/models/equipment/bunsen_burner.glb')
```

### 9.4 Performance Targets

| Metric | Target | Technique |
|--------|--------|-----------|
| Model polygon count | <10k tris per equipment | Subdivision surface + decimation |
| Draw calls | <50 | InstancedMesh for repeated objects |
| Texture size | 1024×1024 max | Compressed textures |
| File size per model | <500KB .glb | Draco compression |
| FPS | 60 on desktop, 30 on mobile | LOD, frustum culling |
| Memory | <200MB | Texture compression, asset pooling |

---

## 10. Reference Materials

### 10.1 External Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| **Blender Docs** | https://docs.blender.org | Full Blender reference |
| **Three.js Docs** | https://threejs.org/docs | Web 3D rendering API |
| **React Three Fiber Docs** | https://docs.pmnd.rs | R3F component reference |
| **glTF Specification** | https://www.khronos.org/gltf | 3D format standards |
| **Poly Haven** | https://polyhaven.com | Free HDRI, textures, models |
| **BlenderKit** | https://www.blenderkit.com | Free lab equipment models |
| **Sketchfab** | https://sketchfab.com | Download test models (check license) |

### 10.2 Local Research Files

| File | Content |
|------|---------|
| `research/3d_research_plan.md` | Complete 3D modeling and rendering guide (556 lines) |
| `research/research.md` | Original research prompts for chemicals and equipment |
| `research/chemicals/*.md` | 140+ chemical compound research files |
| `research/equipment/*.md` | 36 lab operation research files |
| `ChemMate Drug Database We Need to Add.md` | 200+ brand→generic drug name mappings |

### 10.3 Blender Setup Quick Reference

**Open Blender:**
```
R:\Blender\blender-4.5.5-windows-x64\blender.exe
```

**Run a Python script headless:**
```bash
"R:\Blender\blender-4.5.5-windows-x64\blender.exe" --background --python script.py
```

**Enable addons via CLI:**
```python
import bpy
# Enable Node Wrangler
bpy.ops.preferences.addon_enable(module="node_wrangler")
# Enable 3D-Print Toolbox
bpy.ops.preferences.addon_enable(module="mesh_3d_print_toolkit")
bpy.ops.script.save_preferences()
```

### 10.4 Quick-Start Checklist

**Before starting asset creation, verify:**

- [ ] Blender 4.5.5 is installed and launches correctly
- [ ] Required Blender addons are enabled
- [ ] `npm install` for React Three Fiber packages is done
- [ ] `public/models/` directory exists
- [ ] LabScene.tsx renders with OrbitControls
- [ ] `chemicalColors.ts` mapping is created
- [ ] First test model (beaker) exports and loads via `useGLTF`

**Success criteria for Phase 1 (Core Glassware):**
- [ ] Beaker model visible and interactable in 3D scene
- [ ] Glass material renders with transparency and refraction
- [ ] Liquid fill dynamically changes height
- [ ] Scene runs at 60fps on development machine
- [ ] OrbitControls allow full inspection

---

> **Next Steps:** Switch to Phase 0 — install the R3F dependencies and create the basic LabScene component. Then move to Phase 1 — model the beaker in Blender and import it into the scene.