// Auto-detect deployment URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Vercel deployment - use same origin
    if (hostname.includes('vercel.app')) {
      return window.location.origin;
    }
    
    // GitHub Codespaces detection
    if (hostname.includes('github.dev') || hostname.includes('githubpreview.dev') || hostname.includes('app.github.dev')) {
      const protocol = window.location.protocol;
      const baseUrl = hostname.replace(/-(\d+)/, '-3001');
      return `${protocol}//${baseUrl}`;
    }
    
    // Gitpod detection
    if (hostname.includes('gitpod.io')) {
      return window.location.origin.replace('5173', '3001');
    }
  }
  
  // Environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();