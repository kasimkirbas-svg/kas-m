// Dynamic API URL detection
export const getApiUrl = () => {
    // 1. Force a specific public URL if configured (e.g. for production tunnel)
    // Uncomment and change this to your persistent tunnel URL if you have one
    const TUNNEL_URL = 'https://kirbas-doc-platform.loca.lt'; 
    
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // If we are on Vercel or any remote domain, we MUST use the public backend URL
        if (hostname.includes('vercel.app') || (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.'))) {
             return TUNNEL_URL;
        }

        // If on localhost development (or local network), try to use relative path to leverage Vite proxy
        // This avoids CORS issues and port conflicts and firewall issues for port 3001
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
             // Returning empty string makes requests relative (e.g. /api/users)
             // which go through Vite dev server proxy to backend
             return ''; 
        }
    }
    
    // Default fallback
    return 'http://localhost:3001';
};

// Start a fetch request with necessary headers for Tunnel services
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = getApiUrl();
    const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true', // Required for LocalTunnel
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
};
