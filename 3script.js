function start3D() {

var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()

camera = new THREE.PerspectiveCamera(
    35, // angle
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near plane (range to render)
    1000 // far plane
);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement);

scene.background = new THREE.Color( 0xe4e4e4 );

var light = new THREE.AmbientLight(0xffffff)
scene.add(light)

var boxCount = 10
var box = {}
for(i=0; i<boxCount; i++) {
    var boxSize = randomNum(2, 20)
    var whiteLevel = Math.floor(randomNum(170, 245))
    box[i] = {}
    box[i].object = new THREE.Mesh(
        new THREE.BoxGeometry(boxSize, boxSize, boxSize),
        new THREE.MeshBasicMaterial({color:`rgb(${whiteLevel}, ${whiteLevel}, ${whiteLevel})`})
    )

    var boxSpin = randomNum(-0.05, 0.05)
    var boxSpinAxis = Math.floor(randomNum(1,3))
    box[i].boxSpinX = boxSpinAxis === 1 ? boxSpin : 0
    box[i].boxSpinY = boxSpinAxis === 2 ? boxSpin : 0
    box[i].boxSpinZ = boxSpinAxis === 3 ? boxSpin : 0

    box[i].object.position.set(randomNum(-30, 30), randomNum(-30, 30), randomNum(-30, 30));
    // box[i].object.position.set(randomNum(-100, 100), randomNum(-100, 100), randomNum(-100, 100));
    scene.add(box[i].object)
}

camera.position.z = 100;
scene.add(camera);

function render() {
    // box[4].object.position.x += 1
    // for(i=0; i<boxCount; i++) {
    //     box[i].object.rotation.x += box[i].boxSpinXbox
    //     box[i].object.rotation.y += box[i].boxSpinY
    //     box[i].object.rotation.z += box[i].boxSpinZ
    // }
    camera.rotation.z += 0.004
    // camera.rotation.y += 0.001
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render()

function randomNum(max = 30, min = 2) {
    var range = max-min
    return (Math.random()*range)+min;
}
function randomTrue() {
    return Math.random()>0.5 ? true : false;
}

}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var three = getUrlVars()["3d"];
if(three === true || three == "on") {
    start3D()
}
