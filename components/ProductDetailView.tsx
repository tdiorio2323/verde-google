import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon, CheckCircleIcon } from './Icons';

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, onBack }) => {
  const [added, setAdded] = useState(false);
  
  const handleAddToCart = () => {
    if (!product.inStock || added) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <button onClick={onBack} className="mb-6 inline-flex items-center text-primary hover:underline font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-base-200/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10">
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`w-full h-auto aspect-square object-cover rounded-xl shadow-2xl ${!product.inStock ? 'opacity-60' : ''}`}
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="inline-block bg-primary/20 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-3 self-start">{product.category}</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-100 mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-4 mb-6">
            <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            {!product.inStock && (
                <span className="text-lg font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400">Out of Stock</span>
            )}
          </div>
          <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>
          
          <div className="mt-auto relative">
            <div 
              aria-live="polite"
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md shadow-lg transition-all duration-300 ease-in-out ${
                added ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
                Item added to your cart!
            </div>
             <button
              onClick={handleAddToCart}
              disabled={!product.inStock || added}
              aria-label={!product.inStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
              className={`w-full flex items-center justify-center py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 ${
                !product.inStock
                  ? 'bg-base-300 text-gray-500 cursor-not-allowed'
                  : added 
                    ? 'bg-amber-500 text-white focus:ring-amber-400' 
                    : 'bg-primary text-secondary hover:bg-green-300 focus:ring-primary'
              }`}
            >
              {!product.inStock ? (
                <span>Out of Stock</span>
              ) : added ? (
                <>
                  <CheckCircleIcon className="w-7 h-7 mr-3" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-7 h-7 mr-3" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
