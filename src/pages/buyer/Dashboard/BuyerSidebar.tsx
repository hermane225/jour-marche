import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './BuyerDashboard.css';

export function BuyerSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="buyer-sidebar">
      <div className="buyer-sidebar-profile">
        <div className="buyer-sidebar-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="buyer-sidebar-info">
          <h4>{user?.name}</h4>
          <p>{user?.email}</p>
        </div>
      </div>

      <nav className="buyer-sidebar-nav">
        <Link 
          to="/buyer/orders" 
          className={`buyer-sidebar-link ${isActive('/buyer/orders') || isActive('/buyer/dashboard') ? 'active' : ''}`}
        >
          <ShoppingBag size={20} />
          <span>Mes Commandes</span>
        </Link>
        <Link 
          to="/buyer/profile" 
          className={`buyer-sidebar-link ${isActive('/buyer/profile') ? 'active' : ''}`}
        >
          <User size={20} />
          <span>Mon Profil</span>
        </Link>
        <button className="buyer-sidebar-link" onClick={logout}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
}
