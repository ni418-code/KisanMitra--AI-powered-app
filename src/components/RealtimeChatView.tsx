import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { api } from '../services/api.ts';
import { Conversation, ChatMessage } from '../types/index.ts';
import {
  Send,
  MessageSquare,
  Volume2,
  Lock,
  CheckCheck,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

interface RealtimeChatViewProps {
  initialConversationId?: string | null;
}

const QUICK_AGRICULTURAL_REPLIES = [
  'Produce is packed in standard ventilated crates ready for inspection.',
  'Can dispatch today before 4 PM via local transport.',
  'Current moisture content is strictly below 12% as per grade standards.',
  'Kindly confirm delivery address and gate entry contact.',
  'Payment received in escrow, starting shipment loading.',
];

export const RealtimeChatView: React.FC<RealtimeChatViewProps> = ({ initialConversationId }) => {
  const { user, t } = useAuth();
  const { socket, joinConversation, emitSendMessage, emitTyping } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    const res = await api.getConversations();
    if (res.success && res.data) {
      const convList = res.data.conversations || [];
      setConversations(convList);
      if (initialConversationId) {
        const found = convList.find((c) => c.id === initialConversationId || c.orderId === initialConversationId);
        if (found) setActiveConv(found);
      } else if (convList.length > 0 && !activeConv) {
        setActiveConv(convList[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, [user, initialConversationId]);

  useEffect(() => {
    if (activeConv) {
      joinConversation(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversationId: string; message: ChatMessage }) => {
      if (data.conversationId === activeConv?.id) {
        setActiveConv((prev) => {
          if (!prev) return null;
          if (prev.messages.some((m) => m.id === data.message.id)) {
            return prev;
          }
          return {
            ...prev,
            messages: [...prev.messages, data.message],
            lastMessage: data.message.text,
            lastMessageAt: data.message.timestamp,
          };
        });
      }
      // Update snippet in list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, lastMessage: data.message.text, lastMessageAt: data.message.timestamp }
            : c
        )
      );
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, activeConv]);

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages]);

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConv || isSending) return;

    if (activeConv.status === 'closed') {
      setErrorMessage('This conversation is closed because the linked order or request is complete. History is retained for audit.');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    setInputText('');

    try {
      const res = await api.sendMessage(activeConv.id, text);
      if (res.success && res.data) {
        const newMsg = res.data.message;
        emitSendMessage(activeConv.id, newMsg);
        setActiveConv((prev) => {
          if (!prev) return null;
          if (prev.messages.some((m) => m.id === newMsg.id)) return prev;
          return {
            ...prev,
            messages: [...prev.messages, newMsg],
            lastMessage: newMsg.text,
            lastMessageAt: newMsg.timestamp,
          };
        });
      } else {
        setErrorMessage(res.message || 'Failed to send message.');
      }
    } catch {
      setErrorMessage('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-950 rounded-2xl text-white p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-serif">Real-Time Produce Negotiation Chat</h1>
            <p className="text-xs text-emerald-200">
              Direct live communication between farmers & buyers (WebSockets & Audit Log Retained)
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        
        {/* Conversations List (1 col) */}
        <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Negotiation Threads ({conversations.length})
            </span>
          </div>

          <div className="overflow-y-auto flex-grow divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No active chats.</p>
            ) : (
              conversations.map((conv) => {
                const otherParty = user?.role === 'farmer' ? conv.buyerName : conv.farmerName;
                const isSelected = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConv(conv);
                      setErrorMessage(null);
                    }}
                    className={`p-3 cursor-pointer transition ${
                      isSelected ? 'bg-emerald-100/70 border-l-4 border-emerald-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">{otherParty}</span>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-emerald-800">{conv.cropName}</div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    {conv.status === 'closed' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full">
                        Closed (Archived)
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Conversation Thread (2 cols) */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Top Chat Bar */}
              <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {user?.role === 'farmer' ? activeConv.buyerName : activeConv.farmerName}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full">
                      {activeConv.cropName}
                    </span>
                    {activeConv.orderId && (
                      <span className="text-[10px] text-slate-500 font-mono">Order: {activeConv.orderId}</span>
                    )}
                  </div>
                </div>

                {activeConv.status === 'closed' && (
                  <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Closed & Audited</span>
                  </div>
                )}
              </div>

              {/* Messages Body */}
              <div className="p-4 overflow-y-auto flex-grow space-y-3 bg-slate-50/30">
                {activeConv.messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-500">{msg.senderName} ({msg.senderRole})</span>
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="text-slate-400 hover:text-slate-700"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isMine
                            ? 'bg-emerald-800 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      <span className="text-[9px] text-slate-400 mt-0.5">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Error if closed or issue */}
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border-t border-rose-200 text-rose-800 text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {/* Quick Reply Chips */}
              {activeConv.status !== 'closed' && (
                <div className="p-2 border-t border-slate-100 bg-slate-50 overflow-x-auto flex space-x-2">
                  {QUICK_AGRICULTURAL_REPLIES.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-full text-[11px] font-medium whitespace-nowrap transition shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              {activeConv.status !== 'closed' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 border-t border-slate-200 flex items-center space-x-2 bg-white"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type negotiation message or rate clarification..."
                    className="flex-grow px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-1"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-slate-100 text-center text-xs text-slate-500 font-semibold border-t border-slate-200">
                  🔒 Messages disabled. Historical conversation preserved for regulatory audit.
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              Select a conversation from the left panel.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
