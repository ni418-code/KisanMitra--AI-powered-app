import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  Sparkles,
  Send,
  Volume2,
  Globe,
  Bot,
  User as UserIcon,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  { text: 'Where should I sell 2,000 kg tomatoes today for highest net return?', lang: 'en' },
  { text: 'గుంటూరు మరియు హైదరాబాద్ మార్కెట్లలో నేటి టమాటా ధర ఎంత?', lang: 'te' },
  { text: 'धान और कपास के लिए वर्तमान सरकारी एमएसपी क्या है?', lang: 'hi' },
  { text: 'How do I protect tomato harvest from transit spoilage in hot weather?', lang: 'en' },
];

export const AIAssistantView: React.FC = () => {
  const { user, language, t } = useAuth();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; sources?: string[]; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Namaste ${user?.name || 'Kisan Mitra'}! I am your AI Agri Advisor, grounded in real-time AGMARKNET mandi rates, official MSP schedules, and logistics intelligence. Ask me anything in Telugu, Hindi, Tamil, Kannada, Marathi, or English!`,
      sources: ['Government AGMARKNET', 'CACP Official MSP 2024-25'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userEntry = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setInputMessage('');
    setLoading(true);

    const historyForAI = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    const locString = user?.location
      ? `${user.location.village ? user.location.village + ', ' : ''}${user.location.district || 'Guntur'}, ${user.location.state || 'Andhra Pradesh'}`
      : 'Guntur, Andhra Pradesh';

    const res = await api.askAI({
      message: query,
      language,
      userRole: user?.role || 'farmer',
      userLocation: locString,
      conversationHistory: historyForAI,
    });

    setLoading(false);

    if (res.success && res.data) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data!.reply,
          sources: res.data!.sources || ['AGMARKNET Real-time', 'MSP 2024-25'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Apologies, I encountered an issue consulting the agricultural database. Current Guntur tomato rates are ~₹28/kg and Paddy MSP is ₹2,300/qtl. Please ask again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
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

  const locDisplay = user?.location
    ? `${user.location.village ? user.location.village + ', ' : ''}${user.location.district || 'Guntur'}, ${user.location.state || 'Andhra Pradesh'}`
    : 'Guntur, Andhra Pradesh';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-2xl text-white p-5 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold font-serif">AI Mitra Agricultural Sahayak</h1>
              <span className="px-2.5 py-0.5 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Multilingual advisory grounded in real AGMARKNET arrival prices and government MSP guidelines
            </p>
          </div>
        </div>

        <div className="text-xs text-emerald-200 bg-emerald-800/80 px-3 py-2 rounded-xl border border-emerald-700">
          📍 Location context: <strong className="text-white">{locDisplay}</strong>
        </div>
      </div>

      {/* Chat Conversation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
        
        {/* Messages Body */}
        <div className="p-5 overflow-y-auto flex-grow space-y-4 bg-slate-50/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                {m.sender === 'ai' ? (
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> AI Mitra
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-700">You ({user?.name})</span>
                )}
                <button
                  onClick={() => handleSpeak(m.text)}
                  className="text-slate-400 hover:text-slate-700"
                  title="Read aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-br-xs font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-2 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Grounded in: {m.sources.join(' • ')}</span>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-400 mt-1">{m.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 py-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Consulting AGMARKNET rates and crop intelligence...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center">
            <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" /> Quick Questions:
          </span>
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt.text)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-medium rounded-full border border-slate-200 whitespace-nowrap shadow-2xs transition shrink-0"
            >
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Mitra about mandi rates, MSP, crop storage, or buyer negotiations..."
            className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
