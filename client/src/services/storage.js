// Storage service for local storage operations
export const storage = {
  // TODO: Implement storage logic
  setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  getItem: (key) => JSON.parse(localStorage.getItem(key)),
  removeItem: (key) => localStorage.removeItem(key)
};