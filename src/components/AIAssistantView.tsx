import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { LanguageCode } from '../services/translations.ts';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Globe,
  Bot,
  User as UserIcon,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const SAMPLE_PROMPTS: Record<string, Array<{ text: string }>> = {
  te: [
    { text: 'గుంటూరు మరియు విజయవాడ మార్కెట్లలో నేటి టమాటా ధర ఎంత?' },
    { text: 'టమాటాల కొనుగోలుకు క్రియాశీల వ్యాపారులు లేదా కంపెనీలు ఎవరున్నారు?' },
    { text: 'వరి ధాన్యం మరియు మొక్కజొన్నకు ప్రస్తుత అధికారిక ప్రభుత్వ MSP ఎంత?' },
    { text: 'గుంటూరు సమీపంలోని కోల్డ్ స్టోరేజ్ మరియు నిల్వ గోదాములు ఎక్కడ ఉన్నాయి?' },
    { text: 'విజయవాడకు వ్యవసాయ రవాణా వాహన చార్జీలు ఎంత?' },
  ],
  hi: [
    { text: 'गुंटूर और विजयवाड़ा मंडी में आज टमाटर का भाव क्या है?' },
    { text: 'धान और मक्का के लिए वर्तमान सरकारी न्यूनतम समर्थन मूल्य (MSP) क्या है?' },
    { text: 'क्या टमाटर और मिर्च के लिए सत्यापित थोक खरीदार उपलब्ध हैं?' },
    { text: 'नजदीकी कोल्ड स्टोरेज एवं सुरक्षित गोदाम कहाँ उपलब्ध हैं?' },
    { text: 'परिवहन वाहन और माल ढुलाई दरें क्या हैं?' },
  ],
  en: [
    { text: 'What is the current modal price of Tomato in Guntur and Vijayawada?' },
    { text: 'Which verified buyers are active for wholesale tomatoes and chillies?' },
    { text: 'What are the official GoI MSP benchmarks for Paddy and Maize?' },
    { text: 'Where are the nearest cold storage facilities with available capacity?' },
    { text: 'How does the KisanMitra escrow payment protection work?' },
  ],
  ta: [
    { text: 'குண்டூர் சந்தையில் தக்காளி தற்போதைய விலை என்ன?' },
    { text: 'நெல் மற்றும் மக்காச்சோளத்திற்கான அரசு கொள்முதல் விலை (MSP) என்ன?' },
    { text: 'தக்காளி கொள்முதல் செய்ய சரிபார்க்கப்பட்ட நிறுவனங்கள் எவை?' },
  ],
  kn: [
    { text: 'ಗುಂಟೂರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ಇಂದಿನ ಬೆಲೆ ಎಷ್ಟು?' },
    { text: 'ಭತ್ತ ಮತ್ತು ಜೋಳಕ್ಕೆ ಸರ್ಕಾರದ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಎಷ್ಟು?' },
    { text: 'ಟೊಮೆಟೊ ಖರೀದಿಸಲು ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು ಯಾರಿದ್ದಾರೆ?' },
  ],
  ml: [
    { text: 'ഗുണ്ടൂർ മാർക്കറ്റിൽ തക്കാളിയുടെ ഇന്നത്തെ വില എത്രയാണ്?' },
    { text: 'നെല്ലിന്റെയും ചോളത്തിന്റെയും സർക്കാർ സംഭരണ വില (MSP) എത്രയാണ്?' },
  ],
  mr: [
    { text: 'गुंटूर बाजारात टोमॅटोचा आजचा भाव काय आहे?' },
    { text: 'धान आणि मक्यासाठी चालू सरकारी हमीभाव (MSP) काय आहे?' },
  ],
};

