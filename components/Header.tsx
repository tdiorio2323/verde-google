import React from 'react';
import { User, CartItem } from '../types';
import { CartIcon, UserIcon } from './Icons';

interface HeaderProps {
  user: User | null;
  cart: CartItem[];
  onNavigate: (view: 'products' | 'cart' | 'login') => void;
  onLogout: () => void;
  currentBrand: 'Verde' | 'LongMoneyExotics' | null;
}

const Header: React.FC<HeaderProps> = ({ user, cart, onNavigate, onLogout, currentBrand }) => {
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const logoUrl = currentBrand === 'LongMoneyExotics' 
    ? 'https://i.imgur.com/QY4lZQg.png' 
    : 'https://i.imgur.com/JxVSoD0.png';
  
  const logoAlt = currentBrand === 'LongMoneyExotics' 
    ? 'Long Money Exotics Logo' 
    : 'Verde Logo';

  return (
    <header className="bg-base-200/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('products')}
          >
            <img src={logoUrl} alt={logoAlt} className="h-12 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-300 hover:text-primary transition-colors duration-200"
              aria-label="Open cart"
            >
              <CartIcon className="h-7 w-7" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                 <UserIcon className="h-7 w-7 text-gray-300"/>
                 <span className="hidden md:inline text-gray-200 font-medium">{user.name}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-semibold text-secondary bg-primary rounded-full hover:bg-green-300 transition-all duration-300 shadow"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-sm font-semibold text-secondary bg-primary rounded-full hover:bg-green-300 transition-all duration-300 shadow"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;