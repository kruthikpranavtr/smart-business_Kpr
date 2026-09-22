import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartora';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[MongoDB Notice] Live MongoDB service not detected on ${mongoUri} (${err.message}). Activating SMARTORA Persistent Host Storage Engine at: ${DATA_DIR}`);
  }
}

export function getMongoStatus() {
  return {
    connected: isMongoConnected,
    storageEngine: isMongoConnected ? 'MongoDB Live Connection' : 'SMARTORA Disk-Persisted Host Engine',
    dataDir: DATA_DIR
  };
}

// Low-level disk persistence helpers for absolute resilience across server restarts
export const diskStore = {
  readCollection: (name, defaultData = []) => {
    const file = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    try {
      const raw = fs.readFileSync(file, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Error reading ${name}.json from disk:`, e);
      return defaultData;
    }
  },

  writeCollection: (name, data) => {
    const file = path.join(DATA_DIR, `${name}.json`);
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error(`Error writing ${name}.json to disk:`, e);
      return false;
    }
  }
};
