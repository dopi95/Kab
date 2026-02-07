'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password-reset/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('OTP sent to your email!');
        setStep(2);
        setCountdown(60);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password-reset/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('OTP resent to your email!');
        setCountdown(60);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password-reset/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('OTP verified!');
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password-reset/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Password reset successfully!');
        setTimeout(() => router.push('/signin'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#171817] dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 1 && 'Enter your email to receive OTP'}
              {step === 2 && 'Enter the OTP sent to your email'}
              {step === 3 && 'Create a new password'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-sm">
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-[#A97E50] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A97E50] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#A97E50] to-[#C4A86D] text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a href="/signin" className="text-[#A97E50] dark:text-[#C4A86D] hover:underline">
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
