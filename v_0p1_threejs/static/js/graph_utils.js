
function get_all_connected_nodes(objId, objType, level, callback_function_to_return_to) {

	
	//check if this info exists in dict already
	if (objType == 'edge') {
		//console.log(graphObject.edgesNodesConnections);

		//console.log(graphObject.edgesNodesConnections[objId]);
		if (objId in graphObject.edgesNodesConnections) {
			callback_function_to_return_to(graphObject.edgesNodesConnections[objId], 'node');
		}
		else {
			$.getJSON('/get_all_connected_nodes', {
				objId: objId,
				objType: objType,
				level: level,

			}, function(data_from_python) {

				var connectedNodesArray = [for (x of data_from_python.result) x];
				connectedNodesSet = new Set(connectedNodesArray)
				

				graphObject.edgesNodesConnections[objId] = connectedNodesSet;
				//console.log(graphObject);

				callback_function_to_return_to(graphObject.edgesNodesConnections[objId], 'node');

			});

		}
		//obtained all connected nodes, now perform the action
	}
	else if (objType == 'node') {


		if (objId in graphObject.nodesNodesConnections) {
			callback_function_to_return_to(graphObject.nodesNodesConnections[objId], 'node');
		}
		else {
			$.getJSON('/get_all_connected_nodes', {
				objId: objId,
				objType: objType,
				level: level,


			}, function(data_from_python) {
				//console.log(data_from_python);

				var connectedNodesArray = [for (x of data_from_python.result) x];
				connectedNodesSet = new Set(connectedNodesArray)
				//console.log(connectedNodesSet);

				graphObject.nodesNodesConnections[objId] = connectedNodesSet;
				

				callback_function_to_return_to(graphObject.nodesNodesConnections[objId], 'node');

			});

		}
		//obtained all connected nodes, now perform the action
	}


}

function get_all_connected_edges(objId, objType, level, callback_function_to_return_to) {

	
	//check if this info exists in dict already
	if (objType == 'edge') {
		//console.log(graphObject.edgesNodesConnections);

		//console.log(graphObject.edgesNodesConnections[objId]);
		if (objId in graphObject.edgesEdgesConnections) {
			callback_function_to_return_to(graphObject.edgesEdgesConnections[objId], 'edge');
		}
		else {
			$.getJSON('/get_all_connected_edges', {
				objId: objId,
				objType: objType,
				level: level,


			}, function(data_from_python) {

				var connectedEdgesArray = [for (x of data_from_python.result) x];
				connectedEdgesSet = new Set(connectedEdgesArray)
				

				graphObject.edgesEdgesConnections[objId] = connectedEdgesSet;
				//console.log(graphObject);

				callback_function_to_return_to(graphObject.edgesEdgesConnections[objId], 'edge');

			});

		}
		//obtained all connected nodes, now perform the action
	}
	else if (objType == 'node') {


		if (objId in graphObject.nodesEdgesConnections) {
			//console.log(Array.from(graphObject.nodesEdgesConnections[objId]))
			callback_function_to_return_to(graphObject.nodesEdgesConnections[objId], 'edge');
		}
		else {
			$.getJSON('/get_all_connected_edges', {
				objId: objId,
				objType: objType,
				level: level,


			}, function(data_from_python) {
				//console.log(data_from_python);

				var connectedEdgesArray = [for (x of data_from_python.result) x];
				connectedEdgesSet = new Set(connectedEdgesArray)

				//console.log(connectedNodesSet);
				graphObject.nodesEdgesConnections[objId] = connectedEdgesSet;

				callback_function_to_return_to(graphObject.nodesEdgesConnections[objId], 'edge');

			});

		}
		//obtained all connected nodes, now perform the action
	}


}


function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}
function htmlDecode(value){
  return $('<div/>').html(value).text();
}