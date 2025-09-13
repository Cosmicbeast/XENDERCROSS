# XENDERCROSS - Complete Full-Stack Fault Reporting System

A comprehensive fault reporting system for XENDERCROSS with React frontend and Node.js backend.

## 🏗️ **Architecture Overview**

### **Frontend** 
- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** Shadcn/ui + Tailwind CSS
- **Features:** Interactive fault reporting form, file uploads, dashboard
- **Port:** 5173 (development)

### **Backend**
- **Framework:** Node.js + Express + TypeScript  
- **Database:** SQLite with better-sqlite3
- **Features:** RESTful API, file management, security middleware
- **Port:** 3001 (development)

## 📦 **Project Structure**

```
XENDERCROSS/
├── 📁 src/                           # Frontend React Application
│   ├── 📁 components/
│   │   ├── FaultReportForm.tsx       # ⭐ Main fault reporting form (updated)
│   │   ├── AppSidebar.tsx            # Navigation sidebar
│   │   ├── DashboardHeader.tsx       # Header component
│   │   ├── Layout.tsx                # App layout wrapper
│   │   └── ui/                       # Shadcn/ui components
│   ├── 📁 pages/
│   │   ├── Dashboard.tsx             # Main dashboard
│   │   ├── FaultReports.tsx          # Fault reports list
│   │   ├── Analytics.tsx             # Analytics page
│   │   └── Settings.tsx              # Settings page
│   ├── 📁 hooks/
│   │   ├── use-mobile.tsx            # Mobile detection
│   │   └── use-toast.ts              # Toast notifications
│   ├── 📁 contexts/
│   │   └── LanguageContext.tsx       # Multi-language support
│   └── 📁 lib/
│       └── utils.ts                  # Utility functions
├── 📁 backend/                       # Backend API Server
│   ├── 📁 src/
│   │   ├── 📁 models/
│   │   │   └── database.ts           # 🗄️ SQLite database & schema
│   │   ├── 📁 routes/
│   │   │   ├── faults.ts             # 🔌 Fault API endpoints
│   │   │   └── uploads.ts            # 📎 File serving routes
│   │   ├── 📁 middleware/
│   │   │   └── upload.ts             # 📤 File upload validation
│   │   └── server.ts                 # 🚀 Express server
│   ├── 📁 uploads/                   # File storage directory
│   ├── package.json                  # Backend dependencies
│   ├── tsconfig.json                 # Backend TypeScript config
│   ├── .env.example                  # Environment template
│   ├── README.md                     # Backend documentation
│   └── API_EXAMPLES.md               # API usage examples
├── 📁 public/                        # Static assets
├── package.json                      # Frontend deps + combined scripts
├── vite.config.ts                    # Vite configuration
├── tailwind.config.ts                # Tailwind CSS config
└── tsconfig.json                     # Frontend TypeScript config
```

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager

### **1. Install All Dependencies**
```bash
# Install frontend and backend dependencies together
npm run install:all

# Or install separately:
npm install                    # Frontend dependencies
cd backend && npm install      # Backend dependencies
```

### **2. Start Development Environment**
```bash
# Start both frontend and backend together (recommended)
npm run dev:full

# Or start individually:
npm run dev                    # Frontend only → http://localhost:5173
npm run backend:dev            # Backend only → http://localhost:3001
```

### **3. Verify Setup**
- **Frontend:** http://localhost:5173
- **Backend Health:** http://localhost:3001/health
- **API Docs:** http://localhost:3001/api/docs

## 🎯 **Key Features**

### **Frontend Features**
- ✅ **Interactive Fault Report Form** - Comprehensive form with all required fields
- ✅ **File Upload Interface** - Drag & drop support with preview
- ✅ **Form Validation** - Real-time validation with error messages
- ✅ **Toast Notifications** - User feedback for actions
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Multi-language Support** - Internationalization ready
- ✅ **Dashboard Interface** - Overview and navigation
- ✅ **Loading States** - Progress indicators during operations

