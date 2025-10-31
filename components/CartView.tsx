import React from 'react';
import { CartItem } from '../types';
import { PlusIcon, MinusIcon, TrashIcon } from './Icons';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId:string) => void;
  onPlaceOrder: () => void;
  onContinueShopping: () => void;
}

const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onContinueShopping,
}) => {
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="text-gray-200">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-100 mb-8 text-center">Your Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center bg-base-200/80 backdrop-blur-md p-12 rounded-lg shadow-md border border-white/10">
            <p className="text-xl text-gray-400 mb-6">Your cart is empty.</p>
            <button
              onClick={onContinueShopping}
              className="px-8 py-3 font-semibold text-secondary bg-primary rounded-full hover:bg-green-300 transition-all duration-300 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-base-200/80 backdrop-blur-md p-6 rounded-lg shadow-md space-y-4 border border-white/10">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center border-b border-white/10 pb-4 last:border-b-0">
                  <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-grow ml-4">
                    <h3 className="text-lg font-semibold text-gray-100">{product.name}</h3>
                    <p className="text-gray-400">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="p-1 rounded-full hover:bg-base-300" disabled={quantity <= 1}>
                      <MinusIcon className="w-5 h-5 text-gray-300"/>
                    </button>
                    <span className="w-10 text-center font-semibold">{quantity}</span>
                    <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="p-1 rounded-full hover:bg-base-300">
                      <PlusIcon className="w-5 h-5 text-gray-300"/>
                    </button>
                  </div>
                  <div className="ml-4 font-bold text-gray-100 w-20 text-right">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                  <button onClick={() => onRemoveItem(product.id)} className="ml-4 p-1 text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-6 h-6"/>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-base-200/80 backdrop-blur-md p-6 rounded-lg shadow-md sticky top-28 border border-white/10">
                <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">Tax & Fees</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={onPlaceOrder}
                  className="w-full mt-6 py-3 font-semibold text-secondary bg-primary rounded-full hover:bg-green-300 transition-all duration-300 shadow-lg"
                >
                  Place Order
                </button>
                <button
                  onClick={onContinueShopping}
                  className="w-full mt-2 text-center text-primary font-semibold hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;