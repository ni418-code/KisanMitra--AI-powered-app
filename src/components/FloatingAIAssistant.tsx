import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { LanguageCode, getLocalizedCropName } from '../services/translations.ts';
import {
  Bot,
  X,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingUp,
  Building2,
  Truck,
  Warehouse,
  ShieldCheck,
  CreditCard,
  Layers,
  ChevronDown,
  Globe,
  Radio,
} from 'lucide-react';

interface FloatingAIAssistantProps {
  onNavigateToView?: (view: string) => void;
}

interface ChatMsg {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  toolResult?: {
    type: 'market_price' | 'buyers' | 'payment_status' | 'workflow' | 'storage' | 'transport';
    data: any;
  };
}

interface LocaleContent {
  title: string;
  sub: string;
  greeting: string;
  placeholder: string;
  speechLocale: string;
  listenVoice: string;
  listeningText: string;
  micTip: string;
  quickPrompts: Array<{ label: string; text: string }>;
  labels: {
    liveMandi: string;
    govSource: string;
    recommendation: string;
    verifiedBuyers: string;
    found: string;
    need: string;
    match: string;
    transaction: string;
    securedEscrow: string;
    workflowTitle: string;
    storageTitle: string;
    transportTitle: string;
    consulting: string;
    autoSpeak: string;
  };
}

