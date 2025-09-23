const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    // Always use same origin for Vercel deployment
    return window.location.origin;
  }

  return 'https://xendercross.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();