// Dynamic API URL detection
export const getApiUrl = () => {
    // 1. Force a specific public URL if configured (e.g. for production tunnel)
    // Uncomment and change this to your persistent tunnel URL if you have one
    const TUNNEL_URL = 'https://kirbas-doc-platform.loca.lt'; 
    
    // Check if we are checking the server status, we might want to try multiple
    // But for simplicity, if we are on localhost, use localhost
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // If we are on Vercel or any remote domain, we MUST use the public backend URL
        if (hostname.includes('vercel.app') || (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.'))) {
             return TUNNEL_URL;
        }

        // Keep local IP logic for local network testing
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return `http://${hostname}:3001`;
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
