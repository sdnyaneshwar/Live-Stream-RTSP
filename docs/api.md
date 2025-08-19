<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation for RTSP Livestream App</title>
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
    </style>
</head>
<body>
    <h1>API Documentation for RTSP Livestream App</h1>
    <p>This document describes the RESTful API endpoints for the RTSP livestream application, built with Flask and MongoDB. The API supports starting an RTSP stream and managing overlays (text or images) on the video.</p>

    <h2>Base URL</h2>
    <p><code>http://localhost:5000</code></p>

    <h2>Endpoints</h2>

    <h3>1. Start Stream</h3>
    <p>Initiates an RTSP-to-HLS stream conversion using FFmpeg.</p>
    <ul>
        <li><strong>URL</strong>: <code>/start_stream</code></li>
        <li><strong>Method</strong>: <code>POST</code></li>
        <li><strong>Request Body</strong>:
            <pre><code>{
    "rtsp_url": "string" // e.g., "rtsp://rtsp.stream/pattern"
}</code></pre>
        </li>
        <li><strong>Success Response</strong>:
            <ul>
                <li><strong>Code</strong>: 200</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "hls_url": "/hls/playlist.m3u8"
}</code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Error Response</strong>:
            <ul>
                <li><strong>Code</strong>: 400</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "error": "Invalid RTSP URL"
}</code></pre>
                </li>
            </ul>
        </li>
    </ul>

    <h3>2. Get All Overlays</h3>
    <p>Retrieves all saved overlay settings from MongoDB.</p>
    <ul>
        <li><strong>URL</strong>: <code>/overlays</code></li>
        <li><strong>Method</strong>: <code>GET</code></li>
        <li><strong>Success Response</strong>:
            <ul>
                <li><strong>Code</strong>: 200</li>
                <li><strong>Content</strong>:
                    <pre><code>[
    {
        "_id": "string",
        "type": "text|image",
        "content": "string",
        "position": { "x": "string", "y": "string" },
        "size": { "width": "string", "height": "string" },
        "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional, for text overlays
    },
    ...
]</code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Error Response</strong>:
            <ul>
                <li><strong>Code</strong>: 500</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "error": "Failed to fetch overlays"
}</code></pre>
                </li>
            </ul>
        </li>
    </ul>

    <h3>3. Create Overlay</h3>
    <p>Creates a new overlay and saves it to MongoDB.</p>
    <ul>
        <li><strong>URL</strong>: <code>/overlays</code></li>
        <li><strong>Method</strong>: <code>POST</code></li>
        <li><strong>Request Body</strong>:
            <pre><code>{
    "type": "text|image",
    "content": "string",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional, for text overlays
}</code></pre>
        </li>
        <li><strong>Success Response</strong>:
            <ul>
                <li><strong>Code</strong>: 201</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "_id": "string",
    "type": "text|image",
    "content": "string",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional
}</code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Error Response</strong>:
            <ul>
                <li><strong>Code</strong>: 400</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "error": "Invalid overlay data"
}</code></pre>
                </li>
            </ul>
        </li>
    </ul>

    <h3>4. Update Overlay</h3>
    <p>Updates an existing overlay by ID.</p>
    <ul>
        <li><strong>URL</strong>: <code>/overlays/&lt;id&gt;</code></li>
        <li><strong>Method</strong>: <code>PUT</code></li>
        <li><strong>Request Body</strong>:
            <pre><code>{
    "type": "text|image",
    "content": "string",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional
}</code></pre>
        </li>
        <li><strong>Success Response</strong>:
            <ul>
                <li><strong>Code</strong>: 200</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "_id": "string",
    "type": "text|image",
    "content": "string",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "style": { "color": "string", "fontSize": "string", "backgroundColor": "string" } // Optional
}</code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Error Response</strong>:
            <ul>
                <li><strong>Code</strong>: 404</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "error": "Overlay not found"
}</code></pre>
                </li>
            </ul>
        </li>
    </ul>

    <h3>5. Delete Overlay</h3>
    <p>Deletes an overlay by ID.</p>
    <ul>
        <li><strong>URL</strong>: <code>/overlays/&lt;id&gt;</code></li>
        <li><strong>Method</strong>: <code>DELETE</code></li>
        <li><strong>Success Response</strong>:
            <ul>
                <li><strong>Code</strong>: 200</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "message": "Overlay deleted successfully"
}</code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Error Response</strong>:
            <ul>
                <li><strong>Code</strong>: 404</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "error": "Overlay not found"
}</code></pre>
                </li>
            </ul>
        </li>
    </ul>

    <h3>6. Proxy Image</h3>
    <p>Proxies an image URL to bypass CORS restrictions.</p>
    <ul>
        <li><strong>URL</strong>: <code>/proxy-image?url=&lt;image_url&gt;</code></li>
        <li><strong>Method</strong>: <code>GET</code></li>
        <li><strong>Success Response</strong>:
            <ul>
                <li><strong>Code</strong>: 200</li>
                <li><strong>Content</strong>: Image binary data</li>
            </ul>
        </li>
        <li><strong>Error Response</strong>:
            <ul>
                <li><strong>Code</strong>: 400</li>
                <li><strong>Content</strong>:
                    <pre><code>{
    "error": "Invalid image URL"
}</code></pre>
                </li>
            </ul>
        </li>
    </ul>

    <h2>Notes</h2>
    <ul>
        <li>All endpoints require CORS headers to allow requests from <code>http://localhost:5173</code>.</li>
        <li>Use tools like Postman to test endpoints.</li>
        <li>Ensure MongoDB is running and FFmpeg is installed for streaming.</li>
    </ul>
</body>
</html>