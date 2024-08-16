from flask import Flask, request, jsonify
from flask_cors import CORS
from griptape_nodes.agents.base_agent_node.BaseAgent import BaseAgent
import logging
import base64

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

@app.route('/api/image-gen', methods=['POST'])
def process_image_generation():
    logger.info("Received a request to /api/image-gen")
    logger.debug(f"Request data: {request.json}")
    data = request.json
    result = BaseAgent.process_image_prompt(data['image_prompt'], data['ruleset_input'])

    # Check if result is an ImageArtifact
    if hasattr(result, 'value') and hasattr(result, 'media_type'):
        # Convert image data to base64
        image_base64 = base64.b64encode(result.value).decode('utf-8')

        # Create a response dictionary
        response = {
            'image_data': image_base64,
            'media_type': result.media_type,
            'prompt': data['image_prompt']
        }

        return jsonify(response)
    else:
        # If it's not an ImageArtifact, return the result as is
        return jsonify(result)

if __name__ == '__main__':
    logger.info("Starting Flask server")
    app.run(debug=True, port=8888)
