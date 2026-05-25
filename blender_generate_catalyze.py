import bpy
import os
import math
import random

# Set output paths
glassware_dir = r"r:\Antigravity Multiple\ChemKitchen\ChemKitchen\public\models\glassware"
equipment_dir = r"r:\Antigravity Multiple\ChemKitchen\ChemKitchen\public\models\equipment"
os.makedirs(glassware_dir, exist_ok=True)
os.makedirs(equipment_dir, exist_ok=True)

def clean_scene():
    if bpy.ops.object.mode_set.poll():
        bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_principled_material(name, base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0, transmission=0.0, IOR=1.45, emission=(0, 0, 0, 1), emission_strength=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    for node in list(nodes):
        nodes.remove(node)
        
    node_output = nodes.new(type='ShaderNodeOutputMaterial')
    node_output.location = (300, 0)
    
    node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    node_principled.location = (0, 0)
    
    # Set inputs
    if "Base Color" in node_principled.inputs:
        node_principled.inputs["Base Color"].default_value = base_color
    if "Roughness" in node_principled.inputs:
        node_principled.inputs["Roughness"].default_value = roughness
    if "Metallic" in node_principled.inputs:
        node_principled.inputs["Metallic"].default_value = metallic
        
    # Handling transmission in Blender 4.x
    if "Transmission Weight" in node_principled.inputs:
        node_principled.inputs["Transmission Weight"].default_value = transmission
    elif "Transmission" in node_principled.inputs:
        node_principled.inputs["Transmission"].default_value = transmission
        
    if "IOR" in node_principled.inputs:
        node_principled.inputs["IOR"].default_value = IOR
        
    if "Emission Color" in node_principled.inputs:
        node_principled.inputs["Emission Color"].default_value = emission
    elif "Emission" in node_principled.inputs:
        # Older blender version support
        node_principled.inputs["Emission"].default_value = emission
        
    if "Emission Strength" in node_principled.inputs:
        node_principled.inputs["Emission Strength"].default_value = emission_strength
        
    links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])
    return mat

def export_model(obj_list, filename, directory):
    # Select only the specified objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in obj_list:
        obj.select_set(True)
        
    filepath = os.path.join(directory, filename)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6
    )
    print("Exported", filename, "to", filepath)

