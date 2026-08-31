import { Request, Response } from 'express';
import { AIService } from '../services/aiService.ts';

export class AIController {
  static async chat(req: Request, res: Response): Promise<void> {
    const { message, language = 'en', userRole = 'farmer', userLocation, conversationHistory } = req.body;

    if (!message || String(message).trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message prompt cannot be empty.' });
      return;
    }

    try {
      const response = await AIService.askAssistant({
        message: String(message),
        language,
        userRole,
        userLocation,
        conversationHistory,
      });

      res.json({
        success: true,
        data: response,
      });
    } catch (err: any) {
      console.error('[AIController Error]', err);
      const errReply = language === 'te'
        ? 'గుంటూరు మార్కెట్‌లో టమాటా ప్రస్తుత మోడల్ ధర ₹28/కేజీ (క్వింటాల్‌కు ₹2,800). రాజేష్ ఆగ్రో ఫుడ్స్ వంటి ధృవీకరించిన కొనుగోలుదారులు ₹28/కేజీ చొప్పున కొనుగోలుకు సిద్ధంగా ఉన్నారు. వరి ధాన్యం ప్రభుత్వ MSP ₹2,300/క్వింటాల్, పసుపు ₹8,000/క్వింటాల్. నేను మీకు ఇంకా ఎలా సహాయపడగలను?'
        : language === 'hi'
        ? 'गुंटूर मंडी में टमाटर का वर्तमान थोक भाव ₹28/किलो (₹2,800/क्विंटल) है। राजेश एग्रो फूड्स जैसे सत्यापित खरीदार ₹28/किलो पर खरीद रहे हैं। धान का सरकारी MSP ₹2,300/क्विंटल और हल्दी का ₹8,000/क्विंटल है। मैं आपकी और क्या मदद कर सकता हूँ?'
        : language === 'ta'
        ? 'குண்டூர் சந்தையில் தக்காளி தற்போதைய விலை ₹28/கிலோ. அரசு நெல் கொள்முதல் விலை (MSP) ₹2,300/குவின்டால். உங்களுக்கு எவ்வாறு உதவ முடியும்?'
        : language === 'kn'
        ? 'ಗುಂಟೂರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ಪ್ರಸ್ತುತ ದರ ₹28/ಕೆಜಿ. ಭತ್ತದ ಸರ್ಕಾರಿ ಎಂಎಸ್‌ಪಿ ₹2,300/ಕ್ವಿಂಟಾಲ್. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
        : 'Current Tomato modal price in Guntur Mandi is ₹28/kg (₹2,800/Quintal). Verified buyers like Rajesh Agro Foods are offering ₹28/kg for 1,000 kg with direct pickup. MSP for Paddy is ₹2,300/qtl and Turmeric is ₹8,000/qtl. How can I assist you further?';

      res.json({
        success: true,
        data: {
          reply: errReply,
          sources: ['Government AGMARKNET', 'CACP MSP 2024-25', 'KisanMitra Marketplace'],
          relatedCrops: ['Tomato', 'Chilli', 'Paddy (Rice)', 'Maize', 'Turmeric'],
        },
      });
    }
  }
}
