API Documentation for RTSP Livestream App
This document describes the RESTful API endpoints for the RTSP livestream application, built with Flask and MongoDB. The API supports starting an RTSP stream and managing overlays (text or images) on the video.
Base URL
http://localhost:5000
Endpoints
1. Start Stream
Initiates an RTSP-to-HLS stream conversion using FFmpeg.

URL: /start_stream
Method: POST
Request Body:{
  "rtsp_url": "string" // e.g., "rtsp://rtsp.stream/pattern"
}


Success Response:
Code: 200
Content:{
  "hls_url": "/hls/playlist.m3u8"
}




Error Response:
Code: 400
Content:{
  "error": "Invalid RTSP URL"
}





2. Get All Overlays
Retrieves all saved overlay settings from MongoDB.

URL: /overlays
Method: GET
Success Response:
Code: 200
Content:[
  {
    "_id": "string",
    "type": "text|image",
    "content": "string",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional, for text overlays
  },
  ...
]




Error Response:
Code: 500
Content:{
  "error": "Failed to fetch overlays"
}





3. Create Overlay
Creates a new overlay and saves it to MongoDB.

URL: /overlays
Method: POST
Request Body:{
  "type": "text|image",
  "content": "string",
  "position": { "x": "string", "y": "string" },
  "size": { "width": "string", "height": "string" },
  "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional, for text overlays
}


Success Response:
Code: 201
Content:{
  "_id": "string",
  "type": "text|image",
  "content": "string",
  "position": { "x": "string", "y": "string" },
  "size": { "width": "string", "height": "string" },
  "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional
}




Error Response:
Code: 400
Content:{
  "error": "Invalid overlay data"
}





4. Update Overlay
Updates an existing overlay by ID.

URL: /overlays/<id>
Method: PUT
Request Body:{
  "type": "text|image",
  "content": "string",
  "position": { "x": "string", "y": "string" },
  "size": { "width": "string", "height": "string" },
  "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional
}


Success Response:
Code: 200
Content:{
  "_id": "string",
  "type": "text|image",
  "content": "string",
  "position": { "x": "string", "y": "string" },
  "size": { "width": "string", "height": "string" },
  "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional
}




Error Response:
Code: 404
Content:{
  "error": "Overlay not found"
}





5. Delete Overlay
Deletes an overlay by ID.

URL: /overlays/<id>
Method: DELETE
Success Response:
Code: 200
Content:{
  "message": "Overlay deleted successfully"
}




Error Response:
Code: 404
Content:{
  "error": "Overlay not found"
}





6. Proxy Image
Proxies an image URL to bypass CORS restrictions.

URL: /proxy-image?url=<image_url>
Method: GET
Success Response:
Code: 200
Content: Image binary data


Error Response:
Code: 400
Content:{
  "error": "Invalid image URL"
}





Notes

All endpoints require CORS headers to allow requests from http://localhost:5173.
Use tools like Postman to test endpoints.
Ensure MongoDB is running and FFmpeg is installed for streaming.
