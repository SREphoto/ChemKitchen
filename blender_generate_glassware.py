import bpy
import os

# Set output path
output_dir = r"r:\Antigravity Multiple\ChemKitchen\ChemKitchen\public\models\glassware"
os.makedirs(output_dir, exist_ok=True)

def clean_scene():
    # Make sure we are in object mode
    if bpy.ops.object.mode_set.poll():
        bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def add_glass_material(obj, name="Glass"):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    for node in list(nodes):
        nodes.remove(node)
        
    # Create Principled BSDF
    node_output = nodes.new(type='ShaderNodeOutputMaterial')
    node_output.location = (300, 0)
    
    node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    node_principled.location = (0, 0)
    
    # Set inputs for glass transparency in Blender 4.x
    if "Roughness" in node_principled.inputs:
        node_principled.inputs["Roughness"].default_value = 0.02
    if "Transmission Weight" in node_principled.inputs:
        node_principled.inputs["Transmission Weight"].default_value = 1.0
    elif "Transmission" in node_principled.inputs:
        node_principled.inputs["Transmission"].default_value = 1.0
        
    if "IOR" in node_principled.inputs:
        node_principled.inputs["IOR"].default_value = 1.45
        
    # In Blender 4.0+, transmission is set via weight. Let's also set Base Color to slight cyan tint.
    if "Base Color" in node_principled.inputs:
        node_principled.inputs["Base Color"].default_value = (0.95, 0.98, 1.0, 1.0)
        
    links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])
    obj.data.materials.append(mat)

def make_beaker():
    clean_scene()
    print("Generating Beaker...")
    
    # Beaker height: 9cm (0.09m), radius: 3cm (0.03m)
    # Outer cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.09, vertices=64, location=(0, 0, 0.045))
    outer = bpy.context.active_object
    outer.name = "Beaker_Outer"
    
    # Inner cylinder for carving (2mm walls, 2mm bottom)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.028, depth=0.09, vertices=64, location=(0, 0, 0.047))
    inner = bpy.context.active_object
    inner.name = "Beaker_Inner"
    
    # Boolean Difference
    bpy.context.view_layer.objects.active = outer
    bool_mod = outer.modifiers.new(name="Beaker_Cut", type='BOOLEAN')
    bool_mod.object = inner
    bool_mod.operation = 'DIFFERENCE'
    bpy.ops.object.modifier_apply(modifier="Beaker_Cut")
    
    # Remove inner object
    bpy.data.objects.remove(inner, do_unlink=True)
    
    # Select active beaker again
    bpy.context.view_layer.objects.active = outer
    outer.select_set(True)
    
    # Add Bevel modifier to protect flat edges
    bevel = outer.modifiers.new(name="Bevel", type='BEVEL')
    bevel.width = 0.0005
    bevel.segments = 2
    bevel.limit_method = 'ANGLE'
    bevel.angle_limit = 0.7  # ~40 degrees
    
    # Add Subdivision Surface
    subsurf = outer.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 2
    subsurf.render_levels = 2
    
    bpy.ops.object.shade_smooth()
    
    add_glass_material(outer, "BeakerGlass")
    
    filepath = os.path.join(output_dir, "beaker.glb")
    # Export with Draco compression
    bpy.ops.export_scene.gltf(
        filepath=filepath, 
        export_format='GLB', 
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6
    )
    print("Exported Beaker to", filepath)

def make_test_tube():
    clean_scene()
    print("Generating Test Tube...")
    
    # Test tube height: 12cm (0.12m), radius: 1.25cm (0.0125m)
    # Outer cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.0125, depth=0.1075, vertices=32, location=(0, 0, 0.06625))
    outer_cyl = bpy.context.active_object
    outer_cyl.name = "Tube_Cyl"
    
    # Outer bottom sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0125, segments=32, ring_count=16, location=(0, 0, 0.0125))
    outer_sph = bpy.context.active_object
    outer_sph.name = "Tube_Sph"
    
    # Join cylinder and sphere
    bpy.ops.object.select_all(action='DESELECT')
    outer_cyl.select_set(True)
    outer_sph.select_set(True)
    bpy.context.view_layer.objects.active = outer_cyl
    bpy.ops.object.join()
    
    # Inner cylinder for carving
    bpy.ops.mesh.primitive_cylinder_add(radius=0.011, depth=0.1075, vertices=32, location=(0, 0, 0.06775))
    inner_cyl = bpy.context.active_object
    inner_cyl.name = "Tube_Inner_Cyl"
    
    # Inner bottom sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.011, segments=32, ring_count=16, location=(0, 0, 0.014))
    inner_sph = bpy.context.active_object
    inner_sph.name = "Tube_Inner_Sph"
    
    # Join inner cylinder and sphere
    bpy.ops.object.select_all(action='DESELECT')
    inner_cyl.select_set(True)
    inner_sph.select_set(True)
    bpy.context.view_layer.objects.active = inner_cyl
    bpy.ops.object.join()
    
    # Boolean Difference
    bpy.ops.object.select_all(action='DESELECT')
    outer_cyl.select_set(True)
    bpy.context.view_layer.objects.active = outer_cyl
    
    bool_mod = outer_cyl.modifiers.new(name="Tube_Cut", type='BOOLEAN')
    bool_mod.object = inner_cyl
    bool_mod.operation = 'DIFFERENCE'
    bpy.ops.object.modifier_apply(modifier="Tube_Cut")
    
    # Remove inner object
    bpy.data.objects.remove(inner_cyl, do_unlink=True)
    
    # Add a torus flared rim at the top
    bpy.ops.mesh.primitive_torus_add(
        align='WORLD', 
        location=(0, 0, 0.12), 
        major_radius=0.0125, 
        minor_radius=0.0015, 
        major_segments=32, 
        minor_segments=12
    )
    rim = bpy.context.active_object
    rim.name = "Tube_Rim"
    
    # Join rim
    bpy.ops.object.select_all(action='DESELECT')
    outer_cyl.select_set(True)
    rim.select_set(True)
    bpy.context.view_layer.objects.active = outer_cyl
    bpy.ops.object.join()
    
    # Subdivision modifier
    subsurf = outer_cyl.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 2
    subsurf.render_levels = 2
    
    bpy.ops.object.shade_smooth()
    
    add_glass_material(outer_cyl, "TubeGlass")
    
    filepath = os.path.join(output_dir, "test_tube.glb")
    bpy.ops.export_scene.gltf(
        filepath=filepath, 
        export_format='GLB', 
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6
    )
    print("Exported Test Tube to", filepath)

def make_round_bottom_flask():
    clean_scene()
    print("Generating Round Bottom Flask...")
    
    # Flask main sphere radius: 4cm (0.04m), neck radius: 1.25cm (0.0125m), neck height: 6cm (0.06m)
    # Outer bottom sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, segments=32, ring_count=16, location=(0, 0, 0.04))
    outer_sph = bpy.context.active_object
    outer_sph.name = "Flask_Sph"
    
    # Outer neck cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.0125, depth=0.06, vertices=32, location=(0, 0, 0.09))
    outer_cyl = bpy.context.active_object
    outer_cyl.name = "Flask_Cyl"
    
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
    
    add_glass_material(outer_sph, "FlaskGlass")
    
    filepath = os.path.join(output_dir, "round_bottom_flask.glb")
    bpy.ops.export_scene.gltf(
        filepath=filepath, 
        export_format='GLB', 
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6
    )
    print("Exported Round Bottom Flask to", filepath)

if __name__ == "__main__":
    make_beaker()
    make_test_tube()
    make_round_bottom_flask()
    print("All glassware assets generated successfully!")
