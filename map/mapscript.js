var c=document.getElementById("canvas");
var tiles = []
var totaltiles = 40;
for(i=0; i<totaltiles; i++) {
  tiles[i]=c.getContext("2d");
  tiles[i].land = Math.floor((Math.random() * 2) + 1)
  if(tiles[i].land === 1) {
    //green
    tiles[i].fillStyle="#87D652";
  } else {
    //blue
    tiles[i].fillStyle="#4AABD6"
  }
  tiles[i].fillRect(i*25, 0, 25, 25);
}

// refer to individual tile
// tiles[6].fillStyle="#000000"
// tiles[6].fillRect(6*25,0, 25, 25);
//random number between 1 and 10
//Math.floor((Math.random() * 10) + 1)
