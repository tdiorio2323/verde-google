import React, { useState, useEffect } from 'react';
import { User, Product, CartItem, Category, Order } from './types';
import { CATEGORIES, MOCK_PRODUCTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Login from './components/Login';
import CartView from './components/CartView';
import OrderConfirmation from './components/OrderConfirmation';
import ProductDetailView from './components/ProductDetailView';

type View = 'login' | 'products' | 'cart' | 'confirmation' | 'productDetail';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('cannaConnectUser');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('cannaConnectUser'); // Clear corrupted data
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<View>(() => {
    const storedUser = localStorage.getItem('cannaConnectUser');
    // Basic check is enough, since user state will have the full parsed object
    return storedUser ? 'products' : 'login';
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.FLOWER);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if user is not set and trying to access protected views
    if (!user && currentView !== 'login') {
      setCurrentView('login');
    }
  }, [user, currentView]);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('cannaConnectUser', JSON.stringify(loggedInUser));
    setCurrentView('products');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cannaConnectUser');
    setCurrentView('login'); // Go back to login screen on logout
  };
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('productDetail');
  };

  const addToCart = (productToAdd: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === productToAdd.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product: productToAdd, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.product.id === productId ? {...item, quantity: newQuantity} : item));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const placeOrder = () => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      user,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      orderDate: new Date(),
    };
    setCurrentOrder(newOrder);
    setCart([]);
    setCurrentView('confirmation');
  };

  const startNewOrder = () => {
    setCurrentOrder(null);
    setCurrentView('products');
  }

  const navigate = (view: 'products' | 'cart' | 'login') => {
    if ((view === 'cart' || view === 'products') && !user) {
        setCurrentView('login');
    } else {
        setSelectedProductId(null); // Reset selected product when navigating via header
        setCurrentView(view);
    }
  };

  const backToProducts = () => {
    setSelectedProductId(null);
    setCurrentView('products');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'cart':
        return <CartView 
                  cart={cart}
                  onUpdateQuantity={updateCartQuantity}
                  onRemoveItem={removeFromCart}
                  onPlaceOrder={placeOrder}
                  onContinueShopping={backToProducts}
               />;
      case 'confirmation':
        return currentOrder ? <OrderConfirmation order={currentOrder} onNewOrder={startNewOrder} /> : <p>Loading...</p>;
      case 'productDetail': {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) {
          backToProducts();
          return null;
        }
        return <ProductDetailView 
                  product={selectedProduct} 
                  onAddToCart={(product) => addToCart(product)} 
                  onBack={backToProducts}
               />;
      }
      case 'products':
      default:
        const filteredProducts = products.filter(
          (p) => p.category === selectedCategory
        );
        return (
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Our Products</h2>
            <p className="text-lg text-gray-400 mb-8">Browse our curated selection.</p>
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
                  onAddToCart={addToCart}
                  onSelectProduct={handleSelectProduct}
                />
              ))}
            </div>
          </main>
        );
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen font-sans">
      <Header user={user} cart={cart} onNavigate={navigate} onLogout={handleLogout} />
      {renderContent()}
    </div>
  );
};

export default App;
