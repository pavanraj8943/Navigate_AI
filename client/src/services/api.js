// API service for making HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // TODO: Implement API methods
  get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`).then(res => res.json()),
  post: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  put: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  delete: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' }).then(res => res.json())
};