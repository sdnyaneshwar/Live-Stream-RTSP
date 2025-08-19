RTSP Livestream App
A full-stack application for streaming RTSP video feeds in a web browser with support for custom overlays (text and images) that can be created, read, updated, and deleted via a RESTful API. Built with Flask, MongoDB, React, and FFmpeg for RTSP-to-HLS conversion.

Prerequisites

Node.js (v18 or higher)
Python (3.8 or higher)
MongoDB (local or Atlas)
FFmpeg (for RTSP-to-HLS conversion)
Docker (optional, for containerized setup)

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/rtsp_livestream_app.git
cd rtsp_livestream_app

2. Backend Setup

Navigate to the backend directory:cd backend


Create a virtual environment and install dependencies:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt


Copy .env.example to .env and configure:MONGO_URI=mongodb://localhost:27017/rtsp_db
FLASK_ENV=development


Ensure MongoDB is running (or use MongoDB Atlas).
Install FFmpeg:
On Ubuntu: sudo apt-get install ffmpeg
On macOS: brew install ffmpeg
On Windows: Download from FFmpeg website and add to PATH.


Run the Flask server:python app.py

The server will run on http://localhost:5000.

3. Frontend Setup

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Start the React development server:npm run dev

The frontend will run on http://localhost:5173.

4. Docker Setup (Optional)

Ensure Docker and Docker Compose are installed.
Run:docker-compose up --build

This starts the Flask app and MongoDB in containers.

Usage

Open http://localhost:5173 in your browser.
Enter an RTSP URL (e.g., rtsp://rtsp.stream/pattern for testing) and click "Start Stream".
Use the overlay controls to add, edit, or delete text/image overlays on the video.
Drag overlays to reposition them on the video.

Dependencies

Backend: Flask, Flask-CORS, PyMongo, python-dotenv
Frontend: React, Vite, hls.js, react-draggable
Tools: FFmpeg, MongoDB

Notes

Ensure CORS is configured correctly in app.py to allow frontend requests.
Check ffmpeg.log for streaming issues.
Use a valid RTSP URL for testing, such as those from RTSP.me.

Contributing
Submit issues or pull requests to the GitHub repository.
License
MIT License