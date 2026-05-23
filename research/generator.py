import os
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,c):
    open(os.path.join(d,fn),"w",encoding="utf-8").write(c)
    print("Created: "+fn)
