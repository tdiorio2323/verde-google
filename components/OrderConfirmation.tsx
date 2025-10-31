import React from 'react';
import { Order } from '../types';
import { CheckCircleIcon } from './Icons';

interface OrderConfirmationProps {
  order: Order;
  onNewOrder: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onNewOrder }) => {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-base-200/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl space-y-8 text-center text-gray-200">
        <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500" />
        <h2 className="text-3xl font-extrabold text-gray-100">
          Order Confirmed!
        </h2>
        <p className="text-lg text-gray-300">
          Thank you, {order.user.name}. Your order has been received.
        </p>
        
        <div className="text-left bg-base-300/70 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-100 text-xl mb-4">Order Summary</h3>
          <p className="text-sm text-gray-400">Order ID: {order.id}</p>
          <p className="text-sm text-gray-400 mb-4">Date: {order.orderDate.toLocaleDateString()}</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {order.items.map(item => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{item.product.name} (x{item.quantity})</span>
                <span className="font-medium text-gray-100">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-white/20 mt-4 pt-4">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-green-900/50 border-l-4 border-primary text-green-200 p-4 rounded-md text-left">
          <h4 className="font-bold">Next Steps</h4>
          <p className="text-sm">Please wait for a confirmation text or call regarding your order's pickup or drop-off details. All financial matters will be settled in person.</p>
        </div>
        
        <div>
          <button
            onClick={onNewOrder}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-secondary bg-primary hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-primary"
          >
            Start a New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;