def make_catalysis_flask():
    clean_scene()
    print("Generating Catalysis Flask...")
    
    # --- 1. Create Flask Vessel ---
    # Flask main sphere radius: 4cm (0.04m), neck radius: 1.25cm (0.0125m), neck height: 6cm (0.06m)
    # Outer bottom sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, segments=32, ring_count=16, location=(0, 0, 0.04))
    outer_sph = bpy.context.active_object
    outer_sph.name = "Flask_Outer_Sph"
    
    # Outer neck cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.0125, depth=0.06, vertices=32, location=(0, 0, 0.09))
    outer_cyl = bpy.context.active_object
    outer_cyl.name = "Flask_Outer_Cyl"
    
    # Join sphere and cylinder
    bpy.ops.object.select_all(action='DESELECT')
    outer_sph.select_set(True)
    outer_cyl.select_set(True)
    bpy.context.view_layer.objects.active = outer_sph
    bpy.ops.object.join()
    
    # Inner bottom sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.038, segments=32, ring_count=16, location=(0, 0, 0.04))
    inner_sph = bpy.context.active_object
    inner_sph.name = "Flask_Inner_Sph"
    
    # Inner neck cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.0105, depth=0.07, vertices=32, location=(0, 0, 0.095))
    inner_cyl = bpy.context.active_object
    inner_cyl.name = "Flask_Inner_Cyl"
    
    # Join inner sphere and cylinder
    bpy.ops.object.select_all(action='DESELECT')
    inner_sph.select_set(True)
    inner_cyl.select_set(True)
    bpy.context.view_layer.objects.active = inner_sph
    bpy.ops.object.join()
    
    # Boolean Difference
    bpy.ops.object.select_all(action='DESELECT')
    outer_sph.select_set(True)
    bpy.context.view_layer.objects.active = outer_sph
    
    bool_mod = outer_sph.modifiers.new(name="Flask_Cut", type='BOOLEAN')
    bool_mod.object = inner_sph
    bool_mod.operation = 'DIFFERENCE'
    bpy.ops.object.modifier_apply(modifier="Flask_Cut")
    
    # Remove inner object
    bpy.data.objects.remove(inner_sph, do_unlink=True)
    
    # Add a torus flared rim at the top of the neck
    bpy.ops.mesh.primitive_torus_add(
        align='WORLD', 
        location=(0, 0, 0.12), 
        major_radius=0.0125, 
        minor_radius=0.0015, 
        major_segments=32, 
        minor_segments=12
    )
    rim = bpy.context.active_object
    rim.name = "Flask_Rim"
    
    # Join rim
    bpy.ops.object.select_all(action='DESELECT')
    outer_sph.select_set(True)
    rim.select_set(True)
    bpy.context.view_layer.objects.active = outer_sph
    bpy.ops.object.join()
    
    # Subdivision modifier
    subsurf = outer_sph.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 2
    subsurf.render_levels = 2
    
    bpy.ops.object.shade_smooth()
    
    glass_mat = create_principled_material("FlaskGlass", base_color=(0.95, 0.98, 1.0, 1.0), roughness=0.02, transmission=1.0, IOR=1.47)
    outer_sph.data.materials.append(glass_mat)
    outer_sph.name = "Flask_Vessel"
    
    # --- 2. Create Catalyst Pellets (Bed at the bottom) ---
    pellets = []
    # Scatter 12 pellets in a dome/bed shape at bottom center of the flask
    # Center of flask sphere is at (0, 0, 0.04), radius of inner sphere is 0.038.
    # The bottom is at Z = 0.042 (with thickness). So we place pellets from Z = 0.008 to Z = 0.020
    random.seed(42) # Deterministic
    pellet_mat = create_principled_material("CatalystPellet", base_color=(0.25, 0.25, 0.28, 1.0), roughness=0.6, metallic=0.7)
    
    for i in range(15):
        # Cylindrical/spherical distribution
        angle = random.uniform(0, 2 * math.pi)
        r = random.uniform(0, 0.022)
        px = r * math.cos(angle)
        py = r * math.sin(angle)
        # Z height fits close to sphere curve: Z = 0.04 - sqrt(0.038^2 - r^2) + offset
        sphere_bottom_z = 0.04 - math.sqrt(max(0.0001, 0.038**2 - r**2))
        pz = sphere_bottom_z + random.uniform(0.002, 0.008)
        
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0035, segments=8, ring_count=8, location=(px, py, pz))
        pellet = bpy.context.active_object
        pellet.name = f"Pellet_{i}"
        pellet.data.materials.append(pellet_mat)
        bpy.ops.object.shade_smooth()
        pellets.append(pellet)
        
    # Join all pellets into a single mesh "Catalyst_Bed"
    bpy.ops.object.select_all(action='DESELECT')
    for p in pellets:
        p.select_set(True)
    bpy.context.view_layer.objects.active = pellets[0]
    bpy.ops.object.join()
    catalyst_bed = bpy.context.active_object
    catalyst_bed.name = "Catalyst_Bed"
    
    export_model([outer_sph, catalyst_bed], "catalysis_flask.glb", glassware_dir)