### **Backend Features**
- ✅ **RESTful API** - Complete CRUD operations for fault reports
- ✅ **File Upload System** - Multi-file upload with validation
- ✅ **SQLite Database** - Lightweight, serverless database
- ✅ **Security Middleware** - Rate limiting, CORS, Helmet protection
- ✅ **File Validation** - Type, size, and security checks
- ✅ **Error Handling** - Comprehensive error management
- ✅ **API Documentation** - Built-in documentation endpoint
- ✅ **Search & Filtering** - Advanced query capabilities

## 🔌 **API Integration**

### **Complete API Endpoints**

#### **Fault Management**
| Method | Endpoint | Description | Frontend Integration |
|--------|----------|-------------|---------------------|
| `POST` | `/api/faults` | Create fault with files | ✅ Form submission |
| `GET` | `/api/faults` | List all faults | ✅ Dashboard list |
| `GET` | `/api/faults/:id` | Get specific fault | ✅ Detail view |
| `PUT` | `/api/faults/:id` | Update fault | ✅ Edit functionality |
| `DELETE` | `/api/faults/:id` | Delete fault | ✅ Delete action |

#### **File Operations**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/uploads/:filename` | Serve uploaded files |
| `GET` | `/uploads/fault/:faultId/:filename` | Serve files with validation |
| `GET` | `/uploads/info/:filename` | Get file metadata |

#### **Utility**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API health check |
| `GET` | `/api/docs` | API documentation |
| `GET` | `/api/faults/stats/summary` | Fault statistics |

### **Frontend-Backend Communication**

The frontend `FaultReportForm.tsx` has been fully integrated with the backend:

```typescript
// API configuration in frontend
const API_BASE_URL = 'http://localhost:3001';

// Form submission to backend
const response = await fetch(`${API_BASE_URL}/api/faults`, {
  method: 'POST',
  body: formData, // Includes form fields and files
});
```

## 🗄️ **Database Schema**

### **Faults Table**
```sql
CREATE TABLE faults (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reporter TEXT NOT NULL,
  date TEXT NOT NULL,
  severity TEXT CHECK(severity IN ('minor', 'major', 'critical')),
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

### **Fault Files Table**
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

## 📤 **File Upload System**

### **Frontend Implementation**
```typescript
// File selection and validation
const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []);
  // Validation logic for file types and sizes
  // Preview generation for images
  // Error handling and user feedback
};
```

### **Backend Implementation**
- **Multer middleware** for file processing
- **File validation** (type, size, security)
- **Unique naming** (timestamp + UUID)
- **Storage** in `uploads/` directory

### **Supported File Types**
- **Images:** JPG, JPEG, PNG
- **Documents:** PDF, TXT, DOC, DOCX
- **Limits:** 10MB per file, 5 files max per report

## 🔒 **Security Features**

### **Frontend Security**
- Input validation and sanitization
- File type restrictions
- Size limit enforcement
- XSS prevention through React

### **Backend Security**
- **Rate Limiting:** 100 requests/15min, 20 uploads/15min
- **CORS Protection:** Configurable cross-origin policies
- **Helmet Middleware:** Security headers
- **File Validation:** MIME type and extension checking
- **Input Sanitization:** Request validation
- **Error Handling:** Safe error messages

## 📱 **Development Scripts**

### **Combined Scripts** (Root package.json)
```json
{
  "dev": "vite",                              // Frontend only
  "backend:dev": "cd backend && npm run dev", // Backend only
  "dev:full": "concurrently \"npm run dev\" \"npm run backend:dev\"", // Both
  "install:all": "npm install && npm run backend:install",
  "build:all": "npm run build && npm run backend:build"
}
```

### **Usage Examples**
```bash
# Development
npm run dev:full        # Start both frontend and backend
npm run dev            # Frontend only
npm run backend:dev    # Backend only

# Building
npm run build:all      # Build both for production
npm run build          # Frontend build only
npm run backend:build  # Backend build only

