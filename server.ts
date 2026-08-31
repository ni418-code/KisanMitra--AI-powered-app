import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './src/server/routes/api.ts';
import { connectDB } from './src/server/config/db.ts';
import { MarketService } from './src/server/services/marketService.ts';
import { dataStore } from './src/server/services/dataStore.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createHttpServer(app);

// Render injects PORT for web services. Keep a production fallback of 10000
// and a developer-friendly 3000 fallback for local use.
const PORT = Number(process.env.PORT) || (process.env.NODE_ENV === 'production' ? 10000 : 3000);

// CORS can be restricted through CORS_ORIGIN. Leave it unset for the demo.
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigin = allowedOrigins.includes('*')
  ? '*'
  : (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    };

// Socket.IO Server Configuration
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Security & Parsing Middlewares
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint — intentionally lightweight for Render readiness checks.
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'Kisan Mitra Agri-Marketplace',
    timestamp: new Date().toISOString(),
    sync: MarketService.getSyncStatus(),
  });
});

// API Routes
app.use('/api', apiRoutes);

// Socket.IO Real-Time Chat & Notification Management
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join-user', (userId: string) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined user:${userId}`);
    }
  });

  socket.on('join-conversation', (conversationId: string) => {
    if (conversationId) {
      socket.join(`conv:${conversationId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined conv:${conversationId}`);
    }
  });

  socket.on('send-message', (data: { conversationId: string; message: any }) => {
    if (data?.conversationId && data?.message) {
      io.to(`conv:${data.conversationId}`).emit('new-message', {
        conversationId: data.conversationId,
        message: data.message,
      });
    }
  });

  socket.on('typing', (data: { conversationId: string; senderName: string; isTyping: boolean }) => {
    if (data?.conversationId) {
      socket.to(`conv:${data.conversationId}`).emit('typing-status', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

async function start() {
  // Database is optional for the demo; connectDB() falls back immediately when
  // MONGODB_URI is missing or unreachable, so Render can still bind its port.
  await connectDB();

  // Initial market sync runs in the background and never blocks server startup.
  MarketService.syncMarketData().catch((err) => console.log('[Sync Note]', err.message));

  const syncIntervalMinutes = parseInt(process.env.MARKET_SYNC_INTERVAL_MINUTES || '30', 10);
  setInterval(() => {
    console.log('[Kisan Mitra Scheduler] Running periodic AGMARKNET market sync...');
    MarketService.syncMarketData().catch((err) => console.log('[Scheduler Sync Note]', err.message));
  }, Math.max(5, syncIntervalMinutes) * 60 * 1000);

  // Vite development / production static integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'] },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Kisan Mitra Server is running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exitCode = 1;
});
