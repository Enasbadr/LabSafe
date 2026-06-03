/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { ARABIC_DICTIONARY } from '../data';
import { AppLogo } from './AppLogo';

interface LoginProps {
  onSignIn: (email: string) => void;
  isArabic: boolean;
}

export default function Login({ onSignIn, isArabic }: LoginProps) {
  const [email, setEmail] = useState('researcher@lab.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState('');

  const dict = isArabic ? ARABIC_DICTIONARY : {
    appName: "LabSafe",
    tagline: "Secure access to laboratory safety protocols and progress.",
    emailLabel: "Institutional Email",
    passLabel: "Password",
    forgot: "Forgot?",
    signIn: "Sign In",
    createAccount: "Create Account",
    continueGuest: "Continue as Guest",
    ecrNote: "End-to-end encrypted connection"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorText(isArabic ? 'الرجاء إدخال بريد إلكتروني صالح للمؤسسة' : 'Please enter a valid institutional email');
      return;
    }
    if (password.length < 4) {
      setErrorText(isArabic ? 'كلمة المرور يجب أن لا تقل عن 4 رموز' : 'Password must be at least 4 characters');
      return;
    }
    onSignIn(email);
  };

  const handleGuest = () => {
    onSignIn('guest@labsafe.edu');
  };

  return (
    <div id="login-screen-outer" className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-lg overflow-hidden relative border border-slate-100">
        
        {/* Top Accent Strip */}
        <div className="h-2 w-full bg-[#00478d]"></div>

        <div className="p-8">
          
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <AppLogo size={72} className="mb-4" />
            <h1 className="text-2xl font-black font-headline-lg text-[#00478d]">
              {dict.appName}
            </h1>
            <p className="text-slate-500 text-xs text-center mt-1.5 leading-relaxed max-w-[280px]">
              {dict.tagline}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5" htmlFor="email-input">
                {dict.emailLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorText('');
                  }}
                  placeholder="researcher@lab.edu"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-250 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00478d] focus:border-[#00478d] transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="password-input">
                  {dict.passLabel}
                </label>
                <a href="#forgot" className="text-[10px] font-bold text-[#00478d] hover:underline" onClick={(e) => e.preventDefault()}>
                  {dict.forgot}
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorText('');
                  }}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-250 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00478d] focus:border-[#00478d] transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorText && (
              <p id="auth-error-hint" className="text-rose-600 text-xs font-medium animate-pulse">{errorText}</p>
            )}

            {/* Sign In Button */}
            <button
              id="sign-in-btn"
              type="submit"
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-md font-bold text-white bg-[#00478d] hover:bg-[#005db6] transition-all active:scale-[0.98] cursor-pointer text-sm gap-2"
            >
              <span>{dict.signIn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-450 tracking-wider">Or</span>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="space-y-2.5">
            <button
              id="create-account-btn"
              type="button"
              onClick={handleGuest}
              className="w-full flex items-center justify-center py-3 px-4 border-2 border-[#00478d] rounded-xl font-bold text-[#00478d] bg-transparent hover:bg-[#00478d]/5 transition-all text-xs cursor-pointer"
            >
              {dict.createAccount}
            </button>
            <button
              id="guest-login-btn"
              type="button"
              onClick={handleGuest}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-xs cursor-pointer"
            >
              {dict.continueGuest}
            </button>
          </div>

        </div>

        {/* Bottom security note */}
        <div className="bg-[#f0f3ff] p-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{dict.ecrNote}</span>
        </div>

      </div>
    </div>
  );
}
