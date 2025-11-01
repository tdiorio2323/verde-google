import React, { useState, useEffect } from 'react';
import { User, Product, CartItem, Order, Brand } from './types';
import { MOCK_PRODUCTS } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import CartView from './components/CartView';
import OrderConfirmation from './components/OrderConfirmation';
import ProductDetailView from './components/ProductDetailView';
import LongMoneyExotics from './components/LongMoneyExotics';
import AdminPanel from './components/AdminPanel';

type View = 'login' | 'products' | 'cart' | 'confirmation' | 'productDetail' | 'admin';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if user is not set and trying to access protected views
    if (!user && !isAdmin && currentView !== 'login') {
      setCurrentView('login');
    }
  }, [user, isAdmin, currentView]);
  
  const handleLogin = (loggedInUser: User, brandToSet: Brand) => {
    setUser(loggedInUser);
    setBrand(brandToSet);
    setCurrentView('products');
  };
  
  const handleAdminLogin = () => {
    const adminUser: User = { id: 'admin-user', email: 'admin@lme.com', name: 'Admin' };
    setUser(adminUser);
    setIsAdmin(true);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setUser(null);
    setBrand(null);
    setIsAdmin(false);
    setCurrentView('login');
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
  };
  
  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random()}`,
      ...productData,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };


  const navigate = (view: 'products' | 'cart' | 'login') => {
    if ((view === 'cart' || view === 'products') && !user) {
        setCurrentView('login');
    } else if (isAdmin) {
        setCurrentView('admin');
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
      case 'admin':
        return <AdminPanel 
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
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
                  onAddToCart={(product, quantity) => addToCart(product, quantity)} 
                  onBack={backToProducts}
               />;
      }
      case 'products':
      default:
        const lmeProducts = products.filter(p => p.brand === Brand.LONG_MONEY_EXOTICS);
        return <LongMoneyExotics 
          products={lmeProducts} 
          onAddToCart={addToCart} 
          onSelectProduct={handleSelectProduct} 
        />
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} />;
  }

  return (
    <div className="min-h-screen font-sans">
      <Header user={user} cart={cart} onNavigate={navigate} onLogout={handleLogout} />
      <div className="pb-20">{renderContent()}</div>
    </div>
  );
};

export default App;