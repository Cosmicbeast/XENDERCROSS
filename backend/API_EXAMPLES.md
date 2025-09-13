# XENDERCROSS Backend API Examples

## Base URL
```
http://localhost:3001
```

## Health Check
```bash
curl http://localhost:3001/health
```

## API Documentation
```bash
curl http://localhost:3001/api/docs
```

## Create Fault Report

### Simple Fault Report (without files)
```bash
curl -X POST http://localhost:3001/api/faults \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Traction System Fault",
    "description": "Traction converter overheating during operation",
    "reporter": "John Doe - EMP001",
    "severity": "major",
    "assetId": "Unit 407",
    "subsystem": "traction",
    "location": "depot",
    "category": "electrical",
    "observedCause": "Cooling fan malfunction",
    "diagnosticSteps": true,
    "rootCauseKnown": false,
    "passengerSafety": false,
    "staffSafety": true,
    "sparePartsRequired": true,
    "sparePartsList": "Cooling fan unit - Part #CF-2024",
    "estimatedRepairTime": "4 hours",
    "supervisorNotified": true,
    "escalationNeeded": false
  }'
```

### Fault Report with File Upload (using form-data)
```bash
curl -X POST http://localhost:3001/api/faults \
  -F "title=Door System Malfunction" \
  -F "description=Door not closing properly on carriage 2" \
  -F "reporter=Jane Smith - EMP002" \
  -F "severity=critical" \
  -F "assetId=Unit 408" \
  -F "subsystem=doors" \
  -F "location=station-1" \
  -F "category=mechanical" \
  -F "files=@fault_photo.jpg" \
  -F "files=@diagnostic_report.pdf"
```

## Get All Fault Reports
```bash
# Get all faults (default pagination)
curl http://localhost:3001/api/faults

# With pagination
curl "http://localhost:3001/api/faults?limit=20&offset=0"

# With search
curl "http://localhost:3001/api/faults?search=traction&severity=major"

# With filters
curl "http://localhost:3001/api/faults?assetId=Unit%20407&category=electrical"
```

## Get Specific Fault Report
```bash
curl http://localhost:3001/api/faults/{FAULT_ID}
```

## Update Fault Report
```bash
curl -X PUT http://localhost:3001/api/faults/{FAULT_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "critical",
    "rootCauseKnown": true,
    "rootCauseDetails": "Faulty cooling fan motor bearing",
    "escalationNeeded": true
  }'
```

## Delete Fault Report
```bash
curl -X DELETE http://localhost:3001/api/faults/{FAULT_ID}
```

## Get Fault Statistics
```bash
curl http://localhost:3001/api/faults/stats/summary
```

## Serve Uploaded Files

### Get file by filename
```bash
curl http://localhost:3001/uploads/{FILENAME}
```

### Get file with fault validation
```bash
curl http://localhost:3001/uploads/fault/{FAULT_ID}/{FILENAME}
```

### Get file information
```bash
curl http://localhost:3001/uploads/info/{FILENAME}
```

## Example Response Formats

### Successful Fault Creation
```json
{
  "success": true,
  "message": "Fault report created successfully",
  "data": {
    "fault": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Traction System Fault",
      "description": "Traction converter overheating during operation",
      "reporter": "John Doe - EMP001",
      "severity": "major",
      "assetId": "Unit 407",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "files": [
      {
        "id": "file-123",
        "faultId": "123e4567-e89b-12d3-a456-426614174000",
        "fileName": "1642248600000_unique-id.jpg",
        "originalName": "fault_photo.jpg",
        "mimeType": "image/jpeg",
        "size": 1024000,
        "filePath": "uploads/1642248600000_unique-id.jpg",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Fault List Response
```json
{
  "success": true,
  "data": {
    "faults": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Traction System Fault",
        "severity": "major",
        "assetId": "Unit 407",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "fileCount": 2
      }
    ],
    "pagination": {
      "limit": 50,
      "offset": 0,
      "total": 1
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required and must be a non-empty string",
    "Severity is required and must be one of: minor, major, critical"
  ]
}
```

## File Upload Guidelines

- **Allowed file types**: JPG, JPEG, PNG, PDF, TXT, DOC, DOCX
- **Maximum file size**: 10MB per file
- **Maximum files per request**: 5 files
- **Field name for uploads**: `files` (array)

## Error Codes

- `400` - Bad Request (validation errors, invalid data)
- `404` - Not Found (fault report or file not found)
- `413` - Payload Too Large (file size exceeded)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error (database or server issues)

## Rate Limiting

- API endpoints: 100 requests per 15 minutes per IP
- File uploads: 20 uploads per 15 minutes per IP
