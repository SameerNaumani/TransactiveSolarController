#Modules
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import *
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import random
from itertools import islice
import tkinter.messagebox
import mplcursors

import time
from firebase import firebase
from datetime import datetime,timedelta, time
import random
import requests
#Modules End


#initalizes the firebase database and connects to it
firebase = firebase.FirebaseApplication('ENTER YOUR OWN FIREBASE LINK', None)  # Enter your own link!!

#todays date
todays_date = datetime.date(datetime.now())

#stores the directory to take the data from
Power_Data = firebase.get('/Power/' + str(todays_date), None)

def avg_power():
    count = 0
    Power_Data = firebase.get('/Power/' + str(todays_date), None)     #stores the directory to take the data from

    if len(Power_Data) <15:
        intervals = len(Power_Data) #stores the number of intervals under 'power'
    else:
        intervals = 15

    #adds up all the values for the 15 most recent intervals in count
    for x in list(reversed(list(Power_Data)))[0:15]:
          count = count + float(Power_Data[x])
    
    #Avg Power Label and Value Display
    avg_power_value = round(count/intervals,2)
    avg_power_label = Label(frame,text="Avg Power: " + str(round(count/intervals,2)) + " kW",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    avg_power_label.place(x=20,y=150)
    return avg_power_value
    

    window.after(10000,avg_power) #runs function every 10s
    return count

def avg_voltage_current():
    count1 = 0
    count2 = 0

    Voltage_Data = firebase.get('/Voltage/' + str(todays_date), None)     #stores the directory to take the data from
    Current_Data = firebase.get('/Current/' + str(todays_date), None)     #stores the directory to take the data from

    if len(Voltage_Data) <15:
        voltage_intervals = len(Voltage_Data) #stores the number of intervals under 'power'
    else:
        voltage_intervals = 15

    if len(Current_Data) <15:
        current_intervals = len(Current_Data) #stores the number of intervals under 'power'
    else:
        current_intervals = 15


    for x in list(reversed(list(Voltage_Data)))[0:15]:
        count1 = count1 + float(Voltage_Data[x])

    for x in list(reversed(list(Current_Data)))[0:15]:
        count2 = count2 + float(Current_Data[x])
    
    #Avg Voltage Label and Value Display
    avg_power_label = Label(frame,text="Avg Voltage: " + str(round(count1/voltage_intervals,2)) + " V",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    avg_power_label.place(x=20,y=190)

    #Avg Current Label and Value Display
    avg_power_label = Label(frame,text="Avg Current: " + str(round(count2/current_intervals,2)) + " A",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    avg_power_label.place(x=20,y=230)

    window.after(10000,avg_voltage_current) #runs function every 10s


#Energy Price taken from IESO website
def HOEP():
     Market_Price = random.uniform(0.48, 2.79)
     Market_Price_Label = Label(frame,text="Market Price: " + str(round(Market_Price,2)) + " ¢/kwh",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
     Market_Price_Label.place(x=20,y=60)

    #Todays Date Display
     Date_Today = Label(frame,text="Date: "+str(todays_date),fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
     Date_Today.place(x=20,y=20)
     return Market_Price
     
#Unused Right Now
def table():
    df = pd.DataFrame(sorted(Power_Data.items()), columns = ["Date", "Power"])
    print(df)
    number1 = Label(frame,text=df,bg="white")
    number1.pack()

def Weather_API():
     api_address='http://api.openweathermap.org/data/2.5/weather?appid=c171ea3e2e30b0dc425db8b1d5f42649&q=Toronto'
     #city = raw_input("City Name : ")
     url = api_address #+ city
     json_data = requests.get(url).json()
     Weather_API.temperature = json_data['main']['temp'] - 273.15  #gets temperature
     Weather_API.weather = str(json_data['weather'][0]['main'])  #cloudy,hazy etc
     Weather_API.cloudp = str(json_data['clouds']['all']) 
     #Weather_API.Temp = Label(frame,text=Weather_API.temperature,bg="gray")
     
     #Temperature Label and Display
     Temperature_Display = Label(frame,text = "Weather: " + str(round(Weather_API.temperature)) + " Degrees, ",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold')) 
     Temperature_Display.place(x=20,y=100)
     #Weather Label and Display
     Weather_Display = Label(frame,text = str(Weather_API.weather),fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold')) 
     Weather_Display.place(x=152.5,y=100)

     window.after(10000,Weather_API) #runs this function every 10s


def Compare():
    Weather_API()
    TimeNow_PlusBid = datetime.now() + timedelta(hours=float(Hours_Bid_Entry_Box.get()))
    TimeNow_PlusBid = format(TimeNow_PlusBid, '%H:%M:%S')
    Sunset_Time = time(19,56,00)

    if (float(avg_power()) > float(Energy_Bid_Entry_Box.get()) and TimeNow_PlusBid < str(Sunset_Time)):
        if (float(Weather_API.cloudp) < 50 and (float(Production_Amount_Entry_Box.get()) < HOEP())):  
            tkinter.messagebox.showinfo('Decision','Energy CAN be provided!')
        else:
            tkinter.messagebox.showinfo('Decision','Energy CANNOT be provided!')
    else:
            tkinter.messagebox.showinfo('Decision','Energy CANNOT be provided!')
   

def display_entries():
    #Energy Bid Display
    Energy_Display_Bid = Label(window,text= str(float(Energy_Bid_Entry_Box.get()))+" kW",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 10,'bold'))
    Energy_Display_Bid.place(x=115,y=50)

    Hours_Display_Bid = Label(window,text= str(float(Hours_Bid_Entry_Box.get()))+" h",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 10,'bold'))
    Hours_Display_Bid.place(x=420,y=50)
    
    Production_Amount_Display = Label(window,text= str(float(Production_Amount_Entry_Box.get()))+" ¢/kwh",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 10,'bold'))
    Production_Amount_Display.place(x=735,y=50)

    Energy_Bid_Entry_Box.delete(0,'end')
    Hours_Bid_Entry_Box.delete(0,'end')
    Production_Amount_Entry_Box.delete(0,'end')



def display_and_compare():
    Compare()
    display_entries()

def take(n, iterable):
    "Return first n items of the iterable as a list"
    return list(islice(iterable, n))

def animate(i):
    
    Power_Data = firebase.get('/Power/' + str(todays_date), None)
    Voltage_Data = firebase.get('/Voltage/' + str(todays_date), None)
    Current_Data = firebase.get('/Current/' + str(todays_date), None)
    PF_Data = firebase.get('/PF/' + str(todays_date), None)

    Power_List = take(len(Power_Data),Power_Data.items()) #makes a list to later sort the data (to get 15 recent items)
    Power_List_to_Dict = sorted(dict(Power_List[-15:]).items()) #convert to list and get 15 most recent intervals
    x_power,y_power = zip(*Power_List_to_Dict)

    Voltage_List = take(len(Voltage_Data),Voltage_Data.items()) #makes a list to later sort the data (to get 15 recent items)
    Voltage_List_to_Dict = sorted(dict(Voltage_List[-15:]).items()) #convert to list and get 15 most recent intervals
    x_voltage,y_voltage = zip(*Voltage_List_to_Dict)

    Current_List = take(len(Current_Data),Current_Data.items()) #makes a list to later sort the data (to get 15 recent items)
    Current_List_to_Dict = sorted(dict(Current_List[-15:]).items()) #convert to list and get 15 most recent intervals
    x_current,y_current = zip(*Current_List_to_Dict)

    PF_List = take(len(PF_Data),PF_Data.items()) #makes a list to later sort the data (to get 15 recent items)
    PF_List_to_Dict = sorted(dict(PF_List[-15:]).items()) #convert to list and get 15 most recent intervals
    x_PF,y_PF = zip(*PF_List_to_Dict)


    ax = fig.add_subplot(411)
    ax.cla()
    ax.set_ylabel('Real Power')
    #ax.set_facecolor("azure")

    ax1 = fig.add_subplot(412)
    ax1.cla()
    ax1.set_ylabel('Voltage')
    #ax1.grid()
    
    ax2 = fig.add_subplot(413)
    ax2.cla()
    ax2.set_ylabel('Current')

    ax3 = fig.add_subplot(414)
    ax3.cla()
    ax3.set_ylabel('Power Factor')

    line, = ax.plot(x_power, y_power)
    line1, = ax1.plot(x_voltage, y_voltage)
    line2, = ax2.plot(x_current, y_current)
    line3, = ax3.plot(x_PF, y_PF)
    
    mplcursors.cursor()

    #title = "Power vs Time (" + str(todays_date) + ")"
    #fig.suptitle(title)

fig = plt.figure(figsize=(10,8))
fig.patch.set_facecolor("#FBEAEB")


window = Tk()
window.title('Solar Controller UI')

canvas = Canvas(window,height=750, width=1200,bg="#2F3C7E")
canvas.pack()

frame = Frame(window, bg="#FBEAEB")
frame.place(relwidth=0.978,relheight=0.88,relx=0.01,rely=0.1)

line = Frame(window, bg="#B7B0C7")
line.place(relwidth=0.01,relheight=0.88,relx=0.2,rely=0.1)

line = Frame(window, bg="#B7B0C7")
line.place(relwidth=0.2,relheight=0.01,relx=0.01,rely=0.275)

line = Frame(window, bg="#B7B0C7")
line.place(relwidth=0.2,relheight=0.01,relx=0.01,rely=0.45)



#--Energy Bid Structure--
Energy_Bid_Label = Label(window,text="Enter Bid (kW):",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 11,'bold'))
Energy_Bid_Label.place(x=20,y=20)

Energy_Bid_Entry_Box = Entry(window,text="entry",bd=2,width=15)
Energy_Bid_Entry_Box.place(x=135,y=20)

Energy_Bid_Entered = Label(window,text="Current Bid:",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 10,'bold'))
Energy_Bid_Entered.place(x=35,y=50)

#-Hours Bid Structure--
Hours_Bid_Label = Label(window,text="Enter Hours:",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 11,'bold'))
Hours_Bid_Label.place(x=290,y=20)

Hours_Bid_Entry_Box = Entry(window,text="entry1",bd=2,width=15)
Hours_Bid_Entry_Box.place(x=395,y=20)

Hours_Bid_Entered = Label(window,text="Current Hour Bid:",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 10,'bold'))
Hours_Bid_Entered.place(x=305,y=50)

