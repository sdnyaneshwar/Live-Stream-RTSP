export const startStream = async (data) => {
  const response = await fetch('http://localhost:5000/start_stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to start stream');
  return response.json();
};

export const getOverlays = async () => {
  const response = await fetch('http://localhost:5000/overlays', {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch overlays');
  return response.json();
};

export const createOverlay = async (data) => {
  const response = await fetch('http://localhost:5000/overlays', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create overlay');
  return response.json();
};

export const updateOverlay = async (id, data) => {
  const response = await fetch(`http://localhost:5000/overlays/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update overlay');
  return response.json();
};

export const deleteOverlay = async (id) => {
  const response = await fetch(`http://localhost:5000/overlays/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete overlay');
  return response.json();
};