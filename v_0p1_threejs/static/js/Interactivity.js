function Interactivity(){ 
	/*this.objType=name;
	this.offspring=[];
	*/
	//var _level = 1;
	

} 
Interactivity.prototype.increment_level=function(level, objId){ 
	var newLevel = level;
	//debugger;
	if (!(level in graphObject.nodesNodesConnections)) {
			graphObject.nodesNodesConnections[level] = {};
			graphObject.nodesEdgesConnections[level] = {};
			graphObject.edgesNodesConnections[level] = {};
			graphObject.edgesEdgesConnections[level] = {};

	}
	if (!((level+1) in graphObject.nodesNodesConnections)) {
			graphObject.nodesNodesConnections[level+1] = {};
			graphObject.nodesEdgesConnections[level+1] = {};
			graphObject.edgesNodesConnections[level+1] = {};
			graphObject.edgesEdgesConnections[level+1] = {};

	}
	//debugger;
	if (level in graphObject.nodesNodesConnections) {
		//only incr level if we are not covering 
		//more nodes every lvl
		if (level+1 in graphObject.nodesNodesConnections) {
			var nextLvlArray = graphObject.nodesNodesConnections[level+1][objId];
			if (typeof nextLvlArray != "undefined") {
				var nextLvlArrayLen = Array.from(nextLvlArray).length;
			} else {
				var nextLvlArrayLen = -1;
			}
			//debugger;
			currentLvlArray = graphObject.nodesNodesConnections[level][objId];
			if (typeof currentLvlArray != "undefined") {
				var currentLvlArrayLen = Array.from(currentLvlArray).length;
			} else {
				var currentLvlArrayLen = -1;
			}

				
			if (nextLvlArrayLen == -1) {
			   	newLevel = level + 1;
			
			} 
			//debugger;
			try {
				var prevLvlArray = graphObject.nodesNodesConnections[level-1][objId];
			} catch (e) {
				var prevLvlArray = [];
			}
			if (typeof prevLvlArray != "undefined") {
				var prevLvlArrayLen = Array.from(prevLvlArray).length;
			} else {
				var prevLvlArrayLen = -1;
			}
			if (currentLvlArrayLen == prevLvlArrayLen ) {
	 			newLevel = level;
			} else if (currentLvlArrayLen > prevLvlArrayLen) {
				newLevel = level + 1;
			}
			

		}
	}


	return newLevel;
}


Interactivity.prototype.click_in_action=function(objId,objType){ 
	//this._level = 2
	//debugger;
	this._level = Interactivity.prototype.increment_level(this._level, objId);
	this.hover_out_action(objId, objType, this._level);
}

