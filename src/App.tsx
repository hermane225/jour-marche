import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Header, Footer } from './components/layout';

// Auth Pages
import { Login, Signup } from './pages/auth';

// Guest Pages
import { Home, ProductDetail, Cart, Categories, Shops, ShopDetail, Promotions, Search, MobileMoneyPayment } from './pages/guest';
import { OrderReview } from './pages/guest/OrderReview';
import { OrderConfirmation } from './pages/guest/OrderConfirmation';
import { DeliveryInfo } from './pages/guest/DeliveryInfo';
import { PaymentMethod } from './pages/guest/PaymentMethod';

// Buyer Pages
import { BuyerDashboard, Profile, OrderDetail } from './pages/buyer';

// Seller Pages
import { SellerDashboard, CreateShop, ShopPage, CreateProduct } from './pages/seller';

// Admin Pages
import { AdminLayout, AdminDashboard, AdminSellers, AdminOrders, AdminUsers, AdminReports, AdminLoginGuide } from './pages/admin';

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
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
        fontSize: '1.1rem',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #059669',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          Chargement de votre compte...
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role === 'seller') {
    return <Navigate to="/seller/dashboard" replace />;
  }
  
  return <Outlet />;
}

// Route protégée pour les sellers
function SellerRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#f9fafb',
        fontSize: '1.1rem',
        color: '#6b7280'
      }}>
        Chargement...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Les sellers ont accès direct, les buyers non
  if (user?.role !== 'seller') {
    return <Navigate to="/buyer/dashboard" replace />;
  }
  
  return <Outlet />;
}

// Route protégée pour les admins
function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
      }}>
        Chargement...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérifier si l'utilisateur est admin (vous devez adapter selon votre système)
  if (user?.role !== 'admin') {
    return <Navigate to="/buyer/dashboard" replace />;
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
        <Route path="/admin-login-guide" element={<AdminLoginGuide />} />
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

        {/* Panier et commande */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/delivery/info" element={<DeliveryInfo />} />
        <Route path="/order/review" element={<OrderReview />} />
        <Route path="/payment/method" element={<PaymentMethod />} />
        <Route path="/payment/mobile-money" element={<MobileMoneyPayment />} />
        <Route path="/order/confirmation" element={<OrderConfirmation />} />

        {/* Création de boutique - nécessite d'être connecté */}
        <Route element={<AuthRoute />}>
          <Route path="/seller/create-shop" element={<CreateShop />} />
        </Route>

        {/* Routes Buyer protégées */}
        <Route element={<BuyerRoute />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/orders" element={<BuyerDashboard />} />
          <Route path="/buyer/orders/:id" element={<OrderDetail />} />
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

      {/* Routes Admin */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/sellers" element={<AdminSellers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
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
