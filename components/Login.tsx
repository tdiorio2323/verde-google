import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { BackspaceIcon } from './Icons';

interface KeypadProps {
    onKeyPress: (key: string) => void;
    onDelete: () => void;
    onClose: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete, onClose }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'];

  const handleKeyClick = (key: string) => {
    if (key === 'DEL') {
      onDelete();
    } else if (key !== '') {
      onKeyPress(key);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
        <div className="w-full bg-base-300/90 p-4 rounded-t-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-3 gap-2">
                {keys.map((key, index) => (
                    <button
                        key={index}
                        onClick={() => handleKeyClick(key)}
                        className="py-4 text-2xl font-bold text-white bg-base-200/80 rounded-lg hover:bg-primary hover:text-secondary focus:bg-primary focus:text-secondary transition-colors duration-200 disabled:opacity-0 disabled:pointer-events-none focus:outline-none"
                        disabled={key === ''}
                        aria-label={key === 'DEL' ? 'Delete' : `Number ${key}`}
                    >
                        {key === 'DEL' ? <BackspaceIcon className="w-8 h-8 mx-auto" /> : key}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
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
      if (vipCode === '420') {
        const mockUser: User = {
          id: 'vipuser',
          email: email || 'vip@user.com',
          name: email ? email.split('@')[0] : 'VIP User',
        };
        onLogin(mockUser);
      } else {
        setError('Invalid VIP Code. Please try again.');
        setVipCode('');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleKeypadKeyPress = (key: string) => {
    if (vipCode.length < 3) {
      setVipCode(prev => prev + key);
    }
  };

  const handleKeypadDelete = () => {
    setVipCode(prev => prev.slice(0, -1));
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
              <div id="vip-code" onClick={() => setShowKeypad(true)} className="cursor-pointer relative block w-full px-4 py-3 border border-white/20 text-white rounded-lg bg-white/10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-center tracking-[0.5em] h-[50px] flex items-center justify-center" aria-label="Enter VIP Code">
                {vipCode ? vipCode.replace(/./g, '●') : <span className="text-gray-400 normal-case tracking-normal">VIP CODE</span>}
              </div>
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
      {showKeypad && <Keypad onKeyPress={handleKeypadKeyPress} onDelete={handleKeypadDelete} onClose={() => setShowKeypad(false)} />}
    </div>
  );
};

export default Login;