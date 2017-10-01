function onPlay(loggo) {
  document.getElementById("mushroom").src = "background.png";
  console.log(loggo)
}


// other ways besides onclick on button in html
//document.getElementById("playButton").onclick = onPlay //function() { console.log("hi2") }
// document.getElementById("playButton").addEventListener("click", function() {
//   onPlay("hello")
// } );
