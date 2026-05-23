import base64,os
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,b):
 open(os.path.join(d,fn),"wb").write(base64.b64decode(b))
 print("Created: "+fn)
