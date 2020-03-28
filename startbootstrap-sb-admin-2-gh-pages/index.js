 // Users and Bidding
var userId = document.getElementById('userId');
var firstName = document.getElementById('firstName');
var lastName = document.getElementById('lastName');
var company = document.getElementById('company');
var bid = document.getElementById("bid");
var submitBtn = document.getElementById('submitBtn');
var updateBtn = document.getElementById('updateBtn');
var removeBtn = document.getElementById('removeBtn'); 


//DataBase Reference 
var database = firebase.database();
var usersRef = database.ref('/users');
var voltageRef = database.ref('Voltage');
var dateRef = database.ref('/Voltage/2020-03-26');


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

// jquery always goes in this function
$(document).ready(function(){
    // jQuery methods go here...
    //$('#voltageID').text("My function Sameer") 

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
          
          

          //$("#name").append(time_val);
          //$("#id").append(volt_val);
        
          });
        });




});


   











