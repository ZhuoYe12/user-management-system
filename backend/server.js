require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./_middleware/error_handler');
const http = require('http');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? (process.env.PORT || 80) : 4000;
const allowedOrigins = [
   'https://user-management-system-angular-tm8z.vercel.app',
    'https://user-management-system-angular.vercel.app',
    'https://user-management-system-angular-froillan123.vercel.app',
    'https://user-management-system-pn5a.vercel.app',
    'https://user-management-system-production.up.railway.app',
    // Local development URLs
    'http://localhost:4200',
    'http://localhost:3000',
    'http://127.0.0.1:4200'
];

// Parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration
app.use((req, res, next) => {
    // Log the origin for debugging
    console.log(`Request origin: ${req.headers.origin}`);
    next();
});

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        // Check if the origin is allowed
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked request from: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add additional headers to handle preflight requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Handle OPTIONS preflight requests
app.options('*', (req, res) => {
    res.sendStatus(200);
});

// API routes - wrap in try/catch to isolate errors
try {
    console.log('Loading accounts controller...');
    const accountsController = require('./accounts/accounts.controller');
    app.use('/accounts', accountsController);
    console.log('Accounts controller loaded successfully');
} catch (error) {
    console.error('Error loading controllers:', error);
    process.exit(1);
}

// Swagger docs route - disabled to avoid path-to-regexp errors
app.use('/api-docs', (req, res) => {
    res.status(503).send('API Documentation temporarily unavailable due to path-to-regexp issues');
});

// Global error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Log environment information
console.log(`Server running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
console.log(`Server listening on port ${port}`);
console.log(`API Documentation temporarily disabled`);

server.listen(port);
