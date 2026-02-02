// Application constants
export const constants = {
  // TODO: Add application constants
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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