#--Production Amount Structure--
Production_Amount_Label = Label(window,text="Production Price (¢/kwh):",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 11,'bold'))
Production_Amount_Label.place(x=540,y=20)

Production_Amount_Entry_Box = Entry(window,text="entry2",bd=2,width=15)
Production_Amount_Entry_Box.place(x=725,y=20)

Production_Amount_Entered = Label(window,text="Current Production Price:",fg="#FBEAEB",bg="#2F3C7E",font=('Helvetica', 10,'bold'))
Production_Amount_Entered.place(x=570,y=50)

#Submit Button
Submit_btn = Button(window,text="Submit Bid",fg="black",font=('Helvetica', 10,'bold'),command=display_and_compare)
Submit_btn.place(x=880,y=23)

def Relay_ON():
    Relay_Status = firebase.get('/Relay/State',None)

    #Relay_Change = Label(frame,text="Relay State: "+str(Relay_Status),fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    #Relay_Change.place(x=20,y=240)

    Relay_Change = Label(frame,text="Relay State: ON",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    Relay_Change.place(x=20,y=280)
    resulti = firebase.put('/Relay','State','ON')

    Relay_btn = Button(frame,text="Turn Off",fg="red",font=('Helvetica', 10,'bold'),command=Relay_OFF)
    Relay_btn.place(x=20,y=310)


        
def Relay_OFF():
    Relay_Status = firebase.get('/Relay/State',None)

    Relay_Change = Label(frame,text="Relay State: OFF",fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
    Relay_Change.place(x=20,y=280)
    resulti = firebase.put('/Relay','State','OFF')

    Relay_btn = Button(frame,text="Turn On",fg="green",font=('Helvetica', 10,'bold'),command=Relay_ON)
    Relay_btn.place(x=20,y=310)



#Relay Button
Relay_Status = firebase.get('/Relay/State',None)
Relay_Change = Label(frame,text="Relay State: " + str(Relay_Status),fg="#2F3C7E",bg="#FBEAEB",font=('Helvetica', 10,'bold'))
Relay_Change.place(x=20,y=280)
    
if(str(Relay_Status) == "ON"):
    Relay_btn = Button(frame,text="Turn Off",fg="red",font=('Helvetica', 10,'bold'),command=Relay_OFF)
    Relay_btn.place(x=20,y=310)

elif(str(Relay_Status) == "OFF"):
    Relay_btn = Button(frame,text="Turn On",fg="green",font=('Helvetica', 10,'bold'),command=Relay_ON)
    Relay_btn.place(x=20,y=310)

    

canvas = FigureCanvasTkAgg(fig, master=frame)
canvas.get_tk_widget().place(x=220,y=-75)

HOEP() #calling market price display

window.after(0,Weather_API)
window.after(0,avg_power)
window.after(0,avg_voltage_current)


ani = animation.FuncAnimation(fig, animate, interval=10000)

window.mainloop()









