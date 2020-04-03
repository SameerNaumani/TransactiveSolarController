# --- Imports
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import *
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import random
from itertools import islice


import time
from firebase import firebase
from datetime import datetime
import random
import requests
# --- End of imports

#initalizes the firebase database and connects to it
firebase = firebase.FirebaseApplication('https://edp-project-42920.firebaseio.com/', None)

#todays date
todays_date = datetime.date(datetime.now())

#initializes figure for graph
fig = plt.Figure()  

#Return first n items of the iterable as a list
def take(n, iterable):
        return list(islice(iterable, n))


#graphing method
def animate(i):
    
    data3 = firebase.get('/Power/' + str(todays_date), None)

    n_items = take(len(data3),data3.items())
    lists = sorted(dict(n_items[-15:]).items())
    x,y = zip(*lists)

    ax = fig.add_subplot(111)
    ax.cla()
    ax.set_ylabel('Real Power')
    #ax.set_facecolor("azure")

    line, = ax.plot(x, y)


root = Tk()

c = Canvas(root,height=700, width=700,bg="white")
c.pack()

frame = Frame(root, bg="blue")
frame.place(relwidth=0.9,relheight=0.85,relx=0.05,rely=0.1)

canvas = FigureCanvasTkAgg(fig, master=frame)
canvas.get_tk_widget().place(x=10,y=100)

#used to update graph every 1 second
ani = animation.FuncAnimation(fig, animate, interval=1000)  #calls fig, runs function animte every 1second

root.mainloop()