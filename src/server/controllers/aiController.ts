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
      res.status(500).json({
        success: false,
        message: 'AI Assistant temporarily unavailable. Please try again in a moment.',
        code: 'AI_ERROR',
      });
    }
  }
}
