import React, { useState } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES, LONG_MONEY_PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface LongMoneyExoticsViewProps {
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (productId: string) => void;
}

const LongMoneyExoticsView: React.FC<LongMoneyExoticsViewProps> = ({ onAddToCart, onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.FLOWER);
  const filteredProducts = LONG_MONEY_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <img src="https://i.imgur.com/QY4lZQg.png" alt="Long Money Exotics Logo" className="mx-auto h-40 w-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Long Money Exotics</h2>
        <p className="text-lg text-gray-400">Exclusive drops for VIP members.</p>
      </div>
      <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-6 lg:px-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex-shrink-0 ${
                selectedCategory === category
                  ? 'bg-primary text-secondary shadow-lg shadow-primary/30'
                  : 'bg-base-300/70 backdrop-blur-sm text-gray-200 hover:bg-base-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center bg-base-200/60 backdrop-blur-md rounded-xl p-12 mt-8">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default LongMoneyExoticsView;
