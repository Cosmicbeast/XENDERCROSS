import sqlite3 from 'sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

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

class DatabaseManager {
  private db: sqlite3.Database;

  constructor(dbPath?: string) {
    const databasePath = dbPath || path.join(process.cwd(), 'database.sqlite');
    this.db = new sqlite3.Database(databasePath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');

    // Create faults table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS faults (
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
      )
    `);

    // Create fault_files table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS fault_files (
        id TEXT PRIMARY KEY,
        faultId TEXT NOT NULL,
        fileName TEXT NOT NULL,
        originalName TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        size INTEGER NOT NULL,
        filePath TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (faultId) REFERENCES faults (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_faults_severity ON faults (severity);
      CREATE INDEX IF NOT EXISTS idx_faults_assetId ON faults (assetId);
      CREATE INDEX IF NOT EXISTS idx_faults_date ON faults (date);
      CREATE INDEX IF NOT EXISTS idx_fault_files_faultId ON fault_files (faultId);
    `);
  }

  // Fault CRUD operations
  createFault(fault: Omit<FaultReport, 'id' | 'createdAt' | 'updatedAt'>): FaultReport {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO faults (
        id, title, description, reporter, date, severity, assetId,
        subsystem, location, category, observedCause, diagnosticSteps,
        rootCauseKnown, rootCauseDetails, workaround, temporaryFix,
        temporaryFixDetails, passengerSafety, staffSafety, sparePartsRequired,
        sparePartsList, estimatedRepairTime, supervisorNotified, escalationNeeded,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, fault.title, fault.description, fault.reporter, fault.date, fault.severity,
      fault.assetId, fault.subsystem, fault.location, fault.category, fault.observedCause,
      fault.diagnosticSteps, fault.rootCauseKnown, fault.rootCauseDetails, fault.workaround,
      fault.temporaryFix, fault.temporaryFixDetails, fault.passengerSafety, fault.staffSafety,
      fault.sparePartsRequired, fault.sparePartsList, fault.estimatedRepairTime,
      fault.supervisorNotified, fault.escalationNeeded, now, now
    );

    return this.getFaultById(id)!;
  }

  getFaultById(id: string): FaultReport | null {
    const stmt = this.db.prepare('SELECT * FROM faults WHERE id = ?');
    const result = stmt.get(id) as FaultReport | undefined;
    return result || null;
  }

  getAllFaults(limit = 50, offset = 0): FaultReport[] {
    const stmt = this.db.prepare('SELECT * FROM faults ORDER BY createdAt DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as FaultReport[];
  }

  updateFault(id: string, updates: Partial<Omit<FaultReport, 'id' | 'createdAt' | 'updatedAt'>>): FaultReport | null {
    const now = new Date().toISOString();
    const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), now, id];

    const stmt = this.db.prepare(`
      UPDATE faults SET ${updateFields}, updatedAt = ? WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    if (result.changes === 0) return null;
    
    return this.getFaultById(id);
  }

  deleteFault(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM faults WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // File operations
  createFaultFile(file: Omit<FaultFile, 'id' | 'createdAt'>): FaultFile {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO fault_files (id, faultId, fileName, originalName, mimeType, size, filePath, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, file.faultId, file.fileName, file.originalName, file.mimeType, file.size, file.filePath, now);

    return { ...file, id, createdAt: now };
  }

  getFaultFiles(faultId: string): FaultFile[] {
    const stmt = this.db.prepare('SELECT * FROM fault_files WHERE faultId = ? ORDER BY createdAt ASC');
    return stmt.all(faultId) as FaultFile[];
  }

  getFaultFileById(id: string): FaultFile | null {
    const stmt = this.db.prepare('SELECT * FROM fault_files WHERE id = ?');
    const result = stmt.get(id) as FaultFile | undefined;
    return result || null;
  }

  deleteFaultFile(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM fault_files WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Search and filter operations
  searchFaults(searchTerm: string, filters: {
    severity?: string;
    assetId?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): FaultReport[] {
    let query = `
      SELECT * FROM faults 
      WHERE (title LIKE ? OR description LIKE ? OR reporter LIKE ? OR assetId LIKE ?)
    `;
    const params: any[] = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    if (filters.severity) {
      query += ' AND severity = ?';
      params.push(filters.severity);
    }

    if (filters.assetId) {
      query += ' AND assetId = ?';
      params.push(filters.assetId);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.dateFrom) {
      query += ' AND date >= ?';
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      query += ' AND date <= ?';
      params.push(filters.dateTo);
    }

    query += ' ORDER BY createdAt DESC LIMIT 100';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as FaultReport[];
  }

  // Statistics
  getFaultStats(): {
    total: number;
    bySeverity: { minor: number; major: number; critical: number };
    recentCount: number;
  } {
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM faults');
    const total = (totalStmt.get() as { count: number }).count;

    const severityStmt = this.db.prepare('SELECT severity, COUNT(*) as count FROM faults GROUP BY severity');
    const severityResults = severityStmt.all() as { severity: string; count: number }[];
    
    const bySeverity = {
      minor: 0,
      major: 0,
      critical: 0
    };

    severityResults.forEach(result => {
      if (result.severity in bySeverity) {
        bySeverity[result.severity as keyof typeof bySeverity] = result.count;
      }
    });

    const recentStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM faults 
      WHERE createdAt >= datetime('now', '-7 days')
    `);
    const recentCount = (recentStmt.get() as { count: number }).count;

    return { total, bySeverity, recentCount };
  }

  close(): void {
    this.db.close();
  }
}

// Singleton instance
let dbInstance: DatabaseManager | null = null;

export const getDatabase = (): DatabaseManager => {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
  }
  return dbInstance;
};

export { DatabaseManager };
