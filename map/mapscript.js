var c=document.getElementById("canvas");
// black or white background for canvas (to darken or lighten individual tiles with gradient)
var minAlpha = 0.5 // affects impact of gradient shading on tiles
var cbg = c.getContext("2d");
var gradientType = "black" // black or white
if(gradientType === "black") {
  cbg.fillStyle = "black"
} else {
  cbg.fillStyle = "white"
}
cbg.fillRect(0, 0, c.width, c.height);
// top of controls starts 1/4 down, so middle of controls is centered 1/2 down with map
//document.getElementById("terraincontrols").style.paddingTop = "20px"
// use tiles array to store information about tiles, put drawn objects in ctiles (canvas tiles)
var btiles = []
var ctiles = []
// MAP SETTINGS
// 2-20-100 and 10-20-50 are good, 1-40-200 for mad detail
var tilesize = 4
var layercount = 80
var maxtsize = 200
// THRESHOLDS
var deepwater = 0.4
var water = 0.525
var sand = 0.53 // 0.53
var land = 0.58 // 0.64
var mountain = 1
// mapwidth and mapheight in tiles
var mapcolumns = c.width/tilesize
var maprows = c.height/tilesize
var tilecount =  mapcolumns*maprows
var weighthash = 2 // CURRENTLY UNUSED: each layer's weight is 1 / weighthash^i (so layer 1 is 0.5, layer 2 is 0.25)
var baseweight = 0 // existing weightings will be added to this, then at the end 1-baseweight to fill remaining weight
layers = {}
layertiles = []
// list of layers. for each layer, a further list space. within this space is a list of tiles for each layer
// each tile in the list is an object with property strength (layertiles[i].tiles[j].strength)
for (i=1; i<=layercount; i++) {
  // for each layer, generate properties and create grid
  layers[i] = {}
  // formula for generating tile sizes based on number of layers and max tile size
  layers[i].size = maxtsize-((maxtsize/layercount)*(i-1)) //spread out so e.g. layer 1 = max size, l2 = 0.8, l3 = 0.6 etc
  layers[i].columns = Math.ceil(mapcolumns/layers[i].size)
  layers[i].rows = Math.ceil(maprows/layers[i].size)
  layers[i].tilecount = layers[i].rows*layers[i].columns
  // leaves space for base weight. equally divided weighting. for 0.5, 0.25, 0.125 etc use: 1/(Math.pow(weighthash, i))
  layers[i].weighting = 1/(layercount+1)
  baseweight += layers[i].weighting
  // give each tile in grid a strength
  layertiles[i] = []
  layertiles[i].tiles = []
  for (j=0; j<layers[i].tilecount; j++) {
    layertiles[i].tiles[j] = {}
    layertiles[i].tiles[j].strength = Math.random()
  }
}
baseweight = 1-baseweight // base weight fills gap;
// base layer tiles
for(i=0; i<tilecount; i++) {
  // create and position
  btiles[i] = {}
  btiles[i].x = i%mapcolumns
  btiles[i].xpos = tilesize*btiles[i].x
  btiles[i].y = Math.floor(i/mapcolumns)
  btiles[i].ypos = tilesize*btiles[i].y
  btiles[i].strength = 0
  // for each base tile, create space to list information about corresponding tile for each layer
  btiles[i].ltiles = []
  // find corresponding layer tiles and apply strength
  for(j=1; j<=layercount; j++) {
    // add object to this list for each layer
    btiles[i].ltiles[j] = {}
    // find which x and y tile from the layer j this tile fits into, and therefore which ultimate layer tile for each layer
    btiles[i].ltiles[j].x = Math.floor(btiles[i].x/layers[j].size)
    btiles[i].ltiles[j].y = Math.floor(btiles[i].y/layers[j].size)
    btiles[i].ltiles[j].tile = btiles[i].ltiles[j].y*layers[j].rows + btiles[i].ltiles[j].x;
    // dig up and take corresponding strength property from corresponding tile
    btiles[i].ltiles[j].tilestrength = layertiles[j].tiles[btiles[i].ltiles[j].tile].strength
    // add weighted strength
    btiles[i].strength += btiles[i].ltiles[j].tilestrength * layers[j].weighting
  }
  // fill in rest of weight
  btiles[i].strength += Math.random()*baseweight
  // draw tiles
  ctiles=c.getContext("2d");
  if(btiles[i].strength<deepwater) {
    ctiles.fillStyle="#1E7EB4"//#2188C2"
    // percentage position between lower and upper threshold. for deepwater and mountain, use +0.1 or -0.1 instead of 0 and 1
    btiles[i].relativeStrength = 1-(deepwater-btiles[i].strength)/(deepwater-(1))
  } else if(btiles[i].strength<water) {
    ctiles.fillStyle="#4AABD6"
    btiles[i].relativeStrength = 1-(water-btiles[i].strength)/(water-deepwater)
  } else if(btiles[i].strength<sand) {
    ctiles.fillStyle="#E5D37D"
    btiles[i].relativeStrength = 1-(sand-btiles[i].strength)/(sand-water)
  } else if(btiles[i].strength<land) {
    ctiles.fillStyle="#87D652"
    btiles[i].relativeStrength = 1-(land-btiles[i].strength)/(land-sand)
  } else if(btiles[i].strength<mountain) {
    ctiles.fillStyle="#E5E5E5"
    btiles[i].relativeStrength = 1-((land+0.05)-btiles[i].strength)/((land+0.05)-land)
    console.log(btiles[i].relativeStrength)
  }
  // set alpha - start at minAlpha and then fade in the rest based on relative strength
  // when lightening instead of darkening, use 1-relativeStrength to lighten higher areas instead of darkening lower ones
  if(gradientType === "black") {
    ctiles.globalAlpha= minAlpha + ((btiles[i].relativeStrength)*(1-minAlpha))
  } else {
    ctiles.globalAlpha= minAlpha + ((1-btiles[i].relativeStrength)*(1-minAlpha))
  }
  ctiles.fillRect(btiles[i].xpos, btiles[i].ypos, tilesize, tilesize);
}
// add shade
shadecontext = canvas.getContext('2d')
var shadeimg = new Image();
shadeimg.src = "shade.png";
shadeimg.onload = function() {
     shadecontext.globalAlpha = 0.5
     //shadecontext.drawImage(shadeimg, 0, 0, 1000, 600);
}
