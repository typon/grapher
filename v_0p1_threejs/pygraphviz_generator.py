import pygraphviz as pgv
import pdb
from random import randint


from itertools import chain
def flatten_dict_values(dictionary):
	return chain(*dictionary.values())


class HGraph:
	def __init__(self,dot_file):
		
		self.generate_graph()

		self.G = pgv.AGraph(dot_file)   
		edges = self.G.edges(keys=True)
		self.nodes = self.G.nodes()
		self.edges_dict = dict()
		for edge in edges:
			#edges_dict stores:
			#edgeKey = "startingNode,startingPort,endingNode,endingPort"
			#{edgeKey : (startingNode, startingPort, endingNode, endingPort)}
			edgeKey = str(edge[2])
			starting_node, starting_port, ending_node, ending_port = edgeKey.split(',')


			self.edges_dict [edgeKey] = (starting_node, starting_port,
										ending_node, ending_port)
			


	def get_all_connected_nodes (self,objId,objType,level):
		#svg stores ids starting with 1
		#pdb.set_trace()
		#print objId, objType
		#pdb.set_trace()
		if (objType == 'edge'):
			#The edge Id is defined as:
			#[startingNode, startingNodePort, endingNode, endingNodePort]


			starting_node, starting_port, ending_node, ending_port = objId.split(",")

			all_nodes_starting_node = self.get_connected_nodes_n_levels_away (int(starting_node), level)
			all_nodes_ending_node = self.get_connected_nodes_n_levels_away (int(ending_node), level)

			all_nodes = all_nodes_starting_node.union(all_nodes_ending_node)
			all_nodes = [str(node) for node in all_nodes]



			#pdb.set_trace()
			return all_nodes			
		if (objType == 'node'):
			objId = int(objId)

			#propate outwards level number of times to
			#get neighbors at outer levels
			all_nodes = self.get_connected_nodes_n_levels_away (objId, level)

			print str(len(all_nodes))
			print str(level)
			
			#print "Lenght = %s, level = %s" % str(len(all_nodes)), str(level)
			
			all_nodes = [str(node) for node in all_nodes]
			
			return all_nodes	
	def get_all_connected_edges (self,objId,objType,level):

		#pdb.set_trace()
		if (objType == 'edge'):
			#The edge Id is defined as:
			#[startingNode, startingNodePort, endingNode, endingNodePort]


			starting_node, starting_port, ending_node, ending_port = objId.split(",")

			all_nodes_starting_node = self.get_connected_nodes_n_levels_away (int(starting_node), level)
			all_nodes_ending_node = self.get_connected_nodes_n_levels_away (int(ending_node), level)

			all_nodes = all_nodes_starting_node.union(all_nodes_ending_node)

			in_edges = set(self.G.in_edges(all_nodes,keys=True))
			out_edges = set(self.G.out_edges(all_nodes,keys=True))
			#keep the edges that are intersection of all the out
			#edges and in edges from each node

			all_edges = in_edges.intersection(out_edges)

			#the key is stored in the third element of tuple returned for each edge
			all_edges = [str(edge[2]) for edge in all_edges]

			#pdb.set_trace()
			return all_edges			
		if (objType == 'node'):
			objId = int(objId)

			all_nodes = self.get_connected_nodes_n_levels_away (objId, level)



			in_edges = set(self.G.in_edges(all_nodes,keys=True))
			out_edges = set(self.G.out_edges(all_nodes,keys=True))
			#keep the edges that are intersection of all the out
			#edges and in edges from each node

			all_edges = in_edges.intersection(out_edges)

			#the key is stored in the third element of tuple returned for each edge
			all_edges = [str(edge[2]) for edge in all_edges]

			return all_edges
	def get_connected_nodes_n_levels_away (self, nodeId, level):

#		successor_nodes = self.G.successors(nodeId)
#		all_successors = [successor_nodes]
		
#		pred_nodes = self.G.predecessors(nodeId)
#		all_preds = [pred_nodes]
		#if (level == 3):
			#pdb.set_trace()
#		for i in range(1,level):
#			all_successors.append([])
#			for node in all_successors[i-1]:
#				successor_nodes = self.G.successors(node)
#				all_successors[i].extend(successor_nodes) 
#
#		for i in range(1,level):
#			all_preds.append([])
#			for node in all_preds[i-1]:
#				pred_nodes = self.G.predecessors(node)
#				all_preds[i].extend(pred_nodes) 
#
#		all_nodes = all_successors + all_preds + [[nodeId]]
		print "Level %s" % str(level)
		currentNode = self.G.get_node(nodeId)
		neighbors = self.G.neighbors(nodeId)
		all_neighbors = {}
		all_neighbors[nodeId] = neighbors
		for i in range(1,level):
			#all_neighbors.append([])
			for neighbors_lists in all_neighbors.values():
				for node in neighbors_lists:
					if (node not in all_neighbors):

						neighbors = self.G.neighbors(node)
						all_neighbors[node] = (neighbors)
						#all_neighbors = set(all_neighbors)
						#all_neighbors = list (all_neighbors)
						#pdb.set_trace()	




		all_nodes =	flatten_dict_values (all_neighbors) 
	
		print "Level %s" % str(level)
		
		#all_nodes = [item for sublist in all_neighbors for item in sublist]
		all_nodes = [str(node) for node in all_nodes]
		all_nodes.append(str(currentNode))
		all_nodes = set(all_nodes)
		print all_nodes
		return all_nodes

