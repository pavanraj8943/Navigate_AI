// Validation utilities
export const validators = {
  // TODO: Implement validation functions
  isValidEmail: (email) => /\S+@\S+\.\S+/.test(email),
  isValidPassword: (password) => password.length >= 6,
  isNotEmpty: (value) => value.trim().length > 0
};