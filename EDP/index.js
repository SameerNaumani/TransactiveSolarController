
// jquery always goes in this function
$(document).ready(function(){
    // Users and Bidding
    var userId = document.getElementById('userId');
    var firstName = document.getElementById('firstName');
    var lastName = document.getElementById('lastName');
    var company = document.getElementById('company');
    var bid = document.getElementById("bid");
    var submitBtn = document.getElementById('submitBtn');
    var updateBtn = document.getElementById('updateBtn');
    var removeBtn = document.getElementById('removeBtn'); 

//------------------------------------ Submit Button for Bids ----------------------------------------
    submitBtn.addEventListener('click', e => {
    e.preventDefault();
    window.alert("Submitted")
    usersRef.child(userId.value).set({
        first_name: firstName.value,
        last_name: lastName.value,
        company_name: company.value,
        bid_value: bid.value
    });
    });
    const ulList = document.getElementById('list');
    
//-------------------------------------- DataBase Reference -----------------------------------------------
    var database = firebase.database();
    var usersRef = database.ref('/users');
    

//------------------------------------ Get Current Time and Date ----------------------------------------------
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var date_val = mm + '-' + dd + '-' + yyyy;

    function checkTime(i) {
        if (i < 10) {
        i = "0" + i;
        }
        return i;
    } 
    
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    var time = h + ":" + m + ":" + s;

    console.log(time);

// -------------------------------------------- Voltage --------------------------------------------------
    var voltageRef = database.ref('Voltage');
    var dateRef = voltageRef.child('2020-03-29');
    
    //Testing
    function pushVoltData(){
        voltageRef.push({
            date: date_val,
            time: time,
            value: Math.floor(Math.random()*(999-100+1)+100)
        });
    }
    //pushVoltData();

    function displayVolt(){
        dateRef.on("value", function(snapshot) {
            console.log(snapshot.val());
            }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    
        dateRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val(); 

              //console.log(key); // 2020-03-26
              //console.log(childData); //
              $('#voltageID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

              });
            });
    }
    displayVolt();

//---------------------------------------- Power Reference -----------------------------------------
    var powRef = database.ref('Power');
    var powDateRef = powRef.child('2020-03-29');

    //Testing
    function pushPowerData(){
        powRef.push({
            date: date_val,
            time: time,
            value: Math.floor(Math.random()*(999-100+1)+100)
        });
    }
   //pushPowerData();

   //Test
    function getData(){
        powRef.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var keys = childSnapshot.key;
                var childData = childSnapshot.val();
                //console.log(keys);

                for(var i=0; i<keys.length; i++){
                    //var k = keys[i];
                    var time = childSnapshot.val().time;
                    var value = childSnapshot.val().value;
                    console.log(time,value);
                }
            }); 
        });
    }
    //getData();

    function displayPow(){
        powDateRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val(); 
              
              //console.log(key); // 2020-03-26
              //console.log(childData); //
              $('#powerID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");
            
              });
            });
    }
    displayPow();

//----------------------------------------- Current --------------------------------------------
    var currRef = database.ref('Current');
    var currDateRef = currRef.child('2020-03-29');

    //Test
    function pushCurrData(){
        currRef.push({
            date: date_val,
            time: time,
            value: Math.floor(Math.random()*(999-100+1)+100)
        });
    }
    //pushCurrData();

    function displayCurr(){
        currDateRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key; //unique ID
              var childData = childSnapshot.val(); 
              
              var date = childSnapshot.val().date;
              var time = childSnapshot.val().time;
              var value = childSnapshot.val().value;
              
              //console.log(key); // 2020-03-26
              //console.log(childData); //
              $('#currentID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");
            
              });
            });
    }
    displayCurr();

//-------------------------------Power Factor------------------------------
var pfRef = database.ref('PF');
var pfDateRef = pfRef.child('2020-03-29');
function displayPf(){
    pfDateRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key; //unique ID
          var childData = childSnapshot.val(); 
          
          var date = childSnapshot.val().date;
          var time = childSnapshot.val().time;
          var value = childSnapshot.val().value;
          
          //console.log(key); // 2020-03-26
          //console.log(childData); //
          $('#pfID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");
        
          });
        });
}
displayPf();


//------------------------------ Relay State ----------------------------------
    var relayRef = database.ref('Relay');

    function displayRef(){
        relayRef.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key; //unique ID
              var childData = childSnapshot.val(); 
              
              var date = childSnapshot.val().date;
              var time = childSnapshot.val().time;
              var value = childSnapshot.val().value;
              
              console.log(key); // 2020-03-26
              console.log(childData); //
              $('#relayState').append(childData);
            
              });
            });
    }
    displayRef();











});


