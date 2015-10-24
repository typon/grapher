function node_click_action () {
	graphObject.level = graphObject.level+1;

	node_hover_out_action(this.node.id);
}

function node_hover_in_action (nodeId) {
	//console.profile('Node hover in')
	try {
			svgId = this.node.id;

		} catch (e) {
						svgId = nodeId;

		}
	//svgId = this.node.id;
	svgId = svgId.match(/\d+/)[0];


	actualId = graphObject.nodesSvgIdsDict[svgId];


	var objType = 'node';
	var level = graphObject.level;
	get_all_connected_nodes(actualId, objType, level, node_hover_in_action_callback);
	get_all_connected_edges(actualId, objType, level, node_hover_in_action_callback);

}
function node_hover_in_action_callback (connectedObjectsSet, objType) {

	//console.log("In callback");
	//Lower the opacity of all nodes not connected to this edge
	if (objType == 'node') {

		var allNodesSet = graphObject.get_all_nodes();
		//console.log("all_nodes_set");
		//console.log(all_nodes_set[99]);
		//console.log("connectedNodesSet");
		//console.log(connectedNodesSet);
		var unconnectedNodesSet = so.difference(allNodesSet,connectedObjectsSet);
		//console.log("unconnectedNodesSet");
		//console.log(unconnectedNodesSet);


		/*unconnectedNodesSet.forEach(function(nodeNum){

			var svgNodeId = graphObject.nodesActualIdsDict[nodeNum];
			var nodeId = "#node" + svgNodeId;

			snapObject.select(nodeId).attr({opacity:0.1});

		}
		);*/
		
		async.each(unconnectedNodesSet, function(unconnectedNodeId, callback) {
			var svgNodeId = graphObject.nodesActualIdsDict[unconnectedNodeId];
			var nodeId = "#node" + svgNodeId;
			//snapObject.select(nodeId).attr({opacity:0.1});
			$(nodeId).attr('opacity',0.1);
		}, function(err){
		    if( err ) {
		      // One of the iterations produced an error.
		      // All processing will now stop.
		      console.log('A node failed to process');
		    }
		});

	} else if (objType == 'edge') {

		var allEdgesSet = graphObject.get_all_edges();
		//console.log("all_nodes_set");
		//console.log(all_nodes_set[99]);
		console.log("connectedEdges");
		var unconnectedEdgesSet = so.difference(allEdgesSet,connectedObjectsSet);
		//console.log("unconnectedNodesSet");
		//console.log(unconnectedNodesSet);


		async.each(unconnectedEdgesSet, function(unconnectedEdgeId, callback) {
			var svgEdgeId = graphObject.edgesActualIdsDict[unconnectedEdgeId];
			var edgeId = "#edge" + svgEdgeId;
//			snapObject.select(edgeId).attr({opacity:0.1});
			$(edgeId).attr('opacity',0.1);

		}, function(err){
		    if( err ) {
		      // One of the iterations produced an error.
		      // All processing will now stop.
		      console.log('A node failed to process');
		    }
		});		
	}


}


function node_hover_out_action (nodeId, caller_function) {
	//console.profile('Node hover out')
	//clearTimeout($.data(this, "timer"));
	var selectiveOpaque = false;
try {
			svgId = this.node.id;

		} catch (e) {

						svgId = nodeId;
						//if nodeId exists,
						//we know its called from mouseclick
						selectiveOpaque = true;

		}
		if (selectiveOpaque) {
			svgId = svgId.match(/\d+/)[0];

//typically just make everything have
//opacity 1
//if coming from a click action however,
//only turn the opacity of things connected in
//a certaaain level to 1



	actualId = graphObject.nodesSvgIdsDict[svgId];


	var objType = 'node';
	var level = graphObject.level;

	get_all_connected_nodes(actualId, objType, level, node_hover_out_action_callback);
	get_all_connected_edges(actualId, objType, level, node_hover_out_action_callback);

	graphObject.level = 1;


		}  else {
			node_hover_out_action_callback();

		}

}

function node_hover_out_action_callback (connectedObjectsSet, objType) {
	console.log (node_hover_out_action_callback.caller)
   // console.log("Out callback");
	//console.log(connectedObjectsSet);
	//console.log(objType);
	//Increase the opacity of all edges not connected to this edge
	if (objType == 'node') {
		var allNodesSet = graphObject.get_all_nodes();
		//console.log("all_nodes_set");
		//console.log(all_nodes_set[99]);
		//console.log("connectedNodesSet");
		//console.log(connectedNodesSet);
		var unconnectedNodesSet = so.difference(allNodesSet,connectedObjectsSet);
		//console.log("unconnectedNodesSet");
		//console.log(unconnectedNodesSet);


		async.each(unconnectedNodesSet, function(unconnectedNodeId, callback) {
			var svgNodeId = graphObject.nodesActualIdsDict[unconnectedNodeId];
			var nodeId = "#node" + svgNodeId;
			//snapObject.select(nodeId).attr({opacity:1});
			$(nodeId).attr('opacity',1);

		}, function(err){
		    if( err ) {
		      // One of the iterations produced an error.
		      // All processing will now stop.
		      console.log('A node failed to process');
		    }
		});

	} else if (objType == 'edge') {
		var allEdgesSet = graphObject.get_all_edges();
		//console.log("all_nodes_set");
		//console.log(all_nodes_set[99]);
		//console.log("connectedNodesSet");
		//console.log(connectedNodesSet);
		var unconnectedEdgesSet = so.difference(allEdgesSet,connectedObjectsSet);
		//console.log("unconnectedNodesSet");
		//console.log(unconnectedNodesSet);



		async.each(unconnectedEdgesSet, function(unconnectedEdgeId, callback) {
			var svgEdgeId = graphObject.edgesActualIdsDict[unconnectedEdgeId];
			var edgeId = "#edge" + svgEdgeId;
			//snapObject.select(edgeId).attr({opacity:1});
			$(edgeId).attr('opacity',1);
		}, function(err){
		    if( err ) {
		      // One of the iterations produced an error.
		      // All processing will now stop.
		      console.log('A node failed to process');
		    }
		});			
	}

}
