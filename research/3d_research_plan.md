s # 3D Asset Creation Research - ChemKitchen

## Comprehensive Research for Creating Detailed Lab Machine 3D Models

---

## Table of Contents
1. [Free 3D Tools for Lab Equipment](#1-free-3d-tools-for-lab-equipment)
2. [Blender Deep Dive](#2-blender-deep-dive)
3. [Web 3D Rendering Stack](#3-web-3d-rendering-stack)
4. [3D Languages & Formats](#4-3d-languages--formats)
5. [The Donut Tutorial Learning Path](#5-the-donut-tutorial-learning-path)
6. [Integration into ChemKitchen](#6-integration-into-chemkitchen)

---

## 1. Free 3D Tools for Lab Equipment

### Primary: Blender (4.5.5)
- **Installed at:** `R:\Blender\blender-4.5.5-windows-x64\blender.exe`
- **Size:** ~380MB portable, no installer needed
- **License:** GPL (completely free, even for commercial use)
- **Why Blender:** Industry standard for 3D modeling, animation, rendering. Full Python API for procedural generation.

### Secondary/Complementary Tools

| Tool | Type | Strengths | Weaknesses |
|------|------|-----------|------------|
| **Three.js Editor** | Web-based | Quick previews, good for web export testing | Limited modeling |
| **Spline** | Web-based (free tier) | Collaborative, easy UI, direct React export | Subscription needed for serious work |
| **SketchUp Free** | Web-based | Good for architectural/mechanical shapes | Limited texturing |
| **Houdini (Apprentice)** | Free for non-commercial | Best for procedural generation | Steep learning curve |
| **Photogrammetry (Meshroom)** | Free | Turn real lab equipment photos into 3D | Requires good photos |

### Recommended Workflow for ChemKitchen
1. **Model** in Blender (precision modeling with measurements)
2. **Texture/Paint** in Blender (PBR materials for glass, metal, plastic)
3. **Export** as glTF 2.0 (best for web)
4. **Import** via React Three Fiber into ChemKitchen

---

## 2. Blender Deep Dive

### 2.1 XYZ Coordinate System

Understanding Blender's coordinate system vs. Three.js is **critical** for exporting assets.

| Aspect | Blender | Three.js |
|--------|---------|----------|
| **Up Axis** | Z-up | Y-up |
| **Forward** | -Y forward | -Z forward |
| **Coordinate Handedness** | Right-handed | Right-handed |
| **Unit Scale** | 1 unit = 1 meter | 1 unit = 1 meter |

**The Z-up vs Y-up problem:** When exporting from Blender to Three.js via glTF, the conversion is handled automatically — Blender's Z-up becomes Three.js's Y-up. But you must be aware of this when positioning assets.

**Important Blender shortcuts for 3D space:**
- `G` = Grab/Move, `R` = Rotate, `S` = Scale
- `G X`, `G Y`, `G Z` = Move along specific axis
- `Shift + Z` = Toggle wireframe view
- `Numpad 1` = Front view (Y), `Numpad 3` = Right view (X), `Numpad 7` = Top view (Z)
- `Numpad 0` = Camera view
- `~` (tilde) = Pie menu for viewport navigation

### 2.2 Materials & Shaders

#### Two Render Engines

| Engine | Use Case | Speed |
|--------|----------|-------|
| **Eevee** | Real-time preview, game assets | Fast |
| **Cycles** | Photorealistic final renders | Slow (path-traced) |

#### Important Material Types for Lab Equipment

| Material | Principled BSDF Setup | Used For |
|----------|----------------------|----------|
| **Glass** | Roughness=0, Transmission=1, IOR=1.45 | Beakers, flasks, test tubes |
| **Metal** | Roughness=0.1-0.3, Metallic=1 | Centrifuge, metal clamps, stands |
| **Plastic** | Roughness=0.3-0.6, Metallic=0 | Pipette tips, plastic casings |
| **Liquid** | Transmission=0.8-1, IOR=1.33 (water) | Chemicals in glassware |
| **Clear Plastic** | Transmission=0.5, Roughness=0.1 | Safety shields, containers |

#### Key Shader Nodes
- **Principled BSDF** — The main universal shader
- **Glass BSDF** — Pure glass (simpler than Principled for glass)
- **Mix Shader** — Blend two materials (e.g., liquid + glass)
- **Fresnel** — Controls reflection based on viewing angle
- **Noise Texture** — Procedural detail for imperfections
- **Bump/Displacement** — Surface detail for realistic lab equipment

### 2.3 Lighting

#### 3-Point Lighting Setup (for product renders)
1. **Key Light** (main) — 45° to camera, intensity ~1000W
2. **Fill Light** (secondary) — opposite side, 50% intensity
3. **Back Light** (rim) — behind object, creates edge definition

#### HDRI Lighting
- Use HDRI environment maps for realistic reflections on glass/metal
- Great for lab equipment: indoor studio or laboratory HDRIs
- Free HDRI sources: Poly Haven (polyhaven.com)

#### Lighting for Lab Scenes
- **Overhead fluorescent** — Diffuse, even lighting for a lab feel
- **Point lights** inside glassware — Backlight chemicals to show color
- **Area lights** — Soft shadows for product-quality renders

### 2.4 Cameras

| Camera Setting | Recommendation |
|----------------|----------------|
| **Focal Length** | 50mm (standard), 85mm (close-up detail) |
| **F-Stop** | f/2.8-f/5.6 for depth of field |
| **Sensor Size** | 36mm (full frame) |
| **Resolution** | 1920x1080 for web, 4K for renders |

- **Lock Camera to View** (`Ctrl+Alt+Numpad 0`) for easy positioning
- **Depth of Field** checkbox in camera properties for blur effects

### 2.5 Shapes & Modeling Techniques for Lab Equipment

#### Key Modeling Workflows

| Technique | Use Case | Key Modifiers |
|-----------|----------|---------------|
| **Subdivision Surface** | Organic shapes, rounded edges | Subdivision Surface modifier |
| **Boolean** | Cut holes, combine shapes | Boolean modifier |
| **Lathe (Screw)** | Bottles, flasks, test tubes | Screw modifier |
| **Extrude** | Build from base shape | E key |
| **Loop Cut** | Add edge loops for detail | Ctrl+R |
| **Bevel** | Round edges on lab equipment | Ctrl+B |
| **Mirror** | Symmetrical objects | Mirror modifier |
| **Array** | Repeated elements (test tube racks) | Array modifier |

#### Modeling Specific Lab Equipment

**Beaker:**
1. Start with cylinder, delete top face
2. Add solidify modifier for wall thickness
3. Add lip with loop cut + extrude
4. Add spout by extruding a small section upward
5. Measure: 100ml beaker ≈ 6cm diameter × 9cm height

**Test Tube:**
1. Start with cylinder, fewer segments (~16)
2. Use Screw modifier for round bottom
3. Add solidify for glass thickness
4. Measure: 15cm tall × 1.5cm diameter

**Centrifuge:**
1. Cylinder for main body
2. Boolean cut for chamber opening
3. Array modifier for tube holders
4. Detailed rotor mechanism
5. LCD screen with emissive material

**Bunsen Burner:**
1. Base cylinder (flattened)
2. Tube body (cylindrical)
3. Gas inlet (small tube on side)
4. Flame base (cone)
5. Particle system for flame

### 2.6 Blender Python API

Blender exposes its entire functionality via Python (`bpy` module). This allows **procedural generation** of lab equipment.

```python
import bpy
import math

# Create a beaker procedurally
def create_beaker(height=0.09, radius=0.03, thickness=0.002):
    # Create cylinder mesh
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32,
        radius=radius,
        depth=height,
        location=(0, 0, height/2)
    )
    beaker = bpy.context.active_object
    beaker.name = "Beaker"
    
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

create_beaker()
```

**Key bpy modules to learn:**
- `bpy.data` — Access all data (meshes, materials, objects)
- `bpy.context` — Current state (active object, scene)
- `bpy.ops` — Operator calls (like pushing buttons in UI)
- `bpy.types` — Python classes for Blender types
- `mathutils` — Vector, Matrix, Quaternion math (very important!)

### 2.7 Essential Blender Addons

| Addon | Built-in? | Purpose |
|-------|-----------|---------|
| **Node Wrangler** | ✅ Built-in | Quick shader node setup (`Ctrl+Shift+T` for textures) |
| **3D-Print Toolbox** | ✅ Built-in | Check mesh for errors, wall thickness |
| **MeasureIt** | ✅ Built-in | Display measurements in 3D viewport |
| **Loop Tools** | ✅ Built-in | Advanced loop editing (bridge, circle, etc.) |
| **Bool Tool** | ✅ Built-in | Easier boolean operations |
| **Rigify** | ✅ Built-in | If we need articulated machines |
| **UV Squares** | Built-in | Perfect UV unwrapping |
| **Blender Kit** | Free/Paid | Asset library (lab equipment available) |
| **Materialiq** | Free | PBR material library |

**To enable:** Edit → Preferences → Add-ons → Search and check the box

### 2.8 Export Formats for Web

| Format | Recommended For | Notes |
|--------|----------------|-------|
| **glTF 2.0** (.glb/.gltf) | **Web (BEST)** | Industry standard, smaller files, PBR support |
| **OBJ** | Universal fallback | No animations, basic materials |
| **FBX** | Animation-heavy | Proprietary, use only if needed |
| **USD** | Interchange | Pixar format, good for complex scenes |

**Export settings for glTF:**
- Include: Selected Objects
- Transform: +Y Up (Three.js compatible)
- Materials: PBR (KHR_materials_pbrSpecularGlossiness)
- Data: Include UVs, Normals, Vertex Colors
- Compression: Draco mesh compression (smaller files)
- Animation: Include if you have animated equipment

### 2.9 UV Unwrapping

**Why important for lab equipment:**
- Labels on bottles
- Textures for LCD screens
- Decals on equipment panels
- Dirt/scratch maps for realism

**UV Workflow:**
1. Mark seams (`Ctrl+E` → Mark Seam) along natural edges
2. Unwrap (`U` → Unwrap)
3. Pack UV islands (Scale to fit)
4. Export UV layout as PNG for painting

---

## 3. Web 3D Rendering Stack

### 3.1 Three.js (Already in ChemKitchen!)

Three.js v0.182.0 is already a dependency in `package.json`. This is the core 3D rendering engine.

**Key Three.js concepts:**
- `Scene` — The 3D world
- `Camera` — PerspectiveCamera (like eyes) or OrthographicCamera
- `Renderer` — WebGLRenderer draws the scene
- `Mesh` — Geometry + Material combined
- `Light` — AmbientLight, DirectionalLight, PointLight, SpotLight
- `Group` — Organize multiple meshes together

```typescript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a glTF model
const loader = new THREE.GLTFLoader();
loader.load('/models/beaker.glb', (gltf) => {
    scene.add(gltf.scene);
});
```

### 3.2 React Three Fiber (R3F)

This is the **recommended approach** for ChemKitchen — wraps Three.js in React components.

**Install:**
```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing
```

**Basic R3F component:**
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Model } from './BeakerModel'

function LabScene() {
  return (
    <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Environment (HDRI reflections) */}
      <Environment preset="studio" />
      
      {/* 3D Model */}
      <Model position={[0, 0, 0]} />
      
      {/* Controls */}
      <OrbitControls />
      
      {/* Ground shadow */}
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} />
    </Canvas>
  )
}
```

### 3.3 @react-three/drei Helpers

| Component | Purpose |
|-----------|---------|
| `OrbitControls` | Mouse/touch camera control |
| `Environment` | HDRI environment map for reflections |
| `ContactShadows` | Realistic shadows on ground |
| `Float` | Floating animation for idle state |
| `Text` | 3D text (labels on equipment) |
| `Html` | HTML overlays in 3D space |
| `TransformControls` | Gizmo for moving objects (debug) |
| `GizmoHelper` | Axis widget in corner |
| `gltf` / `useGLTF` | Load glTF models |
| `Center` | Center model origin |

### 3.4 Animation Pipeline

**From Blender → Web:**
1. Animate equipment in Blender (keyframes)
2. Export as glTF (with animation checked)
3. Play animation in Three.js:

```tsx
import { useGLTF, useAnimations } from '@react-three/drei'

function Centrifuge() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/centrifuge.glb')
  const { actions } = useAnimations(animations, group)
  
  useEffect(() => {
    // Play spinning animation
    actions['Spin']?.play()
  }, [actions])
  
  return <primitive ref={group} object={scene} />
}
```

### 3.5 Performance Optimizations

| Technique | What It Does |
|-----------|-------------|
| **InstancedMesh** | Render 100+ identical objects cheaply (test tubes in a rack) |
| **LOD** | Lower detail models when far away |
| **Frustum Culling** | Don't render what's off-screen (built-in) |
| **Draco Compression** | Reduce glTF file size |
| **Texture Compression** | Use .ktx2 textures |
| **Baked Lighting** | Pre-calculate lighting into textures |

---

## 4. 3D Languages & Formats

### 4.1 glTF 2.0 — The "JPEG of 3D"

**Why glTF is critical for our workflow:**
- Industry standard for web 3D
- Supports PBR materials, animations, cameras, lights
- Compact binary format (.glb) or separate files (.gltf + .bin + textures)
- Native support in Three.js
- Draco compression reduces file size by 90%+

**glTF file structure:**
```
model.glb (binary, all-in-one) — BEST for distribution
  OR
model.gltf (JSON scene description)
model.bin (geometry data)
texture_0.png (textures)
```

### 4.2 TypeScript 3D Math

Three.js provides powerful math classes:

```typescript
import * as THREE from 'three'

// Vectors
const pos = new THREE.Vector3(1, 2, 3)   // position
const dir = new THREE.Vector3(0, 0, -1)  // direction
pos.add(dir)
pos.lerp(target, 0.1)                     // smooth movement

// Quaternions (rotation without gimbal lock)
const rot = new THREE.Quaternion()
rot.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)  // 90° around Y

// Rotate to face something
const quat = new THREE.Quaternion()
quat.setFromUnitVectors(
  new THREE.Vector3(0, 0, 1),
  targetDirection.clone().normalize()
)

// Matrices
const matrix = new THREE.Matrix4()
matrix.makeRotationY(Math.PI)
matrix.setPosition(new THREE.Vector3(5, 0, 0))
```

### 4.3 GLSL Shaders

For custom effects like liquid in a beaker, bubbling reactions, or color changes:

```glsl
// Vertex Shader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader (bubbling liquid effect)
uniform float time;
varying vec2 vUv;

void main() {
  // Simple bubbling effect
  float bubbles = sin(vUv.x * 50.0 + time) * cos(vUv.y * 50.0 + time);
  bubbles = smoothstep(0.5, 0.8, bubbles);
  
  vec3 liquidColor = vec3(0.2, 0.5, 0.8); // Blue liquid
  gl_FragColor = vec4(liquidColor + bubbles * 0.3, 0.85);
}
```

### 4.4 Shader-based Chemistry Reactions

We can show reactions visually in real-time:
- **Color change** — Lerp between two colors in shader
- **Bubbling** — Voronoi noise + time animation
- **Precipitation** — Particle system falling
- **Gas release** — Translucent rising particles
- **Heating glow** — Emissive pulse effect
- **Mixing swirl** — Rotate UV coordinates

---

## 5. The Donut Tutorial Learning Path

### Tutorial: Blender Guru's Donut Tutorial
**Link:** https://www.youtube.com/watch?v=z-Xl9tGqH14

### What You'll Learn From This Series

| Part | Skill | Applies to Lab Equipment |
|------|-------|--------------------------|
| **Part 1** | Basic navigation, mesh editing | Understanding Blender controls |
| **Part 2** | Modifiers (Subdivision Surface, Mirror) | Creating smooth glass shapes |
| **Part 3** | Shading (Principled BSDF) | Glass and metal materials |
| **Part 4** | Texture painting | Labels on beakers, panel textures |
| **Part 5** | Particle system | Sprinkle effect → bubbling reactions |
| **Part 6** | Lighting & HDRI | Product renders of lab equipment |
| **Part 7** | Camera & rendering | Final renders for web thumbnails |
| **Part 8** | Compositing | Post-processing effects |

### Modified Learning Path for Lab Equipment

Instead of a donut, follow the same skills but apply them to lab equipment:

1. **Basic navigation** → Navigate around a beaker
2. **Mesh editing** → Model a test tube (lathe/screw modifier)
3. **Modifiers** → Create a volumetric flask with subdivision surface
4. **Materials** → Glass shader setup (critical for lab equipment)
5. **Textures** → Add measurement marks to beaker
6. **Particles** → Bubbling liquid in a flask
7. **Lighting** → 3-point light studio setup for equipment renders
8. **Animation** → Centrifuge spinning, piston moving, liquid mixing

---

## 6. Integration into ChemKitchen

### Phase 1: Setup R3F (Current)
- [ ] Install `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`  
- [ ] Create a 3D scene component
- [ ] Add OrbitControls for camera navigation
- [ ] Add environment lighting

### Phase 2: Import First Model
- [ ] Model a simple beaker in Blender
- [ ] Export as glTF with Draco compression
- [ ] Load into ChemKitchen with `useGLTF`
- [ ] Position in lab scene

### Phase 3: Equipment Showcase
- [ ] Replace placeholder images in EquipmentCatalog with 3D models
- [ ] Each equipment card shows a 3D preview
- [ ] Click to view in full 3D scene

### Phase 4: Interactive Lab
- [ ] Full 3D lab scene
- [ ] Machines arranged on lab benches
- [ ] Click to select equipment and perform actions
- [ ] Visual reactions (color change, bubbling, particles)

### Phase 5: Animation
- [ ] Animate machine operations
- [ ] Liquid pouring
- [ ] Chemical reactions in real-time

---

## Research Notes

### Blender Version
- **Installed:** Blender 4.5.5 (portable)
- **Location:** `R:\Blender\blender-4.5.5-windows-x64\`
- **PATH:** Added to user PATH

### Python for Blender
- Blender has its own bundled Python
- Run scripts with: `blender --background --python script.py`
- Or use the Scripting workspace in Blender UI
- Can install pip packages into Blender's Python

### Key Resources
- **Blender Documentation:** https://docs.blender.org
- **Three.js Docs:** https://threejs.org/docs
- **React Three Fiber Docs:** https://docs.pmnd.rs
- **glTF Specification:** https://www.khronos.org/gltf
- **Poly Haven (free models/textures/HDRI):** https://polyhaven.com
- **BlenderKit (free asset library):** https://www.blenderkit.com
- **Sketchfab (download test models):** https://sketchfab.com

### Blender MCP Server
The Blender MCP server allows AI to control Blender remotely. We need to:
1. Install the Blender MCP addon in Blender
2. Set up a server that communicates with Blender's Python API
3. Configure it in Antigravity's MCP settings