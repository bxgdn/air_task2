from flask import Flask, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

# Define the path to the JSON data file
DATA_FILE_PATH = os.path.join('static', 'js', 'calculatorData.json')

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('templates', 'index.html')

@app.route('/api/salaries')
def get_salaries():
    """API endpoint to serve salary data"""
    try:
        # Open and read the JSON data file
        with open(DATA_FILE_PATH, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/static/<path:path>')
def static_files(path):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
