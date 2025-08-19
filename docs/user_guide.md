User Guide for RTSP Livestream App
This guide explains how to set up and use the RTSP Livestream App to view livestream videos from RTSP URLs and manage custom overlays (text or images) on the video.
Overview
The RTSP Livestream App allows users to:

Stream RTSP video feeds in a web browser using HLS conversion.
Add, edit, reposition, resize, and delete custom overlays (text or images) on the video.
Control the video with play, pause, and volume adjustments.

Prerequisites

Browser: Chrome, Firefox, or Safari (with HLS support).
RTSP URL: A valid RTSP URL (e.g., from RTSP.me or a local IP camera).
System Requirements:
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


Create and activate a virtual environment:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install dependencies:pip install -r requirements.txt


Configure environment variables:
Copy backend/.env.example to backend/.env.
Edit .env to set your MongoDB URI:MONGO_URI=mongodb://localhost:27017/rtsp_db
FLASK_ENV=development




Ensure MongoDB is running:
Local: Start MongoDB with mongod.
Atlas: Use your Atlas connection string in .env.


Install FFmpeg:
Ubuntu: sudo apt-get install ffmpeg
macOS: brew install ffmpeg
Windows: Download from FFmpeg website and add to PATH.


Start the Flask server:python app.py



3. Frontend Setup

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Start the React app:npm run dev



4. Docker Setup (Optional)

Ensure Docker and Docker Compose are installed.
From the root directory, run:docker-compose up --build


Access the app at http://localhost:5173.

Using the App
1. Accessing the App

Open http://localhost:5173 in your browser.
The landing page displays a video player and controls for streaming and overlays.

2. Starting a Livestream

In the Stream Control section, enter a valid RTSP URL (e.g., rtsp://rtsp.stream/pattern for testing).
Click Start Stream.
The video will load in the player with controls for play, pause, and volume.
If buffering occurs, a "Buffering..." indicator appears.
Errors (e.g., invalid URL) are displayed in red above the controls.



3. Managing Overlays
Create an Overlay

In the Create New Overlay section:
Select Type (Text or Image).
Enter Content (text for text overlays, image URL for image overlays, e.g., https://example.com/logo.png).
Specify Position X and Position Y (e.g., 10% or 20px).
Specify Width and Height (e.g., 200px, 50px).
For text overlays, set Text Color, Font Size, and Background Color.


Click Create Overlay.
The overlay appears on the video and is saved to MongoDB.

Select and View an Overlay

In the Select Overlay section, choose an overlay from the dropdown.
The selected overlay appears on the video and can be dragged to reposition.
Use the video player controls to play/pause the stream.

Edit an Overlay

Select an overlay from the Select Overlay dropdown.
Click Edit Overlay.
The Edit Overlay form populates with the overlay’s settings.
Modify the fields as needed and click Update Overlay.
Click Cancel to discard changes.

Delete an Overlay

Select an overlay from the Select Overlay dropdown.
Click Delete Overlay.
The overlay is removed from the video and MongoDB.

Reposition an Overlay

Select an overlay from the Select Overlay dropdown.
Drag the overlay (text or image) on the video to a new position.
The new position is saved automatically.

Troubleshooting

Stream Fails to Start:
Verify the RTSP URL is valid (test with VLC: File > Open Network).
Check backend/ffmpeg.log for FFmpeg errors.
Ensure FFmpeg is installed and accessible in PATH.


CORS Errors:
Ensure Flask-CORS is configured in app.py to allow http://localhost:5173.


Overlay Issues:
Ensure MongoDB is running and the MONGO_URI is correct.
For image overlays, verify the image URL is accessible and ends with .jpg, .png, or .gif.


Buffering:
Increase maxBufferLength in LandingPage.jsx if buffering persists.



Testing with RTSP URLs

Use RTSP.me to generate temporary RTSP streams.
Example: rtsp://rtsp.stream/pattern (displays SMPTE color bars and a test tone).

Support
For issues, refer to the GitHub repository’s issue tracker or contact the developer.
License
MIT License