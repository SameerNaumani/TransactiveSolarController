#modules needed
from firebase import firebase
from datetime import datetime
import matplotlib.pylab as plt
import pandas as pd
import requests
import random

#initalizes the firebase database and connects to it
firebase = firebase.FirebaseApplication('https://edp-project-42920.firebaseio.com/', None)

#todays date
todays_date = datetime.date(datetime.now())

#stores the directory to take the data from
data3 = firebase.get('/Power/' + str(todays_date), None)

#Counts the total kwh generated for a certain day
def count_kwh():
     count = 0
     for x in list(data3)[0:len(data3)]:
          count = count + int(data3[x])
     return(count)

#Plots the data in the database
def plot():
     lists = sorted(data3.items())
     x,y = zip(*lists)
     plt.plot(x,y)
     plt.show()
    
#Controls the relay state (ON or OFF)
def Relay():
     if(data > 0):
          resulti = firebase.put('/Relay','State','True')
     else:
          resulti = firebase.put('/Relay','Statecm','False')

#Generates a table of power values with the data from database
def table():
     df = pd.DataFrame(sorted(data3.items()), columns = ["Date", "Power"])
     return(print(df))

#Energy Price taken from IESO website
def HOEP():
     Price_Per_KWH = random.uniform(0.48, 2.79)


#Weather API
def Weather_API():
     api_address='http://api.openweathermap.org/data/2.5/weather?appid=c171ea3e2e30b0dc425db8b1d5f42649&q=Toronto'
     #city = raw_input("City Name : ")
     url = api_address #+ city
     json_data = requests.get(url).json()
     Weather_API.temperature = json_data['main']['temp'] - 273.15
     Weather_API.weather = str(json_data['weather'][0]['main'])
     #print(temperature)
     #print(weather)

def Compare():
     #Transactive_Input = raw_input("Please enter energy requested: ")
     #Time_of_TE = raw_input("Please enter the time of TE requested: ")
     Transactive_Input = 2
     if (count_kwh() > Transactive_Input):
          Weather_API()
          if (Weather_API.temperature > 10 and Weather_API.weather != "Clouds"):
               print("True")
     else:
          print("False")     

count_kwh()


