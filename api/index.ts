import express from 'express';
import cors from 'cors';
import { getDatabase } from '../backend/src/models/jsonDatabase';

const app = express();

app.use(cors());
app.use(express.json());

const db = getDatabase();

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.get('/api/faults', (req, res) => {
  try {
    const faults = db.getAllFaults(50, 0);
    res.json({ success: true, data: { faults } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching faults' });
  }
});

app.post('/api/faults', (req, res) => {
  try {
    const fault = db.createFault({
      title: req.body.title || 'Test Fault',
      description: req.body.description || 'Test Description',
      reporter: req.body.reporter || 'Test Reporter',
      date: new Date().toISOString(),
      severity: req.body.severity || 'minor',
      assetId: req.body.assetId || 'TEST-001'
    });
    res.status(201).json({ success: true, data: { fault } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating fault' });
  }
});

export default app;