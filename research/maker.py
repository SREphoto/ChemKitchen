import os
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,c):
 with open(os.path.join(d,fn),"w",encoding="utf-8") as f: f.write(c)
 print("Created: "+fn)
def r(fn):
 return open(os.path.join(d,fn),"r",encoding="utf-8").read()
