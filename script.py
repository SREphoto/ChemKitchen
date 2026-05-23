import os
import base64
os.makedirs("research/equipment",exist_ok=True)
def w(fn,c):
 with open(fn,"w",encoding="utf-8") as f:
  f.write(base64.b64decode(c).decode())
 print("Created:",fn)
