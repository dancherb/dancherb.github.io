var c=document.getElementById("canvas");
var tiles = []
var tilesize = 25
console.log(tilesize);
// mapwidth and mapheight in tiles
var mapwidth = c.width/tilesize
var mapheight = c.height/tilesize
var totaltiles =  mapwidth*mapheight
console.log(mapwidth, mapheight, totaltiles)
for(i=0; i<totaltiles; i++) {
  tiles[i]=c.getContext("2d");
  tiles[i].land = Math.floor((Math.random() * 10) + 1)
  if(tiles[i].land <= 5) {
    //green
    tiles[i].fillStyle="#87D652";
  } else {
    //blue
    tiles[i].fillStyle="#4AABD6"
  }
  tiles[i].xpos = tilesize*(i%mapwidth)
  tiles[i].ypos = tilesize*(Math.floor(i/mapwidth))
  tiles[i].fillRect(tiles[i].xpos, tiles[i].ypos, tilesize, tilesize);
}
// 0(1) 0(2) 0(3) 0(4) 0(5)
// 1(6) 1(7) 1 1 1
// 2(11) 2 2 2 2
// refer to individual tile
// tiles[6].fillStyle="#000000"
// tiles[6].fillRect(6*25,0, 25, 25);
//random number between 1 and 10
//Math.floor((Math.random() * 10) + 1)
