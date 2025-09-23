import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import * as Express from 'express';
import { getUploadsDir } from '../utils/paths';

// Ensure uploads directory exists using stable path
const uploadsDir = getUploadsDir();

// Allowed file types and their MIME types
const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and UUID
    const fileExtension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}_${uuidv4()}${fileExtension}`;
    cb(null, uniqueName);
  }
});

// File filter function
type UploadedFile = {
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
  filename?: string;
};

const fileFilter = (
  req: Request,
  file: { mimetype: string; originalname: string },
  cb: multer.FileFilterCallback
) => {
  // Check if file type is allowed
  if (!ALLOWED_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_MIME_TYPES]) {
    cb(new Error(`File type ${file.mimetype} is not allowed. Only JPG, PNG, PDF, TXT, DOC, and DOCX files are accepted.`));
    return;
  }

  // Additional check for file extension
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.txt', '.doc', '.docx'];
  
  if (!allowedExtensions.includes(fileExtension)) {
    cb(new Error(`File extension ${fileExtension} is not allowed.`));
    return;
  }

  cb(null, true);
};

// Create multer instance
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per request
  }
});

// Error handler for multer errors
export const handleUploadError = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum size allowed is ${MAX_FILE_SIZE / 1024 / 1024}MB`
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 files allowed per request'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name for file upload'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${typeof (error as { message?: string }).message === 'string' ? (error as { message: string }).message : 'Unknown error'}`
        });
    }
  }

  if (typeof (error as { message?: string }).message === 'string' && (error as { message: string }).message.includes('not allowed')) {
    return res.status(400).json({
      success: false,
      message: (error as { message: string }).message
    });
  }

  return next(error as Error);
};

// Helper function to clean up uploaded files in case of error
export const cleanupUploadedFiles = (files: UploadedFile[]) => {
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to delete file ${file.path}:`, message);
    }
  });
};

// Validate uploaded files
export const validateFiles = (files: UploadedFile[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!files || files.length === 0) {
    return { isValid: true, errors }; // No files is valid
  }

  files.forEach((file, index) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File ${index + 1} (${file.originalname}) exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_MIME_TYPES]) {
      errors.push(`File ${index + 1} (${file.originalname}) has unsupported type: ${file.mimetype}`);
    }

    // Check if file exists
    if (!fs.existsSync(file.path)) {
      errors.push(`File ${index + 1} (${file.originalname}) was not saved properly`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
