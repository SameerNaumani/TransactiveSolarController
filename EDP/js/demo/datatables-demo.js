// Call the dataTables jQuery plugin
$(document).ready(function() {
  
 var database = firebase.database();
 
 //------------------------------------ Get Current Time and Date ----------------------------------------------
 var today = new Date();
 var dd = String(today.getDate()).padStart(2, '0');
 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
 var yyyy = today.getFullYear();
 
 var date_val = yyyy + '-' + mm + '-' + dd;

 //var date_val = '2020-04-02';

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

 console.log(date_val);

 // -------------------------------------------- Power --------------------------------------------------
  var powRef = database.ref('Power');
  var powDateRef = powRef.child(date_val);

  function displayPow(){
      powDateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ date_val + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ date_val + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("powerID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable').DataTable();
          });
  }
  displayPow();


  // -------------------------------------------- Voltage --------------------------------------------------
  var voltageRef = database.ref('Voltage');
  var dateRef = voltageRef.child(date_val);
  function displayVolt(){
      dateRef.on("value", function(snapshot) {
          console.log(snapshot.val());
          }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
  
      dateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ date_val + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ 'date_val' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("voltageID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable2').DataTable();
          });
  }
  displayVolt();

  // -------------------------------------------- current --------------------------------------------------
  var currRef = database.ref('Current');
  var currDateRef = currRef.child(date_val);

  function displayCurr(){
      currDateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ date_val + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ 'date_val' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("currentID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable3').DataTable();
          });
  }
  displayCurr();

  // -------------------------------------------- Power Factor --------------------------------------------------
  var pfRef = database.ref('PF');
  var pfDateRef = pfRef.child(date_val);

  function displayPF(){
      pfDateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ date_val + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ 'date_val' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("pfID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable4').DataTable();
          });
  }
  displayPF();

 





});
