// Auto-detect API base URL so frontend and backend work on the same origin locally
const getApiBaseUrl = () => {
  // 1) Explicit override via env always wins
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    // 2) Local development: prefer same-origin because Vite proxies /api and /uploads
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0'
    ) {
      return origin;
    }

    // 3) Vercel deployment - use same origin
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return origin;
    }

    // 4) GitHub Codespaces detection
    if (
      hostname.includes('github.dev') ||
      hostname.includes('githubpreview.dev') ||
      hostname.includes('app.github.dev')
    ) {
      const protocol = window.location.protocol;
      const baseUrl = hostname.replace(/-(\d+)/, '-3001');
      return `${protocol}//${baseUrl}`;
    }

    // 5) Gitpod detection
    if (hostname.includes('gitpod.io')) {
      return origin.replace('5173', '3001');
    }
  }

  // 6) Default fallback for non-browser contexts
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();