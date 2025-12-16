import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingBag, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui';
import './SellerLayout.css';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { path: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/seller/boutiques', icon: Store, label: 'Mes Boutiques' },
    { path: '/seller/products', icon: Package, label: 'Produits' },
    { path: '/seller/orders', icon: ShoppingBag, label: 'Commandes' },
    { path: '/seller/profile', icon: Settings, label: 'Profil' },
  ];

  return (
    <div className="seller-layout">
      {/* Sidebar */}
      <aside className="seller-sidebar">
        <div className="seller-sidebar-header">
          <div className="seller-sidebar-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>🏪</span>
            )}
          </div>
          <div className="seller-sidebar-info">
            <h4>{user?.name || 'Ivoire Shop'}</h4>
            <p>Seller Dashboard</p>
          </div>
        </div>

        <nav className="seller-sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`seller-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="seller-sidebar-footer">
          <Button variant="primary" fullWidth onClick={() => window.location.href = '/'}>
            View Marketplace
          </Button>
          
          <Link to="/seller/settings" className="seller-sidebar-link">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link to="/help" className="seller-sidebar-link">
            <HelpCircle size={20} />
            <span>Help</span>
          </Link>
          <button className="seller-sidebar-link" onClick={logout}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="seller-main">
        {children}
      </main>
    </div>
  );
}
