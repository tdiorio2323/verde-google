import React, { useState, useEffect } from 'react';
import { User, Brand } from '../types';

interface LoginProps {
  onLogin: (user: User, brand: Brand) => void;
  onAdminLogin: () => void;
}

const AdminKeypad: React.FC<{ onLogin: () => void, onError: (msg: string) => void }> = ({ onLogin, onError }) => {
  const [code, setCode] = useState('');
  const correctCode = '420';

  useEffect(() => {
    if (code.length === correctCode.length) {
      if (code === correctCode) {
        onLogin();
      } else {
        onError('Invalid Admin Code');
        setTimeout(() => setCode(''), 500);
      }
    }
  }, [code, onLogin, onError, correctCode.length]);

  const handleKeyPress = (key: string) => {
    if (code.length < correctCode.length) {
      setCode(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-full max-w-xs flex items-center justify-center bg-base-100/50 rounded-lg border border-white/20">
        <p className="text-white text-3xl tracking-[0.5em]">
          {code.split('').map(() => '•').join('')}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {keys.map(key => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="aspect-square flex items-center justify-center text-3xl font-bold text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            {key}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="aspect-square flex items-center justify-center text-lg font-bold text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200"
          aria-label="Backspace"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
          </svg>
        </button>
        <button
          onClick={() => handleKeyPress('0')}
          className="aspect-square flex items-center justify-center text-3xl font-bold text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          0
        </button>
        <div/>
      </div>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin, onAdminLogin }) => {
  const [currentTab, setCurrentTab] = useState<'signIn' | 'admin'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      let userBrand: Brand | null = null;
      let success = false;

      if (vipCode === '1111') {
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
          <img src="https://i.imgur.com/KFNttyw.jpeg" alt="Long Money Exotics Logo" className="mx-auto h-48 w-auto" />
          <p className="mt-6 text-lg text-gray-400">
            Shop with Long Money Exotics
          </p>
        </div>

        <div className="flex justify-center p-1 bg-base-300/50 rounded-full">
            <button
                onClick={() => setCurrentTab('signIn')}
                className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${currentTab === 'signIn' ? 'bg-primary text-secondary shadow-md' : 'text-gray-300'}`}
            >
                Sign In
            </button>
            <button
                onClick={() => setCurrentTab('admin')}
                className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${currentTab === 'admin' ? 'bg-primary text-secondary shadow-md' : 'text-gray-300'}`}
            >
                ADMIN
            </button>
        </div>

        {error && <p className="mt-2 text-sm text-red-400 text-center animate-pulse">{error}</p>}
        
        {currentTab === 'admin' ? (
           <AdminKeypad onLogin={onAdminLogin} onError={setError} />
        ) : (
          <form className="space-y-6" onSubmit={handleUserSubmit}>
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