import path from 'path';
import fs from 'fs';

// Resolve the backend root from this file location regardless of process.cwd()
const backendRoot = path.resolve(__dirname, '..');

// Resolve an absolute uploads directory path that is stable in all environments
export const getUploadsDir = (): string => {
  const uploadsAbsPath = path.join(backendRoot, 'uploads');
  if (!fs.existsSync(uploadsAbsPath)) {
    fs.mkdirSync(uploadsAbsPath, { recursive: true });
  }
  return uploadsAbsPath;
};

export const getUploadFilePath = (fileName: string): string => {
  return path.join(getUploadsDir(), fileName);
};

export const getBackendRoot = (): string => backendRoot;


