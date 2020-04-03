// Call the dataTables jQuery plugin
$(document).ready(function() {
  
 var database = firebase.database();

 // -------------------------------------------- Power --------------------------------------------------
  var powRef = database.ref('Power');
  var powDateRef = powRef.child('2020-03-29');

  function displayPow(){
      powDateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("powerID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable').DataTable();
          });
  }
  displayPow();


  // -------------------------------------------- Voltage --------------------------------------------------
  var voltageRef = database.ref('Voltage');
  var dateRef = voltageRef.child('2020-03-29');
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
            listMarkup += "<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("voltageID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable2').DataTable();
          });
  }
  displayVolt();

  // -------------------------------------------- Power --------------------------------------------------
  var currRef = database.ref('Current');
  var currDateRef = powRef.child('2020-03-29');

  function displayCurr(){
      powDateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("currentID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable3').DataTable();
          });
  }
  displayCurr();

  // -------------------------------------------- Power --------------------------------------------------
  var pfRef = database.ref('PF');
  var pfDateRef = powRef.child('2020-03-29');

  function displayPF(){
      powDateRef.once("value", function(snapshot) {
        let listMarkup = '';  
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val(); 
            listMarkup += "<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>";
            //$('#voltageID').append("<tr><td>"+ '2020-03-29' + "</td><td>"+ key + "</td><td>"+ childData +"</td></tr>");

            const myList = document.getElementById("pfID");
            myList.innerHTML = listMarkup;
            });
            $('#dataTable4').DataTable();
          });
  }
  displayPF();

 





});