def make_heating_mantle():
    clean_scene()
    print("Generating Heating Mantle...")
    
    # Outer cylindrical housing: radius 0.055, depth 0.055, location (0,0,0.0275)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=0.055, vertices=64, location=(0, 0, 0.0275))
    outer = bpy.context.active_object
    outer.name = "Mantle_Outer"
    
    # Inner hemisphere cutter for the flask cup: radius 0.0415, centered at (0, 0, 0.040)
    # This leaves a cup that perfectly fits the catalysis flask bottom sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0415, segments=64, ring_count=32, location=(0, 0, 0.041))
    cutter = bpy.context.active_object
    cutter.name = "Mantle_Cutter"
    
    # Difference boolean to carve the flask cup
    bpy.ops.object.select_all(action='DESELECT')
    outer.select_set(True)
    bpy.context.view_layer.objects.active = outer
    
    bool_mod = outer.modifiers.new(name="Cup_Cut", type='BOOLEAN')
    bool_mod.object = cutter
    bool_mod.operation = 'DIFFERENCE'
    bpy.ops.object.modifier_apply(modifier="Cup_Cut")
    bpy.data.objects.remove(cutter, do_unlink=True)
    
    # Add a flat cutter at the top to clean the top rim
    bpy.ops.mesh.primitive_cube_add(size=0.15, location=(0, 0, 0.125))
    rim_cutter = bpy.context.active_object
    
    bpy.ops.object.select_all(action='DESELECT')
    outer.select_set(True)
    bpy.context.view_layer.objects.active = outer
    bool_mod2 = outer.modifiers.new(name="Rim_Cut", type='BOOLEAN')
    bool_mod2.object = rim_cutter
    bool_mod2.operation = 'DIFFERENCE'
    bpy.ops.object.modifier_apply(modifier="Rim_Cut")
    bpy.data.objects.remove(rim_cutter, do_unlink=True)
    
    # Bevel and subdivision for smooth finish
    bevel = outer.modifiers.new(name="Bevel", type='BEVEL')
    bevel.width = 0.001
    bevel.segments = 3
    
    subsurf = outer.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 2
    
    bpy.ops.object.shade_smooth()
    
    # Assign materials. To keep it simple, we create two material slots
    # slot 0: Outer body fabric (dark grey)
    # slot 1: Inner heating core (emissive orange-red)
    fabric_mat = create_principled_material("MantleBody", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.9, metallic=0.1)
    emissive_mat = create_principled_material("HeatingCore", base_color=(0.9, 0.25, 0.0, 1.0), roughness=0.4, metallic=0.0, emission=(0.9, 0.25, 0.0, 1.0), emission_strength=4.0)
    
    outer.data.materials.append(fabric_mat) # Slot 0
    outer.data.materials.append(emissive_mat) # Slot 1
    
    # Assign the inner cup faces to slot 1
    # We can programmatically select faces that are close to the inner cup center
    # All faces whose center distance to (0,0,0.041) is close to 0.0415
    for face in outer.data.polygons:
        # Calculate distance to sphere center
        face_center_world = outer.matrix_world @ face.center
        dx = face_center_world[0]
        dy = face_center_world[1]
        dz = face_center_world[2] - 0.041
        dist = math.sqrt(dx*dx + dy*dy + dz*dz)
        if dist < 0.043 and face.normal[2] < 0.95: # Inner cup surface faces point inwards/upwards
            face.material_index = 1
            
    export_model([outer], "heating_mantle.glb", equipment_dir)

def make_bunsen_burner():
    clean_scene()
    print("Generating Bunsen Burner...")
    
    # Base: Hexagonal or round heavy cast iron plate
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.008, vertices=32, location=(0, 0, 0.004))
    base = bpy.context.active_object
    base.name = "Burner_Base"
    base_mat = create_principled_material("CastIron", base_color=(0.15, 0.15, 0.16, 1.0), roughness=0.7, metallic=0.4)
    base.data.materials.append(base_mat)
    
    # Central stem / gas nozzle base
    bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.015, vertices=16, location=(0, 0, 0.0155))
    stem = bpy.context.active_object
    stem.name = "Burner_Stem"
    brass_mat = create_principled_material("Brass", base_color=(0.75, 0.58, 0.22, 1.0), roughness=0.25, metallic=1.0)
    stem.data.materials.append(brass_mat)
    
    # Air control collar (rotatable ring at bottom of barrel)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.009, depth=0.012, vertices=24, location=(0, 0, 0.027))
    collar = bpy.context.active_object
    collar.name = "Burner_Collar"
    steel_mat = create_principled_material("ChromeSteel", base_color=(0.8, 0.8, 0.82, 1.0), roughness=0.15, metallic=1.0)
    collar.data.materials.append(steel_mat)
    
    # Burner Barrel (main tube)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.007, depth=0.09, vertices=24, location=(0, 0, 0.075))
    barrel = bpy.context.active_object
    barrel.name = "Burner_Barrel"
    barrel.data.materials.append(brass_mat)
    
    # Gas inlet nozzle (side tube extending from stem)
    # Cylinder rotated 90 deg around Y axis
    bpy.ops.mesh.primitive_cylinder_add(radius=0.003, depth=0.022, vertices=16, location=(0.015, 0, 0.015))
    nozzle = bpy.context.active_object
    nozzle.rotation_euler = (0, math.pi/2, 0)
    nozzle.name = "Burner_Nozzle"
    nozzle.data.materials.append(steel_mat)
    
    # Join stem, collar, barrel, nozzle, base
    bpy.ops.object.select_all(action='DESELECT')
    base.select_set(True)
    stem.select_set(True)
    collar.select_set(True)
    barrel.select_set(True)
    nozzle.select_set(True)
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.join()
    
    burner = bpy.context.active_object
    burner.name = "Bunsen_Burner"
    bpy.ops.object.shade_smooth()
    
    export_model([burner], "bunsen_burner.glb", equipment_dir)

