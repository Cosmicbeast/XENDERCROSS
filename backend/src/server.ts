import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { getUploadsDir } from './utils/paths';
import type { ErrorRequestHandler } from 'express';

// Import routes
import faultsRouter from './routes/faults';
import uploadsRouter from './routes/uploads';

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env['PORT'] || 3001);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable CSP for file uploads
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 file uploads per windowMs
  message: {
    success: false,
    message: 'Too many file uploads from this IP, please try again later.'
  }
});

app.use('/api/', limiter);
app.use('/uploads/', uploadLimiter);

// CORS configuration
const corsOptions = {
  origin: process.env['NODE_ENV'] === 'production' 
    ? (process.env['FRONTEND_URL'] || 'http://localhost:5173')
    : true, // allow all origins in development (includes codespaces)
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Range']
};

app.use(cors(corsOptions));
// Explicitly handle preflight for SPA fetches
app.options('*', cors(corsOptions));

// Compression middleware
app.use(compression());
// Request logging (dev only)
if (process.env['NODE_ENV'] !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${durationMs}ms`);
    });
    next();
  });
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'XENDERCROSS Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/faults', faultsRouter);
app.use('/uploads', uploadsRouter);
// Also expose static files from uploads for local usage
app.use('/uploads', express.static(getUploadsDir()))

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'XENDERCROSS Fault Reporting API Documentation',
    version: '1.0.0',
    endpoints: {
      'POST /api/faults': {
        description: 'Create a new fault report with optional file uploads',
        body: {
          title: 'string (required)',
          description: 'string (required)',
          reporter: 'string (required)',
          severity: 'string (required) - one of: minor, major, critical',
          assetId: 'string (required)',
          date: 'string (optional) - ISO date string',
          subsystem: 'string (optional)',
          location: 'string (optional)',
          category: 'string (optional)',
          observedCause: 'string (optional)',
          diagnosticSteps: 'boolean (optional)',
          rootCauseKnown: 'boolean (optional)',
          rootCauseDetails: 'string (optional)',
          workaround: 'string (optional)',
          temporaryFix: 'boolean (optional)',
          temporaryFixDetails: 'string (optional)',
          passengerSafety: 'boolean (optional)',
          staffSafety: 'boolean (optional)',
          sparePartsRequired: 'boolean (optional)',
          sparePartsList: 'string (optional)',
          estimatedRepairTime: 'string (optional)',
          supervisorNotified: 'boolean (optional)',
          escalationNeeded: 'boolean (optional)'
        },
        files: 'multipart/form-data field "files" - up to 5 files (JPG, PNG, PDF, TXT, DOC, DOCX)',
        response: 'Created fault report with file information'
      },
      'GET /api/faults': {
        description: 'Get all fault reports with pagination and search',
        query: {
          limit: 'number (optional, default: 50, max: 100)',
          offset: 'number (optional, default: 0)',
          search: 'string (optional)',
          severity: 'string (optional) - filter by severity',
          assetId: 'string (optional) - filter by asset ID',
          category: 'string (optional) - filter by category',
          dateFrom: 'string (optional) - filter from date',
          dateTo: 'string (optional) - filter to date'
        },
        response: 'List of fault reports with file counts'
      },
      'GET /api/faults/:id': {
        description: 'Get a specific fault report by ID',
        params: { id: 'string (required) - fault report ID' },
        response: 'Fault report with associated files'
      },
      'PUT /api/faults/:id': {
        description: 'Update a fault report',
        params: { id: 'string (required) - fault report ID' },
        body: 'Any valid fault report fields (partial update)',
        response: 'Updated fault report'
      },
      'DELETE /api/faults/:id': {
        description: 'Delete a fault report and its files',
        params: { id: 'string (required) - fault report ID' },
        response: 'Success confirmation'
      },
      'GET /api/faults/stats/summary': {
        description: 'Get fault statistics summary',
        response: 'Statistics including total count, severity breakdown, recent count'
      },
      'GET /uploads/:filename': {
        description: 'Serve uploaded files',
        params: { filename: 'string (required) - file name' },
        response: 'File content with appropriate headers'
      },
      'GET /uploads/fault/:faultId/:filename': {
        description: 'Serve files with fault validation',
        params: {
          faultId: 'string (required) - fault report ID',
          filename: 'string (required) - file name'
        },
        response: 'File content with appropriate headers'
      }
    },
    fileTypes: {
      allowed: ['JPG', 'JPEG', 'PNG', 'PDF', 'TXT', 'DOC', 'DOCX'],
      maxSize: '10MB per file',
      maxFiles: '5 files per request'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /api/docs',
      'POST /api/faults',
      'GET /api/faults',
      'GET /api/faults/:id',
      'PUT /api/faults/:id',
      'DELETE /api/faults/:id',
      'GET /api/faults/stats/summary'
    ]
  });
});

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);

  // Handle specific error types
  type ErrorLike = { type?: string; status?: number; message?: string; stack?: string };
  const anyErr: ErrorLike = err as ErrorLike;
  if (anyErr.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body'
    });
  }

  if (anyErr.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }

  // Default error response
  res.status(anyErr.status || 500).json({
    success: false,
    message: anyErr.message || 'Internal Server Error',
    ...(process.env['NODE_ENV'] === 'development' && { stack: anyErr.stack })
  });
  return;
};
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 XENDERCROSS Backend API Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  
  if (process.env['NODE_ENV'] !== 'production') {
    console.log(`🔧 Frontend CORS origin: ${corsOptions.origin}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
