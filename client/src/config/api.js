// API Configuration with multiple fallbacks
const API_CONFIG = {
  primary: import.meta.env?.VITE_API_URL || "https://chatbot-backend-9y4z.onrender.com",
  fallbacks: []
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
