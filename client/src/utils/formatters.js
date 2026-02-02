// Formatting utilities
export const formatters = {
  // TODO: Implement formatting functions
  formatDate: (date) => new Date(date).toLocaleDateString(),
  formatCurrency: (amount) => `$${amount.toFixed(2)}`,
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
};