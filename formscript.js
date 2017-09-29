function onPlay(loggo) {
  document.getElementById("mushroom").src = "background.png";
  console.log(loggo)
}
//document.getElementById("playButton").onclick = onPlay //function() { console.log("hi2") }
document.getElementById("playButton").addEventListener("click", function() {
  onPlay("hello")
} );



// <p onclick="myFunction(this, 'red')">Click me to change my text color.</p>
//
// <script>
// function myFunction(elmnt,clr) {
//     elmnt.style.color = clr;
// }
// </script>
