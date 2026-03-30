import axios from 'axios';
import { getBaseURL, API_URLS } from './config/api.js';

// Get the base URL
const baseURL = getBaseURL();

console.log('API Base URL:', baseURL); // Debug log
console.log('Available API URLs:', API_URLS); // Debug log

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout and error handling
    timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.baseURL + config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging and fallback handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If it's a CORS or 404 error, try fallback URLs
        if ((error.code === 'ERR_NETWORK' || error.response?.status === 404) && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Try fallback URLs
            for (const fallbackURL of API_URLS.fallbacks) {
                if (fallbackURL !== baseURL) {
                    try {
                        console.log('Trying fallback URL:', fallbackURL);
                        originalRequest.baseURL = fallbackURL;
                        return await api(originalRequest);
                    } catch (fallbackError) {
                        console.log('Fallback failed:', fallbackURL);
                        continue;
                    }
                }
            }
        }
        
        console.error('Response error:', error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default api;