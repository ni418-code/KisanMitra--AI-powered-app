import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { getLocalizedCropName, LanguageCode } from '../services/translations.ts';
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  TrendingDown,
  Sparkles,
  MapPin,
  Truck,
  Warehouse,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const L10N_PREFIX = 'PROFIT_';

const LOCAL_TEXT: Record<LanguageCode, Record<string, string>> = {
  en: {
    badge: 'AI Powered Net-in-Pocket Decision Engine',
    header: 'Profit & Sale Window',
    desc: 'Never sell at the nearest market blindly. Calculate real in-pocket return after deducting transport and storage costs across 5 competing Mandis.',
    bestSaleWindow: 'Best Sale Window',
    nextDays: 'Next 2 - 4 Days',
    bestReturn: 'Vijayawada Mandi • +₹5,400 higher return',
    parameters: 'Lot & Cultivation Cost Parameters',
    cropName: 'Crop Name',
    quantityKg: 'Quantity (in Kilograms)',
    productionCost: 'Production Cost (₹/kg)',
    coldStorageHold: 'Cold Storage Hold (Days)',
    comparisonTitle: 'Net In-Pocket Return Comparison Across Nearby Mandis',
    comparisonDesc: 'Ranked dynamically by total net profit after deducting fuel/transit & cold storage expenses.',
    totalLot: 'Total Lot:',
    mandiMarket: 'Mandi Market',
    distance: 'Distance',
    modalPrice: 'Modal Price (₹/kg)',
    transitCost: 'Transit Cost',
    grossValue: 'Gross Value',
    totalExpenses: 'Total Expenses',
    netProfit: 'Net Profit (₹)',
    marketTrend: 'Market Trend',
    topNet: 'TOP NET',
    highDemand: '↗ High Demand',
    heavyArrivals: '↘ Heavy Arrivals',
    steady: '→ Steady',
    optimalTiming: 'Optimal Timing & Mandi Recommendation',
    dispatchTo: 'Dispatch to Vijayawada Wholesale Yard within 48 Hours',
    recommendationBody: 'Vijayawada offers ₹3.5/kg higher price than local Guntur. Even after ₹1.8/kg additional transport costs, you earn a <strong>net additional profit of ₹3,400</strong> on this 2,000 kg lot.',
    insight1: 'Tomato arrivals in Vijayawada are 18% lower than average due to rain in northern districts.',
    insight2: 'Hyderabad offers highest gross, but the 275 km haul creates ₹4.5/kg fuel & spoilage drag.',
    storageHoldTitle: 'Cold Storage Hold vs Sell Decision',
    storageBody: 'Holding perishable crops like Tomato beyond 7 days in cold storage costs ~₹0.08/kg/day with 4% weight loss risk.',
    sellImmediately: 'Sell Immediately',
    zeroStorage: 'Zero storage risk',
    hold14: 'Hold 14 Days',
    storageCostLabel: '-₹2,240 storage cost',
    recommendLabel: 'Recommendation:',
    recommendSell: 'Sell immediately.',
    recommendBody: 'Price upside does not compensate for cold storage & moisture shrinkage risk.',
    distanceKm: 'km',
  },
  te: {
    badge: 'AI ఆధారిత నికర-జేబు నిర్ణయ ఇంజిన్',
    header: 'లాభం & అమ్మకపు సమయం',
    desc: 'సమీప మార్కెట్‌లో జరిగిన ధరలను గుడ్డిగా నమ్మవద్దు. రవాణా మరియు నిల్వ ఖర్చులు తీసివేసిన తర్వాత 5 మండీలలో వాస్తవ నికర రాబడిని లెక్కించండి.',
    bestSaleWindow: 'అత్యుత్తమ అమ్మకపు సమయం',
    nextDays: 'తర్వాత 2 - 4 రోజులు',
    bestReturn: 'విజయవాడ మండీ • +₹5,400 ఎక్కువ రాబడి',
    parameters: 'లాట్ & సాగు ఖర్చు పారామితులు',
    cropName: 'పంట పేరు',
    quantityKg: 'పరిమాణం (కిలోగ్రాములలో)',
    productionCost: 'ఉత్పత్తి ఖర్చు (₹/కేజీ)',
    coldStorageHold: 'కోల్డ్ స్టోరేజ్ హోల్డ్ (రోజులు)',
    comparisonTitle: 'సమీప మండీలలో నికర-జేబు రాబడి పోలిక',
    comparisonDesc: 'ఇంధనం/రవాణా & కోల్డ్ స్టోరేజ్ ఖర్చులను తీసివేసిన తర్వాత మొత్తం నికర లాభం ద్వారా ర్యాంక్.',
    totalLot: 'మొత్తం లాట్:',
    mandiMarket: 'మండీ మార్కెట్',
    distance: 'దూరం',
    modalPrice: 'సగటు ధర (₹/కేజీ)',
    transitCost: 'రవాణా ఖర్చు',
    grossValue: 'స్థూల విలువ',
    totalExpenses: 'మొత్తం ఖర్చులు',
    netProfit: 'నికర లాభం (₹)',
    marketTrend: 'మార్కెట్ ధోరణి',
    topNet: 'అత్యుత్తమ నికర',
    highDemand: '↗ అధిక డిమాండ్',
    heavyArrivals: '↘ భారీ దస్తులు',
    steady: '→ స్థిరం',
    optimalTiming: 'అత్యుత్తమ సమయం & మండీ సిఫార్సు',
    dispatchTo: 'విజయవాడ హోల్‌సేల్ యార్డుకు 48 గంటల్లో పంపండి',
    recommendationBody: 'విజయవాడ స్థానిక గుంటూరు కంటే ₹3.5/కేజీ ఎక్కువ ధర ఇస్తోంది. అదనంగా ₹1.8/కేజీ రవాణా ఖర్చు ఉన్నా, ఈ 2,000 కేజీ లాట్‌పై <strong>₹3,400 అదనపు నికర లాభం</strong> లభిస్తుంది.',
    insight1: 'విజయవాడలో టమోటా దస్తులు వర్షం కారణంగా సగటు కంటే 18% తక్కువగా ఉన్నాయి.',
    insight2: 'హైదరాబాద్ అత్యధిక స్థూల ధర ఇచ్చినా, 275 కి.మీ. ప్రయాణం ₹4.5/కేజీ ఇంధనం మరియు పాడు నష్టం కలిగిస్తుంది.',
    storageHoldTitle: 'కోల్డ్ స్టోరేజ్ హోల్డ్ vs అమ్మకం నిర్ణయం',
    storageBody: 'టమోటా వంటి పెళుసుగా ఉండే పంటలను 7 రోజుల పాటు కోల్డ్ స్టోరేజీలో ఉంచితే రోజుకు ~₹0.08/కేజీతో 4% బరువు తగ్గే ప్రమాదం.',
    sellImmediately: 'వెంటనే అమ్మండి',
    zeroStorage: 'స్టోరేజ్ ప్రమాదం లేదు',
    hold14: '14 రోజులు ఉంచండి',
    storageCostLabel: '-₹2,240 స్టోరేజ్ ఖర్చు',
    recommendLabel: 'సిఫార్సు:',
    recommendSell: 'వెంటనే అమ్మండి.',
    recommendBody: 'ధరల పెరుగుదల కోల్డ్ స్టోరేజ్ & తేమ నష్ట ప్రమాదాలను భర్తీ చేయదు.',
    distanceKm: 'కి.మీ.',
  },
  hi: {
    badge: 'AI-संचालित नेट-इन-पॉकेट निर्णय इंजन',
    header: 'मुनाफा व बिक्री समय',
    desc: 'कभी भी निकटतम मंडी में अंधाधुंध न बेचें। परिवहन और भंडारण लागत घटाकर 5 प्रतिस्पर्धी मंडियों में वास्तविक नेट रिटर्न की गणना करें।',
    bestSaleWindow: 'बेहतरीन बिक्री समय',
    nextDays: 'अगले 2 - 4 दिन',
    bestReturn: 'विजयवाड़ा मंडी • +₹5,400 अधिक रिटर्न',
    parameters: 'लॉट व खेती लागत पैरामीटर',
    cropName: 'फसल का नाम',
    quantityKg: 'मात्रा (किलोग्राम में)',
    productionCost: 'उत्पादन लागत (₹/kg)',
    coldStorageHold: 'कोल्ड स्टोरेज होल्ड (दिन)',
    comparisonTitle: 'आस-पास की मंडियों में नेट-इन-पॉकेट रिटर्न तुलना',
    comparisonDesc: 'ईंधन/परिवहन व कोल्ड स्टोरेज खर्च घटाकर कुल नेट लाभ से गतिशील रूप से रैंक किया गया।',
    totalLot: 'कुल लॉट:',
    mandiMarket: 'मंडी बाजार',
    distance: 'दूरी',
    modalPrice: 'औसत भाव (₹/kg)',
    transitCost: 'परिवहन लागत',
    grossValue: 'सकल मूल्य',
    totalExpenses: 'कुल खर्च',
    netProfit: 'शुद्ध लाभ (₹)',
    marketTrend: 'बाजार रुझान',
    topNet: 'टॉप नेट',
    highDemand: '↗ उच्च मांग',
    heavyArrivals: '↘ भारी आवक',
    steady: '→ स्थिर',
    optimalTiming: 'इष्टतम समय व मंडी सिफारिश',
    dispatchTo: 'विजयवाड़ा थोक यार्ड को 48 घंटे में भेजें',
    recommendationBody: 'विजयवाड़ा स्थानीय गुंटूर से ₹3.5/किलो अधिक कीमत देता है। ₹1.8/किलो अतिरिक्त परिवहन लागत के बाद भी इस 2,000 किलो लॉट पर आपको <strong>₹3,400 अतिरिक्त नेट लाभ</strong> मिलता है।',
    insight1: 'उत्तर जिलों में बारिश के कारण विजयवाड़ा में टमाटर आवक औसत से 18% कम है।',
    insight2: 'हैदराबाद सबसे अधिक सकल देता है, लेकिन 275 किमी की ढुलाई ₹4.5/किलो ईंधन व खराबी ड्रैग बनाती है।',
    storageHoldTitle: 'कोल्ड स्टोरेज होल्ड बनाम बिक्री निर्णय',
    storageBody: 'टमाटर जैसी जल्दी खराब होने वाली फसल को 7 दिन से अधिक कोल्ड स्टोरेज में रखने पर ~₹0.08/किलो/दिन खर्च और 4% वजन घटने का जोखिम है।',
    sellImmediately: 'तुरंत बेचें',
    zeroStorage: 'शून्य भंडारण जोखिम',
    hold14: '14 दिन रखें',
    storageCostLabel: '-₹2,240 भंडारण लागत',
    recommendLabel: 'सिफारिश:',
    recommendSell: 'तुरंत बेचें।',
    recommendBody: 'मूल्य वृद्धि कोल्ड स्टोरेज और नमी सिकुड़न जोखिम की भरपाई नहीं करती।',
    distanceKm: 'किमी',
  },
  ta: {
    badge: 'AI இயங்கும் நிகர-பாக்கெட் முடிவு இயந்திரம்',
    header: 'லாபம் & விற்பனை நேரம்',
    desc: 'அருகில் உள்ள சந்தையில் கண்மூடித்தனமாக விற்காதீர்கள். போக்குவரத்து மற்றும் சேமிப்பு செலவுகளை கழித்து 5 போட்டி சந்தைகளில் உண்மையான நிகர லாபத்தை கணக்கிடுங்கள்.',
    bestSaleWindow: 'சிறந்த விற்பனை நேரம்',
    nextDays: 'அடுத்த 2 - 4 நாட்கள்',
    bestReturn: 'விஜயவாடா சந்தை • +₹5,400 அதிக லாபம்',
    parameters: 'லாட் & விவசாய செலவு அளவுருக்கள்',
    cropName: 'பயிர் பெயர்',
    quantityKg: 'அளவு (கிலோகிராமில்)',
    productionCost: 'உற்பத்தி செலவு (₹/kg)',
    coldStorageHold: 'குளிர்சேமிப்பு வைப்பு (நாட்கள்)',
    comparisonTitle: 'அருகிலுள்ள சந்தைகளில் நிகர-பாக்கெட் லாப ஒப்பீடு',
    comparisonDesc: 'எரிபொருள்/போக்குவரத்து & குளிர்சேமிப்பு செலவுகளை கழித்து மொத்த நிகர லாபத்தால் அடுக்கப்பட்டது.',
    totalLot: 'மொத்த லாட்:',
    mandiMarket: 'சந்தை',
    distance: 'தூரம்',
    modalPrice: 'சராசரி விலை (₹/kg)',
    transitCost: 'போக்குவரத்து செலவு',
    grossValue: 'மொத்த மதிப்பு',
    totalExpenses: 'மொத்த செலவுகள்',
    netProfit: 'நிகர லாபம் (₹)',
    marketTrend: 'சந்தை போக்கு',
    topNet: 'சிறந்த நிகர',
    highDemand: '↗ அதிக தேவை',
    heavyArrivals: '↘ அதிக வருகை',
    steady: '→ நிலையானது',
    optimalTiming: 'சிறந்த நேரம் & சந்தை பரிந்துரை',
    dispatchTo: 'விஜயவாடா மொத்த யார்டுக்கு 48 மணி நேரத்தில் அனுப்பவும்',
    recommendationBody: 'விஜயவாடா உள்ளூர் குண்டூரை விட ₹3.5/கிலோ அதிக விலை தருகிறது. ₹1.8/கிலோ கூடுதல் போக்குவரத்து செலவு இருந்தாலும், இந்த 2,000 கிலோ லாட்டில் <strong>₹3,400 கூடுதல் நிகர லாபம்</strong> பெறுவீர்கள்.',
    insight1: 'வட மாவட்டங்களில் மழையால் விஜயவாடாவில் தக்காளி வருகை சராசரியை விட 18% குறைவு.',
    insight2: 'ஹைதராபாத் அதிக மொத்த லாபம் தந்தாலும், 275 கி.மீ பயணம் ₹4.5/கிலோ எரிபொருள் & கெட்டுப்போகும் இழப்பை ஏற்படுத்துகிறது.',
    storageHoldTitle: 'குளிர்சேமிப்பு வைப்பு vs விற்பனை முடிவு',
    storageBody: 'தக்காளி போன்ற விரைவில் கெடும் பயிர்களை 7 நாட்களுக்கு மேல் குளிர்சேமிப்பில் வைத்தால் ~₹0.08/கிலோ/நாள் செலவும் 4% எடை இழப்பும் ஏற்படும்.',
    sellImmediately: 'உடனே விற்கவும்',
    zeroStorage: 'சேமிப்பு ஆபத்து இல்லை',
    hold14: '14 நாட்கள் வைக்கவும்',
    storageCostLabel: '-₹2,240 சேமிப்பு செலவு',
    recommendLabel: 'பரிந்துரை:',
    recommendSell: 'உடனே விற்கவும்.',
    recommendBody: 'விலை உயர்வு குளிர்சேமிப்பு மற்றும் ஈரப்பத சுருக்கம் ஆபத்தை ஈடுசெய்யாது.',
    distanceKm: 'கி.மீ',
  },
  kn: {
    badge: 'AI ಚಾಲಿತ ನಿವ್ವಳ-ಪಾಕೆಟ್ ನಿರ್ಧಾರ ಎಂಜಿನ್',
    header: 'ಲಾಭ & ಮಾರಾಟ ಸಮಯ',
    desc: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಕುರುಡಾಗಿ ಮಾರಬೇಡಿ. ಸಾರಿಗೆ ಮತ್ತು ಶೇಖರಣಾ ವೆಚ್ಚಗಳನ್ನು ಕಳೆದ ನಂತರ 5 ಸ್ಪರ್ಧಾತ್ಮಕ ಮಂಡಿಗಳಲ್ಲಿ ನಿಜವಾದ ನಿವ್ವಳ ಆದಾಯವನ್ನು ಲೆಕ್ಕಹಾಕಿ.',
    bestSaleWindow: 'ಉತ್ತಮ ಮಾರಾಟ ಸಮಯ',
    nextDays: 'ಮುಂದಿನ 2 - 4 ದಿನಗಳು',
    bestReturn: 'ವಿಜಯವಾಡ ಮಂಡಿ • +₹5,400 ಹೆಚ್ಚಿನ ಆದಾಯ',
    parameters: 'ಲಾಟ್ & ಕೃಷಿ ವೆಚ್ಚ ನಿಯತಾಂಕಗಳು',
    cropName: 'ಬೆಳೆಯ ಹೆಸರು',
    quantityKg: 'ಪ್ರಮಾಣ (ಕಿಲೋಗ್ರಾಂಗಳಲ್ಲಿ)',
    productionCost: 'ಉತ್ಪಾದನಾ ವೆಚ್ಚ (₹/ಕೆಜಿ)',
    coldStorageHold: 'ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಹೋಲ್ಡ್ (ದಿನಗಳು)',
    comparisonTitle: 'ಹತ್ತಿರದ ಮಂಡಿಗಳಲ್ಲಿ ನಿವ್ವಳ-ಪಾಕೆಟ್ ಆದಾಯ ಹೋಲಿಕೆ',
    comparisonDesc: 'ಇಂಧನ/ಸಾರಿಗೆ & ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ವೆಚ್ಚಗಳನ್ನು ಕಳೆದ ನಂತರ ಒಟ್ಟು ನಿವ್ವಳ ಲಾಭದಿಂದ ಗತಿಶೀಲವಾಗಿ ಶ್ರೇಣೀಕರಿಸಲಾಗಿದೆ.',
    totalLot: 'ಒಟ್ಟು ಲಾಟ್:',
    mandiMarket: 'ಮಂಡಿ ಮಾರುಕಟ್ಟೆ',
    distance: 'ದೂರ',
    modalPrice: 'ಸರಾಸರಿ ಬೆಲೆ (₹/ಕೆಜಿ)',
    transitCost: 'ಸಾರಿಗೆ ವೆಚ್ಚ',
    grossValue: 'ಒಟ್ಟು ಮೌಲ್ಯ',
    totalExpenses: 'ಒಟ್ಟು ವೆಚ್ಚಗಳು',
    netProfit: 'ನಿವ್ವಳ ಲಾಭ (₹)',
    marketTrend: 'ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ',
    topNet: 'ಅತ್ಯುತ್ತಮ ನಿವ್ವಳ',
    highDemand: '↗ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ',
    heavyArrivals: '↘ ಭಾರೀ ಆಗಮನ',
    steady: '→ ಸ್ಥಿರ',
    optimalTiming: 'ಉತ್ತಮ ಸಮಯ & ಮಂಡಿ ಶಿಫಾರಸು',
    dispatchTo: 'ವಿಜಯವಾಡ ಸಗಟು ಯಾರ್ಡ್‌ಗೆ 48 ಗಂಟೆಗಳಲ್ಲಿ ಕಳುಹಿಸಿ',
    recommendationBody: 'ವಿಜಯವಾಡ ಸ್ಥಳೀಯ ಗುಂಟೂರಿಗಿಂತ ₹3.5/ಕೆಜಿ ಹೆಚ್ಚಿನ ಬೆಲೆ ನೀಡುತ್ತದೆ. ₹1.8/ಕೆಜಿ ಹೆಚ್ಚುವರಿ ಸಾರಿಗೆ ವೆಚ್ಚದ ನಂತರವೂ, ಈ 2,000 ಕೆಜಿ ಲಾಟ್‌ನಲ್ಲಿ <strong>₹3,400 ಹೆಚ್ಚುವರಿ ನಿವ್ವಳ ಲಾಭ</strong> ಪಡೆಯುತ್ತೀರಿ.',
    insight1: 'ಉತ್ತರ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಮಳೆಯಿಂದ ವಿಜಯವಾಡದಲ್ಲಿ ಟೊಮೆಟೊ ಆಗಮನ ಸರಾಸರಿಗಿಂತ 18% ಕಡಿಮೆ.',
    insight2: 'ಹೈದರಾಬಾದ್ ಅತಿ ಹೆಚ್ಚು ಸ್ಥೂಲ ನೀಡಿದರೂ, 275 ಕಿ.ಮೀ ಪ್ರಯಾಣ ₹4.5/ಕೆಜಿ ಇಂಧನ & ಹಾಳಾಗುವ ನಷ್ಟ ಉಂಟುಮಾಡುತ್ತದೆ.',
    storageHoldTitle: 'ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಹೋಲ್ಡ್ vs ಮಾರಾಟ ನಿರ್ಧಾರ',
    storageBody: 'ಟೊಮೆಟೊ ಮುಂತಾದ ಬೇಗ ಕೆಡುವ ಬೆಳೆಗಳನ್ನು 7 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್‌ನಲ್ಲಿ ಇಟ್ಟರೆ ~₹0.08/ಕೆಜಿ/ದಿನ ವೆಚ್ಚ ಮತ್ತು 4% ತೂಕ ನಷ್ಟದ ಅಪಾಯ.',
    sellImmediately: 'ತಕ್ಷಣ ಮಾರಾಟ',
    zeroStorage: 'ಶೇಖರಣಾ ಅಪಾಯವಿಲ್ಲ',
    hold14: '14 ದಿನ ಇಡಿ',
    storageCostLabel: '-₹2,240 ಶೇಖರಣಾ ವೆಚ್ಚ',
    recommendLabel: 'ಶಿಫಾರಸು:',
    recommendSell: 'ತಕ್ಷಣ ಮಾರಾಟ.',
    recommendBody: 'ಬೆಲೆ ಏರಿಕೆ ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಮತ್ತು ತೇವಾಂಶ ನಷ್ಟ ಅಪಾಯವನ್ನು ಸರಿದೂಗಿಸುವುದಿಲ್ಲ.',
    distanceKm: 'ಕಿ.ಮೀ',
  },
  ml: {
    badge: 'AI പ്രവർത്തിപ്പിക്കുന്ന നെറ്റ്-ഇൻ-പോക്കറ്റ് തീരുമാന എഞ്ചിൻ',
    header: 'ലാഭവും വിൽപന സമയവും',
    desc: 'അടുത്തുള്ള മാർക്കറ്റിൽ അന്ധമായി വിൽക്കരുത്. ഗതാഗത, സംഭരണ ചെലവുകൾ കഴിച്ച് 5 മത്സരിക്കുന്ന മാർക്കറ്റുകളിൽ യഥാർത്ഥ നെറ്റ് റിട്ടേൺ കണക്കാക്കുക.',
    bestSaleWindow: 'മികച്ച വിൽപന സമയം',
    nextDays: 'അടുത്ത 2 - 4 ദിവസം',
    bestReturn: 'വിജയവാഡ മാർക്കറ്റ് • +₹5,400 ഉയർന്ന റിട്ടേൺ',
    parameters: 'ലോട്ട് & കൃഷി ചെലവ് പാരാമീറ്ററുകൾ',
    cropName: 'വിളയുടെ പേര്',
    quantityKg: 'അളവ് (കിലോഗ്രാമിൽ)',
    productionCost: 'ഉൽപാദന ചെലവ് (₹/കിലോ)',
    coldStorageHold: 'കോൾഡ് സ്റ്റോറേജ് ഹോൾഡ് (ദിവസം)',
    comparisonTitle: 'സമീപ മാർക്കറ്റുകളിലെ നെറ്റ്-ഇൻ-പോക്കറ്റ് റിട്ടേൺ താരതമ്യം',
    comparisonDesc: 'ഇന്ധന/ഗതാഗത & കോൾഡ് സ്റ്റോറേജ് ചെലവുകൾ കഴിച്ച് മൊത്തം നെറ്റ് ലാഭം അനുസരിച്ച് റാങ്ക്.',
    totalLot: 'ആകെ ലോട്ട്:',
    mandiMarket: 'മാർക്കറ്റ്',
    distance: 'ദൂരം',
    modalPrice: 'ശരാശരി വില (₹/കിലോ)',
    transitCost: 'ഗതാഗത ചെലവ്',
    grossValue: 'മൊത്ത മൂല്യം',
    totalExpenses: 'ആകെ ചെലവുകൾ',
    netProfit: 'നെറ്റ് ലാഭം (₹)',
    marketTrend: 'മാർക്കറ്റ് പ്രവണത',
    topNet: 'മികച്ച നെറ്റ്',
    highDemand: '↗ ഉയർന്ന ഡിമാൻഡ്',
    heavyArrivals: '↘ ഭാരമേറിയ വരവ്',
    steady: '→ സ്ഥിരം',
    optimalTiming: 'മികച്ച സമയം & മാർക്കറ്റ് ശുപാർശ',
    dispatchTo: 'വിജയവാഡ മൊത്ത യാർഡിലേക്ക് 48 മണിക്കൂറിനുള്ളിൽ അയയ്ക്കുക',
    recommendationBody: 'വിജയവാഡ പ്രാദേശിക ഗുണ്ടൂരിനേക്കാൾ ₹3.5/കിലോ ഉയർന്ന വില നൽകുന്നു. ₹1.8/കിലോ അധിക ഗതാഗത ചെലവ് ഉണ്ടായിട്ടും, 2,000 കിലോ ലോട്ടിൽ <strong>₹3,400 അധിക നെറ്റ് ലാഭം</strong> നേടുന്നു.',
    insight1: 'വടക്കൻ ജില്ലകളിൽ മഴ കാരണം വിജയവാഡയിൽ തക്കാളി വരവ് ശരാശരിയേക്കാൾ 18% കുറവ്.',
    insight2: 'ഹൈദരാബാദ് ഏറ്റവും ഉയർന്ന മൊത്തം നൽകുന്നു, പക്ഷേ 275 കി.മീ. യാത്ര ₹4.5/കിലോ ഇന്ധന, കേടുപാട് നഷ്ടം സൃഷ്ടിക്കുന്നു.',
    storageHoldTitle: 'കോൾഡ് സ്റ്റോറേജ് ഹോൾഡ് vs വിൽപന തീരുമാനം',
    storageBody: 'തക്കാളി പോലുള്ള പെട്ടെന്ന് കേടാകുന്ന വിളകൾ 7 ദിവസത്തിൽ കൂടുതൽ കോൾഡ് സ്റ്റോറേജിൽ സൂക്ഷിച്ചാൽ ~₹0.08/കിലോ/ദിവസം ചെലവും 4% ഭാരം നഷ്ടമാകാനുള്ള അപകടവും.',
    sellImmediately: 'ഉടൻ വിൽക്കുക',
    zeroStorage: 'സംഭരണ അപകടമില്ല',
    hold14: '14 ദിവസം സൂക്ഷിക്കുക',
    storageCostLabel: '-₹2,240 സംഭരണ ചെലവ്',
    recommendLabel: 'ശുപാർശ:',
    recommendSell: 'ഉടൻ വിൽക്കുക.',
    recommendBody: 'വില ഉയർച്ച കോൾഡ് സ്റ്റോറേജ്, ഈർപ്പം ചുരുങ്ങൽ അപകടങ്ങളെ നികത്തുന്നില്ല.',
    distanceKm: 'കി.മീ',
  },
  mr: {
    badge: 'AI चालवलेले नेट-इन-पॉकेट निर्णय इंजिन',
    header: 'नफा आणि विक्री वेळ',
    desc: 'जवळच्या बाजारात आंधळेपणाने विकू नका. वाहतूक आणि साठवणूक खर्च वजा करून 5 स्पर्धात्मक मंड्यांमध्ये वास्तविक निव्वळ परतावा मोजा.',
    bestSaleWindow: 'उत्तम विक्री वेळ',
    nextDays: 'पुढील 2 - 4 दिवस',
    bestReturn: 'विजयवाडा मंडी • +₹5,400 जास्त परतावा',
    parameters: 'लॉट & पीक खर्च पॅरामीटर्स',
    cropName: 'पिकाचे नाव',
    quantityKg: 'प्रमाण (किलोग्रॅममध्ये)',
    productionCost: 'उत्पादन खर्च (₹/किलो)',
    coldStorageHold: 'कोल्ड स्टोरेज होल्ड (दिवस)',
    comparisonTitle: 'जवळच्या मंड्यांमध्ये निव्वळ-पॉकेट परतावा तुलना',
    comparisonDesc: 'इंधन/वाहतूक & कोल्ड स्टोरेज खर्च वजा करून एकूण निव्वळ नफ्यानुसार गतिमान रँक.',
    totalLot: 'एकूण लॉट:',
    mandiMarket: 'मंडी बाजार',
    distance: 'अंतर',
    modalPrice: 'सरासरी भाव (₹/किलो)',
    transitCost: 'वाहतूक खर्च',
    grossValue: 'एकूण मूल्य',
    totalExpenses: 'एकूण खर्च',
    netProfit: 'निव्वळ नफा (₹)',
    marketTrend: 'बाजार कल',
    topNet: 'टॉप नेट',
    highDemand: '↗ उच्च मागणी',
    heavyArrivals: '↘ जास्त आवक',
    steady: '→ स्थिर',
    optimalTiming: 'इष्टतम वेळ & मंडी शिफारस',
    dispatchTo: 'विजयवाडा घाऊक यार्डकडे 48 तासांत पाठवा',
    recommendationBody: 'विजयवाडा स्थानिक गुंटूरपेक्षा ₹3.5/किलो जास्त भाव देतो. ₹1.8/किलो अतिरिक्त वाहतूक खर्चानंतरही या 2,000 किलो लॉटवर <strong>₹3,400 अतिरिक्त निव्वळ नफा</strong> मिळतो.',
    insight1: 'उत्तर जिल्ह्यांत पावसामुळे विजयवाडा टोमॅटो आवक सरासरीपेक्षा 18% कमी आहे.',
    insight2: 'हैदराबाद सर्वाधिक एकूण देतो, पण 275 किमी प्रवास ₹4.5/किलो इंधन व खराबी नुकसान आणतो.',
    storageHoldTitle: 'कोल्ड स्टोरेज होल्ड vs विक्री निर्णय',
    storageBody: 'टोमॅटोसारखे लवकर खराब होणारे पीक 7 दिवसांपेक्षा जास्त कोल्ड स्टोरेजमध्ये ठेवल्यास ~₹0.08/किलो/दिवस खर्च आणि 4% वजन कमी होण्याचा धोका.',
    sellImmediately: 'लगेच विका',
    zeroStorage: 'साठवणुकीचा धोका नाही',
    hold14: '14 दिवस ठेवा',
    storageCostLabel: '-₹2,240 साठवणूक खर्च',
    recommendLabel: 'शिफारस:',
    recommendSell: 'लगेच विका.',
    recommendBody: 'किंमत वाढ कोल्ड स्टोरेज व ओलावा घटण्याचा धोका भरून काढत नाही.',
    distanceKm: 'किमी',
  },
};

