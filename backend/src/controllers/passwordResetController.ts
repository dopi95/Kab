import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import OTP from '../models/OTP';
const SibApiV3Sdk = require('@sendinblue/client');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt });

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = 'Password Reset OTP - Kab Creative Lab';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #A97E50;">Password Reset Request</h2>
        <p>You requested to reset your password. Use the OTP below to proceed:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #A97E50;">
          ${otp}
        </div>
        <p style="color: #666;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;
    sendSmtpEmail.sender = { name: 'Kab Creative Lab', email: process.env.BREVO_EMAIL?.trim() };
    sendSmtpEmail.to = [{ email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};
