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

    //Submit Button for Bids
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

    //DataBase Reference 
    var database = firebase.database();
    var usersRef = database.ref('/users');
    var voltageRef = database.ref('Voltage');
    var dateRef = database.ref('/Voltage/2020-03-26');

    // ---------------------------Voltage-------------------------
    // jQuery methods go here...
    
    function displayVolt(){
        dateRef.on("value", function(snapshot) {
            console.log(snapshot.val());
            }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            
        });
    
        // List sync and reads every existing object
        dateRef.on("child_added", function(snapshot) {
        //list items
            const li = document.createElement('li');
            li.innerText = snapshot.val();
            ulList.appendChild(li);
        });
    
        dateRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val(); 
              
              //console.log(key); // 2020-03-26
              //console.log(childData); //
              $('#voltageID').append("<tr><td>"+ key + "</td><td>"+ childData + "</td></tr>");
            
              });
            });
    }
    
    
  //--------------- Get Current Time and Date------------------------------
    
  function getTime(){
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

  }
    

    //---------------------------------Power Reference -----------------
    var powRef = database.ref('Power');

    function pushPowerData(){
        powRef.push({
            date: date_val,
            time: time,
            value: '67'
        });
    }

    function getData(){
        powRef.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var keys = childSnapshot.key;
                //var childData = childSnapshot.val();
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

    getData();

    





});


   











