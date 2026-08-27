import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { signToken, AuthenticatedRequest } from '../middleware/auth.ts';
import { User, UserRole } from '../../types/index.ts';

// In-memory rate-limited OTP storage for simulated OTP dispatch
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

export class AuthController {
  /**
   * Request OTP for phone login / registration
   */
  static async sendOTP(req: Request, res: Response): Promise<void> {
    const { phone, role = 'farmer' } = req.body;
    if (!phone || String(phone).trim().length < 10) {
      res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number.', code: 'INVALID_PHONE' });
      return;
    }

    const cleanPhone = String(phone).trim().replace(/\D/g, '').slice(-10);

    // Rate limiting: allow new OTP after 30 seconds
    const existing = otpStore.get(cleanPhone);
    if (existing && Date.now() < existing.expiresAt - 4.5 * 60 * 1000) {
      res.status(429).json({
        success: false,
        message: 'OTP already requested recently. Please wait a moment.',
        code: 'TOO_MANY_REQUESTS',
      });
      return;
    }

    // Generate 6-digit OTP (for testing ease, demo phones 9876543210 / 9123456780 / 9999999999 or default 123456)
    const code = cleanPhone === '9876543210' || cleanPhone === '9123456780' || cleanPhone === '9999999999' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanPhone, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
      attempts: 0,
    });

    console.log(`[Auth] OTP for ${cleanPhone} is: ${code}`);

    res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}. (Use code ${code} for verification)`,
      data: {
        phone: cleanPhone,
        expiresInSeconds: 300,
        // Include simulated code for immediate convenience in sandbox preview
        demoCode: code,
      },
    });
  }

  /**
   * Verify OTP and log in / create user account
   */
  static async verifyOTP(req: Request, res: Response): Promise<void> {
    const { phone, otp, role = 'farmer', name, location, preferredLanguage = 'en' } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ success: false, message: 'Phone number and OTP are required.', code: 'MISSING_FIELDS' });
      return;
    }

    const cleanPhone = String(phone).trim().replace(/\D/g, '').slice(-10);
    const stored = otpStore.get(cleanPhone);

    // Check if code matches (accept 123456 or generated code)
    const isValid = (stored && stored.code === String(otp).trim() && Date.now() <= stored.expiresAt) || String(otp).trim() === '123456';

    if (!isValid) {
      if (stored) stored.attempts += 1;
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please check the code or request a new one.',
        code: 'INVALID_OTP',
      });
      return;
    }

    // OTP verified: find or create user
    let user = dataStore.getUserById(cleanPhone);

    if (!user) {
      const isFarmer = role === 'farmer';
      const count = dataStore.users.filter((u) => u.role === role).length + 1;
      const prefix = isFarmer ? 'KM-F' : role === 'buyer' ? 'KM-B' : 'KM-A';
      const userId = `${prefix}-${String(count).padStart(6, '0')}`;

      const newUser: User = {
        id: `usr-${Date.now()}`,
        userId,
        name: name || (isFarmer ? `Farmer ${cleanPhone.slice(-4)}` : `Buyer ${cleanPhone.slice(-4)}`),
        phone: cleanPhone,
        role: (role as UserRole) || 'farmer',
        location: location || {
          state: isFarmer ? 'Andhra Pradesh' : 'Telangana',
          district: isFarmer ? 'Guntur' : 'Hyderabad',
          market: isFarmer ? 'Guntur Mandi' : 'Bowenpally Market',
          village: isFarmer ? 'Prathipadu' : '',
          address: '',
        },
        preferredLanguage: preferredLanguage || 'en',
        preferredCrops: req.body.preferredCrops || ['Tomato', 'Chilli'],
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      user = dataStore.addUser(newUser);
    } else {
      if (name) user.name = name;
      if (role) user.role = role as UserRole;
      if (location) user.location = { ...user.location, ...location };
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (req.body.preferredCrops) user.preferredCrops = req.body.preferredCrops;
    }

    // Clear used OTP
    otpStore.delete(cleanPhone);

    const token = signToken(user);

    res.json({
      success: true,
      message: 'Login successful. Welcome to Kisan Mitra!',
      data: {
        token,
        user,
      },
    });
  }

  /**
   * Direct Switch / Quick Login for Demo Testing
   */
  static async demoLogin(req: Request, res: Response): Promise<void> {
    const { role } = req.body;
    let targetUser: User | undefined;

    if (role === 'farmer') {
      targetUser = dataStore.getUserById('usr-1');
    } else if (role === 'buyer') {
      targetUser = dataStore.getUserById('usr-2');
    } else if (role === 'admin') {
      targetUser = dataStore.getUserById('usr-3');
    }

    if (!targetUser) {
      targetUser = dataStore.users[0];
    }

    const token = signToken(targetUser);

    res.json({
      success: true,
      message: `Signed in as ${targetUser.name} (${targetUser.role.toUpperCase()})`,
      data: {
        token,
        user: targetUser,
      },
    });
  }

  /**
   * Get Current Authenticated Profile
   */
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }

  /**
   * Update Profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, location, preferredLanguage, farmSizeAcres, businessType } = req.body;
    const updated = dataStore.updateUser(req.user.id, {
      name: name || req.user.name,
      location: location || req.user.location,
      preferredLanguage: preferredLanguage || req.user.preferredLanguage,
      farmSizeAcres: farmSizeAcres !== undefined ? farmSizeAcres : req.user.farmSizeAcres,
      businessType: businessType !== undefined ? businessType : req.user.businessType,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: updated,
      },
    });
  }
}
