const getApiBaseUrl = () => {
  // Prefer same-origin in the browser for both dev (Vite proxy) and prod (Vercel)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Fallback for non-browser contexts (e.g., SSR/build tools)
  return import.meta.env.VITE_API_BASE_URL || 'https://xendercross.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();
