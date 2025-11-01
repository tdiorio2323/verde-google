import React, { useState, useEffect } from 'react';
import { User, Product, CartItem, Category, Order } from './types';
import { CATEGORIES } from './constants';
import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Login from './components/Login';
import CartView from './components/CartView';
import OrderConfirmation from './components/OrderConfirmation';
import ProductDetailView from './components/ProductDetailView';

type View = 'login' | 'products' | 'cart' | 'confirmation' | 'productDetail';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.FLOWER);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const supaUser = session.user;
        const appUser: User = {
          id: supaUser.id,
          email: supaUser.email!,
          name: supaUser.user_metadata.brand_name || supaUser.email!.split('@')[0],
        };
        setUser(appUser);
        setCurrentView('products');
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const supaUser = session.user;
        const appUser: User = {
          id: supaUser.id,
          email: supaUser.email!,
          name: supaUser.user_metadata.brand_name || supaUser.email!.split('@')[0],
        };
        setUser(appUser);
        setCurrentView('products');
      } else {
        setUser(null);
        setCurrentView('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data as Product[]);
        }
      } else {
        // Clear products when user logs out
        setProducts([]);
      }
    };
    fetchProducts();
  }, [user]);

  const handleSignIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const handleSignUp = async (email, password, brandName, instagram, phone) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          brand_name: brandName,
          instagram_url: instagram,
          phone_number: phone,
        }
      }
    });
    if (error) throw error;
    alert('Sign up successful! Please check your email to confirm your account.');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
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

  const placeOrder = async () => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    const orderTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total: orderTotal })
      .select('id, created_at')
      .single();
    
    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      alert('There was an issue placing your order. Please try again.');
      return;
    }

    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) {
      console.error('Error saving order items:', itemsError);
      alert('Could not save all items in the order. Please contact support.');
      return;
    }

    const newOrder: Order = {
      id: orderData.id,
      user,
      items: cart,
      total: orderTotal,
      orderDate: new Date(orderData.created_at),
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
        setSelectedProductId(null);
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
                  onAddToCart={(product, quantity) => addToCart(product, quantity)} 
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
  
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 text-white font-bold text-xl">
            Initializing CannaConnect...
        </div>
    );
  }

  if (currentView === 'login') {
    return <Login onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  return (
    <div className="min-h-screen font-sans">
      <Header user={user} cart={cart} onNavigate={navigate} onLogout={handleLogout} />
      {renderContent()}
    </div>
  );
};

export default App;