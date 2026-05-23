import os
os.makedirs("research/equipment",exist_ok=True)
def w(fn,t):
 with open(fn,"w",encoding="utf-8") as f:
  for L in t:
   f.write(L+chr(10))
 print("Wrote:",fn)
print("gen_equip.py loaded")
