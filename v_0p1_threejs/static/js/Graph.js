//creating Graph class
var Graph = function () {

	//assert(typeof snapObject === "object", "No snapObject found.");
	//assert(typeof fragmentObject === "object", "No fragmentObject found.");

	console.log('Main Graph created');

	console.log('Populating nodes set');
	this.create_nodes_set();
	this.create_nodes_ids_dicts();

	console.log('Populating edge set');
	this.create_edges_set();
	this.create_edges_ids_dict();

	console.log('Creating empty dict that stores edges and all their connected nodes');
	this.create_edgesNodesConnections_dict();

	console.log('Creating empty dict that stores nodes and all their connected nodes');
	this.create_nodesNodesConnections_dict();

	console.log('Creating empty dict that stores edges and all their connected edges');
	this.create_edgesEdgesConnections_dict();

	console.log('Creating empty dict that stores nodes and all their connected edges');
	this.create_nodesEdgesConnections_dict();

	console.log('Setting traversal level default to 1');
	this.level = 1;

}
//****************************
//START Graph Class FUNCTIONS
//****************************
//returns a Set of all nodes in Graph
Graph.prototype.get_all_nodes = function() {
//	console.log("getting all nodes");
	//console.log(this.nodes_set);
	return this.nodes_set;
}
//returns a Set of all nodes in Graph
Graph.prototype.get_number_of_nodes = function() {
//	console.log("getting all nodes");
	//console.log(this.nodes_set);
	return this.nodes_set.length;
}
//returns a Set of all edges in Graph
Graph.prototype.get_all_edges = function() {
//	console.log("getting all nodes");
	//console.log(this.nodes_set);
	return this.edges_set;
}
//creates a Set of all nodes in Graph
//The ids are DOT ids, not SVG ids
Graph.prototype.create_nodes_set = function() {
	
	var all_nodes = svgObject.node.getElementsByClassName("node");
	var nodes_set_tmp = new Set();
	for (node of all_nodes) {	
		
		//the actual ID that python knows, stored in title tag
		svgId = node.id;
		svgId = svgId.match(/\d+/)[0];

		actualId =node.firstChild.innerHTML;
		nodes_set_tmp.add(actualId);
		
	}
	
	this.nodes_set = nodes_set_tmp;
	//console.log(this.nodes_set);
}

//creates a Set of all nodes in Graph
Graph.prototype.create_edges_set = function() {
	var edges = svgObject.node.getElementsByClassName("edge");

	var edges_set_temp = new Set(null);
	for (edge of edges) {	


		svgId = edge.id;
		svgId = svgId.match(/\d+/)[0];

		actualId = edge.firstChild.innerHTML;
		actualId = htmlDecode(actualId);
  
  		


		startingNodeWithPort = actualId.split("->")[0];
		endingNodeWithPort = actualId.split("->")[1];
		//check if node has a port
		if (endingNodeWithPort.indexOf(":") > -1) {
			startingNode = startingNodeWithPort.split(":")[0]
			startingPort = startingNodeWithPort.split(":")[1]
		} else {
			startingNode = startingNodeWithPort;
			startingPort = "";
		}
		if (endingNodeWithPort.indexOf(":") > -1) {
			endingNode = endingNodeWithPort.split(":")[0]
			endingPort = endingNodeWithPort.split(":")[1]
		} else {
			endingNode = endingNodeWithPort;
			endingPort = "";
		}

		//actual id consists of four number array, seperated by comma stored as str:
		//[startingNode, startingNodePort, endingNode, endingNodePort]
		actualIdArray = [startingNode,startingPort,endingNode,endingPort];
		actualId = actualIdArray.join([separator = ','])

		edges_set_temp.add(actualId);


	}
	this.edges_set = edges_set_temp;



}
//create dict of all nodes as keys
//and connected nodes as value arrays
Graph.prototype.create_nodesNodesConnections_dict = function() {
	this.nodesNodesConnections = {};
	

}
//create dict of all edges as keys
//and connected nodes as value arrays
Graph.prototype.create_edgesNodesConnections_dict = function() {
	this.edgesNodesConnections = {};
	//this.edgesNodesConnections[this.level] = {};
}
//create dict of all nodes as keys
//and connected edges as value arrays
Graph.prototype.create_nodesEdgesConnections_dict = function() {
	this.nodesEdgesConnections = {};
	//this.nodesEdgesConnections[this.level] = {};
}
//create dict of all edges as keys
//and connected edges as value arrays
Graph.prototype.create_edgesEdgesConnections_dict = function() {
	this.edgesEdgesConnections = {};
	//this.edgesEdgesConnections[this.level] = {};
}
//creates a dic that contains pairs of
//svg ids and actual DOT ids that python knows
//extracted from the title
Graph.prototype.create_nodes_ids_dicts = function() {
	var all_nodes = svgObject.node.getElementsByClassName("node");
	
	//console.log(nodes);
	var nodesIdsDictTemp1 = {};
	var nodesIdsDictTemp2 = {};
	for (node of all_nodes) {	
		//the actual ID that python knows, stored in title tag
		svgId = node.id;
		svgId = svgId.match(/\d+/)[0];
		actualId = node.firstChild.innerHTML;
		nodesIdsDictTemp1[actualId] = svgId;
		nodesIdsDictTemp2[svgId] = actualId;

		
	}
	
	this.nodesActualIdsDict = nodesIdsDictTemp1;
	this.nodesSvgIdsDict = nodesIdsDictTemp2;
	//console.log(this.nodesActualIdsDict);
	//console.log(this.nodesSvgIdsDict);
}
//creates a dic that contains pairs of
//svg ids and actual DOT ids that python knows
//extracted from the title
Graph.prototype.create_edges_ids_dict = function() {
	var edges = svgObject.node.getElementsByClassName("edge");

	
	//console.log(nodes);
	var edgesIdsDictTemp1 = {};
	var edgesIdsDictTemp2 = {};
	for (edge of edges) {	
		//the actual ID that python knows, stored in title tag
		svgId = edge.id;
		svgId = svgId.match(/\d+/)[0];

		actualId = edge.firstChild.innerHTML;
		actualId = htmlDecode(actualId);
  
  		


		startingNodeWithPort = actualId.split("->")[0];
		endingNodeWithPort = actualId.split("->")[1];
		//check if node has a port
		if (endingNodeWithPort.indexOf(":") > -1) {
			startingNode = startingNodeWithPort.split(":")[0]
			startingPort = startingNodeWithPort.split(":")[1]
		} else {
			startingNode = startingNodeWithPort;
			startingPort = "";
		}
		if (endingNodeWithPort.indexOf(":") > -1) {
			endingNode = endingNodeWithPort.split(":")[0]
			endingPort = endingNodeWithPort.split(":")[1]
		} else {
			endingNode = endingNodeWithPort;
			endingPort = "";
		}

		//actual id consists of four number array, seperated by comma stored as str:
		//[startingNode, startingNodePort, endingNode, endingNodePort]
		actualIdArray = [startingNode,startingPort,endingNode,endingPort];
		actualId = actualIdArray.join([separator = ','])

		edgesIdsDictTemp1[actualId] = svgId;
		edgesIdsDictTemp2[svgId] = actualId ;
	}
	
	this.edgesActualIdsDict = edgesIdsDictTemp1;
	this.edgesSvgIdsDict = edgesIdsDictTemp2;
	//console.log(this.nodes_set);
}


//****************************//
//END Graph Class FUNCTIONS
//****************************//