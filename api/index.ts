export default function handler(req: any, res: any) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const { url, method } = req;
    
    // Health check
    if (url === '/health' || url?.includes('/health')) {
      return res.json({ success: true, message: 'API is running' });
    }
    
    // Sample faults data
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
        updatedAt: new Date().toISOString(),
        files: [
          {
            name: 'traction_fault_photo.jpg',
            originalName: 'traction_fault_photo.jpg',
            size: 245760,
            mimeType: 'image/jpeg',
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
          }
        ]
      },
      {
        id: '2',
        title: 'Door Sensor Malfunction',
        description: 'Door not closing properly',
        reporter: 'Jane Smith - EMP002',
        severity: 'minor',
        assetId: 'Unit 412',
        location: 'Kaloor Station',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: [
          {
            name: 'door_sensor_report.pdf',
            originalName: 'door_sensor_report.pdf',
            size: 156432,
            mimeType: 'application/pdf',
            url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO8CjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgovRmlsdGVyIC9GbGF0ZURlY29kZQo+PgpzdHJlYW0KeJxLy8wpTVWwUsjIzEvLTFGwVUjOzytJzSvRy87PS9VLzk/VzyrNTc0rzi9KycxLt1Uw1DM0MjBQsOZiAABAAP//AwBQSwECHgAUAAAACABmAGFQAAAAFgAAABQAGAAAAAAAAAAAAKSBAAAAAGRvY3VtZW50LnBkZlVUBQADUEsBAh4AFAAAAAgAZgBhUAAAABYAAAAUABgAAAAAAAAAAACkgQAAAGRvY3VtZW50LnBkZlVUBQADUEsFBgAAAAACAAIAqgAAAF4AAAAAAA=='
          }
        ]
      }
    ];
    
    // Get all faults
    if (url?.includes('/api/faults') && method === 'GET' && !url.includes('/api/faults/')) {
      return res.json({ success: true, data: { faults: sampleFaults } });
    }
    
    // Create fault
    if (url?.includes('/api/faults') && method === 'POST') {
      let files = [];
      try {
        files = req.body?.files ? JSON.parse(req.body.files) : [];
      } catch (e) {
        files = [];
      }
      
      const fault = {
        id: String(Date.now()),
        title: req.body?.title || 'New Fault Report',
        description: req.body?.description || 'Fault description',
        reporter: req.body?.reporter || 'System User',
        severity: req.body?.severity || 'minor',
        assetId: req.body?.assetId || 'ASSET-001',
        location: req.body?.location || 'Unknown',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: files
      };
      return res.status(201).json({ success: true, data: { fault, files: fault.files } });
    }
    
    // Get single fault
    if (url?.includes('/api/faults/') && method === 'GET') {
      const id = url.split('/').pop();
      const fault = sampleFaults.find(f => f.id === id) || sampleFaults[0];
      return res.json({ success: true, data: { fault, files: [] } });
    }
    
    return res.status(404).json({ success: false, message: 'Endpoint not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: String(error) });
  }
}