// Auto-detect codespace URL or use localhost
const getApiBaseUrl = () => {
  // Check if running in GitHub Codespaces
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
    // Replace frontend port with backend port
    return window.location.origin.replace('-5173', '-3001');
  }
  
  // Check for environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default to localhost
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();