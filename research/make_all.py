import os, sys, base64
sys.stdout.reconfigure(encoding="utf-8") if hasattr(sys.stdout,"reconfigure") else None
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,content):
 open(os.path.join(d,fn),"w",encoding="utf-8").write(content)
 print(f"Created: {fn}",flush=True)
def build_reduce():
 s="""# Reduce - Chemistry Lab Operation
## Purpose
Reduction causes a substance to gain electrons, decreasing its oxidation state. Used to convert metal oxides to metals, reduce aldehydes/ketones to alcohols, nitro compounds to amines, and prepare lower-valence species.
## How It Works
Reductants donate electrons to the target species. Mechanisms include hydrogenation (H2 + catalyst), hydride transfer (NaBH4, LiAlH4), metal reduction (Na, Zn, Fe), electrochemical reduction, and biochemical reduction (NADH/NADPH).
## Setup
Reaction vessel, stirrer, temperature control, inert gas system, addition funnel, condenser, electrochemical cell or hydrogenation apparatus.
## Usage
Dissolve substrate, set up inert atmosphere, add reductant slowly, monitor by TLC/GC, quench excess, extract, purify.
"""
 w("reduce.md",s)
build_reduce()
print("Done")
