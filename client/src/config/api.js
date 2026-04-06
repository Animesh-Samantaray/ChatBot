// API Configuration with multiple fallbacks
const API_CONFIG = {
  // Try environment variable first
  primary: import.meta.env?.VITE_API_URL,
  // Fallback URLs
  fallbacks: [
    'https://chat-bot-bcknd.vercel.app/api',
    'https://chat-bot-bcknd.vercel.app',
    'http://localhost:3000/api',
    'http://localhost:3000'
  ]
};

// Get the working base URL
export const getBaseURL = () => {
  // Try environment variable first
  if (API_CONFIG.primary) {
    return API_CONFIG.primary;
  }
  
  // Return the first fallback
  return API_CONFIG.fallbacks[0];
};

// Export for debugging
export const API_URLS = API_CONFIG;
