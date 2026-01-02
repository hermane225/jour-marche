import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Header, Footer } from './components/layout';

// Auth Pages
import { Login, Signup } from './pages/auth';

// Guest Pages
import { Home, ProductDetail, Cart, Categories, Shops, ShopDetail, Promotions, Search } from './pages/guest';

// Buyer Pages
import { BuyerDashboard, Profile } from './pages/buyer';

// Seller Pages
import { SellerDashboard, CreateShop, ShopPage, CreateProduct } from './pages/seller';

import './index.css';

// Layout avec Header et Footer
function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Layout sans Header/Footer (pour les pages auth)
function AuthLayout() {
  return <Outlet />;
}

// Route protégée pour les buyers
function BuyerRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role === 'seller') {
    return <Navigate to="/seller/dashboard" />;
  }
  
  return <Outlet />;
}

// Route protégée pour les sellers
function SellerRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Les sellers ont accès direct, les buyers non
  if (user?.role !== 'seller') {
    return <Navigate to="/buyer/dashboard" />;
  }
  
  return <Outlet />;
}

// Route qui nécessite juste d'être connecté (pas de rôle spécifique)
function AuthRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Pages Auth (sans header/footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Pages avec Header/Footer */}
      <Route element={<MainLayout />}>
        {/* Pages publiques (Guest) */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<Categories />} />
        <Route path="/boutiques" element={<Shops />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/search" element={<Search />} />
        <Route path="/alimentation" element={<Categories />} />
        <Route path="/nouveautes" element={<Home />} />
        
        {/* Création de boutique - nécessite d'être connecté */}
        <Route element={<AuthRoute />}>
          <Route path="/seller/create-shop" element={<CreateShop />} />
        </Route>

        {/* Routes Buyer protégées */}
        <Route element={<BuyerRoute />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/orders" element={<BuyerDashboard />} />
          <Route path="/buyer/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Routes Seller (layout différent) */}
      <Route element={<SellerRoute />}>
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/boutiques" element={<ShopPage />} />
        <Route path="/seller/boutiques/create" element={<CreateShop />} />
        <Route path="/seller/products" element={<ShopPage />} />
        <Route path="/seller/products/create" element={<CreateProduct />} />
        <Route path="/seller/orders" element={<SellerDashboard />} />
        <Route path="/seller/profile" element={<SellerDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppRoutes />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