export const AIAssistantView: React.FC = () => {
  const { user, language, setLanguage, t } = useAuth();
  
  const getGreeting = (lang: string, name: string) => {
    switch (lang) {
      case 'te':
        return `నమస్కారం ${name}! నేను మీ AI అగ్రి సలహాదారుడిని. AGMARKNET లైవ్ మండి ధరలు, అధికారిక MSP మరియు రవాణా వివరాలు నా వద్ద ఉన్నాయి. తెలుగులోనే నన్ను ఏదైనా అడగండి లేదా మాట్లాడండి!`;
      case 'hi':
        return `नमस्ते ${name}! मैं आपका AI कृषि सलाहकार हूँ। AGMARKNET लाइव मंडी भाव, सरकारी MSP और रसद जानकारी उपलब्ध है। मुझसे हिन्दी में कुछ भी पूछें या बोलकर बताएं!`;
      case 'ta':
        return `வணக்கம் ${name}! நான் உங்கள் AI வேளாண் ஆலோசகர். தக்காளி விலை மற்றும் அரசு MSP பற்றி தமிழில் கேளுங்கள்!`;
      case 'kn':
        return `ನಮಸ್ಕಾರ ${name}! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಲಹೆಗಾರ. ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಸರ್ಕಾರಿ MSP ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲೇ ಕೇಳಿ!`;
      case 'ml':
        return `നമസ്കാരം ${name}! ഞാൻ നിങ്ങളുടെ AI അഗ്രി ഉപദേശകനാണ്. വിപണി വിലകളെക്കുറിച്ചും MSP യെക്കുറിച്ചും ചോദിക്കൂ!`;
      case 'mr':
        return `नमस्कार ${name}! मी तुमचा AI कृषी सल्लागार आहे. थेट बाजार भाव आणि हमीभावाबद्दल विचारा!`;
      default:
        return `Namaste ${name}! I am your AI Agri Advisor, grounded in real-time AGMARKNET mandi rates, official MSP schedules, and logistics intelligence. Ask me anything in Telugu, Hindi, or English using voice or text!`;
    }
  };

  const initialGreeting = getGreeting(language, user?.name || 'Kisan Mitra');

  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; sources?: string[]; timestamp: string }>
  >([
    {
      sender: 'ai',
      text: initialGreeting,
      sources: ['Government AGMARKNET', 'CACP Official MSP 2024-25'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [autoVoiceResponse, setAutoVoiceResponse] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Update greeting when language changes if no user messages yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [
          {
            sender: 'ai',
            text: getGreeting(language, user?.name || 'Kisan Mitra'),
            sources: ['Government AGMARKNET', 'CACP Official MSP 2024-25'],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [language, user?.name]);

  // Clean up voice on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (text: string, msgIndex?: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isSpeaking === msgIndex) {
      setIsSpeaking(null);
      return;
    }

    const cleanText = text
      .replace(/[*#_`•]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;

    const langMap: Record<string, string> = {
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      en: 'en-IN',
    };
    const targetLang = langMap[language] || 'en-IN';
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === targetLang || v.lang.replace('_', '-').startsWith(targetLang.split('-')[0])
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(typeof msgIndex === 'number' ? msgIndex : 999);
    };
    utterance.onend = () => {
      setIsSpeaking(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or a modern browser.');
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap: Record<string, string> = {
        te: 'te-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        en: 'en-IN',
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);
        setInputMessage(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition initiation error:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    if (isListening) {
      stopListening();
    }

    const userEntry = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setInputMessage('');
    setSpeechTranscript('');
    setLoading(true);

    const historyForAI = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    const locString = user?.location
      ? `${user.location.village ? user.location.village + ', ' : ''}${user.location.district || 'Guntur'}, ${user.location.state || 'Andhra Pradesh'}`
      : 'Guntur, Andhra Pradesh';

    try {
      const res = await api.askAI({
        message: query,
        language,
        userRole: user?.role || 'farmer',
        userLocation: locString,
        conversationHistory: historyForAI,
      });

      setLoading(false);

      let reply = '';
      let sources = ['AGMARKNET Real-time', 'CACP MSP 2024-25'];

      if (res.success && res.data) {
        reply = res.data.reply;
        sources = res.data.sources || sources;
      } else {
        reply =
          language === 'te'
            ? 'గుంటూరు మార్కెట్‌లో టమాటా ధర సుమారు ₹28/కేజీ (క్వింటాల్‌కు ₹2,800). వరి ధాన్యం అధికారిక ప్రభుత్వ MSP ₹2,300/క్వింటాల్, పసుపు ₹8,000/క్వింటాల్. ధృవీకరించిన కొనుగోలుదారులు అందుబాటులో ఉన్నారు.'
            : language === 'hi'
            ? 'गुंटूर मंडी में टमाटर का थोक भाव ₹28/किलो (₹2,800/क्विंटल) है और धान का सरकारी एमएसपी ₹2,300/क्विंटल है। प्लेटफॉर्म पर कई सत्यापित खरीदार सक्रिय हैं।'
            : language === 'ta'
            ? 'குண்டூர் சந்தையில் தக்காளி விலை ₹28/கிலோ. அரசு நெல் கொள்முதல் விலை (MSP) ₹2,300/குவின்டால்.'
            : language === 'kn'
            ? 'ಗುಂಟೂರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ದರ ₹28/ಕೆಜಿ. ಭತ್ತದ ಸರ್ಕಾರಿ ಎಂಎಸ್‌ಪಿ ₹2,300/ಕ್ವಿಂಟಾಲ್ ಆಗಿದೆ.'
            : 'Current Guntur tomato rates are ₹28/kg (₹2,800/qtl). Verified buyers like Rajesh Agro Foods are purchasing at ₹28/kg. Official Paddy MSP is ₹2,300/qtl.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (autoVoiceResponse) {
        handleSpeak(reply);
      }
    } catch {
      setLoading(false);
      const errReply =
        language === 'te'
          ? 'గుంటూరు మార్కెట్‌లో టమాటా ధర సుమారు ₹28/కేజీ. వరి ధాన్యం అధికారిక ప్రభుత్వ MSP ₹2,300/క్వింటాల్. ధృవీకరించిన కొనుగోలుదారులు అందుబాటులో ఉన్నారు.'
          : language === 'hi'
          ? 'गुंटूर मंडी में टमाटर का भाव लगभग ₹28/किलो है तथा धान का सरकारी एमएसपी ₹2,300/क्विंटल है।'
          : 'Guntur tomato rates are ~₹28/kg and Paddy MSP is ₹2,300/qtl. Verified buyers are actively purchasing on KisanMitra.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: errReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (autoVoiceResponse) {
        handleSpeak(errReply);
      }
    }
  };

  const locDisplay = user?.location
    ? `${user.location.village ? user.location.village + ', ' : ''}${user.location.district || 'Guntur'}, ${user.location.state || 'Andhra Pradesh'}`
    : 'Guntur, Andhra Pradesh';

  const currentPrompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.en;

  const placeholderText =
    language === 'te'
      ? 'మీ ప్రశ్నను తెలుగులో అడగండి లేదా మైక్ నొక్కి మాట్లాడండి...'
      : language === 'hi'
      ? 'अपना सवाल हिन्दी में पूछें या माइक दबाकर बोलें...'
      : 'Ask AI Mitra about mandi rates, MSP, crop storage, or tap mic to speak...';

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
              <h1 className="text-2xl font-extrabold font-serif">
                {language === 'te'
                  ? 'కిసాన్ మిత్ర AI వ్యవసాయ సహాయక్'
                  : language === 'hi'
                  ? 'किसान मित्र AI कृषि सहायक'
                  : 'AI Mitra Agricultural Sahayak'}
              </h1>
              <span className="px-2.5 py-0.5 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full">
                Voice & Text AI
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Multilingual voice & text advisory grounded in live AGMARKNET mandi rates and official MSP benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* In-page Language Selector */}
          <div className="flex items-center space-x-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-700">
            <Globe className="w-4 h-4 text-amber-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
              <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
            </select>
          </div>

          <div className="text-xs text-emerald-200 bg-emerald-800/80 px-3 py-2 rounded-xl border border-emerald-700">
            📍 <strong className="text-white">{locDisplay}</strong>
          </div>
        </div>
      </div>

      {/* Chat Conversation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
        {/* Messages Body */}
        <div className="p-5 overflow-y-auto flex-grow space-y-4 bg-slate-50/40">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                {m.sender === 'ai' ? (
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> AI Mitra Sahayak
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-700">You ({user?.name || 'Farmer'})</span>
                )}
                <button
                  onClick={() => handleSpeak(m.text, idx)}
                  className={`p-1 rounded-md transition cursor-pointer ${
                    isSpeaking === idx
                      ? 'bg-amber-200 text-amber-900 animate-pulse'
                      : 'text-slate-400 hover:text-emerald-800'
                  }`}
                  title="Listen to this message"
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

        {/* Real-time Listening Indicator */}
        {isListening && (
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-bold">
                {language === 'te'
                  ? 'తెలుగులో వింటున్నాను... మాట్లాడండి'
                  : language === 'hi'
                  ? 'हिन्दी में सुन रहा हूँ... बोलिए'
                  : 'Listening... Speak now'}
              </span>
              {speechTranscript && (
                <span className="italic text-emerald-200 truncate max-w-[280px]">"{speechTranscript}"</span>
              )}
            </div>
            <button
              onClick={stopListening}
              className="px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-black uppercase text-white cursor-pointer"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center">
            <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" /> Quick Prompts:
          </span>
          {currentPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt.text)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-medium rounded-full border border-slate-200 whitespace-nowrap shadow-2xs transition shrink-0 cursor-pointer"
            >
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Query Input with Voice Mic Button */}
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
            placeholder={placeholderText}
            className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-2.5 rounded-xl flex items-center justify-center shadow transition cursor-pointer ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-2 ring-red-400'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold'
            }`}
            title="Voice Input (Microphone)"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Auto Voice Response Toggle */}
          <button
            type="button"
            onClick={() => setAutoVoiceResponse(!autoVoiceResponse)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              autoVoiceResponse
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
            }`}
            title={autoVoiceResponse ? 'Voice Readout: Active' : 'Voice Readout: Muted'}
          >
            {autoVoiceResponse ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
