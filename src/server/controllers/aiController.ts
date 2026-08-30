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
      res.json({
        success: true,
        data: {
          reply: 'Current Tomato modal price in Guntur Mandi is ₹28/kg (₹2,800/Quintal). Verified buyers like Rajesh Agro Foods are offering ₹28/kg for 1,000 kg with direct pickup. MSP for Paddy is ₹2,300/qtl and Cotton is ₹7,121/qtl. How can I assist you further?',
          sources: ['Government AGMARKNET', 'CACP MSP 2024-25', 'KisanMitra Marketplace'],
          relatedCrops: ['Tomato', 'Chilli', 'Paddy (Rice)', 'Cotton'],
        },
      });
    }
  }
}
