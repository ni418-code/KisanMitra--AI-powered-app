import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.tsx';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  emitSendMessage: (conversationId: string, message: any) => void;
  emitTyping: (conversationId: string, senderName: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    // Connect to same host
    const newSocket = io({
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected with ID:', newSocket.id);
      setIsConnected(true);
      if (user?.id) {
        newSocket.emit('join-user', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && isConnected && user?.id) {
      socket.emit('join-user', user.id);
    }
  }, [user, socket, isConnected]);

  const joinConversation = (conversationId: string) => {
    if (socket && conversationId) {
      socket.emit('join-conversation', conversationId);
    }
  };

  const emitSendMessage = (conversationId: string, message: any) => {
    if (socket && conversationId) {
      socket.emit('send-message', { conversationId, message });
    }
  };

  const emitTyping = (conversationId: string, senderName: string, isTyping: boolean) => {
    if (socket && conversationId) {
      socket.emit('typing', { conversationId, senderName, isTyping });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        emitSendMessage,
        emitTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
