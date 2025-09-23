import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../models/database';
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
    const fileRecord = db.getAllFiles().find(f => f.fileName === filename);

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
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // Handle range requests (for video/audio streaming)
    const range = req.headers.range;
    if (range && stats.size > 0) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      
      if (start >= stats.size || end >= stats.size) {
        res.status(416).json({
          success: false,
          message: 'Requested range not satisfiable'
        });
        return;
      }

      const chunkSize = (end - start) + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunkSize.toString());
      
      const fileStream = fs.createReadStream(filePath, { start, end });
      fileStream.pipe(res);
    } else {
      // Serve entire file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }

  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while serving file'
    });
  }
});

// GET /uploads/fault/:faultId/:filename - Serve files with fault validation
router.get('/fault/:faultId/:filename', (req, res) => {
  try {
    const { faultId, filename } = req.params;
    
    if (!faultId || !filename || typeof faultId !== 'string' || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid fault ID or filename'
      });
    }

    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format'
      });
    }

    // Verify fault exists
    const fault = db.getFaultById(faultId);
    if (!fault) {
      return res.status(404).json({
        success: false,
        message: 'Fault report not found'
      });
    }

    // Find the specific file for this fault
    const files = db.getFaultFiles(faultId);
    const fileRecord = files.find(f => f.fileName === filename);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found for this fault report'
      });
    }

    const filePath = fileRecord.filePath;
    
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
    res.setHeader('Content-Type', fileRecord.mimeType);
    res.setHeader('Content-Length', stats.size.toString());
    res.setHeader('Content-Disposition', `inline; filename="${fileRecord.originalName}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // Serve the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error serving fault file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while serving file'
    });
  }
});

// GET /uploads/info/:filename - Get file information without downloading
router.get('/info/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Security check
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format'
      });
    }

    // Find the file in database
    const fileRecord = db.getAllFiles().find(f => f.fileName === filename);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file exists on filesystem
    const filePath = getUploadFilePath(filename);
    const fileExists = fs.existsSync(filePath);

    let fileStats = null;
    if (fileExists) {
      const stats = fs.statSync(filePath);
      fileStats = {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime
      };
    }

    res.json({
      success: true,
      data: {
        id: fileRecord.id,
        faultId: fileRecord.faultId,
        fileName: fileRecord.fileName,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimeType,
        size: fileRecord.size,
        createdAt: fileRecord.createdAt,
        fileExists,
        fileStats
      }
    });

  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting file information'
    });
  }
});

// DELETE /uploads/:filename - Delete a file (admin only - you might want to add auth)
router.delete('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Security check
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format'
      });
    }

    // Find the file in database
    const fileRecord = db.getAllFiles().find(f => f.fileName === filename);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete from database
    const deleted = db.deleteFaultFile(fileRecord.id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete file record from database'
      });
    }

    // Delete from filesystem
    const filePath = getUploadFilePath(filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting file'
    });
  }
});

export default router;