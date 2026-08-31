import type { Server as SocketIOServer } from 'socket.io';

/**
 * Tiny pub/sub bridge between the HTTP layer and Socket.IO.
 *
 * Controllers and the data store can push real-time events without importing
 * the socket server (which would create a circular dependency on server.ts).
 * If Socket.IO is unavailable every call is a no-op, so nothing breaks.
 */
let io: SocketIOServer | null = null;

export function registerSocketServer(server: SocketIOServer): void {
  io = server;
}

export function isRealtimeReady(): boolean {
  return io !== null;
}

/** Push an event to every device/session of one user. */
export function emitToUser<T>(userId: string, event: string, payload: T): void {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit(event, payload);
}

/** Push an event to everyone watching a conversation. */
export function emitToConversation<T>(conversationId: string, event: string, payload: T): void {
  if (!io || !conversationId) return;
  io.to(`conv:${conversationId}`).emit(event, payload);
}
