import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FaultReport {
  id: string;
  title: string;
  description: string;
  reporter: string;
  date: string;
  severity: 'minor' | 'major' | 'critical';
  assetId: string;
  subsystem?: string;
  location?: string;
  category?: string;
  observedCause?: string;
  diagnosticSteps?: boolean;
  rootCauseKnown?: boolean;
  rootCauseDetails?: string;
  workaround?: string;
  temporaryFix?: boolean;
  temporaryFixDetails?: string;
  passengerSafety?: boolean;
  staffSafety?: boolean;
  sparePartsRequired?: boolean;
  sparePartsList?: string;
  estimatedRepairTime?: string;
  supervisorNotified?: boolean;
  escalationNeeded?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaultFile {
  id: string;
  faultId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
  createdAt: string;
}

interface DatabaseData {
  faults: FaultReport[];
  files: FaultFile[];
}

class JSONDatabaseManager {
  private dbPath: string;
  private data: DatabaseData;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || path.join(process.cwd(), 'database.json');
    this.loadDatabase();
  }

  private loadDatabase(): void {
    try {
      if (fs.existsSync(this.dbPath)) {
        const rawData = fs.readFileSync(this.dbPath, 'utf8');
        this.data = JSON.parse(rawData);
      } else {
        this.data = { faults: [], files: [] };
        this.saveDatabase();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = { faults: [], files: [] };
    }
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Fault CRUD operations
  createFault(fault: Omit<FaultReport, 'id' | 'createdAt' | 'updatedAt'>): FaultReport {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newFault: FaultReport = {
      ...fault,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.data.faults.push(newFault);
    this.saveDatabase();
    
    return newFault;
  }

  getFaultById(id: string): FaultReport | null {
    return this.data.faults.find(fault => fault.id === id) || null;
  }

  getAllFaults(limit = 50, offset = 0): FaultReport[] {
    return this.data.faults
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  updateFault(id: string, updates: Partial<Omit<FaultReport, 'id' | 'createdAt' | 'updatedAt'>>): FaultReport | null {
    const faultIndex = this.data.faults.findIndex(fault => fault.id === id);
    
    if (faultIndex === -1) return null;
    
    const now = new Date().toISOString();
    this.data.faults[faultIndex] = {
      ...this.data.faults[faultIndex],
      ...updates,
      updatedAt: now
    };
    
    this.saveDatabase();
    return this.data.faults[faultIndex];
  }

  deleteFault(id: string): boolean {
    const initialLength = this.data.faults.length;
    this.data.faults = this.data.faults.filter(fault => fault.id !== id);
    this.data.files = this.data.files.filter(file => file.faultId !== id);
    
    if (this.data.faults.length < initialLength) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // File operations
  createFaultFile(file: Omit<FaultFile, 'id' | 'createdAt'>): FaultFile {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newFile: FaultFile = {
      ...file,
      id,
      createdAt: now
    };

    this.data.files.push(newFile);
    this.saveDatabase();
    
    return newFile;
  }

  getFaultFiles(faultId: string): FaultFile[] {
    return this.data.files
      .filter(file => file.faultId === faultId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getFaultFileById(id: string): FaultFile | null {
    return this.data.files.find(file => file.id === id) || null;
  }

  deleteFaultFile(id: string): boolean {
    const initialLength = this.data.files.length;
    this.data.files = this.data.files.filter(file => file.id !== id);
    
    if (this.data.files.length < initialLength) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Search and filter operations
  searchFaults(searchTerm: string, filters: {
    severity?: string;
    assetId?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): FaultReport[] {
    let filteredFaults = this.data.faults;

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredFaults = filteredFaults.filter(fault => 
        fault.title.toLowerCase().includes(searchLower) ||
        fault.description.toLowerCase().includes(searchLower) ||
        fault.reporter.toLowerCase().includes(searchLower) ||
        fault.assetId.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.severity) {
      filteredFaults = filteredFaults.filter(fault => fault.severity === filters.severity);
    }

    if (filters.assetId) {
      filteredFaults = filteredFaults.filter(fault => fault.assetId === filters.assetId);
    }

    if (filters.category) {
      filteredFaults = filteredFaults.filter(fault => fault.category === filters.category);
    }

    if (filters.dateFrom) {
      filteredFaults = filteredFaults.filter(fault => fault.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filteredFaults = filteredFaults.filter(fault => fault.date <= filters.dateTo!);
    }

    return filteredFaults
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100); // Limit to 100 results
  }

  // Statistics
  getFaultStats(): {
    total: number;
    bySeverity: { minor: number; major: number; critical: number };
    recentCount: number;
  } {
    const total = this.data.faults.length;

    const bySeverity = {
      minor: this.data.faults.filter(f => f.severity === 'minor').length,
      major: this.data.faults.filter(f => f.severity === 'major').length,
      critical: this.data.faults.filter(f => f.severity === 'critical').length
    };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = this.data.faults.filter(
      f => new Date(f.createdAt) >= sevenDaysAgo
    ).length;

    return { total, bySeverity, recentCount };
  }

  // Get file by filename (for uploads route)
  getFileByName(fileName: string): FaultFile | null {
    return this.data.files.find(file => file.fileName === fileName) || null;
  }

  close(): void {
    // JSON database doesn't need explicit closing
    console.log('JSON Database connection closed');
  }
}

// Singleton instance
let dbInstance: JSONDatabaseManager | null = null;

export const getDatabase = (): JSONDatabaseManager => {
  if (!dbInstance) {
    dbInstance = new JSONDatabaseManager();
  }
  return dbInstance;
};

export { JSONDatabaseManager };
