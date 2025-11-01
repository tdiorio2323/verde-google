import React, { useState, useEffect } from 'react';

interface LoginProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, brandName: string, instagram: string, phone: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onSignIn, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sign up form states
  const [brandName, setBrandName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // Reset fields when toggling between Sign In and Sign Up
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setBrandName('');
    setInstagram('');
    setPhone('');
    setError('');
  }, [isSignUp]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      if (isSignUp) {
        await onSignUp(email, password, brandName, instagram, phone);
        // On success, App component will receive auth event and navigate away.
        // A confirmation alert is shown in the App component after the handler resolves.
      } else {
        await onSignIn(email, password);
        // On success, App component will receive auth event and navigate away.
      }
    } catch (err: any) {
       setError(err.message || 'An unexpected error occurred.');
    } finally {
       setIsSubmitting(false);
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

        {error && <p className="mt-2 text-sm text-red-400 text-center animate-pulse">{error}</p>}

        {isSignUp ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input name="brandName" type="text" placeholder="Brand Name" value={brandName} onChange={e => setBrandName(e.target.value)} className={commonInputClass} required />
            <input name="instagram" type="text" placeholder="Instagram URL/Username" value={instagram} onChange={e => setInstagram(e.target.value)} className={commonInputClass} />
            <input name="email" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} required />
            <input name="phone" type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className={commonInputClass} />
            <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={commonInputClass} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={commonInputClass} required />

            <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-secondary bg-primary hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary disabled:bg-gray-600 transition-colors duration-300">
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input id="email-address" name="email" type="email" autoComplete="email" className={commonInputClass} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              <input id="password" name="password" type="password" autoComplete="current-password" className={commonInputClass} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
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
