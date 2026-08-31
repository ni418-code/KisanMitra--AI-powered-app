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
   * Update Profile & Bank Details
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      name,
      phone,
      location,
      preferredLanguage,
      preferredCrops,
      farmSizeAcres,
      businessType,
      bankDetails,
    } = req.body;

    const currentBank = req.user.bankDetails || {};
    const updatedBank = bankDetails
      ? {
          accountHolderName: bankDetails.accountHolderName ?? currentBank.accountHolderName ?? req.user.name,
          bankName: bankDetails.bankName ?? currentBank.bankName ?? 'State Bank of India',
          branchName: bankDetails.branchName ?? currentBank.branchName ?? '',
          accountNumber: bankDetails.accountNumber ?? currentBank.accountNumber ?? '',
          ifscCode: (bankDetails.ifscCode ?? currentBank.ifscCode ?? '').toUpperCase(),
          upiId: bankDetails.upiId ?? currentBank.upiId ?? '',
          accountType: bankDetails.accountType ?? currentBank.accountType ?? 'savings',
          isVerified: true,
        }
      : currentBank;

    const updated = dataStore.updateUser(req.user.id, {
      name: name || req.user.name,
      phone: phone || req.user.phone,
      location: location ? { ...req.user.location, ...location } : req.user.location,
      preferredLanguage: preferredLanguage || req.user.preferredLanguage,
      preferredCrops: preferredCrops || req.user.preferredCrops,
      farmSizeAcres: farmSizeAcres !== undefined ? farmSizeAcres : req.user.farmSizeAcres,
      businessType: businessType !== undefined ? businessType : req.user.businessType,
      bankDetails: updatedBank,
    });

    res.json({
      success: true,
      message: 'Profile and bank account details updated successfully.',
      data: {
        user: updated,
      },
    });
  }

  /**
   * Buyer / User Wallet Deposit (Simulated Payment)
   */
  static async walletDeposit(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { amount, method = 'upi', referenceNote } = req.body;
    const depositAmt = Number(amount);

    if (isNaN(depositAmt) || depositAmt <= 0) {
      res.status(400).json({ success: false, message: 'Please enter a valid deposit amount (min ₹1).' });
      return;
    }

    const currentBal = req.user.walletBalance || 0;
    const newBal = currentBal + depositAmt;

    const updatedUser = dataStore.updateUser(req.user.id, {
      walletBalance: newBal,
    });

    const txId = `tx-${Date.now()}`;
    const refCode = `DEP_${method.toUpperCase()}_${Math.floor(100000 + Math.random() * 900000)}`;

    const tx = dataStore.addWalletTransaction({
      id: txId,
      userId: req.user.id,
      type: 'deposit',
      amount: depositAmt,
      description: referenceNote || `Escrow Wallet Deposit via ${method.toUpperCase()}`,
      method: method as any,
      status: 'completed',
      referenceId: refCode,
      createdAt: new Date().toISOString(),
    });

    // Notify user
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: req.user.id,
      title: 'Funds Added to Escrow Wallet',
      message: `₹${depositAmt.toLocaleString('en-IN')} successfully deposited into your KisanMitra Escrow Wallet. Ref: ${refCode}`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `₹${depositAmt.toLocaleString('en-IN')} deposited successfully to your Escrow Wallet.`,
      data: {
        user: updatedUser,
        transaction: tx,
      },
    });
  }

  /**
   * Farmer / User Wallet Withdrawal to Bank / UPI
   */
  static async walletWithdraw(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { amount, method = 'bank_transfer', payoutDetails } = req.body;
    const withdrawAmt = Number(amount);

    const availableWithdrawable = req.user.withdrawableBalance ?? req.user.walletBalance ?? 0;

    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      res.status(400).json({ success: false, message: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (withdrawAmt > availableWithdrawable) {
      res.status(400).json({
        success: false,
        message: `Insufficient withdrawable balance. Available: ₹${availableWithdrawable.toLocaleString('en-IN')}`,
      });
      return;
    }

    const currentBal = req.user.walletBalance || 0;
    const newWithdrawable = Math.max(0, availableWithdrawable - withdrawAmt);
    const newWallet = Math.max(0, currentBal - withdrawAmt);

    const updatedUser = dataStore.updateUser(req.user.id, {
      walletBalance: newWallet,
      withdrawableBalance: newWithdrawable,
    });

    const txId = `tx-${Date.now()}`;
    const utr = `IMPS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(100000 + Math.random() * 900000)}`;

    const bankInfo = req.user.bankDetails;
    const destText = method === 'upi'
      ? `UPI ID ${payoutDetails?.upiId || bankInfo?.upiId || req.user.phone + '@upi'}`
      : `${bankInfo?.bankName || 'Bank'} A/C: ••••${(bankInfo?.accountNumber || '6194').slice(-4)} (IFSC: ${bankInfo?.ifscCode || 'SBIN0001248'})`;

    const tx = dataStore.addWalletTransaction({
      id: txId,
      userId: req.user.id,
      type: 'withdrawal',
      amount: withdrawAmt,
      description: `Instant Payout to ${destText}`,
      method: method as any,
      status: 'completed',
      referenceId: utr,
      createdAt: new Date().toISOString(),
    });

    // Notify farmer
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: req.user.id,
      title: 'Withdrawal Processed Successfully',
      message: `₹${withdrawAmt.toLocaleString('en-IN')} has been sent to your ${destText}. UTR: ${utr}`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `₹${withdrawAmt.toLocaleString('en-IN')} withdrawn successfully. Funds transferred via instant IMPS/UPI. UTR: ${utr}`,
      data: {
        user: updatedUser,
        transaction: tx,
        utr,
      },
    });
  }

  /**
   * Get User Wallet & Escrow Transactions
   */
  static async getWalletTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const transactions = dataStore.getWalletTransactions(req.user.id);

    res.json({
      success: true,
      data: {
        transactions,
        total: transactions.length,
        walletBalance: req.user.walletBalance || 0,
        withdrawableBalance: req.user.withdrawableBalance ?? req.user.walletBalance ?? 0,
        escrowLockedBalance: req.user.escrowLockedBalance || 0,
      },
    });
  }
}
