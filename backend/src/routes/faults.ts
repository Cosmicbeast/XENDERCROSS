import express from 'express';
import { getDatabase, FaultReport } from '../models/jsonDatabase';
import { uploadMiddleware, handleUploadError, validateFiles, cleanupUploadedFiles } from '../middleware/upload';
import fs from 'fs';

const router = express.Router();
const db = getDatabase();

const validateFaultData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!data.reporter || typeof data.reporter !== 'string' || data.reporter.trim().length === 0) {
    errors.push('Reporter is required');
  }
  
  if (!data.severity || !['minor', 'major', 'critical'].includes(data.severity)) {
    errors.push('Severity is required');
  }
  
  if (!data.assetId || typeof data.assetId !== 'string' || data.assetId.trim().length === 0) {
    errors.push('Asset ID is required');
  }

  return { isValid: errors.length === 0, errors };
};

router.post('/', uploadMiddleware.any(), (req, res) => {
  try {
    const files = Array.isArray(req.files) ? (req.files as Express.Multer.File[]) : [];
    
    const { isValid, errors } = validateFaultData(req.body);
    if (!isValid) {
      cleanupUploadedFiles(files);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const fileValidation = validateFiles(files);
    if (!fileValidation.isValid) {
      cleanupUploadedFiles(files);
      return res.status(400).json({ success: false, message: 'File validation failed', errors: fileValidation.errors });
    }

    const convertToBoolean = (value: any): boolean => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
      return false;
    };

    const faultData: Omit<FaultReport, 'id' | 'createdAt' | 'updatedAt'> = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      reporter: req.body.reporter.trim(),
      date: req.body.date || new Date().toISOString(),
      severity: req.body.severity,
      assetId: req.body.assetId.trim(),
      subsystem: req.body.subsystem?.trim() || undefined,
      location: req.body.location?.trim() || undefined,
      category: req.body.category?.trim() || undefined,
      observedCause: req.body.observedCause?.trim() || undefined,
      diagnosticSteps: convertToBoolean(req.body.diagnosticSteps),
      rootCauseKnown: convertToBoolean(req.body.rootCauseKnown),
      rootCauseDetails: req.body.rootCauseDetails?.trim() || undefined,
      workaround: req.body.workaround?.trim() || undefined,
      temporaryFix: convertToBoolean(req.body.temporaryFix),
      temporaryFixDetails: req.body.temporaryFixDetails?.trim() || undefined,
      passengerSafety: convertToBoolean(req.body.passengerSafety),
      staffSafety: convertToBoolean(req.body.staffSafety),
      sparePartsRequired: convertToBoolean(req.body.sparePartsRequired),
      sparePartsList: req.body.sparePartsList?.trim() || undefined,
      estimatedRepairTime: req.body.estimatedRepairTime?.trim() || undefined,
      supervisorNotified: convertToBoolean(req.body.supervisorNotified),
      escalationNeeded: convertToBoolean(req.body.escalationNeeded)
    };

    const fault = db.createFault(faultData);

    const savedFiles = files.map(file => {
      return db.createFaultFile({
        faultId: fault.id,
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filePath: file.path
      });
    });

    res.status(201).json({
      success: true,
      message: 'Fault report created successfully',
      data: { fault, files: savedFiles }
    });

  } catch (error) {
    const files = req.files as Express.Multer.File[] || [];
    cleanupUploadedFiles(files);
    console.error('Error creating fault report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}, handleUploadError);

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid fault ID' });
    }

    const fault = db.getFaultById(id);
    if (!fault) {
      return res.status(404).json({ success: false, message: 'Fault report not found' });
    }

    const files = db.getFaultFiles(id);
    res.json({ success: true, data: { fault, files } });

  } catch (error) {
    console.error('Error fetching fault report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ success: false, message: 'Limit must be between 1 and 100' });
    }

    if (offset < 0) {
      return res.status(400).json({ success: false, message: 'Offset must be non-negative' });
    }

    let faults: FaultReport[];

    if (search && search.trim().length > 0) {
      const filters = {
        severity: req.query.severity as string,
        assetId: req.query.assetId as string,
        category: req.query.category as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string
      };
      faults = db.searchFaults(search.trim(), filters);
    } else {
      faults = db.getAllFaults(limit, offset);
    }

    const faultsWithFileCounts = faults.map(fault => ({
      ...fault,
      fileCount: db.getFaultFiles(fault.id).length
    }));

    res.json({
      success: true,
      data: {
        faults: faultsWithFileCounts,
        pagination: { limit, offset, total: faultsWithFileCounts.length }
      }
    });

  } catch (error) {
    console.error('Error fetching fault reports:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid fault ID' });
    }

    const existingFault = db.getFaultById(id);
    if (!existingFault) {
      return res.status(404).json({ success: false, message: 'Fault report not found' });
    }

    const allowedFields = [
      'title', 'description', 'severity', 'subsystem', 'location', 'category',
      'observedCause', 'diagnosticSteps', 'rootCauseKnown', 'rootCauseDetails',
      'workaround', 'temporaryFix', 'temporaryFixDetails', 'passengerSafety',
      'staffSafety', 'sparePartsRequired', 'sparePartsList', 'estimatedRepairTime',
      'supervisorNotified', 'escalationNeeded'
    ];

    const updates: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const updatedFault = db.updateFault(id, updates);
    const files = db.getFaultFiles(id);

    res.json({
      success: true,
      message: 'Fault report updated successfully',
      data: { fault: updatedFault, files }
    });

  } catch (error) {
    console.error('Error updating fault report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid fault ID' });
    }

    const files = db.getFaultFiles(id);
    const deleted = db.deleteFault(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Fault report not found' });
    }

    files.forEach(file => {
      try {
        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath);
        }
      } catch (error) {
        console.error(`Failed to delete file ${file.filePath}:`, error);
      }
    });

    res.json({ success: true, message: 'Fault report deleted successfully' });

  } catch (error) {
    console.error('Error deleting fault report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/stats/summary', (req, res) => {
  try {
    const stats = db.getFaultStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching fault statistics:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;