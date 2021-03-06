var svgManager = new THREE.SVGLoader();
var url = 'NewTux.svg';

function svg_loading_done_callback(doc) {
  init(new THREE.SVGObject(doc));
  animate();
};

svgManager.load(url, 
                svg_loading_done_callback, 
                function(){console.log("Loading SVG...");},
                function(){console.log("Error loading SVG!");
                });

var AMOUNT = 100;
var camera, scene, renderer;

function init(svgObject) {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 500;
  scene = new THREE.Scene();

  svgObject.position.x = Math.random() * 1000 - 500;
  svgObject.position.y = Math.random() * 1000 - 500;
  svgObject.position.z = Math.random() * 1000 - 500;
  scene.add(svgObject);

  var ambient = new THREE.AmbientLight(0x80ffff);
  scene.add(ambient);
  var directional = new THREE.DirectionalLight(0xffff00);
  directional.position.set(-1, 0.5, 0);
  scene.add(directional);
  renderer = new THREE.SVGRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(window.innerWidth, window.innerHeight-5);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  var time = Date.now() * 0.0002;
  camera.position.x = Math.sin(time) * 500;
  camera.position.z = Math.cos(time) * 500;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}