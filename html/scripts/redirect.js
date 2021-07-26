var changeSetBut = document.getElementById("settings")
var signupButton = document.getElementById("signBut");
var harButton = document.getElementById("har");
var heatButton = document.getElementById("heat");

function redirectSettings() {
  window.location.replace("http://localhost:3000/profileSettings.html");
}

function redirectSignup() {
  window.location.replace("http://localhost:3000/signup.html");
}

function redirectHar() {
  window.location.replace("http://localhost:3000/har.html");
}
function redirectHeat() {
  window.location.replace("http://localhost:3000/heatmap.html");
}

if(typeof(changeSetBut) != 'undefined' && changeSetBut != null){
    changeSetBut.onclick = redirectSettings;
    harButton.onclick = redirectHar;
    //heatButton.onclick = redirectHeat;
}
if(typeof(signupButton) != 'undefined' && signupButton != null)
    signupButton.onclick = redirectSignup;

