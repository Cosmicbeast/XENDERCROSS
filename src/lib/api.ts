const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    // Vercel deployment - use same origin
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return origin;
    }

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
  }

  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();