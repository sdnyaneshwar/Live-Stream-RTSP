<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RTSP Livestream App README</title>
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
        ul {
            list-style-type: disc;
            margin: 10px 0 10px 20px;
            padding-left: 20px;
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
        .file-tree {
            font-family: 'Courier New', monospace;
            background-color: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>RTSP Livestream App</h1>
    <p>A full-stack application for streaming RTSP video feeds in a web browser with support for custom overlays (text and images) that can be created, read, updated, and deleted via a RESTful API. Built with Flask, MongoDB, React, and FFmpeg for RTSP-to-HLS conversion.</p>

    <h2>Project Structure</h2>
    <pre class="file-tree">
rtsp_livestream_app/
├── backend/
│   ├── app.py                # Flask backend with RTSP streaming and CRUD API
│   ├── requirements.txt      # Python dependencies
│   ├── ffmpeg.log            # FFmpeg logs (generated during runtime)
│   └── .env.example          # Example environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── LandingPage.jsx  # React component for the landing page
│   │   ├── api.js            # API client for backend communication
│   │   ├── App.jsx           # Main React app component
│   │   └── index.jsx         # React entry point
│   ├── package.json          # Node dependencies and scripts
│   ├── vite.config.js        # Vite configuration
│   └── public/               # Static assets
├── docs/
│   ├── api.md                # API documentation
│   └── user_guide.md         # User documentation
├── docker-compose.yml        # Docker Compose for MongoDB and Flask
└── README.md                 # This file
    </pre>

    <h2>Prerequisites</h2>
    <ul>
        <li><strong>Node.js</strong> (v18 or higher)</li>
        <li><strong>Python</strong> (3.8 or higher)</li>
        <li><strong>MongoDB</strong> (local or Atlas)</li>
        <li><strong>FFmpeg</strong> (for RTSP-to-HLS conversion)</li>
        <li><strong>Docker</strong> (optional, for containerized setup)</li>
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
        <li>Create a virtual environment and install dependencies:
            <pre><code>python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt</code></pre>
        </li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and configure:
            <pre><code>MONGO_URI=mongodb://localhost:27017/rtsp_db
FLASK_ENV=development</code></pre>
        </li>
        <li>Ensure MongoDB is running (or use MongoDB Atlas).</li>
        <li>Install FFmpeg:
            <ul>
                <li>On Ubuntu: <code>sudo apt-get install ffmpeg</code></li>
                <li>On macOS: <code>brew install ffmpeg</code></li>
                <li>On Windows: Download from <a href="https://ffmpeg.org/download.html">FFmpeg website</a> and add to PATH.</li>
            </ul>
        </li>
        <li>Run the Flask server:
            <pre><code>python app.py</code></pre>
            The server will run on <code>http://localhost:5000</code>.
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
        <li>Start the React development server:
            <pre><code>npm run dev</code></pre>
            The frontend will run on <code>http://localhost:5173</code>.
        </li>
    </ol>

    <h3>4. Docker Setup (Optional)</h3>
    <ol>
        <li>Ensure Docker and Docker Compose are installed.</li>
        <li>Run:
            <pre><code>docker-compose up --build</code></pre>
            This starts the Flask app and MongoDB in containers.
        </li>
    </ol>

    <h2>Usage</h2>
    <ol>
        <li>Open <code>http://localhost:5173</code> in your browser.</li>
        <li>Enter an RTSP URL (e.g., <code>rtsp://rtsp.stream/pattern</code> for testing) and click "Start Stream".</li>
        <li>Use the overlay controls to add, edit, or delete text/image overlays on the video.</li>
        <li>Drag overlays to reposition them on the video.</li>
    </ol>

    <h2>Dependencies</h2>
    <ul>
        <li><strong>Backend</strong>: Flask, Flask-CORS, PyMongo, python-dotenv</li>
        <li><strong>Frontend</strong>: React, Vite, hls.js, react-draggable</li>
        <li><strong>Tools</strong>: FFmpeg, MongoDB</li>
    </ul>

    <h2>Notes</h2>
    <ul>
        <li>Ensure CORS is configured correctly in <code>app.py</code> to allow frontend requests.</li>
        <li>Check <code>ffmpeg.log</code> for streaming issues.</li>
        <li>Use a valid RTSP URL for testing, such as those from <a href="https://rtsp.me">RTSP.me</a>.</li>
    </ul>

    <h2>Contributing</h2>
    <p>Submit issues or pull requests to the GitHub repository.</p>

    <h2>License</h2>
    <p>MIT License</p>
</body>
</html>