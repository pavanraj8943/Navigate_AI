// API service for making HTTP requests
const API_BASE_URL =  import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com';

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    return data;
  }
  // Handle non-JSON response
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
};

export const api = {
  get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include'
  }).then(handleResponse),
  post: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  }).then(handleResponse),
  put: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' ,
    'Accept': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  }).then(handleResponse),
  delete: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(handleResponse),
  upload: (endpoint, formData) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }).then(handleResponse),
  checkAlignment: (targetRole) => api.post('/resume/alignment', { targetRole }),
  updateProfile: (data) => api.put('/auth/me', data)
};