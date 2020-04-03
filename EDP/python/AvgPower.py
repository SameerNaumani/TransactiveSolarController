#!/usr/bin/env python
#Modules
#from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import *
#import numpy as np
#import matplotlib.pyplot as plt
#import matplotlib.animation as animation
import random
from itertools import islice
import tkinter.messagebox
#import mplcursors

import time
from firebase import firebase
from datetime import datetime
import random
import requests
#Modules End

#initalizes the firebase database and connects to it
firebase = firebase.FirebaseApplication('https://test-1-85a78.firebaseio.com/', None)

#todays date
todays_date = datetime.date(datetime.now())

def avg_power():
    count = 0
    Power_Data = firebase.get('/Power/' + str(todays_date), None)     #stores the directory to take the data from
    
    intervals = len(Power_Data) #stores the number of intervals under 'power'

    #adds up all the values for the 15 most recent intervals in count
    for x in list(reversed(list(Power_Data)))[0:15]:
          count = count + int(Power_Data[x])
    
    #Avg Power Label and Value Display
    avg_power = round(count/intervals,2)
    avg_power_label = Label(frame,text="Avg Power: " + str(round(count/intervals,2)) + " kW",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    avg_power_label.place(x=20,y=110)
    
    window.after(10000,avg_power) #runs function every 10s
    return avg_power

window = Tk()
window.title('Solar Controller UI')

canvas = Canvas(window,height=750, width=1200,bg="#2F3C7E")
canvas.pack()


frame = Frame(window, bg="#FBEAEB")
frame.place(relwidth=0.978,relheight=0.88,relx=0.01,rely=0.1)

window.after(0,avg_power)

window.mainloop()