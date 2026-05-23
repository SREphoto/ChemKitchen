import os, base64
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,b64):
    with open(os.path.join(d,fn),"w",encoding="utf-8") as f:
        f.write(base64.b64decode(b64).decode("utf-8"))
    print("Created: "+fn)
print("loaded")
# --- reduce ---
w("reduce.md","import base64,os; d=os.path.join(os.path.dirname(__file__),"equipment"); os.makedirs(d,exist_ok=True); print("done")"[:1])
