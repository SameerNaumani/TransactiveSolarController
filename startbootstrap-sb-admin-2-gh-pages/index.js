// Users and Bidding
const userId = document.getElementById('userId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const company = document.getElementById('company');
const bid = document.getElementById("bid");
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const removeBtn = document.getElementById('removeBtn'); 

const database = firebase.database();
const usersRef = database.ref('/users');

submitBtn.addEventListener('click', e => {
  e.preventDefault();
  window.alert("good job")
  usersRef.child(userId.value).set({
    first_name: firstName.value,
    last_name: lastName.value,
    company_name: company.value,
    bid_value: bid.value
  });
});

usersRef.on('value', snap=>{
    userId.innerText = JSON.stringify(snap.val(),null,3)
});


//voltages
var voltageID = doucment.getElementById('voltagID')
var voltageRef = firebase.database().ref('Voltage/');

$(document).ready(function(){

    // jQuery methods go here...
    voltageRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();              
        
          //var time_val = childSnapshot.val().Time;
          var id_val = childSnapshot.val().voltageID;
        
          $("#voltageID").append(id_val);
          //$("#id").append(id_val);
    
          $("#voltageID").append(id_val + "</p> <br>");
        
          });
        });
  
  });



 


    var userDataRef = firebase.database().ref("UserData").orderByKey();
    userDataRef.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();              
    
      var name_val = childSnapshot.val().Name;
      var id_val = childSnapshot.val().AssignedID;
    
      $("#output").append(name_val);
      $("#id").append(id_val);
    
      });
    });

    $("#name").append("<p>" + name_val + "</p><p> " + id_val + "</p><br>");



function submitBid(){
    var database = firebase.database();
    database.ref().child("text").set("some value");
    window.alert("Successful");
    EDP-app

}









firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      $(".h5 mb-0 font-weight-bold text-gray-800").hide();
  
      var dialog = document.querySelector('#loginDialog');
      /*
      if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      */
      dialog.close();
  
    } else {
  
      $(".login-cover").show();
  
      // No user is signed in.
      var dialog = document.querySelector('#loginDialog');
      if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      dialog.showModal();
  
    }
  });
  
  
  /* LOGIN PROCESS */
  
  $("#loginBtn").click(
    function(){
  
  
      var email = $("#loginEmail").val();
      var password = $("#loginPassword").val();
  
      if(email != "" && password != ""){
        $("#loginProgress").show();
        $("#loginBtn").hide();
  
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
  
          $("#loginError").show().text(errorMessage);
          $("#loginProgress").hide();
          $("#loginBtn").show();
        });
      }
    }
  );
  
  
  /* LOGOUT PROCESS */
  
  $("#signOutBtn").click(
    function(){
  
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
        alert(error.message);
      });
  
    }
  );