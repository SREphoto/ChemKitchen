import os
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(f,c):
    with open(os.path.join(d,f),"w",encoding="utf-8") as fh:
        fh.write(c)
    print("Created: "+f)
