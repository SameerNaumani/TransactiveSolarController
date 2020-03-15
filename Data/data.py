import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

df = pd.read_excel (r'test_data.xlsx')
#df = pd.DataFrame(dataset)

print(df)

print(df.columns)

volt = df[["Voltage"]]
print(volt)

curr = df[["Current"]]
print(curr)

#def power(self, voltage[], current[]):
 #   for val in voltage:
  #      for val in current
   # power[] = voltage * current
    