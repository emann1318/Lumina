import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Routes
import authRoutes from './server/routes/auth.js';
import journalRoutes from './server/routes/journals.js';

dotenv.config();

console.log(process.env.MONGODB_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  mongoose.set('bufferCommands', false);

  const isValidMongoUri = (uri) => {
  return uri &&
    (uri.startsWith('mongodb://') ||
     uri.startsWith('mongodb+srv://'));
};

  if (isValidMongoUri(MONGODB_URI)) {
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => {
        console.error('MongoDB connection error:', err.message);
      });
  } else {
    console.warn('CRITICAL: MONGODB_URI is missing or invalid. Please set a valid connection string in the Secrets panel.');
  }

  // Middleware to check DB connection
  app.use((req, res, next) => {
    const isApiRequest = req.path.startsWith('/api/');
    const isStatusCheck = req.path === '/api/status';
    
    if (isApiRequest && !isStatusCheck && mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please ensure a valid MONGODB_URI (e.g., MongoDB Atlas) is configured in the Secrets panel.' 
      });
    }
    next();
  });

  // API Routes
  app.get('/api/status', (req, res) => {
    res.json({ 
      connected: mongoose.connection.readyState === 1,
      uri_configured: !!process.env.MONGODB_URI 
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/journals', journalRoutes);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
   console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
