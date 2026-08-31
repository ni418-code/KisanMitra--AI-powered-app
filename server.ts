// Load .env FIRST: ES module imports are evaluated before any statement in this
// file runs, so `dotenv.config()` further down would be too late for modules
// that read process.env at import time (e.g. the JWT secret in middleware/auth).
import 'dotenv/config';

import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './src/server/routes/api.ts';
import { connectDB } from './src/server/config/db.ts';
import { MarketService } from './src/server/services/marketService.ts';
import { dataStore } from './src/server/services/dataStore.ts';
import { Persistence } from './src/server/services/persistence.ts';
import { registerSocketServer } from './src/server/services/realtimeBus.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createHttpServer(app);

// Socket.IO Server Configuration
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Render injects a dynamic PORT env var; fall back to 3000 for local dev.
const PORT = Number(process.env.PORT) || 3000;

// Security & Parsing Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Kisan Mitra Agri-Marketplace',
    timestamp: new Date().toISOString(),
    sync: MarketService.getSyncStatus(),
  });
});

// API Routes
app.use('/api', apiRoutes);

// Make the socket server reachable from controllers / the data store.
registerSocketServer(io);

// Socket.IO Real-Time Chat & Notification Management
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Join user room for private notifications
  socket.on('join-user', (userId: string) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined user:${userId}`);
    }
  });

  // Join specific conversation/order room
  socket.on('join-conversation', (conversationId: string) => {
    if (conversationId) {
      socket.join(`conv:${conversationId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined conv:${conversationId}`);
    }
  });

  // Handle new message
  socket.on('send-message', (data: { conversationId: string; message: any }) => {
    if (data?.conversationId && data?.message) {
      // Broadcast to room
      io.to(`conv:${data.conversationId}`).emit('new-message', {
        conversationId: data.conversationId,
        message: data.message,
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data: { conversationId: string; senderName: string; isTyping: boolean }) => {
    if (data?.conversationId) {
      socket.to(`conv:${data.conversationId}`).emit('typing-status', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Start Server & Initialize Services
async function start() {
  // Connect DB (optional — the app falls back to its in-memory store).
  await connectDB();

  // If MongoDB is reachable, restore previously saved data into the store.
  await Persistence.hydrate(dataStore as unknown as Record<string, any[]>).catch((err) =>
    console.log('[Hydration Note]', err.message)
  );

  // Initial Market Data Sync
  MarketService.syncMarketData().catch((err) => console.log('[Sync Note]', err.message));

  // Scheduled Market Sync interval (30 minutes)
  const syncIntervalMinutes = parseInt(process.env.MARKET_SYNC_INTERVAL_MINUTES || '30', 10);
  setInterval(() => {
    console.log('[Kisan Mitra Scheduler] Running periodic AGMARKNET market sync...');
    MarketService.syncMarketData().catch((err) => console.log('[Scheduler Sync Note]', err.message));
  }, syncIntervalMinutes * 60 * 1000);

  // Vite Development / Production integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'] },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Kisan Mitra Server is running on http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown: mirror the in-memory store back to MongoDB, then exit.
  const shutdown = async (signal: string) => {
    console.log(`[Kisan Mitra] ${signal} received — saving state and shutting down.`);
    try {
      await Persistence.flush(dataStore as unknown as Record<string, any[]>);
    } catch {
      /* never block shutdown on a database hiccup */
    }
    httpServer.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 4000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
});
