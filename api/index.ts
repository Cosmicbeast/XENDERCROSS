import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory storage for Vercel
let faults: any[] = [];
let nextId = 1;

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  
  // Health check
  if (url === '/health') {
    return res.json({ success: true, message: 'API is running' });
  }
  
  // Get all faults
  if (url === '/api/faults' && method === 'GET') {
    return res.json({ success: true, data: { faults } });
  }
  
  // Create fault
  if (url === '/api/faults' && method === 'POST') {
    const fault = {
      id: String(nextId++),
      title: req.body?.title || 'New Fault',
      description: req.body?.description || 'Description',
      reporter: req.body?.reporter || 'Reporter',
      severity: req.body?.severity || 'minor',
      assetId: req.body?.assetId || 'ASSET-001',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    faults.push(fault);
    return res.status(201).json({ success: true, data: { fault } });
  }
  
  // Get single fault
  if (url?.startsWith('/api/faults/') && method === 'GET') {
    const id = url.split('/')[3];
    const fault = faults.find(f => f.id === id);
    if (!fault) {
      return res.status(404).json({ success: false, message: 'Fault not found' });
    }
    return res.json({ success: true, data: { fault, files: [] } });
  }
  
  return res.status(404).json({ success: false, message: 'Not found' });
}