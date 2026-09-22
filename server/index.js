import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, getMongoStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import hospitalityRoutes from './routes/hospitalityRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import { AuditModel } from './models/AuditLog.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploaded photos permanently
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/hospitality', hospitalityRoutes);
app.use('/api/finance', financeRoutes);

// Health & System Diagnostic Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SMARTORA Enterprise Platform Engine',
    database: getMongoStatus(),
    timestamp: new Date().toISOString()
  });
});

// Audit Logs Endpoint
app.get('/api/audit-logs', async (req, res) => {
  const logs = await AuditModel.getAll();
  res.json({ success: true, logs });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Uncaught Error]:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start Server and Connect DB
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[SMARTORA Backend] Server listening on http://localhost:${PORT}`);
    console.log(`[SMARTORA Backend] Uploads permanently hosted at: ${UPLOADS_DIR}`);
  });
}

start();
