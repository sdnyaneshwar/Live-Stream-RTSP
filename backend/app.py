# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from pymongo import MongoClient
# from config import Config
# import bson
# import subprocess
# import os
# import threading
# import mimetypes

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# # Register MIME types
# mimetypes.add_type('application/vnd.apple.mpegurl', '.m3u8')
# mimetypes.add_type('video/mp2t', '.ts')

# # MongoDB setup
# client = MongoClient(Config.MONGODB_URI)
# db = client.get_database()
# overlays_collection = db.overlays

# # Streaming setup
# HLS_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'static', 'hls')
# os.makedirs(HLS_OUTPUT_DIR, exist_ok=True)
# HLS_OUTPUT_FILE = os.path.join(HLS_OUTPUT_DIR, 'stream.m3u8')
# ffmpeg_process = None

# def start_ffmpeg(rtsp_url):
#     global ffmpeg_process
#     if ffmpeg_process:
#         ffmpeg_process.terminate()
#     cmd = [
#         'ffmpeg',
#         '-rtsp_transport', 'tcp',
#         '-i', rtsp_url,
#         '-c:v', 'copy',
#         '-c:a', 'aac',
#         '-f', 'hls',
#         '-hls_time', '2',
#         '-hls_list_size', '3',
#         '-hls_flags', 'delete_segments',
#         '-hls_segment_filename', os.path.join(HLS_OUTPUT_DIR, 'segment_%03d.ts'),
#         HLS_OUTPUT_FILE
#     ]
#     ffmpeg_process = subprocess.Popen(cmd)

# @app.route('/')
# def home():
#     return jsonify({"message": "Flask backend is running!"})

# @app.route('/start_stream', methods=['POST', 'OPTIONS'])
# def start_stream():
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
#     data = request.json
#     rtsp_url = data.get('rtsp_url')
#     if not rtsp_url:
#         return jsonify({"error": "RTSP URL required"}), 400
#     threading.Thread(target=start_ffmpeg, args=(rtsp_url,)).start()
#     return jsonify({"message": "Stream started", "hls_url": "/static/hls/stream.m3u8"}), 200

# @app.route('/static/hls/<path:filename>')
# def hls_files(filename):
#     return send_from_directory(HLS_OUTPUT_DIR, filename)

# @app.route('/static/images/<path:filename>')
# def image_files(filename):
#     return send_from_directory(os.path.join(os.path.dirname(__file__), 'static', 'images'), filename)

# # CRUD Endpoints
# @app.route('/overlays', methods=['POST'])
# def create_overlay():
#     data = request.json
#     if not data or not all(key in data for key in ['type', 'content', 'position', 'size']):
#         return jsonify({"error": "Missing required fields"}), 400
#     overlay_id = overlays_collection.insert_one(data).inserted_id
#     return jsonify({"id": str(overlay_id), "message": "Overlay created successfully"}), 201

# @app.route('/overlays', methods=['GET'])
# def get_overlays():
#     overlays = list(overlays_collection.find())
#     for overlay in overlays:
#         overlay['_id'] = str(overlay['_id'])
#     return jsonify(overlays), 200

# @app.route('/overlays/<id>', methods=['PUT'])
# def update_overlay(id):
#     data = request.json
#     result = overlays_collection.update_one(
#         {'_id': bson.ObjectId(id)},
#         {'$set': data}
#     )
#     if result.matched_count == 0:
#         return jsonify({"error": "Overlay not found"}), 404
#     return jsonify({"message": "Overlay updated successfully"}), 200

# @app.route('/overlays/<id>', methods=['DELETE'])
# def delete_overlay(id):
#     result = overlays_collection.delete_one({'_id': bson.ObjectId(id)})
#     if result.deleted_count == 0:
#         return jsonify({"error": "Overlay not found"}), 404
#     return jsonify({"message": "Overlay deleted successfully"}), 200

# @app.teardown_appcontext
# def shutdown_ffmpeg(exception=None):
#     global ffmpeg_process
#     if ffmpeg_process:
#         ffmpeg_process.terminate()

# app.static_folder = 'static'

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)



