# XENDERCROSS Backend

A robust Node.js + Express + TypeScript backend API for the XENDERCROSS fault reporting system.

## Features

- ✅ **Fault Reporting API** - Create, read, update, delete fault reports
- ✅ **File Upload Support** - Upload photos, documents, and other files with fault reports
- ✅ **SQLite Database** - Lightweight, serverless database for development
- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **File Validation** - Secure file upload with type and size validation
- ✅ **Rate Limiting** - Protection against abuse and spam
- ✅ **CORS Support** - Cross-origin resource sharing for frontend integration
- ✅ **Security Middleware** - Helmet for security headers and protection
- ✅ **Compression** - Gzip compression for better performance
- ✅ **Error Handling** - Comprehensive error handling and logging

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **better-sqlite3** - Fast, synchronous SQLite database
- **Multer** - File upload middleware
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **uuid** - UUID generation for unique identifiers

## Quick Start

### 1. Install Dependencies

```bash
# From the backend directory
npm install

# Or from the root directory
npm run backend:install
```

### 2. Environment Setup

Create a `.env` file in the backend directory (optional):

```bash
cp .env.example .env
```

Default configuration works out of the box.

### 3. Start Development Server

```bash
# From the backend directory
npm run dev

# Or from the root directory
npm run backend:dev

# Run both frontend and backend together
npm run dev:full
```

The server will start on `http://localhost:3001`

### 4. Verify Installation

```bash
curl http://localhost:3001/health
```

## API Endpoints

### Core Endpoints

- `POST /api/faults` - Create a new fault report with optional file uploads
- `GET /api/faults` - Get all fault reports (with pagination and search)
- `GET /api/faults/:id` - Get a specific fault report
- `PUT /api/faults/:id` - Update a fault report
- `DELETE /api/faults/:id` - Delete a fault report
- `GET /api/faults/stats/summary` - Get fault statistics

### File Endpoints

- `GET /uploads/:filename` - Serve uploaded files
- `GET /uploads/fault/:faultId/:filename` - Serve files with fault validation
- `GET /uploads/info/:filename` - Get file metadata

### Utility Endpoints

- `GET /health` - Health check
- `GET /api/docs` - API documentation

## Database Schema

### Faults Table
```sql
CREATE TABLE faults (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reporter TEXT NOT NULL,
  date TEXT NOT NULL,
  severity TEXT NOT NULL CHECK(severity IN ('minor', 'major', 'critical')),
  assetId TEXT NOT NULL,
  subsystem TEXT,
  location TEXT,
  category TEXT,
  observedCause TEXT,
  diagnosticSteps BOOLEAN DEFAULT FALSE,
  rootCauseKnown BOOLEAN DEFAULT FALSE,
  rootCauseDetails TEXT,
  workaround TEXT,
  temporaryFix BOOLEAN DEFAULT FALSE,
  temporaryFixDetails TEXT,
  passengerSafety BOOLEAN DEFAULT FALSE,
  staffSafety BOOLEAN DEFAULT FALSE,
  sparePartsRequired BOOLEAN DEFAULT FALSE,
  sparePartsList TEXT,
  estimatedRepairTime TEXT,
  supervisorNotified BOOLEAN DEFAULT FALSE,
  escalationNeeded BOOLEAN DEFAULT FALSE,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Fault Files Table
```sql
CREATE TABLE fault_files (
  id TEXT PRIMARY KEY,
  faultId TEXT NOT NULL,
  fileName TEXT NOT NULL,
  originalName TEXT NOT NULL,
  mimeType TEXT NOT NULL,
  size INTEGER NOT NULL,
  filePath TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faultId) REFERENCES faults (id) ON DELETE CASCADE
);
```

## File Upload Configuration

- **Supported formats**: JPG, JPEG, PNG, PDF, TXT, DOC, DOCX
- **Maximum file size**: 10MB per file
- **Maximum files per request**: 5 files
- **Storage**: Local filesystem in `uploads/` directory
- **Naming**: Timestamp + UUID for uniqueness
- **Security**: MIME type validation and extension checking

## Development Scripts

```bash
# Development with auto-reload
npm run dev
npm run dev:watch  # Using nodemon

# Build TypeScript to JavaScript
npm run build

# Production server
npm start

# Clean build directory
npm run clean
```

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   └── database.ts      # Database schema and operations
│   ├── routes/
│   │   ├── faults.ts        # Fault reporting endpoints
│   │   └── uploads.ts       # File serving endpoints
│   ├── middleware/
│   │   └── upload.ts        # File upload middleware
│   └── server.ts            # Main Express server
├── uploads/                 # File storage directory
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── API_EXAMPLES.md
```

## Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS (production)
FRONTEND_URL=http://localhost:5173

# Optional: Custom database path
# DATABASE_PATH=./database.sqlite
```

## Production Deployment

### 1. Build the Project

```bash
npm run build
```

### 2. Set Environment Variables

```bash
export NODE_ENV=production
export PORT=3001
export FRONTEND_URL=https://yourdomain.com
```

### 3. Start Production Server

```bash
npm start
```

### 4. Process Management (Optional)

Use PM2 for production process management:

```bash
npm install -g pm2
pm2 start dist/server.js --name xendercross-backend
```

## Security Features

- **Rate Limiting**: 100 API requests and 20 file uploads per 15 minutes per IP
- **File Validation**: MIME type and extension checking
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers and XSS protection
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Safe error messages without sensitive information

## Performance Features

- **Compression**: Gzip compression for responses
- **SQLite Indexes**: Optimized database queries
- **File Streaming**: Efficient file serving with range requests
- **Caching Headers**: Browser caching for static files

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `413` - Payload Too Large
- `429` - Too Many Requests
- `500` - Internal Server Error

## Testing

Test the API endpoints using the examples in `API_EXAMPLES.md`:

```bash
# Health check
curl http://localhost:3001/health

# Create a fault report
curl -X POST http://localhost:3001/api/faults \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test fault","reporter":"Test User","severity":"minor","assetId":"Test-001"}'
```

## Integration with Frontend

The backend is designed to work seamlessly with the XENDERCROSS React frontend. The frontend form (`FaultReportForm.tsx`) has been updated to integrate with this backend.

### Frontend Configuration

Ensure your frontend points to the correct backend URL:

```typescript
const API_BASE_URL = 'http://localhost:3001'; // Development
// const API_BASE_URL = 'https://api.yourdomain.com'; // Production
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3001
   netstat -ano | findstr :3001  # Windows
   lsof -i :3001                 # macOS/Linux
   ```

2. **File upload not working**
   - Check file size (max 10MB)
   - Verify file type is supported
   - Ensure uploads/ directory exists and is writable

3. **Database errors**
   - Check database.sqlite file permissions
   - Ensure no other process is using the database

4. **CORS errors**
   - Verify frontend URL in CORS configuration
   - Check browser network tab for preflight requests

### Logs

The server logs important information to the console. Enable debug logging:

```bash
DEBUG=* npm run dev  # Enable all debug logs
```

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test API endpoints

## License

ISC License - see project root for details.
