# 🚇 XENDERCROSS – Complete Full-Stack Fault Reporting System

*Transforming Ideas into Limitless Possibilities*  

![Last Commit](https://img.shields.io/github/last-commit/Cosmicbeast/XENDERCROSS)
![TypeScript](https://img.shields.io/github/languages/top/Cosmicbeast/XENDERCROSS?color=blue)
![Languages](https://img.shields.io/github/languages/count/Cosmicbeast/XENDERCROSS?color=lightgrey)

---

## 🏗️ **Full-Stack Architecture**

**Frontend:** React 18 + TypeScript + Vite + Shadcn/ui  
**Backend:** Node.js + Express + TypeScript + SQLite  
**Features:** File uploads, real-time validation, secure API, responsive design

---

## ⚙️ Tech Stack  

### **Frontend Technologies**
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white)

### **Backend Technologies**
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white)
![Multer](https://img.shields.io/badge/-Multer-FF6B35?logo=multer&logoColor=white)

---

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

---

## 🎯 **Key Features Implemented**

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

---

## 📦 **Project Structure**

```
XENDERCROSS/
├── 📁 src/                     # Frontend React Application
│   ├── components/             # React components
│   │   ├── FaultReportForm.tsx # ⭐ Main fault reporting form
│   │   └── ui/                 # Shadcn/ui components
│   ├── pages/                  # Application pages
│   ├── hooks/                  # Custom React hooks
│   ├── contexts/               # React contexts
│   └── lib/                    # Utility functions
├── 📁 backend/                 # Backend API Server
│   ├── src/
│   │   ├── models/             # Database models & schema
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Express middleware
│   │   └── server.ts           # Main server file
│   ├── uploads/                # File storage
│   └── package.json            # Backend dependencies
├── 📁 public/                  # Static assets
└── package.json                # Frontend + combined scripts
```

---

## 📱 **Available Scripts**

### **Full-Stack Development**
- `npm run dev:full` - Start both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run build:all` - Build both for production

### **Frontend Scripts**
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Backend Scripts**
- `npm run backend:dev` - Start backend development server
- `npm run backend:install` - Install backend dependencies
- `npm run backend:build` - Build backend TypeScript
- `npm run backend:start` - Start production backend

---

## 🔌 **API Endpoints**

### **Fault Management**
- `POST /api/faults` - Create fault report with files
- `GET /api/faults` - List all fault reports (with pagination/search)
- `GET /api/faults/:id` - Get specific fault report
- `PUT /api/faults/:id` - Update fault report
- `DELETE /api/faults/:id` - Delete fault report

### **File Operations**
- `GET /uploads/:filename` - Serve uploaded files
- `GET /uploads/fault/:faultId/:filename` - Serve files with validation

### **Utility**
- `GET /health` - API health check
- `GET /api/docs` - API documentation
- `GET /api/faults/stats/summary` - Fault statistics

---

## 📤 **File Upload System**

### **Supported File Types**
- **Images:** JPG, JPEG, PNG
- **Documents:** PDF, TXT, DOC, DOCX
- **Limits:** 10MB per file, 5 files max per report

### **Security Features**
- File type validation (MIME type + extension)
- File size limits (10MB per file)
- Unique file naming (timestamp + UUID)
- Secure storage in uploads/ directory

---

## 🗄️ **Database Schema**

### **Faults Table**
Complete fault report data with 25+ fields including:
- Basic info (title, description, reporter, severity, assetId)
- Diagnostic data (observedCause, diagnosticSteps, rootCause)
- Safety info (passengerSafety, staffSafety)
- Resources (sparePartsRequired, estimatedRepairTime)
- Status tracking (supervisorNotified, escalationNeeded)

### **Fault Files Table**
File metadata and relationships:
- File information (fileName, originalName, mimeType, size)
- Relationships (faultId foreign key)
- Timestamps and file paths

---

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

---

## 🔒 **Security Features**

- **Rate Limiting:** 100 API requests/15min, 20 uploads/15min
- **CORS Protection:** Configurable cross-origin policies
- **File Validation:** MIME type and extension checking
- **Input Sanitization:** Request validation and sanitization
- **Security Headers:** Helmet middleware for protection
- **Error Handling:** Safe error messages without sensitive data

---

## 📚 **Documentation**

- **[Complete Project Guide](./COMPLETE_PROJECT_GUIDE.md)** - Comprehensive documentation
- **[Backend README](./backend/README.md)** - Backend-specific documentation  
- **[API Examples](./backend/API_EXAMPLES.md)** - API usage examples with curl commands

---

## 🖼️ **Screenshots**

<table>
  <tr>
    <td align="center">
      <strong>Main Dashboard</strong><br>
      <em>Real-time overview of metro operations.</em><br><br>
      <img src="https://raw.githubusercontent.com/Cosmicbeast/XENDERCROSS/main/images/dashboard.jpg" alt="Main Dashboard" width="400">
    </td>
    <td align="center">
      <strong>Fault Reports</strong><br>
      <em>Manage and track all submitted fault reports.</em><br><br>
      <img src="https://raw.githubusercontent.com/Cosmicbeast/XENDERCROSS/main/images/faults-reports.jpg" alt="Fault Reports" width="400">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Analytics Dashboard</strong><br>
      <em>Performance insights and system metrics.</em><br><br>
      <img src="https://raw.githubusercontent.com/Cosmicbeast/XENDERCROSS/main/images/analytics.jpg" alt="Analytics Dashboard" width="400">
    </td>
    <td align="center">
      <strong>Asset Management</strong><br>
      <em>Monitor and manage all railway assets.</em><br><br>
      <img src="https://raw.githubusercontent.com/Cosmicbeast/XENDERCROSS/main/images/assest%20management.jpg" alt="Asset Management" width="400">
    </td>
  </tr>
</table>

---

## 🚢 **Production Ready**

The application includes:
- Environment configuration
- Production build scripts
- Security best practices
- Error handling and logging
- Performance optimizations
- CORS configuration for production domains

### **Deployment Checklist**
- [ ] Install dependencies: `npm run install:all`
- [ ] Test development: `npm run dev:full`
- [ ] Build for production: `npm run build:all`
- [ ] Set production environment variables
- [ ] Configure web server for frontend static files
- [ ] Start backend production server
- [ ] Test file upload functionality
- [ ] Verify database permissions

---

## 🛠️ **Troubleshooting**

### **Common Issues & Solutions**

1. **Port Conflicts**
   - Check ports 3001 (backend) and 5173 (frontend)
   - Kill existing processes: `netstat -ano | findstr :3001`

2. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API_BASE_URL points to correct backend

3. **File Upload Issues**
   - Check file types are supported (JPG, PNG, PDF, TXT, DOC, DOCX)
   - Verify file size under 10MB limit
   - Ensure uploads/ directory exists and is writable

4. **Database Issues**
   - Check SQLite file permissions
   - Verify no locks on database file
   - Ensure proper foreign key relationships

---

## 📌 **Original Project Context**

This repository contains the implementation of **KMRL Docuzone & Asset Management Dashboard**, a centralized software solution developed for **Smart India Hackathon 2025**.  

**Problem Statement ID:** 25080  
**Title:** Document Overload at Kochi Metro Rail Limited (KMRL)  
**Theme:** Smart Automation  
**Category:** Software  
**Team:** XENDERCROSS  

---

## 🌍 **Live Demo**

Check out the deployed application here:  

🔗 [**XENDERCROSS – Live Demo**](https://xendercross.vercel.app/)  

---

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`) 
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the ISC License.

---

**The system is ready for immediate use with full frontend-backend integration!** 🎉
