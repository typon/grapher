
var snapObject;
var fragmentObject;
var graphObject; 
var nodeInteractivity;
var edgeInteractivity;
var so = setOps;
var z=0;
var camera;
var scene;
var renderer;
var svgObject;
$( document ).ready(function() {

	init();
	load_svg();
			


	/*var node = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
	node.setAttribute( 'stroke', 'black' );
	node.setAttribute( 'fill', 'red' );
	node.setAttribute( 'r', '40' );

for ( var i = 0; i < 50; i ++ ) {

				

	}*/
	window.addEventListener( 'resize', onWindowResize, false );

});
function init() {

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0001, 1000000 );
	camera.position.z = 500;
	fov = camera.fov;
	scene = new THREE.Scene();
}
function load_svg(fragment) {

	var svgManager = new THREE.SVGLoader();
	var url = '/svg/graph.svg';
	svgManager.load ( 
		url, svg_loading_done_callback, function(){console.log("Loading SVG...");}, function(){console.log("Error loading SVG!");} 
	);
	

   // var doc = document.getElementById("svg1").getSVGDocument();
    
		    
		/*var obj = document.createElement('object', true);
		obj.setAttribute('type', 'image/svg+xml');
		obj.setAttribute('data', '/svg/graph.svg');
		obj.setAttribute('width', '500');
		obj.setAttribute('height', '500');
		svg_loading_done_callback(obj);*/

    //var rect = doc.querySelector("rect"); // suppose our image contains a <rect>
    //rect.setAttribute("fill", "green");
}


function svg_loading_done_callback(svgDoc) {
	console.log(svgDoc);
	//var doc = this.getSVGDocument();
	
	/*var root = document.createElementNS(svgns, 'svg');
	root.setAttribute('width', 200);
	root.setAttribute('height', 200);
	*/
	//var svgns = "http://www.w3.org/2000/svg";
	//var root = svgObject.nextSibling.nextElementSibling.children[0];
	//console.log(root);

	//var r = ((SVGDocument) (svgObject)).createElementNS(SVGNS, "use");
	//svgObject = svgObject.firstElementChild.firstElementChild;
	//console.log(svgObject);
	   // var object = new THREE.CSS3DObject( svgObject );
	//var node = svgObject.nextSibling.nextElementSibling.children[0];
	//console.log(svgObject.getElementsByTagName("svg"));
		
svgDoc.setAttribute('height', '600');
	svgDoc.setAttribute('width', '600');
	svgObject = new THREE.SVGObject(svgDoc);
	svgObject.position.x = -50;
	svgObject.position.y = 200;
	svgObject.position.z = 1;
    svgObject.scale.set (0.01, 0.01, 0.01);

	//debugger;
	scene.add(svgObject);

	var nodeobj = svgObject.node.getElementById("node1");
	var nodeobjs = svgObject.node.getElementsByClassName("node");
//	debugger;
//	console.log(nodeobj);
//	nodeobj.setAttribute ('opacity', 0);
	/*/////*var node = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
				node.setAttribute( 'stroke', 'black' );
				node.setAttribute( 'fill', 'red' );
				node.setAttribute( 'r', '40' );
				console.log(node);*/
		//scene.add( svgObject );
		/*var node = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
				node.setAttribute( 'stroke', 'black' );
				node.setAttribute( 'fill', 'red' );
				node.setAttribute( 'r', '40' );

				for ( var i = 0; i < 50; i ++ ) {

					var object = new THREE.SVGObject( node.cloneNode() );
					object.position.x = Math.random() * 1000 - 500;
					object.position.y = Math.random() * 1000 - 500;
					object.position.z = Math.random() * 1000 - 500;
					scene.add( object );

				}*/


  var ambient = new THREE.AmbientLight(0x80ffff);
  scene.add(ambient);
  var directional = new THREE.DirectionalLight(0xffff00);
  directional.position.set(-1, 0.5, 0);
  scene.add(directional);
  renderer = new THREE.SVGRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

	graphObject = new Graph();


  	set_all_nodes_interactivity();
  	set_all_edges_interactivity();

	/*var $panzoom = $("#svg").panzoom();

	$panzoom.parent().on('mousewheel.focal', function( e ) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
              increment: 0.1,
              animate: false,
              focal: e
            });
          });
	
	fragmentObject = fragment;

	//alert( "Thanks for visiting!" );


	g = fragment.select("g");

	//add the entire graph to Snap
	snapObject.append(g);

	set_all_nodes_interactivity ();
	

	//set_all_edges_interactivity (fragment);
	*/
	
	animate();

}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
/*function set_all_nodes_interactivity () {
	
	all_nodes = fragmentObject.selectAll(".node");	

	all_nodes.forEach(function(node){

		//only start hovering after a delay of 400ms
		//node.hover(function() {
			//$.data(this, "timer", setTimeout($.proxy(function() {
    		//	node_hover_in_action(node);
  		//	}, this), 400));
		//  			
		//}, node_hover_out_action);

		node.hover(node_hover_in_action,node_hover_out_action);

		node.click(node_click_action);

		//node.mouseover(node_hover_in_action);
		//node.mouseout(node_hover_out_action);
	}
	);
}
*/
var requested = false;
function animate() {
		console.log("animate");
		if (requested == false) {
			requested = true;
			requestAnimationFrame( animate );
		}

		render();
	//	stats.update();

	}
 
window.addEventListener('wheel', mousewheel, false);
//window.addEventListener('mousewheel', mousewheel, false);

function mousewheel(event) {

    var fovMAX = 16000;
    var fovMIN = 0.001;
  //  console.log(event);
    //camera.fov -= event.deltaY * 5;
    //camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
   // console.log(event.deltaY);
 //   console.log(camera.position.z);
    camera.position.z -= event.deltaY * 5000;
    var xScale = svgObject.scale.x * Math.pow(10,  (event.deltaY * 0.01));
    var yScale = svgObject.scale.y * Math.pow(10,  (event.deltaY * 0.01));
    var zScale = svgObject.scale.z * Math.pow(10,  (event.deltaY * 0.01));
    
    //svgObject.translateZ(10);
    svgObject.scale.set (xScale, yScale, 1);
    svgObject.updateMatrix ();
    console.log(svgObject.scale.y);
   //var obj= svgObject.getObjectById ('#node0');
    //svgObject.visible = false;


   //debugger;
   // camera.zoom  -= event.deltaY * 0.5;
    //camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, window.innerWidth / window.innerHeight, camera.near, camera.far);

}



function render() {
  //var time = Date.now() * 0.0002;
  //camera.position.x = 0;
  //camera.position.z = 10000;

  //camera.lookAt(scene.position);

  // update the picking ray with the camera and mouse position	
//raycaster.setFromCamera( mouse, camera );	

  renderer.render(scene, camera);
  //debugger;
}
function set_all_nodes_interactivity () {
	nodeInteractivity = new NodeInteractivity();
	//edgeInteractivity = new EdgeInteractivity();

}
function set_all_edges_interactivity () {

	edgeInteractivity = new EdgeInteractivity();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();