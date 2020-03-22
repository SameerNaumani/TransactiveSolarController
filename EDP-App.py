from tkinter import *
import time

from firebase import firebase
from datetime import datetime
import random


#initalizes the firebase database and connects to it
firebase = firebase.FirebaseApplication('https://edp-project-42920.firebaseio.com/', None)

#todays date
todays_date = datetime.date(datetime.now())

#stores the directory to take the data from
data3 = firebase.get('/Power/' + str(todays_date), None)

root = Tk()

canvas = tk.Canvas(root,height=700, width=700,bg="#263D42")
canvas.pack()

frame = tk.Frame(root, bg="white")
frame.place(relwidth=0.8,relheight=0.8,relx=0.1,rely=0.1)

#Counts the total kwh generated for a certain day
def count_kwh():
    count = 0
    #stores the directory to take the data from
    data3 = firebase.get('/Power/' + str(todays_date), None)

    for x in list(data3)[0:len(data3)]:
          count = count + int(data3[x])
    
    number = Label(root,text=count)
    number.pack()    
    root.after(10000,count_kwh)

#root.after(0,count_kwh)
root.mainloop()





#label = tk.Label(frame,text=count,bg="gray")
#label.pack()






