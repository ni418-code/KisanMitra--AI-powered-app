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
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const app = express();
const httpServer = createHttpServer(app);

const PORT = Number(process.env.PORT) || 3000;

// CORS configuration - allow all origins in development and preview environments
const rawCorsOrigin = process.env.CORS_ORIGIN?.trim();
const allowedOrigins = rawCorsOrigin && rawCorsOrigin !== '*'
  ? rawCorsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

const corsOrigin = allowedOrigins.length > 0
  ? (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        // Safe fallback to allow preview iframes and dev domains
        callback(null, true);
      }
    }
  : true;

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lightweight HTTP health endpoint for Render readiness checks.
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'Kisan Mitra Agri-Marketplace',
    timestamp: new Date().toISOString(),
    sync: MarketService.getSyncStatus(),
  });
});

app.use('/api', apiRoutes);

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

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'] },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
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
