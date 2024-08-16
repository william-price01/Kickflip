from flask import Flask, request, jsonify
from flask_cors import CORS
from griptape_nodes.agents.base_agent_node.BaseAgent import BaseAgent
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/process', methods=['POST'])
def process_data():
    logger.info("Received a request to /api/process")
    logger.debug(f"Request data: {request.json}")
    data = request.json
    result = BaseAgent.process_with_griptape(data)
    logger.info(f"Processed result: {result}")
    return jsonify(result)

if __name__ == '__main__':
    logger.info("Starting Flask server")
    app.run(debug=True, port=8888)