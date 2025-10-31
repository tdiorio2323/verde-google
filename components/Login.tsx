import React, { useState, useEffect } from 'react';
import { User, Brand } from '../types';

interface LoginProps {
  onLogin: (user: User, brand: Brand) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sign up form states
  const [brandName, setBrandName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
        // This is a placeholder for actual sign-up logic
        alert(`Sign-up submitted for:\nBrand: ${brandName}\nEmail: ${email}\nInstagram: ${instagram}\nPhone: ${phone}`);
        return;
    }
    
    setIsSubmitting(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      let userBrand: Brand | null = null;
      let success = false;

      if (vipCode === '420') {
        userBrand = Brand.CANNA_CONNECT;
        success = true;
      } else if (vipCode === '1111') {
        userBrand = Brand.LONG_MONEY_EXOTICS;
        success = true;
      }

      if (success && userBrand) {
        const mockUser: User = {
          id: `${vipCode}-user`,
          email: email || `${vipCode}@user.com`,
          name: email ? email.split('@')[0] : (userBrand === Brand.LONG_MONEY_EXOTICS ? 'LME Member' : 'VIP User'),
        };
        onLogin(mockUser, userBrand);
      } else {
        setError('Invalid VIP Code. Please try again.');
        setVipCode('');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleVipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only numbers and enforce max length
    if (/^\d*$/.test(value) && value.length <= 4) {
      setVipCode(value);
    }
  };

  const commonInputClass = "appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-400 text-white rounded-lg bg-white/10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white relative">
      <div className="max-w-md w-full rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <img src="https://i.imgur.com/JxVSoD0.png" alt="CannaConnect Logo" className="mx-auto h-48 w-auto" />
          <p className="mt-6 text-lg text-gray-400">
            Unlock Exclusive Access to the Portal
          </p>
        </div>

        <div className="flex justify-center p-1 bg-base-300/50 rounded-full">
            <button
                onClick={() => setIsSignUp(false)}
                className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${!isSignUp ? 'bg-primary text-secondary shadow-md' : 'text-gray-300'}`}
            >
                Sign In
            </button>
            <button
                onClick={() => setIsSignUp(true)}
                className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${isSignUp ? 'bg-primary text-secondary shadow-md' : 'text-gray-300'}`}
            >
                Sign Up
            </button>
        </div>

        {isSignUp ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input name="brandName" type="text" placeholder="Brand Name" value={brandName} onChange={e => setBrandName(e.target.value)} className={commonInputClass} required />
            <input name="instagram" type="text" placeholder="Instagram URL/Username" value={instagram} onChange={e => setInstagram(e.target.value)} className={commonInputClass} />
            <input name="email" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} required />
            <input name="phone" type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className={commonInputClass} />
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-secondary bg-primary hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary disabled:bg-gray-600 transition-colors duration-300">
              Sign Up
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input id="email-address" name="email" type="email" autoComplete="email" className={commonInputClass} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input id="password" name="password" type="password" autoComplete="current-password" className={commonInputClass} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <hr className="border-white/20" />
            <div>
              <input
                id="vip-code"
                name="vip-code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                className={`${commonInputClass} text-center tracking-[0.5em] h-[50px] placeholder:tracking-normal`}
                placeholder="VIP CODE"
                value={vipCode}
                onChange={handleVipCodeChange}
                maxLength={4}
                aria-label="Enter VIP Code"
              />
              {error && <p className="mt-2 text-sm text-red-400 text-center animate-pulse">{error}</p>}
            </div>
            <div>
              <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-secondary bg-primary hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary disabled:bg-gray-600 transition-colors duration-300">
                {isSubmitting ? 'Authenticating...' : 'Enter Portal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
