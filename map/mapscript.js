var c=document.getElementById("canvas");
// use tiles array to store information about tiles, put drawn objects in ctiles (canvas tiles)
var btiles = []
var ctiles = []
// MAP SETTINGS
var tilesize = 1
var layercount = 20
var maxtsize = 100
// THRESHOLDS
var deepwater = 0.35
var water = 0.525
var sand = 0.55
var land = 0.68
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
  ctiles[i]=c.getContext("2d");
  if(btiles[i].strength<deepwater) {
    ctiles[i].fillStyle="#2188C2"
  } else if(btiles[i].strength<water) {
    ctiles[i].fillStyle="#4AABD6"
  } else if(btiles[i].strength<sand) {
    ctiles[i].fillStyle="#E5D37D"
  } else if(btiles[i].strength<land) {
    ctiles[i].fillStyle="#87D652"
  } else if(btiles[i].strength<mountain) {
    ctiles[i].fillStyle="#E0E0E0"
  }
  // ctiles[i].globalAlpha=(btiles[i].strength)
  ctiles[i].fillRect(btiles[i].xpos, btiles[i].ypos, tilesize, tilesize);
}
