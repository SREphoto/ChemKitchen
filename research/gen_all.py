import base64,os
d=os.path.join(os.path.dirname(__file__),"equipment")
os.makedirs(d,exist_ok=True)
def w(fn,data):
 with open(os.path.join(d,fn),"wb") as f:
  f.write(base64.b64decode(data))
 print("Created:"+fn)
print("Ready")
