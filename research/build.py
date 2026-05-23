import base64, os
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,data):
    with open(os.path.join(d,fn),"w",encoding="utf-8") as f:
        f.write(base64.b64decode(data).decode("utf-8"))
    print("Created: "+fn)