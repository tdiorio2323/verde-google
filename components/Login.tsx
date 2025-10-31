import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (brand: 'Verde' | 'LongMoneyExotics', user: User) => void;
}

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onClose: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onBackspace, onEnter, onClose }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="w-full max-w-xs p-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-base-300/80 p-6 rounded-2xl shadow-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {keys.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="py-4 text-2xl font-bold rounded-lg transition-colors duration-200 bg-base-200/60 hover:bg-base-100/80 text-white"
              >
                {key}
              </button>
            ))}
             <button
              onClick={onBackspace}
              className="py-4 text-2xl font-bold rounded-lg transition-colors duration-200 bg-base-200/60 hover:bg-base-100/80 text-red-400"
            >
              ⌫
            </button>
            <button
              onClick={() => onKeyPress('0')}
              className="py-4 text-2xl font-bold rounded-lg transition-colors duration-200 bg-base-200/60 hover:bg-base-100/80 text-white"
            >
              0
            </button>
            <button
              onClick={onEnter}
              className="py-4 text-lg font-bold rounded-lg transition-colors duration-200 bg-primary/80 hover:bg-primary text-secondary"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnter = () => {
    if (vipCode === '420' || vipCode === '1111') {
      const brand = vipCode === '420' ? 'Verde' : 'LongMoneyExotics';
      const mockUser: User = { id: 'demouser', email: 'vip@user.com', name: 'VIP User' };
      onLogin(brand, mockUser);
      setShowKeypad(false);
    } else {
      setError('Invalid VIP Code');
      setTimeout(() => {
        setError(null);
        setVipCode('');
      }, 1500);
    }
  };

  const handleKeyPress = (key: string) => {
    if (vipCode.length < 4) {
      setVipCode(vipCode + key);
    }
  };

  const handleBackspace = () => {
    setVipCode(vipCode.slice(0, -1));
  };


  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <img src="https://i.imgur.com/JxVSoD0.png" alt="Verde Logo" className="mx-auto h-40 w-auto" />
            <p className="mt-4 text-lg text-gray-400">
              Unlock Exclusive Access to the Portal
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-400 text-white rounded-lg bg-white/10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-400 text-white rounded-lg bg-white/10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <hr className="border-white/10" />

          <div className="space-y-3 text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">VIP Access</h3>
            <div
              onClick={() => setShowKeypad(true)}
              className={`w-full max-w-[200px] mx-auto p-3 bg-white/10 border border-white/20 rounded-lg cursor-pointer tracking-[1.5em] text-center font-mono text-3xl h-16 flex items-center justify-center transition-colors ${error ? 'border-red-500 animate-shake' : ''}`}
            >
              {vipCode ? '•'.repeat(vipCode.length) : <span className="text-gray-400 text-base tracking-normal normal-case font-sans">Enter Code</span>}
            </div>
            {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
          </div>

        </div>
      </div>
      {showKeypad && (
        <Keypad
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          onClose={() => setShowKeypad(false)}
        />
      )}
    </>
  );
};

export default Login;