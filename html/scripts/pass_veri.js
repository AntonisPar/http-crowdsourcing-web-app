var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var special_char = document.getElementById("special_char");

if(typeof(document.getElementById("modal_password")) === 'undefined' || document.getElementById("modal_password")===null)
    var myInput = document.getElementById("new_pass");
else
    var myInput = document.getElementById("modal_password");


if(typeof(document.getElementById("modal_password")) === 'undefined' || document.getElementById("modal_password")===null)
    var confirmInput = document.getElementById("confirm_pass");
else
    var confirmInput = document.getElementById("modal_conf_password");

function checkPass(myInput){
  // Checks for lower-case
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
}

  // Checks for upper-case
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Checks for numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Checks for length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
  // Checks for special characters
  var specialchars = /[ `!@#$%^&*()_+\-={};':"|,.<>?~]/;
  if(myInput.value.match(specialchars)) {
    special_char.classList.remove("invalid");
    special_char.classList.add("valid");
  } else {
    special_char.classList.remove("valid");
    special_char.classList.add("invalid");
  }
}

// The message-box appears when the field is clicked
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
    checkPass(myInput)
}

// The message-box disappears and the messages state reset to "invalid" when clicked away from field
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
  letter.classList.add("invalid");
  capital.classList.add("invalid");
  number.classList.add("invalid");
  length.classList.add("invalid");
  special_char.classList.add("invalid");
}

// When user begins to type
myInput.onkeyup = function(){checkPass(myInput)}


confirmInput.onkeyup = function(){
  if(confirmInput.value === myInput.value){

    confirmInput.style.borderColor = "green";
  }
  else{
    confirmInput.style.borderColor = "red";
  }
}

confirmInput.onfocus = function(){
  confirmInput.style.borderWidth = "3px";
  if(confirmInput.value === myInput.value){

    confirmInput.style.borderColor = "green";
  }
  else{
    confirmInput.style.borderColor = "red";
  }
}


confirmInput.onblur = function (){
  confirmInput.style.borderColor = "#e9ecef";
  confirmInput.style.borderWidth = "1px";
}
