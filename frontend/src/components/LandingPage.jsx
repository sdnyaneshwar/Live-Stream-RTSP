import { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import Hls from 'hls.js';
import Draggable from 'react-draggable';
import { startStream, getOverlays, createOverlay, updateOverlay, deleteOverlay } from '../api';

function LandingPage() {
  const videoRef = useRef(null);
  const draggableRef = useRef(null);
  const [hlsUrl, setHlsUrl] = useState('');
  const [error, setError] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [overlays, setOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [overlayForm, setOverlayForm] = useState({
    type: 'text',
    content: '',
    position: { x: '10%', y: '10%' },
    size: { width: '200px', height: '50px' },
    style: { color: 'white', fontSize: '24px', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchOverlays = async () => {
      try {
        const data = await getOverlays();
        setOverlays(data);
        console.log('Fetched overlays:', data);
      } catch (err) {
        setError('Failed to fetch overlays');
      }
    };
    fetchOverlays();
  }, []);

  const startStreaming = async () => {
    if (!rtspUrl.trim()) {
      setError('Please enter a valid RTSP URL');
      return;
    }
    try {
      const response = await startStream({ rtsp_url: rtspUrl });
      setHlsUrl(response.hls_url);
      setError('');
    } catch (err) {
      setError('Failed to start stream: ' + (err.message || 'Unknown error'));
    }
  };

  const copyRtspUrl = () => {
    const url = 'rtsp://rtspstream:5hccZBNYAQiYnSRImRXMG@zephyr.rtsp.stream/pattern2';
    navigator.clipboard.writeText(url).then(() => {
      setError('RTSP URL copied to clipboard!');
    }).catch((err) => {
      setError('Failed to copy URL: ' + (err.message || 'Unknown error'));
    });
  };

  useEffect(() => {
    if (hlsUrl && videoRef.current) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          liveSyncDurationCount: 5,
          liveMaxLatencyDurationCount: 10,
        });
        hls.loadSource(`http://localhost:5000${hlsUrl}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((err) => {
            console.error('Playback error:', err);
            setError('Failed to start playback');
          });
        });
        hls.on(Hls.Events.BUFFER_APPENDING, () => {
          setIsBuffering(true);
        });
        hls.on(Hls.Events.BUFFER_APPENDED, () => {
          setIsBuffering(false);
        });
        
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = `http://localhost:5000${hlsUrl}`;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((err) => {
            console.error('Playback error:', err);
            setError('Failed to start playback');
          });
        });
        video.addEventListener('waiting', () => setIsBuffering(true));
        video.addEventListener('playing', () => setIsBuffering(false));
      } else {
        setError('HLS is not supported in this browser');
      }
    }
  }, [hlsUrl]);

  const handleOverlaySubmit = async (e) => {
    e.preventDefault();
    if (overlayForm.type === 'image' && !overlayForm.content.match(/\.(jpg|jpeg|png|gif)$/i)) {
      setError('Please enter a valid image URL (e.g., ending with .jpg, .png, .gif)');
      return;
    }
    try {
      const overlayData = {
        type: overlayForm.type,
        content: overlayForm.type === 'image'
          ? `http://localhost:5000/proxy-image?url=${encodeURIComponent(overlayForm.content)}`
          : overlayForm.content,
        position: {
          x: overlayForm.position.x,
          y: overlayForm.position.y,
        },
        size: {
          width: overlayForm.size.width,
          height: overlayForm.size.height,
        },
        ...(overlayForm.type === 'text' && { style: overlayForm.style }),
      };
      console.log('Submitting overlay data:', overlayData);
      if (editMode && selectedOverlay) {
        await updateOverlay(selectedOverlay._id, overlayData);
        setEditMode(false);
      } else {
        await createOverlay(overlayData);
      }
      const updatedOverlays = await getOverlays();
      setOverlays(updatedOverlays);
      setSelectedOverlay(null);
      setError('');
      setOverlayForm({
        type: 'text',
        content: '',
        position: { x: '10%', y: '10%' },
        size: { width: '200px', height: '50px' },
        style: { color: 'white', fontSize: '24px', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      });
    } catch (err) {
      setError('Failed to save overlay: ' + (err.message || 'Unknown error'));
    }
  };

  const handleOverlayFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('position.')) {
      const key = name.split('.')[1];
      setOverlayForm({
        ...overlayForm,
        position: { ...overlayForm.position, [key]: value },
      });
    } else if (name.includes('size.')) {
      const key = name.split('.')[1];
      setOverlayForm({
        ...overlayForm,
        size: { ...overlayForm.size, [key]: value },
      });
    } else if (name.includes('style.')) {
      const key = name.split('.')[1];
      setOverlayForm({
        ...overlayForm,
        style: { ...overlayForm.style, [key]: value },
      });
    } else {
      setOverlayForm({ ...overlayForm, [name]: value });
    }
  };

  const handleEditOverlay = () => {
    if (selectedOverlay) {
      setOverlayForm({
        type: selectedOverlay.type,
        content: selectedOverlay.content.startsWith('http://localhost:5000/proxy-image')
          ? decodeURIComponent(selectedOverlay.content.split('url=')[1] || '')
          : selectedOverlay.content,
        position: { ...selectedOverlay.position },
        size: { ...selectedOverlay.size },
        style: selectedOverlay.style || { color: 'white', fontSize: '24px', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      });
      setEditMode(true);
    }
  };

  const handleDeleteOverlay = async () => {
    if (selectedOverlay) {
      try {
        await deleteOverlay(selectedOverlay._id);
        const updatedOverlays = await getOverlays();
        setOverlays(updatedOverlays);
        setSelectedOverlay(null);
        setEditMode(false);
        setError('');
      } catch (err) {
        setError('Failed to delete overlay: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleDragStop = async (e, data, overlay) => {
    try {
      const video = videoRef.current;
      const videoRect = video.getBoundingClientRect();
      const newX = `${(data.x / videoRect.width) * 100}%`;
      const newY = `${(data.y / videoRect.height) * 100}%`;
      const updatedOverlay = {
        ...overlay,
        position: { x: newX, y: newY },
      };
      await updateOverlay(overlay._id, updatedOverlay);
      const updatedOverlays = await getOverlays();
      setOverlays(updatedOverlays);
      setSelectedOverlay(updatedOverlays.find((o) => o._id === overlay._id) || null);
      setError('');
    } catch (err) {
      // setError('Failed to update overlay position: ' + (err.message || 'Unknown error'));
    }
  };

  const handleImageError = (e) => {
    console.error('Image load error:', e);
    setError('Failed to load image overlay. Check the URL or CORS settings.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Live Stream</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '20px' }}>
        <h3>Stream Control</h3>
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="Enter RTSP URL (e.g., rtsp://example.com/stream)"
          style={{ width: '100%', maxWidth: '600px', padding: '8px', marginRight: '10px' }}
        />
        <button onClick={startStreaming}>Start Stream</button>
        <div style={{ padding: '8px 16px', marginLeft: '10px' }}>

        <div onClick={copyRtspUrl} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          Use Test URL : rtsp://rtspstream:5hccZBNYAQiYnSRImRXMG@zephyr.rtsp.stream/pattern2
        </div>
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Overlay</h3>
        <select
          value={selectedOverlay ? selectedOverlay._id : ''}
          onChange={(e) => {
            const overlay = overlays.find((o) => o._id === e.target.value);
            console.log('Selected overlay:', overlay);
            setSelectedOverlay(overlay || null);
            setEditMode(false);
          }}
          style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
        >
          <option value="">None</option>
          {overlays.map((overlay) => (
            <option key={overlay._id} value={overlay._id}>
              {overlay.type}: {overlay.content}
            </option>
          ))}
        </select>
        {selectedOverlay && (
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleEditOverlay} style={{ padding: '8px 16px', marginRight: '10px' }}>
              Edit Overlay
            </button>
            <button onClick={handleDeleteOverlay} style={{ padding: '8px 16px', backgroundColor: '#ff4444' }}>
              Delete Overlay
            </button>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>{editMode ? 'Edit Overlay' : 'Create New Overlay'}</h3>
        <form onSubmit={handleOverlaySubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Type: </label>
            <select
              name="type"
              value={overlayForm.type}
              onChange={handleOverlayFormChange}
              style={{ padding: '8px' }}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Content: </label>
            <input
              type="text"
              name="content"
              value={overlayForm.content}
              onChange={handleOverlayFormChange}
              placeholder={overlayForm.type === 'text' ? 'Enter text' : 'Enter image URL (e.g., https://example.com/image.jpg)'}
              style={{ width: '100%', maxWidth: '400px', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Position X: </label>
            <input
              type="text"
              name="position.x"
              value={overlayForm.position.x}
              onChange={handleOverlayFormChange}
              placeholder="e.g., 10% or 20px"
              style={{ width: '100px', padding: '8px' }}
            />
            <label style={{ marginLeft: '10px' }}>Position Y: </label>
            <input
              type="text"
              name="position.y"
              value={overlayForm.position.y}
              onChange={handleOverlayFormChange}
              placeholder="e.g., 10% or 20px"
              style={{ width: '100px', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Width: </label>
            <input
              type="text"
              name="size.width"
              value={overlayForm.size.width}
              onChange={handleOverlayFormChange}
              placeholder="e.g., 200px"
              style={{ width: '100px', padding: '8px' }}
            />
            <label style={{ marginLeft: '10px' }}>Height: </label>
            <input
              type="text"
              name="size.height"
              value={overlayForm.size.height}
              onChange={handleOverlayFormChange}
              placeholder="e.g., 50px"
              style={{ width: '100px', padding: '8px' }}
            />
          </div>
          {overlayForm.type === 'text' && (
            <div style={{ marginBottom: '10px' }}>
              <label>Text Color: </label>
              <input
                type="text"
                name="style.color"
                value={overlayForm.style.color}
                onChange={handleOverlayFormChange}
                placeholder="e.g., white or #ffffff"
                style={{ width: '100px', padding: '8px' }}
              />
              <label style={{ marginLeft: '10px' }}>Font Size: </label>
              <input
                type="text"
                name="style.fontSize"
                value={overlayForm.style.fontSize}
                onChange={handleOverlayFormChange}
                placeholder="e.g., 24px"
                style={{ width: '100px', padding: '8px' }}
              />
              <label style={{ marginLeft: '10px' }}>Background Color: </label>
              <input
                type="text"
                name="style.backgroundColor"
                value={overlayForm.style.backgroundColor}
                onChange={handleOverlayFormChange}
                placeholder="e.g., rgba(0, 0, 0, 0.5)"
                style={{ width: '150px', padding: '8px' }}
              />
            </div>
          )}
          <button type="submit" style={{ padding: '8px 16px' }}>
            {editMode ? 'Update Overlay' : 'Create Overlay'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setOverlayForm({
                  type: 'text',
                  content: '',
                  position: { x: '10%', y: '10%' },
                  size: { width: '200px', height: '50px' },
                  style: { color: 'white', fontSize: '24px', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                });
              }}
              style={{ padding: '8px 16px', marginLeft: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        <video
          ref={videoRef}
          controls
          autoPlay
          style={{ width: '100%', maxWidth: '800px' }}
        />
        {isBuffering && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px',
            borderRadius: '5px',
          }}>
            Buffering...
          </div>
        )}
        {selectedOverlay && (
          <Draggable
            nodeRef={draggableRef}
            bounds="parent"
            onStop={(e, data) => handleDragStop(e, data, selectedOverlay)}
            defaultPosition={{
              x: parseFloat(selectedOverlay.position.x) * (videoRef.current?.getBoundingClientRect().width || 800) / 100,
              y: parseFloat(selectedOverlay.position.y) * (videoRef.current?.getBoundingClientRect().height || 450) / 100,
            }}
          >
            <div
              ref={draggableRef}
              style={{
                position: 'absolute',
                width: selectedOverlay.size.width,
                height: selectedOverlay.size.height,
                zIndex: 10,
                cursor: 'move',
                ...(selectedOverlay.style || {}),
              }}
            >
              {selectedOverlay.type === 'text' ? (
                <span>{selectedOverlay.content}</span>
              ) : (
                <img
                  src={
                    selectedOverlay.content.startsWith('http://localhost:5000/proxy-image')
                      ? selectedOverlay.content
                      : `http://localhost:5000/proxy-image?url=${encodeURIComponent(selectedOverlay.content)}`
                  }
                  alt="Overlay"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={handleImageError}
                  onLoad={() => console.log('Image loaded successfully:', selectedOverlay.content)}
                />
              )}
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}

export default LandingPage;