Interactivity.prototype.hover_in_action=function(objId,objType){ 
	
	level = 1;
	
	//var objType = 'node';
	get_all_connected_nodes(objId, objType, level, Interactivity.prototype.hover_in_action_callback);
	get_all_connected_edges(objId, objType, level, Interactivity.prototype.hover_in_action_callback);

} 
Interactivity.prototype.hover_out_action=function(objId, objType, newLevel){ 
//	console.log("hover out");
	if (typeof newLevel != "undefined") {
		get_all_connected_nodes(objId, objType, newLevel, Interactivity.prototype.hover_out_action_callback);
		get_all_connected_edges(objId, objType, newLevel, Interactivity.prototype.hover_out_action_callback);


	} else {
		//make eveerything visible
		var all_nodes = svgObject.node.getElementsByClassName("node");
		var all_edges = svgObject.node.getElementsByClassName("edge");
		var all_objects = svgObject.node.querySelectorAll('.edge, .node');

//$(".node").attr('opacity',0.5);			
			//	var nodes = $(".node");

		
		//for (node of all_nodes) {
	//	console.log(all_objects);
		for (node of all_objects) {
		//	console.log("Setting opaicty of" + node.id+ " to 1");
			 
			var objectId = "#" + node.id;
			//$(objectId).animate({opacity:1},1500);


			
			node.style.opacity = 1;
			//$(objectId).attr('opacity',0.5);
			//console.log('seetting opacity 1 for node.id = ' + node.id);
				//console.log('seetting opacity 1 for node = ' + node);
		}
		this._level = 1;


			//$("svg").find("node").animate({opacity:1},1500);
			//$("*").attr('opacity',1);
		//}

	}
	

} 
Interactivity.prototype.hover_in_action_callback=function(connectedObjectsSet, objType){ 
	//console.log("In callback");
	//Lower the opacity of all nodes not connected to this edge
	var allObjectsSet;
	if (objType == 'node') {

		allObjectsSet = graphObject.get_all_nodes();
	} else if (objType == 'edge') {
		allObjectsSet = graphObject.get_all_edges();

	}	
	var unconnectedObjectsSet = so.difference(allObjectsSet,connectedObjectsSet);


	
	async.each(unconnectedObjectsSet, function(unconnectedObjectId, callback) {
				//console.log(unconnectedObjectId);
		
		if (objType == 'node') {
			var svgObjectId = graphObject.nodesActualIdsDict[unconnectedObjectId];
			var objectId = "node" + svgObjectId;
		} else if (objType == 'edge') {
			var svgObjectId = graphObject.edgesActualIdsDict[unconnectedObjectId];
			var objectId = "edge" + svgObjectId;
		}
	//	if (svgObjectId == 11) {
		//	debugger;
	//	}

		//$(objectId).attr('o(pacity',0.1);
		//$(objectId).animate({opacity:0.1},1500);
		var nodes = svgObject.node.getElementById(objectId);

		//console.log(nodes)
		//console.log(svgObjectId);
		nodes.style.opacity = '0';
		

	}, function(err){
	    if( err ) {
	      // One of the iterations produced an error.
	      // All processing will now stop.
	      console.log('A node failed to process');
	    }
	});
}
Interactivity.prototype.hover_out_action_callback=function(connectedObjectsSet, objType){ 
	//console.log("In callback");
	//Lower the opacity of all nodes not connected to this edge
	//debugger;
	var allObjectsSet;
	if (objType == 'node') {

		allObjectsSet = graphObject.get_all_nodes();
	} else if (objType == 'edge') {
		allObjectsSet = graphObject.get_all_edges();

	}	
	//var unconnectedObjectsSet = so.difference(allObjectsSet,connectedObjectsSet);

	
	//console.log(Array.from(connectedObjectsSet));
	//async only works on arrays not sets
	connectedObjectsArray = Array.from(connectedObjectsSet);
	//debugger;
	async.each(connectedObjectsArray, function(connectedObjectId, callback) {
		
		//console.log(connectedObjectId);
		if (objType == 'node') {
			var svgObjectId = graphObject.nodesActualIdsDict[connectedObjectId];
			var objectId = "node" + svgObjectId;
		} else if (objType == 'edge') {
			var svgObjectId = graphObject.edgesActualIdsDict[connectedObjectId];
			var objectId = "edge" + svgObjectId;
		}
		var object = svgObject.node.getElementById(objectId);

//		console.log(object.id);
		object.style.opacity = 1;
	}, function(err){
	    if( err ) {
	      // One of the iterations produced an error.
	      // All processing will now stop.
	      console.log('A node failed to process');
	    }
	});
}
Interactivity.prototype.mouse_move_event = function(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		

}

/*Mammal.prototype.toString=function(){ 
	return '[Mammal "'+this.name+'"]';
} 
*/

