import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Store, Users, BarChart3, LogOut, Bell, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.css';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = useMemo(
    () => [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
      { path: '/admin/sellers', label: 'Boutiques', icon: Store },
      { path: '/admin/users', label: 'Utilisateurs', icon: Users },
      { path: '/admin/reports', label: 'Rapports', icon: BarChart3 },
      { path: '/admin/profile', label: 'Mon Profil', icon: UserCircle2 },
    ],
    []
  );

  const currentTitle = useMemo(() => {
    const active = menuItems.find((item) => location.pathname.startsWith(item.path));
    return active?.label || 'Administration';
  }, [location.pathname, menuItems]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-container-pro">
      <aside className={`admin-sidebar-pro ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-head">
          <button className="admin-logo-wrap" onClick={() => navigate('/admin/dashboard')}>
            <img src="/jour_marcher.png" alt="Jour Marche" className="admin-logo-image" />
            {sidebarOpen && (
              <span>
                <strong>Jour Marche</strong>
                <small>Admin Panel</small>
              </span>
            )}
          </button>
          <button className="admin-collapse-btn" onClick={() => setSidebarOpen((prev) => !prev)}>
            {sidebarOpen ? '<' : '>'}
          </button>
        </div>

        <nav className="admin-nav-pro">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                className={`admin-nav-link ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <ItemIcon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={17} />
            {sidebarOpen && <span>Deconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="admin-main-pro">
        <header className="admin-topbar-pro">
          <div>
            <p className="admin-overline">Backoffice</p>
            <h1>{currentTitle}</h1>
          </div>

          <div className="admin-topbar-actions">
            <button className="admin-notif-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="admin-user-chip">
              <span>{user?.name || 'Admin'}</span>
              <small>{user?.email}</small>
            </div>
          </div>
        </header>

        <main className="admin-content-pro">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
