#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os

d = os.path.join(os.path.dirname(__file__), "equipment")
os.makedirs(d, exist_ok=True)

def write_file(fn, content):
    with open(os.path.join(d, fn), "w", encoding="utf-8") as f:
        f.write(content)
    print("Created " + fn)

print("Helper loaded")