def make_bomb_calorimeter():
    clean_scene()
    print("Generating Bomb Calorimeter...")
    
    # Outer insulated water jacket container: cylinder of radius 0.065, height 0.13
    bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.13, vertices=48, location=(0, 0, 0.065))
    outer = bpy.context.active_object
    outer.name = "Calorimeter_Jacket"
    jacket_mat = create_principled_material("BluePlastic", base_color=(0.1, 0.35, 0.65, 1.0), roughness=0.35, metallic=0.0)
    outer.data.materials.append(jacket_mat)
    
    # Metal rim / lid adapter at top
    bpy.ops.mesh.primitive_cylinder_add(radius=0.066, depth=0.01, vertices=48, location=(0, 0, 0.13))
    rim = bpy.context.active_object
    rim.name = "Calorimeter_Rim"
    steel_mat = create_principled_material("CalorimeterSteel", base_color=(0.85, 0.85, 0.87, 1.0), roughness=0.2, metallic=1.0)
    rim.data.materials.append(steel_mat)
    
    # Lid: cylinder radius 0.066, depth 0.015, location (0, 0, 0.14)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.066, depth=0.015, vertices=48, location=(0, 0, 0.1375))
    lid = bpy.context.active_object
    lid.name = "Calorimeter_Lid"
    lid_mat = create_principled_material("GreyPlastic", base_color=(0.2, 0.2, 0.22, 1.0), roughness=0.5, metallic=0.0)
    lid.data.materials.append(lid_mat)
    
    # Screen / control panel on the side of the jacket
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.064, 0.07))
    screen_box = bpy.context.active_object
    screen_box.name = "Calorimeter_ScreenBox"
    screen_box.scale = (0.04, 0.006, 0.035)
    screen_box.data.materials.append(lid_mat)
    
    # Glass screen panel
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0, -0.0675, 0.07))
    screen_panel = bpy.context.active_object
    screen_panel.name = "Calorimeter_ScreenDisplay"
    screen_panel.scale = (0.035, 0.028, 1.0)
    screen_panel.rotation_euler = (math.pi/2, 0, 0)
    lcd_mat = create_principled_material("CalorimeterLCD", base_color=(0.01, 0.01, 0.01, 1.0), roughness=0.1, metallic=0.0, emission=(0.0, 0.4, 0.08, 1.0), emission_strength=1.5)
    screen_panel.data.materials.append(lcd_mat)
    
    # Stirrer motor cap on top of lid
    bpy.ops.mesh.primitive_cylinder_add(radius=0.014, depth=0.02, vertices=24, location=(0.025, 0, 0.155))
    motor = bpy.context.active_object
    motor.name = "Calorimeter_Motor"
    motor.data.materials.append(lid_mat)
    
    # Thermometer probe housing extending from lid top
    bpy.ops.mesh.primitive_cylinder_add(radius=0.003, depth=0.04, vertices=12, location=(-0.025, 0, 0.165))
    probe = bpy.context.active_object
    probe.name = "Calorimeter_Probe"
    probe.data.materials.append(steel_mat)
    
    # Join all calorimeter subcomponents
    bpy.ops.object.select_all(action='DESELECT')
    outer.select_set(True)
    rim.select_set(True)
    lid.select_set(True)
    screen_box.select_set(True)
    screen_panel.select_set(True)
    motor.select_set(True)
    probe.select_set(True)
    bpy.context.view_layer.objects.active = outer
    bpy.ops.object.join()
    
    calorimeter = bpy.context.active_object
    calorimeter.name = "Bomb_Calorimeter"
    bpy.ops.object.shade_smooth()
    
    export_model([calorimeter], "bomb_calorimeter.glb", equipment_dir)