export const ProfitAndSaleWindowView: React.FC = () => {
  const { user, language, t } = useAuth();
  const text = LOCAL_TEXT[language] || LOCAL_TEXT.en;
  const L = (key: string) => text[key] ?? key;

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [quantityKg, setQuantityKg] = useState<number>(2000);
  const [costOfCultivationPerKg, setCostOfCultivationPerKg] = useState<number>(12);
  const [holdingDays, setHoldingDays] = useState<number>(0);

  const cropOptions = ['Tomato', 'Onion', 'Paddy (Rice)', 'Chilli', 'Maize'];

  const CROP_DEFAULTS: Record<string, { basePrice: number; defaultCost: number }> = {
    'Tomato': { basePrice: 28, defaultCost: 12 },
    'Onion': { basePrice: 26, defaultCost: 11 },
    'Paddy (Rice)': { basePrice: 25, defaultCost: 14 },
    'Paddy': { basePrice: 25, defaultCost: 14 },
    'Chilli': { basePrice: 195, defaultCost: 85 },
    'Maize': { basePrice: 24, defaultCost: 13 },
  };

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    const defaults = CROP_DEFAULTS[crop] || { basePrice: 28, defaultCost: 12 };
    setCostOfCultivationPerKg(defaults.defaultCost);
  };

  const cropBase = (CROP_DEFAULTS[selectedCrop] || { basePrice: 28 }).basePrice;

  // Mandi comparison data with distances and dynamic price offsets
  const mandis = [
    { name: 'Guntur APMC Mandi', district: 'Guntur, AP', distanceKm: 14, modalPricePerKg: cropBase, transitCostPerKg: 0.8, trend: 'up', arrivalVolume: 'Moderate', demandLevel: 'High' },
    { name: 'Vijayawada Wholesale Yard', district: 'Krishna, AP', distanceKm: 42, modalPricePerKg: cropBase * 1.12, transitCostPerKg: 1.8, trend: 'up', arrivalVolume: 'Low', demandLevel: 'Very High' },
    { name: 'Tenali Fruit & Veg Market', district: 'Guntur, AP', distanceKm: 28, modalPricePerKg: cropBase * 1.04, transitCostPerKg: 1.2, trend: 'stable', arrivalVolume: 'Normal', demandLevel: 'Moderate' },
    { name: 'Hyderabad Bowenpally', district: 'Hyderabad, TS', distanceKm: 275, modalPricePerKg: cropBase * 1.25, transitCostPerKg: 4.5, trend: 'up', arrivalVolume: 'High', demandLevel: 'High' },
    { name: 'Ongole Agriculture Market', district: 'Prakasam, AP', distanceKm: 110, modalPricePerKg: cropBase * 0.96, transitCostPerKg: 2.6, trend: 'down', arrivalVolume: 'Heavy', demandLevel: 'Low' },
  ];

  const storageCostPerKgPerDay = 0.08;
  const totalStorageCost = quantityKg * holdingDays * storageCostPerKgPerDay;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{L('badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{L('header')}</h1>
          <p className="text-sm text-slate-300 max-w-xl">{L('desc')}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-300 block">{L('bestSaleWindow')}</span>
          <span className="text-xl font-black text-white block mt-0.5">{L('nextDays')}</span>
          <span className="text-[10px] text-emerald-300 font-semibold">{L('bestReturn')}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-emerald-800" />
          <span>{L('parameters')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{L('cropName')}</label>
            <select value={selectedCrop} onChange={(e) => handleCropChange(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              {cropOptions.map((crop) => <option key={crop} value={crop}>{getLocalizedCropName(crop, language)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{L('quantityKg')}</label>
            <input type="number" value={quantityKg} onChange={(e) => setQuantityKg(Number(e.target.value) || 0)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none" min="100" step="100" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{L('productionCost')}</label>
            <input type="number" value={costOfCultivationPerKg} onChange={(e) => setCostOfCultivationPerKg(Number(e.target.value) || 0)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none" min="1" step="0.5" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{L('coldStorageHold')}</label>
            <input type="number" value={holdingDays} onChange={(e) => setHoldingDays(Number(e.target.value) || 0)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none" min="0" max="60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900">{L('comparisonTitle')}</h2>
            <p className="text-xs text-slate-500">{L('comparisonDesc')}</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">{L('totalLot')} {quantityKg.toLocaleString('en-IN')} kg</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{L('mandiMarket')}</th>
                <th className="py-3 px-4">{L('distance')}</th>
                <th className="py-3 px-4">{L('modalPrice')}</th>
                <th className="py-3 px-4">{L('transitCost')}</th>
                <th className="py-3 px-4">{L('grossValue')}</th>
                <th className="py-3 px-4">{L('totalExpenses')}</th>
                <th className="py-3 px-4 font-black text-slate-900">{L('netProfit')}</th>
                <th className="py-3 px-4">{L('marketTrend')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mandis
                .map((m) => {
                  const gross = quantityKg * m.modalPricePerKg;
                  const transitTotal = quantityKg * m.transitCostPerKg;
                  const productionTotal = quantityKg * costOfCultivationPerKg;
                  const totalExpenses = transitTotal + productionTotal + totalStorageCost;
                  const netProfit = gross - totalExpenses;
                  const netPerKg = netProfit / quantityKg;
                  return { ...m, gross, transitTotal, totalExpenses, netProfit, netPerKg };
                })
                .sort((a, b) => b.netProfit - a.netProfit)
                .map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={idx} className={isTop ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {isTop && <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-black uppercase">{L('topNet')}</span>}
                          <span className="font-bold text-slate-900">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.district}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{m.distanceKm} {L('distanceKm')}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{m.modalPricePerKg.toFixed(1)}/kg</td>
                      <td className="py-3 px-4 text-slate-600">₹{m.transitCostPerKg.toFixed(1)}/kg (₹{m.transitTotal.toLocaleString('en-IN')})</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">₹{m.gross.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-rose-700 font-medium">-₹{m.totalExpenses.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-black ${m.netProfit > 0 ? 'text-emerald-800' : 'text-rose-700'}`}>₹{m.netProfit.toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] text-slate-500 font-normal">(₹{m.netPerKg.toFixed(1)} net/kg)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${m.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : m.trend === 'down' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                          {m.trend === 'up' ? L('highDemand') : m.trend === 'down' ? L('heavyArrivals') : L('steady')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">{L('optimalTiming')}</h3>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <h4 className="font-black text-emerald-950 text-base">{L('dispatchTo')}</h4>
            <p className="text-xs text-emerald-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: L('recommendationBody') }} />
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" /><span>{L('insight1')}</span></li>
            <li className="flex items-start space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" /><span>{L('insight2')}</span></li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <Warehouse className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">{L('storageHoldTitle')}</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <p>{L('storageBody')}</p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{L('sellImmediately')}</span>
                <span className="text-lg font-black text-emerald-800 block">₹{((quantityKg * 31.5) - (quantityKg * costOfCultivationPerKg)).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500">{L('zeroStorage')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{L('hold14')}</span>
                <span className="text-lg font-black text-slate-700 block">₹{((quantityKg * 32.8) - (quantityKg * costOfCultivationPerKg) - totalStorageCost).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-amber-700 font-semibold">{L('storageCostLabel')}</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{L('recommendLabel')} <strong>{L('recommendSell')}</strong> {L('recommendBody')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
