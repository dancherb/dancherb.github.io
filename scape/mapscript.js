// about button and text
aboutText.style.opacity = 0;
function openAbout() {
  if(aboutText.style.opacity === "0") {
    aboutText.style.opacity = 1;
    aboutText.style.paddingLeft = "10px";
    aboutText.style.paddingTop = "10px";
    // document.getElementById("aboutText").innerHTML = aboutDesc
  } else {
    aboutText.style.opacity = 0;
    aboutText.style.paddingLeft = "0px";
    aboutText.style.paddingTop = "0px";
    // document.getElementById("aboutText").innerHTML = ""
  }
  aboutText.style.transition = "all 0.2s ease";
  envelopeIcon.classList.toggle("fa-envelope-open-o");
  envelopeIcon.classList.toggle("fa-envelope-o");
}
// map
var c=document.getElementById("canvas");
var cbg = c.getContext("2d");
var firstTime = true;
// refreshAll true when re-calculating everything, false when only redrawing tiles to change colours
function gogogo(refreshAll) { // main button
  if(firstTime != false) {
    firstTime = false // marks that it's now been loaded once
  } else {
    cbg.clearRect(0, 0, c.width, c.height); // if it's already been loaded once before, clear all
  }
  if(refreshAll === true) {
    // use tiles array to store information about tiles, put drawn objects in ctiles (canvas tiles)
    btiles = [] // clears/creates array
    ctiles = []
    // MAP SETTINGS
    // 2-20-100 and 10-20-50 are good, 1-40-200 for mad detail
    c.width = document.getElementById('mapWidth').value
    c.height = document.getElementById('mapHeight').value
    tilesize = Number(document.getElementById('tileSize').value)
    layercount = Number(document.getElementById('layers').value)
    maxtsize = Number(document.getElementById('maxTileSize').value)
    document.getElementById('goHolder').style.lineHeight = (c.height+40)+"px" // position "go" button in middle
    document.getElementById('particles-js').style.height = (c.height+180)+"px" // adjust sidebar height with map height
    // document.getElementById('bgleft').style.minHeight = 100+"%" // adjust sidebar height with map height
    document.getElementById('container').style.width = (c.width+450)+"px" // adjust page width with map width
    // mapwidth and mapheight in tiles
    mapcolumns = Math.ceil(c.width/tilesize)
    maprows = Math.ceil(c.height/tilesize)
    tilecount = mapcolumns*maprows
    baseweight = 0 // existing weightings will be added to this, then at the end 1-baseweight to fill remaining weight
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
  }
  if(document.getElementById('gradientType1').checked) {
    var gradientType = "Light"
  } else if(document.getElementById('gradientType2').checked) {
    var gradientType = "Dark"
  } else {
    var gradientType = "Off"
  }
  if(gradientType === "Dark") {
    cbg.fillStyle = "black"
  } else {
    cbg.fillStyle = "white"
  }
  cbg.globalAlpha = 1
  cbg.fillRect(0, 0, c.width, c.height);
  // base layer tiles
  for(i=0; i<tilecount; i++) {
    if(refreshAll === true) {
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
        btiles[i].ltiles[j].tile = btiles[i].ltiles[j].y*btiles[i].ltiles[j].x;
        // dig up and take corresponding strength property from corresponding tile
        btiles[i].ltiles[j].tilestrength = layertiles[j].tiles[btiles[i].ltiles[j].tile].strength
        // add weighted strength
        btiles[i].strength += btiles[i].ltiles[j].tilestrength * layers[j].weighting
      }
      // fill in rest of weight
      btiles[i].strength += Math.random()*baseweight
    }
    // do this when it's not a full refresh (AND when it is), i.e. when changing threshold sliders
    // draw tiles
    // THRESHOLDS 0.4 / 0.525 / 0.53 / 0.58 / 1
    var deepwater = Number(document.getElementById('deepwater').value)/100
    var water = Number(document.getElementById('water').value)/100
    var sand = Number(document.getElementById('sand').value)/100
    var land = Number(document.getElementById('land').value)/100
    var mountain = Number(document.getElementById('mountain').value)/100
    var minAlpha = 1-(Number(document.getElementById('gradient').value)/100) // affects impact of gradient shading on tiles
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
      btiles[i].relativeStrength = 1-((land+0.03)-btiles[i].strength)/((land+0.03)-land)
    }
    // set alpha - start at minAlpha and then fade in the rest based on relative strength
    // when lightening instead of darkening, use 1-relativeStrength to lighten higher areas instead of darkening lower ones
    if(gradientType === "Dark") {
      ctiles.globalAlpha= minAlpha + ((btiles[i].relativeStrength)*(1-minAlpha))
    } else if(gradientType === "Light") {
      ctiles.globalAlpha= minAlpha + ((1-btiles[i].relativeStrength)*(1-minAlpha))
    } else {
      ctiles.globalAlpha= 1
    }
    ctiles.fillRect(btiles[i].xpos, btiles[i].ypos, tilesize, tilesize);
  }
  hideGears()
  // add shade
  shadecontext = canvas.getContext('2d')
  var shadeimg = new Image();
  shadeimg.src = "shade.png";
  shadeimg.onload = function() {
       console.log("load shade")
       shadecontext.globalAlpha = 0.4
       shadecontext.drawImage(shadeimg, 0, 0, c.width, c.height);
  }
}
function showGears() {
  document.getElementById('goButton').style.fontSize = "0px"
  document.getElementById('cogs').style.fontSize = "28px"
  loadshade = canvas.getContext('2d')
  loadshade.fillStyle="#3D3D43"
  loadshade.globalAlpha = 0.3
  loadshade.fillRect(0, 0, c.width, c.height);
}
function hideGears() {
  document.getElementById('goButton').style.fontSize = "45px"
  document.getElementById('cogs').style.fontSize = "0px"
}
showGears()
gogogo(true)
addEventListener("keydown",
  function pressEnter(e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
      showGears();
      setTimeout(gogogo.bind(null, true), 10);
  }
});

//html buttons
document.getElementById("goHolder").addEventListener("click", function() {
   showGears(); setTimeout(gogogo.bind(null, true), 10);
 } )

// disabled for terrain thresholds to avoid annoying flashing, instead more of a feel of real time results
// document.getElementById("deepwater").addEventListener("change", function() {
//    showGears(); setTimeout(gogogo.bind(null, false), 10);
//  } )
// document.getElementById("water").addEventListener("change", function() {
//    showGears(); setTimeout(gogogo.bind(null, false), 10);
//  } )
// document.getElementById("sand").addEventListener("change", function() {
//    showGears(); setTimeout(gogogo.bind(null, false), 10);
//  } )
// document.getElementById("land").addEventListener("change", function() {
//    showGears(); setTimeout(gogogo.bind(null, false), 10);
//  } )
// document.getElementById("mountain").addEventListener("change", function() {
//    showGears(); setTimeout(gogogo.bind(null, false), 10);
//  } )
// document.getElementById("heightScale").addEventListener("change", function() {
//    showGears(); setTimeout(gogogo.bind(null, false), 10);
//  } )

document.getElementById("aboutButton").addEventListener("click", openAbout)
