import React, { useState } from 'react';
import { Product, Category } from '../types';
import ProductCard from './ProductCard';

interface LongMoneyExoticsProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (productId: string) => void;
}

const LME_CATEGORIES: Category[] = [Category.PRE_PACKAGED, Category.MERCH];

const LongMoneyExotics: React.FC<LongMoneyExoticsProps> = ({ products, onAddToCart, onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.PRE_PACKAGED);

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <img src="https://i.imgur.com/9CLdLaE.png" alt="Long Money Exotics Logo" className="mx-auto h-48 w-auto" />
      </div>

      <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex justify-center space-x-3 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-6 lg:px-8">
          {LME_CATEGORIES.map((category) => (
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
        {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
            />
            ))
        ) : (
            <p className="text-center text-gray-400">No products available in this category.</p>
        )}
      </div>
    </main>
  );
};

export default LongMoneyExotics;
