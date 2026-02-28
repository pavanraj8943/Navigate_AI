// Application constants
export const constants = {
  // TODO: Add application constants
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com/api',
  STORAGE_KEYS: {
    USER: 'user',
    TOKEN: 'token'
  },
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup'
  }
};