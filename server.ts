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

// Socket.IO Server Configuration
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

const PORT = 3000;

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
  // Connect DB
  await connectDB();

  // Initial Market Data Sync
  MarketService.syncMarketData().catch((err) => console.warn('[Sync Error]', err.message));

  // Scheduled Market Sync interval (30 minutes)
  const syncIntervalMinutes = parseInt(process.env.MARKET_SYNC_INTERVAL_MINUTES || '30', 10);
  setInterval(() => {
    console.log('[Kisan Mitra Scheduler] Running periodic AGMARKNET market sync...');
    MarketService.syncMarketData().catch((err) => console.warn('[Scheduler Sync Warn]', err.message));
  }, syncIntervalMinutes * 60 * 1000);

  // Vite Development / Production integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
}

start().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
});