#		predecessor_nodes = self.G.predecessors(objId)	
#		all_nodes = successor_nodes+predecessor_nodes+[objId]		
	def generate_graph(self):
		G=pgv.AGraph(strict=False,directed=True, ranksep='0.1',nodesep='0.1', 
					esep='0.2', sep='0.1', overlap='false', splines='ortho',  bgcolor = '#7887AB')
		G.node_attr['shape']='plaintext'
		G.node_attr['color']='#718EA4'
		G.node_attr['style']='filled'

		#G.add_node('n0', label='<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"> <TR><TH PORT="f0"><f0><B>title</B></TH></TR> <TR><TH PORT="f1" BGCOLOR="#4F628E">index</TH></TR> <TR><TH PORT="f2">field1</TH></TR> <TR><TH PORT="f3">field2</TH></TR> </TABLE>>')

		#G.add_node('n1', label='<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"> <TR><TH PORT="f0"><B>node1</B></TH></TR> <TR><TH PORT="f1" BGCOLOR="#4F628E">index</TH></TR> <TR><TH PORT="f2">field1</TH></TR> <TR><TH PORT="f3">field2</TH></TR> </TABLE>>')

		#G.add_node('n2', label='<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"> <TR><TH PORT="f0"><B>node2</B></TH></TR> <TR><TH PORT="f1" BGCOLOR="#4F628E">index</TH></TR> <TR><TH PORT="f2">field1</TH></TR> <TR><TH PORT="f3">field2</TH></TR> </TABLE>>')
		#G.add_node(1)
		#label = '''<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0">
		#								    <TR><TD PORT="f0"><B>title</B></TD></TR>
		#								    <TR><TD PORT="f1" BGCOLOR="#4F628E">index</TD></TR>
		#								    <TR><TD PORT="f2">field1</TD></TR>
		#								    <TR><TD PORT="f3">field2</TD></TR> </TABLE>>'''

		#G.get_node(1).attr.update({'shape':'plaintext','label':label})

		#G.add_node(2)
		#label='''<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"> <TH><TD PORT="f0"><B>node2</B></TD></TH> <TH><TD PORT="f1" BGCOLOR="#4F628E">index</TD></TH> <TH><TD PORT="f2">field1</TD></TH> <TH><TD PORT="f3">field2</TD></TH> </TABLE>>'''
		#G.get_node(2).attr.update({'shape':'plaintext','label':label})
		#G.add_node(3)
		#label='''<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"> <TH><TD PORT="f0"><B>node3</B></TD></TH> <TH><TD PORT="f1" BGCOLOR="#4F628E">index</TD></TH> <TH><TD PORT="f2">field1</TD></TH> <TH><TD PORT="f3">field2</TD></TH> </TABLE>>'''
		#G.get_node(3).attr.update({'shape':'plaintext','label':label})
		num_nodes = 20
		num_edges = 3

		for i in range(num_nodes):
			#print i
			nodeId = i
			nodeName = "node" + str(nodeId)

			portDict = {'inputs': ['in0', 'in1','in2', 'in3', 'in4', 'in5'],
						'outputs': ['out0', 'out1','out2', 'out3', 'out4', 'out5', 'out6', 'out7', 'out8', 'out9', 'out10', 'out11', 'out12']
					   }

			label = self.generate_node_label(nodeId, nodeName, portDict)
			G.add_node(i)

			G.get_node(i).attr.update({'shape':'plaintext','label':label})


			for j in range (num_edges):

				starting_node = str(randint(0,num_nodes-1))
				ending_node = str(randint(0,num_nodes-1))
				#get random port number
				starting_port = randint(0,num_edges+2)
				ending_port = randint(0,num_edges+2)
				if (starting_port < num_edges and ending_port < num_edges):
					starting_port = 'in' + str(starting_port)
					ending_port = 'out' + str(ending_port)
				else:
					starting_port = ""
					ending_port = ""

				edgeKey = ','.join([starting_node,starting_port,
									ending_node,ending_port])

				G.add_edge(starting_node,ending_node,key=edgeKey,tailport=starting_port,headport=ending_port)

		#G.add_edge(1,2,key='edge1')
		#edge = G.get_edge(1,2)
		#edge.attr.update({'tailport':'f0'})
		#edge.attr.update({'headport':'f1'})

		#G.add_edge(2,3,key='edge2')
		#edge = G.get_edge(2,3)
		#edge.attr.update({'tailport':'f1'})
		#edge.attr.update({'headport':'f2'})
		#G.add_edge(("n0:f0", "n1:f3"))
		#G.add_edge('n1:f2', 'n2:f0')

		G.write("graph.dot")

		G.draw("static/svg/graph.svg",prog='neato')

	def generate_node_label(self,nodeId, nodeName, portDict):
		
		inputs = portDict['inputs']
		outputs = portDict['outputs']
		numInputs = len(inputs)
		numOutputs = len(outputs)

		#pdb.set_trace()
		numRows = max(numInputs,numOutputs)
		#center the outputs or inputs depending on whos less
		difference = abs(numInputs - numOutputs)

		applyPadding = (difference > 1)
		moreOutputs = (numInputs < numOutputs)

		if applyPadding:

			if moreOutputs:
				topPadding = difference/2
				bottomPadding = difference - topPadding
				if ((bottomPadding + topPadding) < difference):
						topPadding = topPadding + 1

			else:

				topPadding = difference/2
				bottomPadding = difference - topPadding
				if ((bottomPadding + topPadding) < difference):
						topPadding = topPadding + 1

  		inputIndex = 0
  		outputIndex = 0

		label = '<<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4" WIDTH="0">'
		#first row - the node name goes in the middle column spanning all rows
  		label = label + '<TR>'
  		if numInputs == 0:
  			label = label + 	'<TD>{0}</TD><TD ALIGN="CENTER" ROWSPAN="{1}">{2}</TD><TD></TD><TD PORT="{3}">{3}</TD>'.format('', numRows, nodeName, ouputs[0])
  			outputIndex = outputIndex + 1
  		elif numOutputs == 0:
  			label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ROWSPAN="{1}"">{2}</TD><TD></TD><TD>{3}</TD>'.format(inputs[0], numRows, nodeName, '')
  			inputIndex = inputIndex + 1
  		elif numOutputs == 0 and numInputs ==0:
  			label = label + 	'<TD>{0}</TD><TD ALIGN="CENTER" ROWSPAN="{1}">{2}</TD><TD></TD><TD>{3}</TD>'.format('',  numRows, nodeName, '')
  		else:

  			if applyPadding:
  				if (moreOutputs):
  					label = label + 	'<TD>{0}</TD><TD ROWSPAN="{1}">{2}</TD><TD></TD><TD PORT="{3}">{3}</TD>'.format('',  numRows, nodeName, outputs[0])
  		  			outputIndex = outputIndex + 1
			
  				else:
  					label = label + 	'<TD PORT="{0}">{0}</TD><TD ROWSPAN="{1}">{2}</TD><TD></TD><TD>{3}</TD>'.format(inputs[0], numRows, nodeName, '')
		  			inputIndex = inputIndex + 1

				topPadding = topPadding - 1

  			else:
  				label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ROWSPAN="{1}">{2}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{3}">{3}</TD>'.format(inputs[0], numRows, nodeName, outputs[0])	
	  			inputIndex = inputIndex + 1
	 			outputIndex = outputIndex + 1

	  	label = label + '</TR>'

	  	#pdb.set_trace()

  		for row in range(1,numRows):

	  		label = label + '<TR>'

			if applyPadding:
				if (moreOutputs):
					if ((row <= topPadding) or (row >= (numRows-bottomPadding))):
						label = label + 	'<TD>{0}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{1}">{1}</TD>'.format('', outputs[outputIndex])
						
						outputIndex = outputIndex + 1
					else:
						label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{1}">{1}</TD>'.format(inputs[inputIndex], outputs[outputIndex])
						inputIndex = inputIndex + 1
	 					outputIndex = outputIndex + 1

				else:
					#pdb.set_trace()
					if ((row <= topPadding) or (row >= (numRows-bottomPadding))):
						label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ></TD><TD>{1}</TD>'.format(inputs[inputIndex], '')
						inputIndex = inputIndex + 1

					else:
					
						label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{1}">{1}</TD>'.format(inputs[inputIndex], outputs[outputIndex])
						inputIndex = inputIndex + 1
			 			outputIndex = outputIndex + 1
			else:
				#we're on the last row, don't print either input or output since it's one less
				if (difference == 1 and row == numRows - 1):
					if (moreOutputs):
						label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{1}">{1}</TD>'.format('', outputs[outputIndex])
					else:
						label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{1}">{1}</TD>'.format(inputs[inputIndex], '')

		 		else:
		 			label = label + 	'<TD PORT="{0}">{0}</TD><TD ALIGN="CENTER" ></TD><TD PORT="{1}">{1}</TD>'.format(inputs[inputIndex], outputs[outputIndex])
					inputIndex = inputIndex + 1
		 			outputIndex = outputIndex + 1

	  		label = label + '</TR>'
 		label = label + '</TABLE>>'

	

# 		print label
 		
 		return label


def initiate():
	GraphObject = HGraph('graph.dot')
	return GraphObject

if __name__ == "__main__":
	initiate()