def make_chn_analyzer():
    clean_scene()
    print("Generating CHN Analyzer...")
    
    # Main cabinet housing: W 16cm, D 16cm, H 18cm (represented as 0.16 x 0.16 x 0.18 units)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.09))
    cab = bpy.context.active_object
    cab.scale = (0.16, 0.16, 0.18)
    cab.name = "CHN_Cabinet"
    cab_mat = create_principled_material("CabinetMetal", base_color=(0.88, 0.88, 0.90, 1.0), roughness=0.3, metallic=0.2)
    cab.data.materials.append(cab_mat)
    
    # Side glass combustion tube viewport chamber
    # Outer transparent glass cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.016, depth=0.15, vertices=32, location=(0.055, -0.05, 0.09))
    viewport_glass = bpy.context.active_object
    viewport_glass.name = "CHN_Viewport_Glass"
    glass_mat = create_principled_material("ViewportGlass", base_color=(0.95, 0.98, 1.0, 1.0), roughness=0.05, transmission=0.92, IOR=1.47)
    viewport_glass.data.materials.append(glass_mat)
    
    # Combustion tube catalyst bed inside viewport
    bpy.ops.mesh.primitive_cylinder_add(radius=0.010, depth=0.05, vertices=24, location=(0.055, -0.05, 0.06))
    inner_bed = bpy.context.active_object
    inner_bed.name = "CHN_Catalyst_Bed"
    catalyst_mat = create_principled_material("CHNCatalyst", base_color=(0.85, 0.35, 0.1, 1.0), roughness=0.5, metallic=0.6, emission=(0.85, 0.35, 0.1, 1), emission_strength=2.0)
    inner_bed.data.materials.append(catalyst_mat)
    
    # Sloped front console panel: create a cube and rotate/position
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.075, 0.07))
    console = bpy.context.active_object
    console.name = "CHN_Console"
    console.scale = (0.10, 0.01, 0.06)
    console.rotation_euler = (-math.pi/12, 0, 0) # 15 degree forward slope
    console_mat = create_principled_material("CHNConsolePlastic", base_color=(0.15, 0.15, 0.17, 1.0), roughness=0.5, metallic=0.0)
    console.data.materials.append(console_mat)
    
    # Digital LCD display screen on the console
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0, -0.081, 0.075))
    screen = bpy.context.active_object
    screen.name = "CHN_Screen"
    screen.scale = (0.08, 0.045, 1.0)
    screen.rotation_euler = (math.pi/2 - math.pi/12, 0, 0)
    lcd_mat = create_principled_material("CHN_LCD", base_color=(0.0, 0.02, 0.0, 1.0), roughness=0.1, metallic=0.0, emission=(0.02, 0.3, 0.8, 1.0), emission_strength=1.8)
    screen.data.materials.append(lcd_mat)
    
    # Sample insertion slot on front face
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.03, -0.081, 0.14))
    slot = bpy.context.active_object
    slot.name = "CHN_Slot"
    slot.scale = (0.05, 0.005, 0.015)
    slot_mat = create_principled_material("SlotBlack", base_color=(0.02, 0.02, 0.02, 1.0), roughness=0.9, metallic=0.0)
    slot.data.materials.append(slot_mat)
    
    # Join cabinet parts (except glass viewport and catalyst bed for rendering/transparency order in three.js)
    bpy.ops.object.select_all(action='DESELECT')
    cab.select_set(True)
    console.select_set(True)
    screen.select_set(True)
    slot.select_set(True)
    bpy.context.view_layer.objects.active = cab
    bpy.ops.object.join()
    
    chn_cabinet = bpy.context.active_object
    chn_cabinet.name = "CHN_Cabinet_Base"
    bpy.ops.object.shade_smooth()
    bpy.ops.object.select_all(action='DESELECT')
    viewport_glass.select_set(True)
    bpy.ops.object.shade_smooth()
    bpy.ops.object.select_all(action='DESELECT')
    inner_bed.select_set(True)
    bpy.ops.object.shade_smooth()
    
    export_model([chn_cabinet, viewport_glass, inner_bed], "chn_analyzer.glb", equipment_dir)

if __name__ == "__main__":
    make_catalysis_flask()
    make_heating_mantle()
    make_bunsen_burner()
    make_bomb_calorimeter()
    make_chn_analyzer()
    print("All catalysis and combustion assets generated successfully!")