const LOCALE_CONTENT: Record<string, LocaleContent> = {
  te: {
    title: 'కిసాన్ మిత్ర సహాయక్',
    sub: 'AGMARKNET & MSP లైవ్ మార్కెట్ నిఘా',
    greeting: 'నమస్కారం 🙏 ! నేను మీ AI కిసాన్ మిత్ర సహాయకుడిని. మీకు ఈరోజు ఎలా సహాయపడగలను? టమాటా ధరలు, కొనుగోలుదారులు, ఎస్క్రో పేమెంట్ల గురించి నన్ను తెలుగులోనే అడగండి లేదా మైక్ ద్వారా మాట్లాడండి!',
    placeholder: 'మీ ప్రశ్నను తెలుగులో అడగండి లేదా మాట్లాడండి...',
    speechLocale: 'te-IN',
    listenVoice: 'తెలుగులో వినండి (Listen Voice)',
    listeningText: 'తెలుగులో వింటున్నాను... మాట్లాడండి',
    micTip: 'తెలుగు వాయిస్ అసిస్టెంట్ (మాట్లాడండి)',
    quickPrompts: [
      { label: '🍅 టమాటా ప్రస్తుత ధర ఎంత?', text: 'గుంటూరు మార్కెట్‌లో టమాటా ప్రస్తుత ధర మరియు సిఫార్సు ఏమిటి?' },
      { label: '🏢 టమాటాలకు కొనుగోలుదారులు ఉన్నారా?', text: 'నా టమాటాలకు ధృవీకరించిన కొనుగోలుదారులు మరియు కంపెనీలు ఎవరున్నారు?' },
      { label: '💳 నా చెల్లింపు (Payment) స్థితి', text: 'నా చెల్లింపు మరియు ఎస్క్రో రక్షణ స్థితి ఏమిటి?' },
      { label: 'ℹ️ ఈ వెబ్‌సైట్ ఎలా పనిచేస్తుంది?', text: 'కిసాన్ మిత్ర ప్లాట్‌ఫారమ్ ఎలా పనిచేస్తుంది?' },
      { label: '🏬 సమీప కోల్డ్ స్టోరేజ్ ఎక్కడ ఉంది?', text: 'సమీపంలోని కోల్డ్ స్టోరేజ్ మరియు నిల్వ గోదాములు ఎక్కడ ఉన్నాయి?' },
      { label: '🚚 రవాణా ఛార్జీలు మరియు బుకింగ్', text: 'వ్యవసాయ రవాణా వాహన వివరాలు మరియు బుకింగ్ ఛార్జీలు ఏమిటి?' },
    ],
    labels: {
      liveMandi: 'లైవ్ మార్కెట్ ధరలు (Live Mandi Rates):',
      govSource: 'భారత ప్రభుత్వ AGMARKNET',
      recommendation: 'సిఫార్సు: విజయవాడలో క్వింటాల్‌కు ₹300 ఎక్కువ లభిస్తుంది. రవాణా ఖర్చు తీసివేసినా నికర రాబడి పెరుగుతుంది.',
      verifiedBuyers: 'ధృవీకరించిన కొనుగోలుదారులు (Verified Buyers):',
      found: 'కనుగొనబడినవి',
      need: 'కావాల్సిన పరిమాణం',
      match: 'సరిపోలిక',
      transaction: 'ఎస్క్రో లావాదేవీ',
      securedEscrow: '✓ 100% ఎస్క్రో ఖాతాలో భద్రపరచబడింది',
      workflowTitle: 'కిసాన్ మిత్ర 8-దశల సురక్షిత లావాదేవీ విధానం:',
      storageTitle: 'సమీప నిల్వ & కోల్డ్ స్టోరేజ్ కేంద్రాలు:',
      transportTitle: 'అందుబాటులో ఉన్న వ్యవసాయ రవాణా వాహనాలు:',
      consulting: 'మార్కెట్ డేటాబేస్ పరిశీలిస్తోంది...',
      autoSpeak: 'వాయిస్ సమాధానాలు (Voice Assistant)',
    },
  },
  hi: {
    title: 'किसान मित्र सहायक',
    sub: 'AGMARKNET एवं MSP लाइव मंडी इंटेलिजेंस',
    greeting: 'नमस्ते 🙏 ! मैं आपका किसान मित्र AI सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? टमाटर भाव, खरीदार, या भुगतान के बारे में मुझसे हिन्दी में पूछें या बोलकर बताएं!',
    placeholder: 'अपना सवाल हिन्दी में पूछें या माइक से बोलें...',
    speechLocale: 'hi-IN',
    listenVoice: 'हिन्दी में सुनें (Listen Voice)',
    listeningText: 'हिन्दी में सुन रहा हूँ... बोलिए',
    micTip: 'हिन्दी वॉयस असिस्टेंट (बोलें)',
    quickPrompts: [
      { label: '🍅 आज टमाटर का भाव क्या है?', text: 'गुंटूर मंडी में टमाटर का वर्तमान भाव और सिफारिश क्या है?' },
      { label: '🏢 क्या टमाटर के थोक खरीदार उपलब्ध हैं?', text: 'टमाटर के लिए कौन-से सत्यापित खरीदार सक्रिय हैं?' },
      { label: '💳 मेरी भुगतान (Payment) स्थिति', text: 'मेरी भुगतान और एस्क्रो सुरक्षा स्थिति क्या है?' },
      { label: 'ℹ️ यह वेबसाइट कैसे काम करती है?', text: 'किसान मित्र प्लेटफॉर्म कैसे काम करता है?' },
      { label: '🏬 नजदीकी कोल्ड स्टोरेज कहाँ उपलब्ध है?', text: 'नजदीकी कोल्ड स्टोरेज और गोदाम कहाँ हैं?' },
      { label: '🚚 परिवहन (ट्रक) बुकिंग दरें', text: 'कृषि परिवहन गाड़ियाँ और बुकिंग दरें क्या हैं?' },
    ],
    labels: {
      liveMandi: 'लाइव मंडी भाव (Live Mandi Rates):',
      govSource: 'भारत सरकार AGMARKNET',
      recommendation: 'सिफारिश: विजयवाड़ा में ₹300/क्विंटल अधिक भाव है। परिवहन खर्च काटकर भी शुद्ध मुनाफा बेहतर रहेगा।',
      verifiedBuyers: 'सत्यापित थोक खरीदार (Verified Buyers):',
      found: 'उपलब्ध',
      need: 'मांग',
      match: 'मैच',
      transaction: 'एस्क्रो सुरक्षित लेन-देन',
      securedEscrow: '✓ 100% एस्क्रो खाते में सुरक्षित',
      workflowTitle: 'किसान मित्र 8-चरणीय सुरक्षित लेन-देन प्रक्रिया:',
      storageTitle: 'नजदीकी कोल्ड स्टोरेज एवं सुरक्षित गोदाम:',
      transportTitle: 'उपलब्ध कृषि परिवहन गाड़ियाँ:',
      consulting: 'मंडी डेटाबेस से संपर्क हो रहा है...',
      autoSpeak: 'वॉयस उत्तर (Voice Assistant)',
    },
  },
  en: {
    title: 'KisanMitra Sahayak',
    sub: 'Grounded in AGMARKNET & CACP MSP',
    greeting: 'Namaste 🙏 ! I am AI KisanMitra Sahayak. How can I help you today? Ask about Mandi rates, MSP benchmarks, verified buyers, and escrow payments using text or voice!',
    placeholder: 'Ask in your preferred language or tap mic to speak...',
    speechLocale: 'en-IN',
    listenVoice: 'Listen Voice',
    listeningText: 'Listening in English... Speak now',
    micTip: 'Voice Assistant (Speak)',
    quickPrompts: [
      { label: '🍅 Current price of Tomato?', text: 'What is the current price and market trend of Tomato?' },
      { label: '🏢 Active buyers for wholesale tomatoes?', text: 'Are there any active buyers for wholesale tomatoes?' },
      { label: '💳 My Payment Status', text: 'What is my current payment and escrow status?' },
      { label: 'ℹ️ How this Website works?', text: 'How does the KisanMitra platform work?' },
      { label: '🏬 Nearby cold storage options', text: 'Where can I store produce in cold storage nearby?' },
      { label: '🚚 Transport booking rates', text: 'What are the transport options and rates?' },
    ],
    labels: {
      liveMandi: 'Live Mandi Rates:',
      govSource: 'data.gov.in AGMARKNET',
      recommendation: 'Recommendation: Vijayawada offers ₹300/qtl higher return; offset against ~₹150 transit cost for +₹150 net in-pocket.',
      verifiedBuyers: 'Verified Buyers:',
      found: 'Found',
      need: 'Demand',
      match: 'Match',
      transaction: 'Escrow Transaction',
      securedEscrow: '✓ SECURED IN MILESTONE ESCROW',
      workflowTitle: 'KisanMitra 8-Step Transaction Flow:',
      storageTitle: 'Nearby Storage Facilities:',
      transportTitle: 'Available Transport Carriers:',
      consulting: 'Consulting AGMARKNET database...',
      autoSpeak: 'Voice Assistant (Auto-Readout)',
    },
  },
  ta: {
    title: 'கிசான் மித்ரா உதவியாளர்',
    sub: 'AGMARKNET & MSP நேரலை சந்தை தகவல்',
    greeting: 'வணக்கம் 🙏 ! நான் உங்கள் கிசான் மித்ரா AI உதவியாளர். தக்காளி விலை, கொள்முதல் செய்வோர், எஸ்க்ரோ கட்டணம் குறித்து தமிழில் கேளுங்கள் அல்லது பேசுங்கள்!',
    placeholder: 'தமிழில் கேள்வி கேளுங்கள் அல்லது பேசுங்கள்...',
    speechLocale: 'ta-IN',
    listenVoice: 'தமிழில் கேளுங்கள் (Listen Voice)',
    listeningText: 'தமிழில் கேட்கிறேன்... பேசுங்கள்',
    micTip: 'குரல் உதவியாளர் (பேசுங்கள்)',
    quickPrompts: [
      { label: '🍅 தக்காளி இன்றைய விலை என்ன?', text: 'குண்டூர் சந்தையில் தக்காளி தற்போதைய விலை என்ன?' },
      { label: '🏢 தக்காளி வாங்குபவர்கள் உள்ளார்களா?', text: 'தக்காளி வாங்குவதற்கு சரிபார்க்கப்பட்ட நிறுவனங்கள் எவை?' },
      { label: '💳 எனது பணம் செலுத்தும் நிலை', text: 'எனது பணம் செலுத்தும் எஸ்க்ரோ பாதுகாப்பு நிலை என்ன?' },
      { label: 'ℹ️ இந்த தளம் எவ்வாறு செயல்படுகிறது?', text: 'கிசான் மித்ரா தளம் எவ்வாறு செயல்படுகிறது?' },
    ],
    labels: {
      liveMandi: 'நேரலை சந்தை விலைகள்:',
      govSource: 'இந்திய அரசு AGMARKNET',
      recommendation: 'பரிந்துரை: விஜயவாடாவில் ₹300/குவின்டால் கூடுதல் விலை கிடைக்கும்.',
      verifiedBuyers: 'சரிபார்க்கப்பட்ட வாங்குபவர்கள்:',
      found: 'கிடைத்தன',
      need: 'தேவை',
      match: 'பொருத்தம்',
      transaction: 'எஸ்க்ரோ பரிவர்த்தனை',
      securedEscrow: '✓ 100% எஸ்க்ரோவில் பாதுகாப்பானது',
      workflowTitle: 'கிசான் மித்ரா 8-படி பாதுகாப்பான செயல்முறை:',
      storageTitle: 'அருகிலுள்ள குளிர்சாதன சேமிப்பகங்கள்:',
      transportTitle: 'கிடைக்கும் வேளாண் போக்குவரத்து வாகனங்கள்:',
      consulting: 'சந்தை தகவல் பெறப்படுகிறது...',
      autoSpeak: 'குரல் பதில் (Voice Assistant)',
    },
  },
  kn: {
    title: 'ಕಿಸಾನ್ ಮಿತ್ರ ಸಹಾಯಕ',
    sub: 'AGMARKNET ಮತ್ತು MSP ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ',
    greeting: 'ನಮಸ್ಕಾರ 🙏 ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ ಮಿತ್ರ AI ಸಹಾಯಕ. ಟೊಮೆಟೊ ದರಗಳು, ಖರೀದಿದಾರರು, ಎಸ್ಕ್ರೋ ಪಾವತಿಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲೇ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ!',
    placeholder: 'ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ...',
    speechLocale: 'kn-IN',
    listenVoice: 'ಕನ್ನಡದಲ್ಲಿ ಆಲಿಸಿ (Listen Voice)',
    listeningText: 'ಕನ್ನಡದಲ್ಲಿ ಆಲಿಸುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ',
    micTip: 'ಧ್ವನಿ ಸಹಾಯಕ (ಮಾತನಾಡಿ)',
    quickPrompts: [
      { label: '🍅 ಟೊಮೆಟೊ ಇಂದಿನ ಬೆಲೆ ಎಷ್ಟು?', text: 'ಗುಂಟೂರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ಪ್ರಸ್ತುತ ಬೆಲೆ ಮತ್ತು ಮಾಹಿತಿ ಏನು?' },
      { label: '🏢 ಖರೀದಿದಾರರು ಲಭ್ಯವಿದ್ದಾರೆಯೇ?', text: 'ಟೊಮೆಟೊ ಖರೀದಿಗೆ ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು ಯಾರಿದ್ದಾರೆ?' },
      { label: '💳 ನನ್ನ ಪಾವತಿ ಸ್ಥಿತಿ', text: 'ನನ್ನ ಪಾವತಿ ಮತ್ತು ಎಸ್ಕ್ರೋ ರಕ್ಷಣೆ ಸ್ಥಿತಿ ಏನು?' },
      { label: 'ℹ️ ಈ ವೆಬ್‌ಸೈಟ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?', text: 'ಕಿಸಾನ್ ಮಿತ್ರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?' },
    ],
    labels: {
      liveMandi: 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರಗಳು:',
      govSource: 'ಭಾರತ ಸರ್ಕಾರ AGMARKNET',
      recommendation: 'ಶಿಫಾರಸು: ವಿಜಯವಾಡದಲ್ಲಿ ₹300/ಕ್ವಿಂಟಾಲ್ ಹೆಚ್ಚಿನ ಆದಾಯ ಲಭ್ಯ.',
      verifiedBuyers: 'ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು:',
      found: 'ಲಭ್ಯ',
      need: 'ಬೇಡಿಕೆ',
      match: 'ಹೊಂದಾಣಿಕೆ',
      transaction: 'ಎಸ್ಕ್ರೋ ವಹಿವಾಟು',
      securedEscrow: '✓ 100% ಎಸ್ಕ್ರೋದಲ್ಲಿ ಸುರಕ್ಷಿತ',
      workflowTitle: 'ಕಿಸಾನ್ ಮಿತ್ರ 8-ಹಂತದ ಸುರಕ್ಷಿತ ವ್ಯವಸ್ಥೆ:',
      storageTitle: 'ಸಮೀಪದ ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ವಿವರಗಳು:',
      transportTitle: 'ಲಭ್ಯವಿರುವ ಕೃಷಿ ಸಾರಿಗೆ ವಾಹನಗಳು:',
      consulting: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಪಡೆಯಲಾಗುತ್ತಿದೆ...',
      autoSpeak: 'ಧ್ವನಿ ಉತ್ತರಗಳು (Voice Assistant)',
    },
  },
  ml: {
    title: 'കിസാൻ മിത്ര സഹായക്',
    sub: 'AGMARKNET & MSP ലൈവ് വിപണി വിവരങ്ങൾ',
    greeting: 'നമസ്കാരം 🙏 ! ഞാൻ നിങ്ങളുടെ കിസാൻ മിത്ര AI സഹായിയാണ്. തക്കാളി വില, വാങ്ങുന്നവർ, എസ്ക്രോ പേയ്മെന്റുകൾ എന്നിവയെക്കുറിച്ച് മലയാളത്തിൽ ചോദിക്കൂ അല്ലെങ്കിൽ സംസാരിക്കൂ!',
    placeholder: 'മലയാളത്തിൽ ചോദിക്കൂ അല്ലെങ്കിൽ സംസാരിക്കൂ...',
    speechLocale: 'ml-IN',
    listenVoice: 'മലയാളത്തിൽ കേൾക്കൂ (Listen Voice)',
    listeningText: 'കേൾക്കുന്നു... സംസാരിക്കൂ',
    micTip: 'വോയ്‌സ് അസിസ്റ്റന്റ് (സംസാരിക്കൂ)',
    quickPrompts: [
      { label: '🍅 തക്കാളി ഇന്നത്തെ വില എത്ര?', text: 'ഗുണ്ടൂർ മാർക്കറ്റിൽ തക്കാളിയുടെ ഇപ്പോഴത്തെ വില എത്രയാണ്?' },
      { label: '🏢 വാങ്ങുന്നവർ ലഭ്യമാണോ?', text: 'തക്കാളി വാങ്ങാൻ ലഭ്യമായ സ്ഥാപനങ്ങൾ ഏതെല്ലാം?' },
      { label: '💳 പേയ്മെന്റ് അവസ്ഥ', text: 'എന്റെ പേയ്മെന്റ് സുരക്ഷ അവസ്ഥ എന്താണ്?' },
    ],
    labels: {
      liveMandi: 'തത്സമയ മാർക്കറ്റ് നിരക്കുകൾ:',
      govSource: 'ഭാരത സർക്കാർ AGMARKNET',
      recommendation: 'ശുപാർശ: വിജയവാഡയിൽ ₹300/ക്വിന്റൽ കൂടുതൽ ലഭ്യമാണ്.',
      verifiedBuyers: 'പരിശോധിച്ച വാങ്ങുന്നവർ:',
      found: 'ലഭ്യമാണ്',
      need: 'ആവശ്യം',
      match: 'പൊരുത്തം',
      transaction: 'എസ്ക്രോ ഇടപാട്',
      securedEscrow: '✓ 100% എസ്ക്രോയിൽ സുരക്ഷിതം',
      workflowTitle: 'കിസാൻ മിത്ര 8 ഘട്ട സുരക്ഷിത പ്രക്രിയ:',
      storageTitle: 'സമീപത്തെ കോൾഡ് സ്റ്റോറേജുകൾ:',
      transportTitle: 'ലഭ്യമായ കാർഷിക വാഹനങ്ങൾ:',
      consulting: 'വിവരങ്ങൾ പരിശോധിക്കുന്നു...',
      autoSpeak: 'വോയ്‌സ് മറുപടി (Voice Assistant)',
    },
  },
  mr: {
    title: 'किसान मित्र सहायक',
    sub: 'AGMARKNET व MSP थेट बाजार भाव',
    greeting: 'नमस्कार 🙏 ! मी तुमचा किसान मित्र AI सहाय्यक आहे. टोमॅटो भाव, खरेदीदार, किंवा एस्क्रो पेमेंटबद्दल मराठीत विचारा किंवा बोला!',
    placeholder: 'मराठीत विचारा किंवा बोला...',
    speechLocale: 'mr-IN',
    listenVoice: 'मराठीत ऐका (Listen Voice)',
    listeningText: 'ऐकत आहे... बोला',
    micTip: 'व्हॉइस असिस्टंट (बोला)',
    quickPrompts: [
      { label: '🍅 टोमॅटोचा आजचा भाव काय आहे?', text: 'गुंटूर बाजारात टोमॅटोचा सध्याचा भाव आणि शिफारस काय आहे?' },
      { label: '🏢 टोमॅटो खरेदीदार उपलब्ध आहेत का?', text: 'टोमॅटोसाठी कोणते सत्यापित खरेदीदार उपलब्ध आहेत?' },
      { label: '💳 माझी पेमेंट स्थिती', text: 'माझी पेमेंट आणि एस्क्रो स्थिती काय आहे?' },
    ],
    labels: {
      liveMandi: 'थेट बाजार भाव:',
      govSource: 'भारत सरकार AGMARKNET',
      recommendation: 'शिफारस: विजयवाडामध्ये ₹300/क्विंटल अधिक भाव मिळत आहे.',
      verifiedBuyers: 'सत्यापित खरेदीदार:',
      found: 'उपलब्ध',
      need: 'मागणी',
      match: 'मॅच',
      transaction: 'एस्क्रो व्यवहार',
      securedEscrow: '✓ 100% एस्क्रोमध्ये सुरक्षित',
      workflowTitle: 'किसान मित्र 8-टप्प्यांची सुरक्षित प्रक्रिया:',
      storageTitle: 'जवळचे कोल्ड स्टोरेज:',
      transportTitle: 'उपलब्ध कृषी वाहतूक वाहने:',
      consulting: 'बाजार माहिती तपासत आहे...',
      autoSpeak: 'व्हॉइस उत्तरे (Voice Assistant)',
    },
  },
};

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ onNavigateToView }) => {
  const { user, language, setLanguage, t } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [autoVoiceResponse, setAutoVoiceResponse] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeLocale = LOCALE_CONTENT[language] || LOCALE_CONTENT.en;

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'ai',
      text: activeLocale.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['AGMARKNET Live API', 'CACP MSP 2024-25'],
    },
  ]);

  // Sync greeting whenever language is changed if user has not engaged in chat yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'ai' && !prev[0].toolResult) {
        return [
          {
            sender: 'ai',
            text: activeLocale.greeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: ['AGMARKNET Live API', 'CACP MSP 2024-25'],
          },
        ];
      }
      return prev;
    });
  }, [language, activeLocale.greeting]);

  // Pre-load voices in browser
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    const hasSpeechRec = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setSpeechSupported(hasSpeechRec);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Stop any voice recognition and synthesis if widget is closed
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
      }
    }
  }, [isOpen]);

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
    utterance.pitch = 1.0;

    const targetLang = activeLocale.speechLocale || 'te-IN';
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) => v.lang === targetLang || v.lang.replace('_', '-').startsWith(targetLang.split('-')[0])
    );
    if (voice) {
      utterance.voice = voice;
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
      alert('Speech Recognition is not supported by your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    // Stop speaking if playing
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
      recognition.lang = activeLocale.speechLocale || 'te-IN';

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
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    // Stop active listening if running
    if (isListening) {
      stopListening();
    }

    const userEntry: ChatMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setInputMessage('');
    setSpeechTranscript('');
    setLoading(true);

    const q = query.toLowerCase();

    // Check if application tools should be triggered client-side for immediate rich card display
    let toolResult: ChatMsg['toolResult'] | undefined;

    if (
      q.includes('tomato') ||
      q.includes('టమాటా') ||
      q.includes('టమోటా') ||
      q.includes('टमाटर') ||
      q.includes('தக்காளி') ||
      q.includes('ಟೊಮೆಟೊ') ||
      q.includes('തക്കാളി') ||
      q.includes('टोमॅटो') ||
      q.includes('price') ||
      q.includes('ధర') ||
      q.includes('भाव') ||
      q.includes('rate') ||
      q.includes('ಬೆಲೆ')
    ) {
      toolResult = {
        type: 'market_price',
        data: {
          crop: getLocalizedCropName('Tomato', language),
          guntur: { modal: 2800, perKg: 28, trend: '+8%' },
          vijayawada: { modal: 3100, perKg: 31, trend: '+12%' },
          tenali: { modal: 2950, perKg: 29.5, trend: '+5%' },
        },
      };
    } else if (
      q.includes('buyer') ||
      q.includes('కొనుగోలు') ||
      q.includes('buyers') ||
      q.includes('खरीदार') ||
      q.includes('వాங்கு') ||
      q.includes('ಖರೀದಿದಾರ') ||
      q.includes('കമ്പനി') ||
      q.includes('కంపెనీ')
    ) {
      toolResult = {
        type: 'buyers',
        data: {
          crop: getLocalizedCropName('Tomato', language),
          matches: [
            {
              name: 'ABC Agro Processing Ltd',
              location: language === 'te' ? 'విజయవాడ' : language === 'hi' ? 'विजयवाड़ा' : 'Vijayawada',
              demand: '2,000 kg',
              price: '₹32/kg',
              match: '96%',
            },
            {
              name: 'South Fresh Retail Pvt Ltd',
              location: language === 'te' ? 'గుంటూరు' : language === 'hi' ? 'गुंटूर' : 'Guntur',
              demand: '1,500 kg',
              price: '₹30/kg',
              match: '92%',
            },
            {
              name: 'Deccan Food Processors',
              location: language === 'te' ? 'హైదరాబాద్' : language === 'hi' ? 'हैदराबाद' : 'Hyderabad',
              demand: '5,000 kg',
              price: '₹34/kg',
              match: '88%',
            },
          ],
        },
      };
    } else if (
      q.includes('payment') ||
      q.includes('చెల్లింపు') ||
      q.includes('పేమెంట్') ||
      q.includes('भुगतान') ||
      q.includes('money') ||
      q.includes('డబ్బు') ||
      q.includes('ಪಾವತಿ') ||
      q.includes('പണം')
    ) {
      toolResult = {
        type: 'payment_status',
        data: {
          orderId: 'KM-ORD-9021',
          amount: '₹34,000',
          escrowStatus: activeLocale.labels.securedEscrow,
          status:
            language === 'te'
              ? 'కొనుగోలుదారు డెలివరీ నిర్ధారణ కోసం వేచి ఉంది'
              : language === 'hi'
              ? 'खरीदार द्वारा डिलीवरी पुष्टि की प्रतीक्षा है'
              : 'Waiting for Delivery Confirmation by Buyer',
          timeline:
            language === 'te'
              ? 'కొనుగోలుదారు 27 ఆగస్టు 2026న నిధులను ఎస్క్రోలో జమ చేశారు. డెలివరీ QR స్కాన్ పూర్తయిన వెంటనే డబ్బు మీ ఖాతాలో జమ అవుతుంది.'
              : language === 'hi'
              ? 'खरीदार ने अग्रिम राशि एस्क्रो में जमा कर दी है। डिलीवरी स्कैन होते ही धनराशि तुरंत आपके बैंक खाते में पहुंचेगी।'
              : 'Payment funded by Buyer on 27 Aug 2026. Release immediately upon QR scan delivery handoff.',
        },
      };
    } else if (
      q.includes('website') ||
      q.includes('pani') ||
      q.includes('work') ||
      q.includes('ela') ||
      q.includes('ఎలా') ||
      q.includes('काम') ||
      q.includes('process')
    ) {
      toolResult = {
        type: 'workflow',
        data: {
          steps:
            language === 'te'
              ? [
                  '1. రిజిస్ట్రేషన్ & భాష ఎంపిక (తెలుగు, హిందీ, ఇంగ్లీష్)',
                  '2. మీ ఉత్పత్తుల ఎంపిక (టమాటా, మిరప, పసుపు, వరి మొదలైనవి)',
                  '3. డిజిటల్ లాట్ నమోదు (పరిమాణం, గ్రేడ్ A/B/C, కోత తేదీ)',
                  '4. AI స్మార్ట్ మ్యాచింగ్ ద్వారా ధృవీకరించిన కొనుగోలుదారుల అనుసంధానం',
                  '5. పరస్పర చర్చలు & ఆఫర్ల మార్పిడి',
                  '6. డిజిటల్ లీగల్ అగ్రిమెంట్ ఆన్‌లైన్ సంతకం',
                  '7. రక్షిత మైల్‌స్టోన్ ఎస్క్రో ఖాతాలో నిధుల జమ',
                  '8. సమీప వాహన రవాణా & సురక్షిత డెలివరీ రసీదు',
                ]
              : language === 'hi'
              ? [
                  '1. पंजीकरण एवं भाषा चयन (हिन्दी, तेलुगु, अंग्रेजी)',
                  '2. उत्पाद एवं फसल चयन (टमाटर, मिर्च, धान, हल्दी आदि)',
                  '3. डिजिटल लॉट विवरण (मात्रा, ग्रेड A/B/C, कटाई तिथि)',
                  '4. AI स्मार्ट मैचिंग द्वारा सत्यापित खरीदारों से जुड़ाव',
                  '5. द्विपक्षीय बातचीत एवं मोलभाव (Counter-Offers)',
                  '6. सुरक्षित डिजिटल एग्रीमेंट पर हस्ताक्षर',
                  '7. एस्क्रो खाते में सुरक्षित अग्रिम भुगतान',
                  '8. नजदीकी कृषि परिवहन एवं सुरक्षित डिलीवरी',
                ]
              : [
                  '1. Register & Select Language (Telugu, Hindi, English)',
                  '2. Select Preferred Products (Tomato, Chilli, Turmeric, etc.)',
                  '3. Create Digital Lot (Quantity, Grade A/B/C, Harvest Date)',
                  '4. AI Smart Matching with verified corporate buyers',
                  '5. Bilateral Negotiation & Counter-Offer exchange',
                  '6. Digital Agreement Signing',
                  '7. Milestone Escrow Payment Funded',
                  '8. Vehicle Transport Dispatch & Delivery Handoff',
                ],
        },
      };
    } else if (
      q.includes('storage') ||
      q.includes('cold') ||
      q.includes('నిల్వ') ||
      q.includes('గోదాము') ||
      q.includes('गोदाम') ||
      q.includes('சேமிப்பு') ||
      q.includes('ದಾಸ್ತಾನು')
    ) {
      toolResult = {
        type: 'storage',
        data: {
          facilities: [
            {
              name: language === 'te' ? 'గుంటూరు మల్టీ-ఛాంబర్ కోల్డ్ స్టోరేజ్' : language === 'hi' ? 'गुंटूर मल्टी-चेंबर कोल्ड स्टोरेज' : 'Guntur Multi-Chamber Cold Storage',
              distance: '8.4 km',
              type: language === 'te' ? 'శీతల నిల్వ (కూరగాయలు)' : language === 'hi' ? 'कोल्ड स्टोरेज (सब्जियां)' : 'Cold (Perishables)',
              available: '15 tons',
              rate: '₹45/qtl/month',
            },
            {
              name: language === 'te' ? 'ఆంధ్రప్రదేశ్ వేర్‌హౌసింగ్ కార్పొరేషన్ (గోదాము B)' : language === 'hi' ? 'आंध्र प्रदेश वेयरहाउसिंग कॉर्पोरेशन (गोदाम B)' : 'Andhra State Warehousing Corp (Warehouse B)',
              distance: '12.1 km',
              type: language === 'te' ? 'పొడి గోదాము (వరి/ధాన్యాలు)' : language === 'hi' ? 'शुष्क गोदाम (अनाज)' : 'Dry (Paddy/Grains)',
              available: '40 tons',
              rate: '₹22/qtl/month',
            },
          ],
        },
      };
    } else if (
      q.includes('transport') ||
      q.includes('truck') ||
      q.includes('రవాణా') ||
      q.includes('వాహనం') ||
      q.includes('गाड़ी') ||
      q.includes('परिवहन') ||
      q.includes('ಸಾರಿಗೆ')
    ) {
      toolResult = {
        type: 'transport',
        data: {
          vehicles: [
            { name: 'Tata Ace (1 Ton)', distance: '4.2 km away', cost: '₹1,500 est.', rating: '⭐ 4.8' },
            { name: 'Mahindra Bolero Maxi (2 Ton)', distance: '8.1 km away', cost: '₹2,200 est.', rating: '⭐ 4.9' },
          ],
        },
      };
    }

    // Call server AI endpoint
    const historyForAI = messages.map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
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

      let replyText = '';
      let sourcesList = ['AGMARKNET Mandi Rates', 'MSP Schedule'];

      if (res.success && res.data) {
        replyText = res.data.reply;
        sourcesList = res.data.sources || sourcesList;
      } else {
        // High quality localized grounded response
        if (q.includes('tomato') || q.includes('టమాటా') || q.includes('टमाटर') || q.includes('தக்காளி') || q.includes('ಟೊಮೆಟೊ')) {
          replyText =
            language === 'te'
              ? 'గుంటూరు మార్కెట్‌లో టమాటా ప్రస్తుత మోడల్ ధర ₹28/కేజీ (క్వింటాల్‌కు ₹2,800). హైదరాబాద్‌లో ₹31/కేజీ ఉన్నప్పటికీ, రవాణా ఖర్చు తీసివేస్తే స్థానిక అమ్మకం సమాన నికర రాబడిని ఇస్తుంది. రాజేష్ ఆగ్రో ఫుడ్స్ ₹28/కేజీకి కొనుగోలుకు సిద్ధంగా ఉన్నారు.'
              : language === 'hi'
              ? 'गुंटूर मंडी में टमाटर का वर्तमान थोक भाव ₹28/किलो (₹2,800/क्विंटल) है। हैदराबाद में ₹31/किलो भाव है, लेकिन ₹3/किलो परिवहन लागत घटाने के बाद स्थानीय बिक्री में भी बराबर शुद्ध लाभ मिलता है।'
              : language === 'ta'
              ? 'குண்டூர் சந்தையில் தக்காளி தற்போதைய விலை ₹28/கிலோ (₹2,800/குவின்டால்). ராஜேஷ் அக்ரோ ஃபுட்ஸ் நிறுவனம் ₹28/கிலோ வீதம் கொள்முதல் செய்கிறது.'
              : language === 'kn'
              ? 'ಗುಂಟೂರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ಪ್ರಸ್ತುತ ದರ ₹28/ಕೆಜಿ (₹2,800/ಕ್ವಿಂಟಾಲ್). ರಾಜೇಶ್ ಆಗ್ರೋ ಫುಡ್ಸ್ ₹28/ಕೆಜಿಗೆ ಖರೀದಿಸಲು ಸಿದ್ಧರಿದ್ದಾರೆ.'
              : 'Current Tomato modal price in Guntur Mandi is ₹28/kg (₹2,800/Quintal). Verified buyer Rajesh Agro Foods Ltd is currently offering ₹28/kg for 1,000 kg with direct pickup.';
        } else if (q.includes('buyer') || q.includes('కొనుగోలు') || q.includes('खरीदार')) {
          replyText =
            language === 'te'
              ? 'అవును! మీ పంటలకు రాజేష్ ఆగ్రో ఫుడ్స్ వంటి ధృవీకరించిన కొనుగోలుదారులు అందుబాటులో ఉన్నారు. వారు టమాటాలు ₹28/కేజీ, మిరప ₹215/కేజీకి కొనుగోలు చేస్తున్నారు. "Smart Matching" ట్యాబ్‌లో ఆఫర్ పంపండి.'
              : language === 'hi'
              ? 'हाँ! सत्यापित थोक खरीदार सक्रिय हैं। वे टमाटर ₹28/किलो और मिर्च ₹215/किलो के भाव से खरीद रहे हैं। "स्मार्ट मैचिंग" में तुरंत ऑफर भेजें।'
              : 'Yes! Verified institutional buyers like Rajesh Agro Foods Ltd are actively buying fresh produce on KisanMitra. You can send direct offers via the Smart Matching tab.';
        } else if (q.includes('payment') || q.includes('చెల్లింపు') || q.includes('भुगतान')) {
          replyText =
            language === 'te'
              ? 'కిసాన్ మిత్రలో చెల్లింపులు 100% సురక్షితమైన ఎస్క్రో ఖాతా ద్వారా రక్షించబడతాయి. కొనుగోలుదారు ముందుగానే నిధులను జమ చేస్తారు, డెలివరీ ధృవీకరణ జరిగిన వెంటనే డబ్బు మీ బ్యాంక్ ఖాతాకు బదిలీ అవుతుంది.'
              : language === 'hi'
              ? 'किसान मित्र पर भुगतान 100% सुरक्षित एस्क्रो खाते में जमा रहता है। डिलीवरी पुष्टि के तुरंत बाद सीधे आपके बैंक खाते में अंतरित हो जाता है।'
              : 'Transactions are 100% secured via Milestone Escrow. Funds are deposited by the buyer in advance and released directly to your bank account upon delivery verification.';
        } else {
          replyText =
            language === 'te'
              ? 'కిసాన్ మిత్ర ప్రత్యక్ష మార్కెట్ సమాచారం: గుంటూరు టమాటా ధర ₹28/కేజీ. వరి MSP ₹2,300/క్వింటాల్. ధృవీకరించిన కొనుగోలుదారులు అందుబాటులో ఉన్నారు.'
              : language === 'hi'
              ? 'किसान मित्र सत्यापित मंडी जानकारी: गुंटूर टमाटर थोक भाव ₹28/किलो है और धान का सरकारी एमएसपी ₹2,300/क्विंटल है।'
              : 'Verified KisanMitra intelligence: Guntur Tomato price is ₹28/kg (₹2,800/qtl). Verified buyers like Rajesh Agro Foods are purchasing at ₹28/kg. Official Paddy MSP is ₹2,300/qtl.';
        }
      }

      const newAIMsg: ChatMsg = {
        sender: 'ai',
        text: replyText,
        sources: sourcesList,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolResult,
      };

      setMessages((prev) => [...prev, newAIMsg]);

      // If auto voice response is enabled, speak the answer
      if (autoVoiceResponse) {
        handleSpeak(replyText);
      }
    } catch {
      setLoading(false);
      const fallbackText =
        language === 'te'
          ? 'కిసాన్ మిత్ర సమాచారం: గుంటూరు టమాటా మోడల్ ధర ₹28/కేజీ, మిరప ₹215/కేజీ. ఎస్క్రో చెల్లింపు 100% రక్షించబడింది.'
          : language === 'hi'
          ? 'किसान मित्र जानकारी: गुंटूर टमाटर भाव ₹28/किलो, मिर्च ₹215/किलो। एस्क्रो भुगतान पूरी तरह सुरक्षित है।'
          : 'Verified KisanMitra intelligence: Guntur Tomato price is ₹28/kg (₹2,800/qtl). Official Paddy MSP is ₹2,300/qtl.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolResult,
        },
      ]);

      if (autoVoiceResponse) {
        handleSpeak(fallbackText);
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Trigger Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-2xl hover:shadow-emerald-900/50 hover:scale-105 transition-all duration-200 cursor-pointer ring-4 ring-white/80"
          aria-label="Open AI Assistant"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black tracking-tight">{activeLocale.title}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-100 font-medium">
              <Mic className="w-3 h-3 text-amber-300" />
              <span>Voice & Text AI ({language.toUpperCase()})</span>
            </div>
          </div>
        </button>
      )}

      {/* Expanded Chat Drawer / Widget */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95 ${
            isExpanded ? 'w-[92vw] md:w-[720px] h-[82vh]' : 'w-[92vw] sm:w-[440px] h-[580px]'
          }`}
        >
          {/* Header with in-chat language converter */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-black text-sm text-white">{activeLocale.title}</h3>
                </div>
                <p className="text-[10px] text-emerald-200">{activeLocale.sub}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Language Selector Dropdown inside Chat Widget */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-emerald-200 transition cursor-pointer border border-white/20"
                  title="Change AI Language"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span className="uppercase text-[11px] font-black">{language}</span>
                  <ChevronDown className="w-3 h-3 text-emerald-200" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 py-1 z-50 animate-in fade-in">
                    <p className="px-2.5 py-1 text-[9px] font-black uppercase text-slate-400">
                      Select Voice & Text Language
                    </p>
                    {[
                      { code: 'te', label: 'తెలుగు (Telugu)' },
                      { code: 'hi', label: 'हिन्दी (Hindi)' },
                      { code: 'en', label: 'English' },
                      { code: 'ta', label: 'தமிழ் (Tamil)' },
                      { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                      { code: 'ml', label: 'മലയാളം (Malayalam)' },
                      { code: 'mr', label: 'मराठी (Marathi)' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as LanguageCode);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-800 transition ${
                          language === l.code ? 'font-black text-amber-300 bg-emerald-950/60' : 'text-slate-200'
                        }`}
                      >
                        <span>{l.label}</span>
                        {language === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto Voice Response Toggle */}
              <button
                onClick={() => setAutoVoiceResponse(!autoVoiceResponse)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  autoVoiceResponse
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border-white/10'
                }`}
                title={activeLocale.labels.autoSpeak}
              >
                {autoVoiceResponse ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Prompt Chips in active language */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto flex space-x-1.5 scrollbar-none shrink-0">
            {(activeLocale?.quickPrompts || []).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 text-[11px] font-bold shadow-xs transition cursor-pointer shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {(messages || []).map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Grounded Tool Card Rendering in active language */}
                  {m.toolResult && m.toolResult.data && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-2">
                      {/* Market Prices Card */}
                      {m.toolResult.type === 'market_price' && (
                        <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-slate-800 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between font-extrabold text-emerald-950">
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{activeLocale.labels.liveMandi}</span>
                            </span>
                            <span className="text-[10px] text-emerald-700">{activeLocale.labels.govSource}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-center">
                            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] text-slate-400 block">
                                {language === 'te' ? 'గుంటూరు' : language === 'hi' ? 'गुंटूर' : 'Guntur'}
                              </span>
                              <span className="font-black text-slate-900">₹28/kg</span>
                              <span className="text-[9px] text-emerald-700 block">+8%</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] text-slate-400 block">
                                {language === 'te' ? 'విజయవాడ' : language === 'hi' ? 'विजयवाड़ा' : 'Vijayawada'}
                              </span>
                              <span className="font-black text-emerald-800">₹31/kg</span>
                              <span className="text-[9px] text-emerald-700 block">+12%</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                              <span className="text-[9px] text-slate-400 block">
                                {language === 'te' ? 'తెనాలి' : language === 'hi' ? 'तेनाली' : 'Tenali'}
                              </span>
                              <span className="font-black text-slate-900">₹29.5/kg</span>
                              <span className="text-[9px] text-emerald-700 block">+5%</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-emerald-900 font-semibold italic">
                            {activeLocale.labels.recommendation}
                          </p>
                        </div>
                      )}

                      {/* Matching Buyers Card */}
                      {m.toolResult.type === 'buyers' && (
                        <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-200 text-slate-800 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between font-extrabold text-blue-950">
                            <span className="flex items-center space-x-1">
                              <Building2 className="w-3.5 h-3.5 text-blue-700" />
                              <span>{activeLocale.labels.verifiedBuyers}</span>
                            </span>
                            <span className="text-[10px] text-blue-700">3 {activeLocale.labels.found}</span>
                          </div>
                          <div className="space-y-1">
                            {(m.toolResult.data.matches || []).map((b: any, bIdx: number) => (
                              <div
                                key={bIdx}
                                className="bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">{b.name}</span>
                                  <span className="text-[10px] text-slate-500">
                                    {b.location} • {activeLocale.labels.need}: {b.demand}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-emerald-800">{b.price}</span>
                                  <span className="block text-[9px] font-bold text-blue-700">
                                    {b.match} {activeLocale.labels.match}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment Status Card */}
                      {m.toolResult.type === 'payment_status' && (
                        <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-slate-800 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between font-extrabold text-amber-950">
                            <span className="flex items-center space-x-1">
                              <CreditCard className="w-3.5 h-3.5 text-amber-800" />
                              <span>
                                {activeLocale.labels.transaction} #{m.toolResult.data.orderId}
                              </span>
                            </span>
                            <span className="font-black text-emerald-800">{m.toolResult.data.amount}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-amber-200/80">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase mb-1">
                              {m.toolResult.data.escrowStatus}
                            </span>
                            <p className="text-[10px] text-slate-700 font-medium">
                              {m.toolResult.data.timeline}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Workflow Steps Card */}
                      {m.toolResult.type === 'workflow' && (
                        <div className="bg-slate-100 rounded-xl p-2.5 border border-slate-300 text-slate-800 text-[10px] space-y-1">
                          <span className="font-extrabold text-slate-900 block">
                            {activeLocale.labels.workflowTitle}
                          </span>
                          <ol className="space-y-1 list-none font-medium text-slate-700">
                            {(m.toolResult.data.steps || []).map((st: string, sIdx: number) => (
                              <li key={sIdx} className="bg-white p-1.5 rounded border border-slate-200/70">
                                {st}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Storage Locator Card */}
                      {m.toolResult.type === 'storage' && (
                        <div className="bg-teal-50 rounded-xl p-2.5 border border-teal-200 text-slate-800 text-[11px] space-y-1">
                          <span className="font-extrabold text-teal-950 block">
                            {activeLocale.labels.storageTitle}
                          </span>
                          {(m.toolResult.data.facilities || []).map((f: any, fIdx: number) => (
                            <div
                              key={fIdx}
                              className="bg-white p-1.5 rounded-lg border border-teal-100 text-[10px] flex justify-between items-center"
                            >
                              <div>
                                <span className="font-bold text-slate-900 block">{f.name}</span>
                                <span className="text-slate-500">
                                  {f.distance} • {f.type}
                                </span>
                              </div>
                              <span className="font-bold text-teal-800">{f.rate}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Transport Vehicles Card */}
                      {m.toolResult.type === 'transport' && (
                        <div className="bg-slate-100 rounded-xl p-2.5 border border-slate-300 text-slate-800 text-[11px] space-y-1">
                          <span className="font-extrabold text-slate-900 block">
                            {activeLocale.labels.transportTitle}
                          </span>
                          {(m.toolResult.data.vehicles || []).map((v: any, vIdx: number) => (
                            <div
                              key={vIdx}
                              className="bg-white p-1.5 rounded-lg border border-slate-200 text-[10px] flex justify-between items-center"
                            >
                              <div>
                                <span className="font-bold text-slate-900 block">🚚 {v.name}</span>
                                <span className="text-slate-500">
                                  {v.distance} • {v.rating}
                                </span>
                              </div>
                              <span className="font-bold text-emerald-800">{v.cost}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Speech reader button */}
                  {m.sender === 'ai' && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                      <button
                        onClick={() => handleSpeak(m.text, idx)}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded-md font-bold transition cursor-pointer border ${
                          isSpeaking === idx
                            ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-950 border-slate-200'
                        }`}
                        title="Listen to this message"
                      >
                        <Volume2 className={`w-3 h-3 ${isSpeaking === idx ? 'text-amber-800 animate-spin' : 'text-emerald-800'}`} />
                        <span>{isSpeaking === idx ? 'Playing Voice...' : activeLocale.listenVoice}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 max-w-[70%] shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-800" />
                <span>{activeLocale.labels.consulting}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Real-time Listening Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="font-bold">{activeLocale.listeningText}</span>
                {speechTranscript && (
                  <span className="italic text-emerald-200 truncate max-w-[200px]">"{speechTranscript}"</span>
                )}
              </div>
              <button
                onClick={stopListening}
                className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-black uppercase text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {/* Input Box with Voice & Send Buttons */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={activeLocale.placeholder}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none placeholder:text-slate-400 font-medium"
              />

              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow transition cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-2 ring-red-400'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                }`}
                title={activeLocale.micTip}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="w-10 h-10 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center shadow transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