# Installation
npm run install:all    # Install all dependencies
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Backend (.env)**
```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
# DATABASE_PATH=./database.sqlite (optional)
```

#### **Frontend (Vite)**
```typescript
// API configuration
const API_BASE_URL = 'http://localhost:3001';
```

### **CORS Configuration**
```typescript
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
```

## 🚀 **Production Deployment**

### **Build Process**
```bash
# Build both frontend and backend
npm run build:all

# Frontend build output → dist/
# Backend build output → backend/dist/
```

### **Production Environment**
```bash
# Backend production
cd backend
npm start  # Runs compiled JavaScript

# Frontend production
npm run preview  # Preview build locally
# Or serve dist/ folder with any web server
```

## 📊 **API Examples**

### **Create Fault Report with Files**
```bash
curl -X POST http://localhost:3001/api/faults \
  -F "title=Traction System Fault" \
  -F "description=Converter overheating" \
  -F "reporter=John Doe - EMP001" \
  -F "severity=major" \
  -F "assetId=Unit 407" \
  -F "subsystem=traction" \
  -F "files=@fault_photo.jpg" \
  -F "files=@diagnostic_report.pdf"
```

### **Get All Faults**
```bash
curl "http://localhost:3001/api/faults?limit=20&search=traction"
```

### **Response Format**
```json
{
  "success": true,
  "message": "Fault report created successfully",
  "data": {
    "fault": {
      "id": "uuid-here",
      "title": "Traction System Fault",
      "severity": "major",
      "assetId": "Unit 407",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "files": [
      {
        "id": "file-uuid",
        "fileName": "timestamp_uuid.jpg",
        "originalName": "fault_photo.jpg",
        "mimeType": "image/jpeg",
        "size": 1024000
      }
    ]
  }
}
```

## 🔍 **Testing & Debugging**

### **Frontend Testing**
```bash
npm run dev           # Development server with hot reload
npm run build         # Test production build
npm run preview       # Test built application
```

### **Backend Testing**
```bash
# Health check
curl http://localhost:3001/health

# API documentation
curl http://localhost:3001/api/docs
```

### **Common Issues & Solutions**

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API_BASE_URL

2. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file types are supported
   - Ensure uploads/ directory exists

3. **Database Issues**
   - Check SQLite file permissions
   - Verify no locks on database file

## 📚 **Component Integration**

### **Updated FaultReportForm.tsx**
The main form component now includes:

```typescript
// State management for files and submission
const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);

// File handling
const handleFileSelect = (event) => { /* File validation & preview */ };
const removeFile = (index) => { /* Remove file from list */ };

// Form submission to backend
const handleSubmit = async (isDraft) => {
  const formData = new FormData();
  // Add form fields and files
  const response = await fetch(`${API_BASE_URL}/api/faults`, {
    method: 'POST',
    body: formData,
  });
};
```

## 🎨 **UI/UX Features**

- **File Preview:** Image previews in upload list
- **Progress Indicators:** Loading states during operations
- **Error Handling:** Toast notifications for user feedback
- **Validation:** Real-time form validation with error messages
- **Responsive Design:** Mobile-friendly interface
- **Accessibility:** Proper labels and ARIA attributes

## 🚢 **Deployment Checklist**

- [ ] Install dependencies: `npm run install:all`
- [ ] Test development: `npm run dev:full`
- [ ] Build for production: `npm run build:all`
- [ ] Set production environment variables
- [ ] Configure web server for frontend static files
- [ ] Start backend production server
- [ ] Test file upload functionality
- [ ] Verify database permissions
- [ ] Check CORS configuration for production domain

---

## 📞 **Support**

This complete documentation covers both frontend and backend integration. For specific issues:

1. Check the backend `README.md` for API details
2. Review `API_EXAMPLES.md` for usage examples
3. Examine browser network tab for API calls
4. Check console logs for error details

**The system is ready for immediate use with full frontend-backend integration!** 🎉
