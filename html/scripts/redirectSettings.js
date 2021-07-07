var but = document.getElementById("settings")

function redirectSettings() {
  window.location.replace("http://localhost:3000/profileSettings.html");
}

but.onclick = redirectSettings
