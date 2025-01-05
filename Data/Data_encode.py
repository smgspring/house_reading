import os
import pandas as pd

files = []
for i in range(1, 4):
    for j in range(2020, 2025):
        files.append(f"Data/Type{i}_{j}.csv")

for file in files:
    try:
        df = pd.read_csv(file, encoding='euc-kr', skiprows=15)
        df.to_csv(file, encoding='utf-8', index=False)
    except Exception as e:
        print(file)
        print(e)