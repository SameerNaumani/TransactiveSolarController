// EmonLibrary examples openenergymonitor.org, Licence GNU GPL V3

#include <LiquidCrystal_I2C.h>
#include "EmonLib.h"             // Include Emon Library
#include <Arduino_JSON.h>
#include <NTPClient.h>
#include <WiFi.h>                                                 // esp32 library
#include <IOXhop_FirebaseESP32.h>                                 // firebase library

#define FIREBASE_HOST "HOLD"        // the project name address from firebase id
#define FIREBASE_AUTH "HOLD"  // the secret key generated from firebase
#define WIFI_SSID "HOLD"                                          // input your home or public wifi name
#define WIFI_PASSWORD "HOLD"                                  //password of wifi ssid

#define testpin 18

String fireStatus = "";                                           // led status received from firebase
int i = 1;

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

int currentHour = timeClient.getHours();
int currentMin = timeClient.getMinutes();
int currentSec = timeClient.getSeconds();

// Variables to save date and time
String formattedDate;
String dayStamp;
String timeStamp;

// set the LCD number of columns and rows
int lcdColumns = 16;
int lcdRows = 2;

EnergyMonitor emon1;             // Create an instance

// set LCD address, number of columns and rows
// if you don't know your display address, run an I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows); 

void setup()
{  
  Serial.begin(9600);

  
  lcd.init();       // initialize LCD                      
  lcd.backlight();  // turn on LCD backlight

  lcd.clear();
  lcd.print("Connecting ...");
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);                                      //try to connect with wifi
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) 
  {
    Serial.print(".");
    delay(500);
  }
  
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP Address is : ");
  Serial.println(WiFi.localIP());                                                      //print local IP address

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);                                       // connect to firebase
  Firebase.setString("/Relay/State", "False");                                          //send initial string of led status

  timeClient.begin();     // Initialize a NTPClient to get time
  // Set offset time in seconds to adjust for your timezone, for example:
  // GMT +1 = 3600
  // GMT +8 = 28800
  // GMT -1 = -3600
  // GMT 0 = 0
  timeClient.setTimeOffset(-18000+3600); // -18000
  
  lcd.clear();
  lcd.print("Solar Controller");
  lcd.setCursor(0, 1);
  lcd.print("*** Test Rig ***");

  pinMode (testpin, OUTPUT);
  
  emon1.voltage(34, 72.9, 1.7);  // Voltage: input pin, calibration, phase_shift (Best Ones 73.9)
  emon1.current(32, (12.5*12));       // Current: input pin, calibration. (Best one: 12.5) (12.5/1.9)

  delay (3000);

  lcd.clear();
}

void loop()
{

  while (i < 4)
  {
    Serial.print ("Calibrating Sensors: ");
    Serial.println (i);
    
    emon1.calcVI(20,2000);         // Calculate all. No.of half wavelengths (crossings), time-out
    delay (10);

    if (i == 1)
    {
      lcd.clear();
      lcd.print ("Calibrating");
    }
    
    i = i+1;
    
  }

  emon1.calcVI(20,2000);
  
  float RP  = emon1.realPower;        //extract Real Power into variable
  float AP  = emon1.apparentPower;    //extract Apparent Power into variable
  float PF  = emon1.powerFactor;      //extract Power Factor into Variable
  float SV  = emon1.Vrms;             //extract Vrms into Variable
  float SI  = emon1.Irms;             //extract Irms into Variable
  float QP;

  QP = sqrt(sq(AP)-sq(RP));
  
  while(!timeClient.update()) 
  {
    timeClient.forceUpdate();
  }

  // The formattedDate comes with the following format:
  // 2018-05-28T16:00:13Z
  // We need to extract date and time
  formattedDate = timeClient.getFormattedDate();
  //Serial.println(formattedDate);

  //Extract Date
  int splitT = formattedDate.indexOf("T");
  dayStamp = formattedDate.substring(0, splitT);
  Serial.print("DATE: ");
  Serial.println(dayStamp);

  // Extract time
  timeStamp = formattedDate.substring(splitT+1, formattedDate.length()-1);
  Serial.print("HOUR: ");
  Serial.println(timeStamp);
  delay(10);

  Serial.println();

  String HMtimestamp;

  if (timeClient.getMinutes() >= 0 && timeClient.getMinutes() <= 9)
  {
    HMtimestamp = String(timeClient.getHours()) + ":0" + String(timeClient.getMinutes());  
  }
  
  else
  { 
    HMtimestamp = String(timeClient.getHours()) + ":" + String(timeClient.getMinutes());
  }
  
 //String Power_Date_Log = "/" + String(dayStamp) + "/" + String(timeStamp);  //Setting correct time format in firebase

 String Power_Date_Log = "/Power/" + String(dayStamp) + "/" + String(HMtimestamp);  //Setting correct time format in firebase
 String V_Date_Log = "/Voltage/" + String(dayStamp) + "/" + String(HMtimestamp);  //Setting correct time format in firebase
 String I_Date_Log = "/Current/" + String(dayStamp) + "/" + String(HMtimestamp);  //Setting correct time format in firebase
 String PF_Date_Log = "/PF/" + String(dayStamp) + "/" + String(HMtimestamp);  //Setting correct time format in firebase

  //emon1.calcVI(20,2000);         // Calculate all. No.of half wavelengths (crossings), time-out
  //emon1.serialprint();           // Print out all variables (realpower, apparent power, Vrms, Irms, power factor)

  Firebase.setFloat(Power_Date_Log, abs(RP/1000));
  Firebase.setFloat(V_Date_Log, (SV));
  Firebase.setFloat(I_Date_Log, (SI));
  Firebase.setFloat(PF_Date_Log, (PF));  

  Serial.print ("Real Power (W)     : ");
  Serial.println (RP);
  Serial.print ("React. Power (VAR) : ");
  Serial.println (QP);
  Serial.print ("App. Power (VA)    : ");
  Serial.println (AP);
  Serial.print ("Power Factor       : ");
  Serial.println (PF);
  Serial.print ("Voltage (Vrms)     : ");
  Serial.println (SV);
  Serial.print ("Current (Irms)     : ");
  Serial.println (SI);
  Serial.println ();

  lcd.setCursor(0, 0);
  lcd.clear();
  
  lcd.print("V: ");
  lcd.print(SV);

  lcd.setCursor(0, 1);

  lcd.print("A: ");
  lcd.print(SI);

  lcd.print(" T:");
  
  if (timeClient.getMinutes() >= 0 && timeClient.getMinutes() <= 9)
  {
     lcd.print(String(timeClient.getHours()) + ":0" + String(timeClient.getMinutes()));  
  }
  
  else
  { 
    lcd.print(String(timeClient.getHours()) + ":" + String(timeClient.getMinutes())); 
  }

  lcd.setCursor(0, 0);
 
  fireStatus = Firebase.getString("/Relay/State");                     // get led status input from firebase
  
  if (fireStatus == "ON") 
  {                         
    Serial.println("Relay Turned ON");                                        // compare the input of led status received from firebase
    digitalWrite(18, HIGH);                                                         // make output led ON
  }
  
  else 
  { 
    digitalWrite(18,LOW);
  }

  delay (10);

}
