import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Bell, 
  User, 
  Menu, 
  X, 
  MapPin, 
  ChevronDown,
  Heart,
  Package,
  LogOut,
  Settings,
  Store,
  Truck,
  Phone,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { categories } from '../../../data/mockData';
import logoImage from '../../../assets/jour_marché.png';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Announcement */}
      <div className="header-top-bar-container" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="header-top-bar" style={{ alignItems: 'center', justifyContent: 'space-between', height: '40px', color: 'white', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={14} />
              <span style={{ opacity: 0.9 }}>Livraison à</span>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Abidjan, CI
                <ChevronDown size={12} />
              </span>
            </div>
            <div className="header-top-right" style={{ alignItems: 'center', gap: '24px' }}>
              <Link to="/aide" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
                <Phone size={13} />
                Aide
              </Link>
              <Link to="/devenir-vendeur" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontWeight: 500 }}>
                <Store size={13} />
                Devenir vendeur
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', height: '72px' }}>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" style={{ flexShrink: 0, marginLeft: '-20px' }}>
              <img 
                src={logoImage} 
                alt="Jour de Marché" 
                style={{ height: '90px', width: 'auto' }}
              />
            </Link>

            {/* Categories Button */}
            <div 
              className="header-desktop-nav"
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                background: 'linear-gradient(135deg, #059669, #10b981)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: 600, 
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s'
              }}>
                <Menu size={18} />
                Catégories
                <ChevronDown size={16} style={{ transform: showCategories ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {/* Mega Menu */}
              {showCategories && (
                <div style={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: '100%', 
                  marginTop: '8px',
                  width: '700px', 
                  background: 'white', 
                  borderRadius: '16px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
                  border: '1px solid #e5e7eb',
                  padding: '24px',
                  zIndex: 100
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {categories.map(cat => (
                      <Link 
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '16px', 
                          padding: '16px', 
                          borderRadius: '12px', 
                          textDecoration: 'none',
                          color: '#1f2937',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0fdf4';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <span style={{ fontSize: '32px' }}>{cat.icon}</span>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>{cat.name}</p>
                          {cat.description && (
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{cat.description}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="header-desktop-search" style={{ flex: 1, maxWidth: '600px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#f9fafb', 
                border: '2px solid #e5e7eb', 
                borderRadius: '50px', 
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}>
                <div style={{ padding: '0 16px' }}>
                  <Search size={20} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un produit, une boutique..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    flex: 1, 
                    padding: '14px 0', 
                    border: 'none', 
                    background: 'transparent', 
                    fontSize: '15px',
                    outline: 'none',
                    color: '#1f2937'
                  }}
                />
                <button 
                  type="submit"
                  style={{ 
                    padding: '14px 28px', 
                    background: 'linear-gradient(135deg, #059669, #10b981)', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Rechercher
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAuthenticated ? (
                <>
                  {/* Seller/Create Shop Button */}
                  {user?.role === 'seller' ? (
                    <Link 
                      to="/seller/dashboard"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '8px 16px 8px 8px', 
                        background: 'linear-gradient(135deg, #f97316, #fb923c)', 
                        color: 'white', 
                        borderRadius: '50px', 
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '13px',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Store size={16} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.9 }}>Ma Boutique</p>
                        <p style={{ margin: 0, fontWeight: 700 }}>Tableau de bord</p>
                      </div>
                    </Link>
                  ) : (
                    <Link 
                      to="/seller/create-shop"
                      className="create-shop-btn"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px 20px', 
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
                        color: 'white', 
                        borderRadius: '50px', 
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Sparkles size={16} />
                      <span className="create-shop-btn-text">Créer ma boutique gratuitement</span>
                      <span className="create-shop-btn-text-short">Vendre</span>
                    </Link>
                  )}

                  {/* Notifications */}
                  <button style={{ 
                    position: 'relative', 
                    padding: '12px', 
                    background: '#f3f4f6', 
                    border: 'none', 
                    borderRadius: '50%', 
                    cursor: 'pointer',
                    color: '#4b5563'
                  }}>
                    <Bell size={20} />
                    <span style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px', 
                      width: '8px', 
                      height: '8px', 
                      background: '#ef4444', 
                      borderRadius: '50%',
                      border: '2px solid white'
                    }}></span>
                  </button>

                  {/* Favorites */}
                  <Link 
                    to="/buyer/favorites"
                    style={{ 
                      padding: '12px', 
                      background: '#f3f4f6', 
                      borderRadius: '50%', 
                      color: '#4b5563',
                      display: 'flex'
                    }}
                  >
                    <Heart size={20} />
                  </Link>

                  {/* Cart */}
                  <Link 
                    to="/cart" 
                    style={{ 
                      position: 'relative',
                      padding: '12px', 
                      background: '#f0fdf4', 
                      borderRadius: '50%', 
                      color: '#059669',
                      display: 'flex'
                    }}
                  >
                    <ShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '-4px', 
                        right: '-4px', 
                        minWidth: '22px', 
                        height: '22px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        background: 'linear-gradient(135deg, #059669, #10b981)', 
                        color: 'white', 
                        fontSize: '11px', 
                        fontWeight: 700,
                        borderRadius: '50px',
                        border: '2px solid white'
                      }}>
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div 
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <button style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '8px 16px 8px 8px', 
                      background: '#f3f4f6', 
                      border: 'none', 
                      borderRadius: '50px', 
                      cursor: 'pointer'
                    }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #f97316, #fbbf24)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white'
                      }}>
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Bonjour 👋</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {user?.name?.split(' ')[0]}
                        </p>
                      </div>
                      <ChevronDown size={16} color="#6b7280" />
                    </button>

                    {/* Dropdown */}
                    {showUserMenu && (
                      <div style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: '100%', 
                        marginTop: '8px',
                        width: '280px', 
                        background: 'white', 
                        borderRadius: '16px', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        zIndex: 100
                      }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
                          <p style={{ fontWeight: 600, fontSize: '16px', color: '#1f2937', margin: '0 0 4px 0' }}>{user?.name}</p>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{user?.email}</p>
                        </div>
                        <div style={{ padding: '8px' }}>
                          <Link 
                            to={user?.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: '#374151' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                              <User size={18} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Mon compte</span>
                          </Link>
                          <Link 
                            to="/buyer/orders"
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: '#374151' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                              <Package size={18} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Mes commandes</span>
                          </Link>
                          <Link 
                            to="/buyer/favorites"
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: '#374151' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                              <Heart size={18} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Mes favoris</span>
                          </Link>
                          <Link 
                            to="/settings"
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: '#374151' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                              <Settings size={18} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Paramètres</span>
                          </Link>
                        </div>
                        
                        {/* Seller Section */}
                        <div style={{ padding: '8px', borderTop: '1px solid #f3f4f6' }}>
                          {user?.role === 'seller' ? (
                            <Link 
                              to="/seller/dashboard"
                              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: '#374151', background: 'linear-gradient(135deg, #fff7ed, #ffedd5)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ffedd5, #fed7aa)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #fff7ed, #ffedd5)'}
                            >
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Store size={18} />
                              </div>
                              <div>
                                <span style={{ fontWeight: 600, color: '#ea580c' }}>Ma Boutique</span>
                                <p style={{ margin: 0, fontSize: '11px', color: '#9a3412' }}>Gérer mes produits et ventes</p>
                              </div>
                            </Link>
                          ) : (
                            <Link 
                              to="/seller/create-shop"
                              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', textDecoration: 'none', color: '#374151', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ede9fe, #ddd6fe)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #f5f3ff, #ede9fe)'}
                            >
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Sparkles size={18} />
                              </div>
                              <div>
                                <span style={{ fontWeight: 600, color: '#7c3aed' }}>Ouvrir ma boutique gratuitement</span>
                                <p style={{ margin: 0, fontSize: '11px', color: '#6d28d9' }}>Vendez vos produits en ligne</p>
                              </div>
                            </Link>
                          )}
                        </div>

                        <div style={{ padding: '8px', borderTop: '1px solid #f3f4f6' }}>
                          <button 
                            onClick={logout}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <LogOut size={18} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Cart for guests */}
                  <Link 
                    to="/cart" 
                    style={{ 
                      position: 'relative',
                      padding: '12px', 
                      background: '#f0fdf4', 
                      borderRadius: '50%', 
                      color: '#059669',
                      display: 'flex'
                    }}
                  >
                    <ShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '-4px', 
                        right: '-4px', 
                        minWidth: '22px', 
                        height: '22px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        background: 'linear-gradient(135deg, #059669, #10b981)', 
                        color: 'white', 
                        fontSize: '11px', 
                        fontWeight: 700,
                        borderRadius: '50px',
                        border: '2px solid white'
                      }}>
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  {/* Auth Buttons */}
                  <button 
                    onClick={() => navigate('/login')}
                    style={{ 
                      padding: '12px 24px', 
                      background: 'none', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '50px', 
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    style={{ 
                      padding: '12px 24px', 
                      background: 'linear-gradient(135deg, #059669, #10b981)', 
                      border: 'none', 
                      borderRadius: '50px', 
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'white',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <Link to="/" style={{ padding: '16px 20px', color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
              Accueil
            </Link>
            <Link to="/promotions" style={{ padding: '16px 20px', color: '#dc2626', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} />
              Promos
            </Link>
            <Link to="/nouveautes" style={{ padding: '16px 20px', color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
              Nouveautés
            </Link>
            <Link to="/boutiques" style={{ padding: '16px 20px', color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
              Boutiques
            </Link>
            <Link to="/category/restaurants" style={{ padding: '16px 20px', color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🍽️ Restaurants
            </Link>
            <Link to="/categories" style={{ padding: '16px 20px', color: '#f97316', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Tout voir →
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mobile-search" style={{ display: 'none', padding: '12px 16px', background: 'white', borderBottom: '1px solid #f3f4f6' }}>
        <form onSubmit={handleSearch} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '12px', padding: '0 16px' }}>
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '14px 12px', border: 'none', background: 'transparent', fontSize: '15px', outline: 'none' }}
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <img src={logoImage} alt="Jour de Marché" style={{ height: '70px', width: 'auto' }} />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              <X size={24} color="#374151" />
            </button>
          </div>

          <div style={{ overflowY: 'auto', height: 'calc(100vh - 72px)', padding: '16px' }}>
            {/* Mobile Search */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '12px', padding: '0 16px' }}>
                <Search size={18} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Rechercher produits, boutiques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, padding: '14px 12px', border: 'none', background: 'transparent', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </form>

            {/* Mobile Categories */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Catégories
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {categories.slice(0, 8).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '14px', 
                      background: '#f9fafb', 
                      borderRadius: '12px', 
                      textDecoration: 'none',
                      color: '#1f2937'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.name}</span>
                  </Link>
                ))}
              </div>
              <Link 
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', textAlign: 'center', padding: '12px', color: '#059669', fontWeight: 600, fontSize: '14px', textDecoration: 'none', marginTop: '12px' }}
              >
                Voir toutes les catégories →
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '14px 0', fontSize: '16px', fontWeight: 500, color: '#1f2937', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
              >
                Accueil
              </Link>
              <Link 
                to="/promotions"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 0', fontSize: '16px', fontWeight: 600, color: '#dc2626', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
              >
                <Sparkles size={18} />
                Promotions
              </Link>
              <Link 
                to="/nouveautes"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '14px 0', fontSize: '16px', fontWeight: 500, color: '#1f2937', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
              >
                Nouveautés
              </Link>
              <Link 
                to="/boutiques"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '14px 0', fontSize: '16px', fontWeight: 500, color: '#1f2937', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
              >
                Boutiques
              </Link>
            </div>

            {/* Mobile Seller Section */}
            {isAuthenticated && (
              <div style={{ marginTop: '16px', padding: '16px', background: user?.role === 'seller' ? 'linear-gradient(135deg, #fff7ed, #ffedd5)' : 'linear-gradient(135deg, #f5f3ff, #ede9fe)', borderRadius: '16px' }}>
                {user?.role === 'seller' ? (
                  <Link 
                    to="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: '#1f2937' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Store size={24} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#ea580c' }}>Ma Boutique</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#9a3412' }}>Gérer mes produits et ventes</p>
                    </div>
                  </Link>
                ) : (
                  <Link 
                    to="/seller/create-shop"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: '#1f2937' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#7c3aed' }}>Ouvrir ma boutique gratuitement</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#6d28d9' }}>Vendez vos produits en ligne !</p>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link 
                  to="/seller/create-shop"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%', 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: 600,
                    fontSize: '16px',
                    textDecoration: 'none'
                  }}
                >
                  <Sparkles size={20} />
                  Ouvrir ma boutique gratuitement
                </Link>
                <button 
                  onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #059669, #10b981)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  S'inscrire gratuitement
                </button>
                <button 
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    background: 'white', 
                    color: '#374151', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px', 
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .header-top-bar { display: flex; }
        .header-top-right { display: flex; }
        .header-desktop-nav { display: flex; }
        .header-desktop-search { display: flex; }
        .header-desktop-actions { display: flex; }
        
        @media (max-width: 1024px) {
          .mobile-menu-btn { display: flex !important; }
          .mobile-search { display: block !important; }
          .header-desktop-nav { display: none !important; }
          .header-desktop-search { display: none !important; }
        }
        
        @media (max-width: 768px) {
          .header-top-bar-container { display: none !important; }
          .header-top-right { display: none !important; }
          .header-desktop-actions { gap: 8px !important; }
          .create-shop-btn { padding: 10px 14px !important; gap: 6px !important; }
          .create-shop-btn-text { display: none !important; }
          .create-shop-btn-text-short { display: inline !important; }
        }
        
        .create-shop-btn-text-short { display: none; }
        
        @media (max-width: 480px) {
          .header-top-bar { font-size: 11px !important; }
        }
      `}</style>
    </header>
  );
}
