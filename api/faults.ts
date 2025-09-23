export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sampleFaults = [
    {
      id: '1',
      title: 'Traction System Fault',
      description: 'Converter overheating detected',
      reporter: 'John Doe - EMP001',
      severity: 'major',
      assetId: 'Unit 407',
      location: 'Aluva Depot',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      files: []
    }
  ];

  if (req.method === 'GET') {
    return res.json({ success: true, data: { faults: sampleFaults } });
  }

  if (req.method === 'POST') {
    const fault = {
      id: String(Date.now()),
      title: req.body?.title || 'New Fault',
      description: req.body?.description || 'Description',
      reporter: req.body?.reporter || 'User',
      severity: req.body?.severity || 'minor',
      assetId: req.body?.assetId || 'ASSET-001',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      files: []
    };
    return res.status(201).json({ success: true, data: { fault } });
  }

  return res.status(404).json({ success: false, message: 'Not found' });
}