NodeInteractivity.prototype = new Interactivity();        // Here's where the inheritance occurs 
NodeInteractivity.prototype.constructor=NodeInteractivity;   
NodeInteractivity.prototype.parent = Interactivity.prototype;
function NodeInteractivity(){ 
	var self = this;

	this._level = 1;
	
	//neded to detect mouseover
	this._raycaster = new THREE.Raycaster();
	this._mouse = new THREE.Vector2();

	var all_nodes = svgObject.node.querySelectorAll(".node");
	
	for (node of all_nodes) {

		//only start hovering after a delay of 400ms
		/*node.hover(function() {
			$.data(this, "timer", setTimeout($.proxy(function() {
    			node_hover_in_action(node);
  			}, this), 400));
		  			
		}, node_hover_out_action);
		*/
		//node = all_nodes[i];
		//debugger;

		//node.hover(function() {
			//$.data(this, "timer", setTimeout($.proxy(function() {
    		//	node_hover_in_action(node);
  		//	}, this), 400));
		//  
		node.style.opacity = 1;
		node.style.MozTransition = 'opacity 0.5s ease-in-out';
		//node.style.transition = 'opacity 1s ease-in-out';
		//node.style.setProperty('-webkit-transition', 'opacity 1s ease-in-out');

		//Only activate hovering after 0.5 seconds
		
		//console.log(prefix);

		// update the picking ray with the camera and mouse position	
		//  raycaster.setFromCamera( mouse, camera );	
		
		node.style.opacity =  1;
		node.onmouseenter = function (){
//				$.data(this, "timer", setTimeout($.proxy(function() {
			//		console.log("triggering");
					var objType = 'node';
					var svgId = this.id;
					svgId = svgId.match(/\d+/)[0];

					var actualNodeId = graphObject.nodesSvgIdsDict[svgId];
					self.hover_in_action(actualNodeId,objType);	
//				}, this), 50));
				//}, this), 500));
		};

		node.onmouseleave = function (){
			//console.log("leaving");
			var objType = 'node';
			var svgId = this.id;
			svgId = svgId.match(/\d+/)[0];

			var actualNodeId = graphObject.nodesSvgIdsDict[svgId];
			self.hover_out_action(actualNodeId,objType);
//			clearTimeout($.data(this, "timer"));

		};
		
		node.onclick = function() {
			var objType = 'node';
			var svgId = this.id;
			svgId = svgId.match(/\d+/)[0];

			var actualNodeId = graphObject.nodesSvgIdsDict[svgId];
			self.click_in_action(actualNodeId,objType);			
		}
		
		
		//node.click(this.node_click_action);

		//node.mouseover(node_hover_in_action);
		//node.mouseout(node_hover_out_action);
	}
	
	graphObject.nodesNodesConnections[1] = {};
	graphObject.nodesEdgesConnections[1] = {};
}
NodeInteractivity.prototype.click_in_action=function(objId,objType){
	this.parent.click_in_action.call(this, objId,objType); 
} 
NodeInteractivity.prototype.hover_in_action=function(objId,objType){
	this.parent.hover_in_action.call(this, objId,objType); 
}
NodeInteractivity.prototype.hover_out_action=function(objId,objType,level){

	this.parent.hover_out_action.call(this, objId,objType,level); 
}

EdgeInteractivity.prototype = new Interactivity();        // Here's where the inheritance occurs 
EdgeInteractivity.prototype.constructor=EdgeInteractivity;   
EdgeInteractivity.prototype.parent = Interactivity.prototype;
function EdgeInteractivity(){

	var self = this;
	this._level = 1;

	

	var all_edges = svgObject.node.querySelectorAll(".edge");
	
	for (edge of all_edges) {

		edge.style.opacity =  1;

		edge.style.MozTransition = 'opacity 0.5s ease-in-out';

		//disable edge interaction for now
		
		/*edge.onmouseenter = function (){
//				$.data(this, "timer", setTimeout($.proxy(function() {
			//		console.log("triggering");
					var objType = 'edge';
					var svgId = this.id;
					svgId = svgId.match(/\d+/)[0];

					var actualEdgeId = graphObject.edgesSvgIdsDict[svgId];
					self.hover_in_action(actualEdgeId,objType);	
//				}, this), 50));
				//}, this), 500));
		};

		edge.onmouseleave = function (){
			//console.log("leaving");
			var objType = 'edge';
			var svgId = this.id;
			svgId = svgId.match(/\d+/)[0];

			var actualEdgeId = graphObject.edgesSvgIdsDict[svgId];
			self.hover_out_action(actualEdgeId,objType);
//			clearTimeout($.data(this, "timer"));

		};

*/
		//node.click(this.node_click_action);

		//node.mouseover(node_hover_in_action);
		//node.mouseout(node_hover_out_action);
	}
	graphObject.edgesNodesConnections[1] = {};
	graphObject.edgesEdgesConnections[1] = {};
} 

EdgeInteractivity.prototype.click_in_action=function(objId,objType){
	this.parent.click_in_action.call(this, objId,objType); 
} 
EdgeInteractivity.prototype.hover_in_action=function(objId,objType){
	this.parent.hover_in_action.call(this, objId,objType); 
}
EdgeInteractivity.prototype.hover_out_action=function(objId,objType){
	this.parent.hover_out_action.call(this, objId,objType); 
}

