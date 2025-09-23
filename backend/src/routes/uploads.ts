import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../models/jsonDatabase';
import { getUploadFilePath } from '../utils/paths';

const router = express.Router();
const db = getDatabase();

// GET /uploads/:filename - Serve uploaded files
router.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format'
      });
    }

    // Find the file in database to get metadata
    const fileRecord = db.getFileByName(filename);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const filePath = getUploadFilePath(filename);
    
    // Check if file exists on filesystem
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on filesystem'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', fileRecord.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', stats.size.toString());
    res.setHeader('Content-Disposition', `inline; filename="${fileRecord.originalName}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // Serve entire file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while serving file'
    });
  }
});

export default router;