from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from pymongo import MongoClient
from config import Config
import bson
import subprocess
import os
import threading
import mimetypes
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Register MIME types
mimetypes.add_type('application/vnd.apple.mpegurl', '.m3u8')
mimetypes.add_type('video/mp2t', '.ts')

# MongoDB setup
client = MongoClient(Config.MONGODB_URI)
db = client.get_database()
overlays_collection = db.overlays

# Streaming setup
HLS_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'static', 'hls')
os.makedirs(HLS_OUTPUT_DIR, exist_ok=True)
HLS_OUTPUT_FILE = os.path.join(HLS_OUTPUT_DIR, 'stream.m3u8')
ffmpeg_process = None

def start_ffmpeg(rtsp_url):
    global ffmpeg_process
    if ffmpeg_process:
        ffmpeg_process.terminate()
    cmd = [
        'ffmpeg',
        '-rtsp_transport', 'tcp',
        '-i', rtsp_url,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-f', 'hls',
        '-hls_time', '4',  # Increased segment duration
        '-hls_list_size', '10',  # Increased playlist size
        '-hls_segment_type', 'mpegts',  # Ensure MPEG-TS segments
        '-hls_flags', 'delete_segments+append_list',
        '-hls_segment_filename', os.path.join(HLS_OUTPUT_DIR, 'segment_%03d.ts'),
        HLS_OUTPUT_FILE
    ]
    print(f"Starting FFmpeg with command: {' '.join(cmd)}")
    with open('ffmpeg.log', 'a') as log_file:
        ffmpeg_process = subprocess.Popen(cmd, stderr=log_file, stdout=log_file)
    print(f"FFmpeg process started with PID: {ffmpeg_process.pid}")

@app.route('/')
def home():
    return jsonify({"message": "Flask backend is running!"})

@app.route('/start_stream', methods=['POST', 'OPTIONS'])
def start_stream():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.json
    rtsp_url = data.get('rtsp_url')
    if not rtsp_url:
        return jsonify({"error": "RTSP URL required"}), 400
    threading.Thread(target=start_ffmpeg, args=(rtsp_url,)).start()
    return jsonify({"message": "Stream started", "hls_url": "/static/hls/stream.m3u8"}), 200

@app.route('/static/hls/<path:filename>')
def hls_files(filename):
    return send_from_directory(HLS_OUTPUT_DIR, filename)

@app.route('/static/images/<path:filename>')
def image_files(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static', 'images'), filename)

@app.route('/proxy-image')
def proxy_image():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Image URL required"}), 400
    try:
        response = requests.get(url, stream=True)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch image"}), 400
        return Response(
            response.content,
            content_type=response.headers['content-type'],
            headers={'Access-Control-Allow-Origin': 'http://localhost:5173'}
        )
    except Exception as e:
        return jsonify({"error": f"Failed to proxy image: {str(e)}"}), 500
    

# CRUD Endpoints
@app.route('/overlays', methods=['POST'])
def create_overlay():
    data = request.json
    if not data or not all(key in data for key in ['type', 'content', 'position', 'size']):
        return jsonify({"error": "Missing required fields"}), 400
    overlay_id = overlays_collection.insert_one(data).inserted_id
    return jsonify({"id": str(overlay_id), "message": "Overlay created successfully"}), 201

@app.route('/overlays', methods=['GET'])
def get_overlays():
    overlays = list(overlays_collection.find())
    for overlay in overlays:
        overlay['_id'] = str(overlay['_id'])
    return jsonify(overlays), 200

from bson.errors import InvalidId

@app.route('/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    data = request.json
    try:
        obj_id = bson.ObjectId(id)
    except InvalidId:
        return jsonify({"error": "Invalid ID format"}), 400

    result = overlays_collection.update_one(
        {'_id': obj_id},
        {'$set': data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Overlay not found"}), 404
    return jsonify({"message": "Overlay updated successfully"}), 200

@app.route('/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    result = overlays_collection.delete_one({'_id': bson.ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Overlay not found"}), 404
    return jsonify({"message": "Overlay deleted successfully"}), 200

@app.teardown_appcontext
def shutdown_ffmpeg(exception=None):
    global ffmpeg_process
    if ffmpeg_process:
        ffmpeg_process.terminate()

app.static_folder = 'static'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)