import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon, CheckCircleIcon, MinusIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSelectProduct }) => {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the add button
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
        setAdded(false);
        setQuantity(1); // Reset quantity after adding
    }, 1500);
  };

  return (
    <div 
      onClick={() => onSelectProduct(product.id)}
      className="flex items-center p-3 bg-base-200/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(product.id) }}
      aria-label={`View details for ${product.name}`}
    >
      <img
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        src={product.imageUrl}
        alt={product.name}
      />
      <div className="flex-grow mx-4">
        <h3 className="text-lg font-semibold text-gray-100">{product.name}</h3>
        <p className="text-md font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center rounded-full bg-base-300/80 p-1">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(q => Math.max(1, q - 1));
                }}
                disabled={quantity <= 1}
                className="p-1 rounded-full text-gray-300 hover:bg-base-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                <MinusIcon className="w-5 h-5"/>
            </button>
            <span className="w-8 text-center font-bold text-lg text-white tabular-nums">{quantity}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(q => q + 1);
                }}
                className="p-1 rounded-full text-gray-300 hover:bg-base-100 transition-colors"
                aria-label="Increase quantity"
            >
                <PlusIcon className="w-5 h-5"/>
            </button>
        </div>
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${quantity} of ${product.name} to cart`}
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 ${
            added 
              ? 'bg-amber-500 text-white focus:ring-amber-400' 
              : 'bg-primary text-secondary hover:bg-green-300 focus:ring-primary'
          }`}
        >
          {added ? <CheckCircleIcon className="w-7 h-7" /> : <PlusIcon className="w-7 h-7" />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;