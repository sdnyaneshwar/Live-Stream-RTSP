<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Guide for RTSP Livestream App</title>
    <style>
        body {
            font-family: 'Inter', 'Arial', sans-serif;
            background-color: #1a1a1a;
            color: #ffffff;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        h1, h2, h3 {
            color: #4da8ff;
        }
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 30px;
        }
        h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            font-size: 1.4rem;
            font-weight: 600;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        p {
            margin: 10px 0;
            font-size: 1rem;
        }
        ul, ol {
            list-style-type: disc;
            margin: 10px 0 10px 20px;
            padding-left: 20px;
        }
        ol {
            list-style-type: decimal;
        }
        li {
            margin-bottom: 8px;
        }
        code {
            background-color: #2a2a2a;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
        }
        pre {
            background-color: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 10px 0;
        }
        a {
            color: #4da8ff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>User Guide for RTSP Livestream App</h1>
    <p>This guide explains how to set up and use the RTSP Livestream App to view livestream videos from RTSP URLs and manage custom overlays (text or images) on the video.</p>

    <h2>Overview</h2>
    <p>The RTSP Livestream App allows users to:</p>
    <ul>
        <li>Stream RTSP video feeds in a web browser using HLS conversion.</li>
        <li>Add, edit, reposition, resize, and delete custom overlays (text or images) on the video.</li>
        <li>Control the video with play, pause, and volume adjustments.</li>
    </ul>

    <h2>Prerequisites</h2>
    <ul>
        <li><strong>Browser</strong>: Chrome, Firefox, or Safari (with HLS support).</li>
        <li><strong>RTSP URL</strong>: A valid RTSP URL (e.g., from <a href="https://rtsp.me">RTSP.me</a> or a local IP camera).</li>
        <li><strong>System Requirements</strong>:
            <ul>
                <li>Node.js (v18 or higher)</li>
                <li>Python (3.8 or higher)</li>
                <li>MongoDB (local or Atlas)</li>
                <li>FFmpeg (for RTSP-to-HLS conversion)</li>
                <li>Docker (optional, for containerized setup)</li>
            </ul>
        </li>
    </ul>

    <h2>Setup Instructions</h2>

    <h3>1. Clone the Repository</h3>
    <pre><code>git clone https://github.com/your-username/rtsp_livestream_app.git
cd rtsp_livestream_app</code></pre>

    <h3>2. Backend Setup</h3>
    <ol>
        <li>Navigate to the backend directory:
            <pre><code>cd backend</code></pre>
        </li>
        <li>Create and activate a virtual environment:
            <pre><code>python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate</code></pre>
        </li>
        <li>Install dependencies:
            <pre><code>pip install -r requirements.txt</code></pre>
        </li>
        <li>Configure environment variables:
            <ul>
                <li>Copy <code>backend/.env.example</code> to <code>backend/.env</code>.</li>
                <li>Edit <code>.env</code> to set your MongoDB URI:
                    <pre><code>MONGO_URI=mongodb://localhost:27017/rtsp_db
FLASK_ENV=development</code></pre>
                </li>
            </ul>
        </li>
        <li>Ensure MongoDB is running:
            <ul>
                <li>Local: Start MongoDB with <code>mongod</code>.</li>
                <li>Atlas: Use your Atlas connection string in <code>.env</code>.</li>
            </ul>
        </li>
        <li>Install FFmpeg:
            <ul>
                <li>Ubuntu: <code>sudo apt-get install ffmpeg</code></li>
                <li>macOS: <code>brew install ffmpeg</code></li>
                <li>Windows: Download from <a href="https://ffmpeg.org/download.html">FFmpeg website</a> and add to PATH.</li>
            </ul>
        </li>
        <li>Start the Flask server:
            <pre><code>python app.py</code></pre>
        </li>
    </ol>

    <h3>3. Frontend Setup</h3>
    <ol>
        <li>Navigate to the frontend directory:
            <pre><code>cd frontend</code></pre>
        </li>
        <li>Install dependencies:
            <pre><code>npm install</code></pre>
        </li>
        <li>Start the React app:
            <pre><code>npm run dev</code></pre>
        </li>
    </ol>

    <h3>4. Docker Setup (Optional)</h3>
    <ol>
        <li>Ensure Docker and Docker Compose are installed.</li>
        <li>From the root directory, run:
            <pre><code>docker-compose up --build</code></pre>
        </li>
        <li>Access the app at <code>http://localhost:5173</code>.</li>
    </ol>

    <h2>Using the App</h2>

    <h3>1. Accessing the App</h3>
    <ul>
        <li>Open <code>http://localhost:5173</code> in your browser.</li>
        <li>The landing page displays a video player and controls for streaming and overlays.</li>
    </ul>

    <h3>2. Starting a Livestream</h3>
    <ol>
        <li>In the <strong>Stream Control</strong> section, enter a valid RTSP URL (e.g., <code>rtsp://rtsp.stream/pattern</code> for testing).</li>
        <li>Click <strong>Start Stream</strong>.</li>
        <li>The video will load in the player with controls for play, pause, and volume.
            <ul>
                <li>If buffering occurs, a "Buffering..." indicator appears.</li>
                <li>Errors (e.g., invalid URL) are displayed in red above the controls.</li>
            </ul>
        </li>
    </ol>

    <h3>3. Managing Overlays</h3>
    <h4>Create an Overlay</h4>
    <ol>
        <li>In the <strong>Create New Overlay</strong> section:
            <ul>
                <li>Select <strong>Type</strong> (Text or Image).</li>
                <li>Enter <strong>Content</strong> (text for text overlays, image URL for image overlays, e.g., <code>https://example.com/logo.png</code>).</li>
                <li>Specify <strong>Position X</strong> and <strong>Position Y</strong> (e.g., <code>10%</code> or <code>20px</code>).</li>
                <li>Specify <strong>Width</strong> and <strong>Height</strong> (e.g., <code>200px</code>, <code>50px</code>).</li>
                <li>For text overlays, set <strong>Text Color</strong>, <strong>Font Size</strong>, and <strong>Background Color</strong>.</li>
            </ul>
        </li>
        <li>Click <strong>Create Overlay</strong>.</li>
        <li>The overlay appears on the video and is saved to MongoDB.</li>
    </ol>

    <h4>Select and View an Overlay</h4>
    <ol>
        <li>In the <strong>Select Overlay</strong> section, choose an overlay from the dropdown.</li>
        <li>The selected overlay appears on the video and can be dragged to reposition.</li>
        <li>Use the video player controls to play/pause the stream.</li>
    </ol>

    <h4>Edit an Overlay</h4>
    <ol>
        <li>Select an overlay from the <strong>Select Overlay</strong> dropdown.</li>
        <li>Click <strong>Edit Overlay</strong>.</li>
        <li>The <strong>Edit Overlay</strong> form populates with the overlay’s settings.</li>
        <li>Modify the fields as needed and click <strong>Update Overlay</strong>.</li>
        <li>Click <strong>Cancel</strong> to discard changes.</li>
    </ol>

    <h4>Delete an Overlay</h4>
    <ol>
        <li>Select an overlay from the <strong>Select Overlay</strong> dropdown.</li>
        <li>Click <strong>Delete Overlay</strong>.</li>
        <li>The overlay is removed from the video and MongoDB.</li>
    </ol>

    <h4>Reposition an Overlay</h4>
    <ol>
        <li>Select an overlay from the <strong>Select Overlay</strong> dropdown.</li>
        <li>Drag the overlay (text or image) on the video to a new position.</li>
        <li>The new position is saved automatically.</li>
    </ol>

    <h2>Troubleshooting</h2>
    <ul>
        <li><strong>Stream Fails to Start</strong>:
            <ul>
                <li>Verify the RTSP URL is valid (test with VLC: File > Open Network).</li>
                <li>Check <code>backend/ffmpeg.log</code> for FFmpeg errors.</li>
                <li>Ensure FFmpeg is installed and accessible in PATH.</li>
            </ul>
        </li>
        <li><strong>CORS Errors</strong>:
            <ul>
                <li>Ensure <code>Flask-CORS</code> is configured in <code>app.py</code> to allow <code>http://localhost:5173</code>.</li>
            </ul>
        </li>
        <li><strong>Overlay Issues</strong>:
            <ul>
                <li>Ensure MongoDB is running and the <code>MONGO_URI</code> is correct.</li>
                <li>For image overlays, verify the image URL is accessible and ends with <code>.jpg</code>, <code>.png</code>, or <code>.gif</code>.</li>
            </ul>
        </li>
        <li><strong>Buffering</strong>:
            <ul>
                <li>Increase <code>maxBufferLength</code> in <code>LandingPage.jsx</code> if buffering persists.</li>
            </ul>
        </li>
    </ul>

    <h2>Testing with RTSP URLs</h2>
    <ul>
        <li>Use <a href="https://rtsp.me">RTSP.me</a> to generate temporary RTSP streams.</li>
        <li>Example: <code>rtsp://rtsp.stream/pattern</code> (displays SMPTE color bars and a test tone).</li>
    </ul>

    <h2>Support</h2>
    <p>For issues, refer to the GitHub repository’s issue tracker or contact the developer.</p>

    <h2>License</h2>
    <p>MIT License</p>
</body>
</html>