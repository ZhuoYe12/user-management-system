// Dynamic environment configuration based on hostname
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isVercel = hostname.includes('vercel.app');
const isRender = hostname.includes('render.com');
const isNetlify = hostname.includes('netlify.app');

// Define the backend endpoints
const LOCAL_API = 'http://localhost:4000/accounts';
const RENDER_API = 'https://user-management-system-1-h9ik.onrender.com/accounts';
// Never use Vercel as API endpoint - the backend is only on Render
// const VERCEL_API = 'https://user-management-eight-kappa.vercel.app/accounts';
const DEFAULT_REMOTE_API = RENDER_API; // Default for other hosting platforms

// This will automatically choose the correct API endpoint based on where the frontend is running
export const environment = {
    production: false,
    // Local development uses localhost API, otherwise use Render API
    apiUrl: isLocalhost 
        ? LOCAL_API 
        : RENDER_API, // Always use Render API for production deployments
    // For debugging - shows which environment was detected
    detectedEnvironment: isLocalhost 
        ? 'Local' 
        : isRender 
            ? 'Render' 
            : isVercel 
                ? 'Vercel' 
                : 'Other'
};
