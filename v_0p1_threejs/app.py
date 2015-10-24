import os, sys, pdb
from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request
from flask import send_from_directory
import pygraphviz_generator


app = Flask(__name__, template_folder='templates', static_url_path='')

#pygraphviz_generator.main2() 
G = pygraphviz_generator.initiate() 

@app.route("/get_all_connected_nodes", methods=['POST','GET'])
def get_all_connected_nodes():
	objId = request.args.get('objId', 0, type=str)
	objType = request.args.get('objType', 0, type=str)
	level = request.args.get('level', 0, type=int)
	
	
	node_list = G.get_all_connected_nodes(objId,objType,level)

	return jsonify(status='OK',result=node_list)
@app.route("/get_all_connected_edges", methods=['POST','GET'])
def get_all_connected_edges():
	objId = request.args.get('objId', 0, type=str)
	objType = request.args.get('objType', 0, type=str)
	level = request.args.get('level', 0, type=int)
	
	
	edge_list = G.get_all_connected_edges(objId,objType,level)

	return jsonify(status='OK',result=edge_list)
 
@app.route("/")
def main():

    return render_template ("main.html")



@app.route('/js/<path:filename>')
@app.route('/svg/<path:filename>')
def serve_static(filename):
	
	period = filename.rfind(".")
	extension = filename[period+1:]
	
	root_dir = os.getcwd()
	full_path = os.path.join(root_dir, 'static', extension)
	
	return send_from_directory(full_path, filename)


if __name__ == "__main__":
    app.run(debug=True)

