import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import './Header.css';
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  X,
  MapPin,
  Heart,
  Store,
  Phone,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { categories } from '../../../data/mockData';
import logoImage from '../../../assets/jour_marché.png';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { cart, itemCount, removeFromCart, updateQuantity } = useCart();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50" style={{ overflow: 'hidden' }}>
      {/* Top Bar - Announcement */}
      <div className="header-top-bar-container" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
          <div className="header-top-bar" style={{ alignItems: 'center', justifyContent: 'space-between', height: '40px', color: 'white', fontSize: '13px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', paddingRight: '16px' }}>
              <Link to="/aide" className="header-desktop-help" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', textDecoration: 'none', fontWeight: 500, fontSize: '15px', padding: '8px 12px', borderRadius: '8px', background: '#f0fdf4' }}>
                <Phone size={18} />
                Aide
              </Link>
              <MapPin size={14} />
              <span style={{ opacity: 0.9 }}>Livraison </span>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Partout en Cote d'Ivoire
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

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: 'min(380px, 100vw)', background: 'white', boxShadow: '-20px 0 40px rgba(2,6,23,0.08)', zIndex: 1100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, fontWeight: 800 }}>Mon Panier</h3>
            <button type="button" onClick={() => setShowCartDrawer(false)} style={{ border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
              <X />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {cart.items.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280' }}>Votre panier est vide</div>
            ) : (
              cart.items.map((it, idx) => (
                <div key={it.product.id + '-' + idx} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'center' }}>
                  <img src={it.product.images?.[0]} alt={it.product.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{it.product.title}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{it.quantity} × {new Intl.NumberFormat('fr-FR').format(it.product.price)} FCFA</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button type="button" onClick={() => updateQuantity(it.product.id, it.quantity - 1)} style={{ border: 'none', background: '#f3f4f6', padding: '6px', borderRadius: 8 }}>−</button>
                    <button type="button" onClick={() => updateQuantity(it.product.id, it.quantity + 1)} style={{ border: 'none', background: '#f3f4f6', padding: '6px', borderRadius: 8 }}>+</button>
                    <button type="button" onClick={() => removeFromCart(it.product.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', padding: 0 }}>Suppr</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '16px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ color: '#6b7280' }}>Total</div>
              <div style={{ fontWeight: 800 }}>{new Intl.NumberFormat('fr-FR').format(cart.total || 0)} FCFA</div>
            </div>
            {!showPaymentOptions ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/cart" onClick={() => setShowCartDrawer(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, background: '#fff', border: '1px solid #059669', color: '#059669', textDecoration: 'none', fontWeight: 700 }}>Voir le panier</Link>
                <button type="button" onClick={() => setShowPaymentOptions(true)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Payer</button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700 }}>Choisir le mode de paiement</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Link to="/payment/mobile-money" onClick={() => { setShowCartDrawer(false); setShowPaymentOptions(false); }} style={{ padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>Mobile Money</Link>
                    <button type="button" onClick={() => { setShowCartDrawer(false); setShowPaymentOptions(false); navigate('/payment/cash-on-delivery'); }} style={{ padding: '12px', borderRadius: 12, background: '#fff', border: '1px solid #059669', color: '#059669', fontWeight: 700, cursor: 'pointer' }}>Paiement à la livraison</button>
                  </div>
                </div>
                <button type="button" onClick={() => setShowPaymentOptions(false)} style={{ width: '100%', padding: '8px', borderRadius: 8, background: '#f3f4f6', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>Retour</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '72px', width: '100%', boxSizing: 'border-box', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none' }}>
            
            {/* Mobile Menu Button */}
            <button type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none', // sera overridé par le CSS responsive
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>


            {/* Logo */}
            <Link to="/" style={{ flexShrink: 0, marginLeft: '-8px' }}>
              <img
                src={logoImage}
                alt="Jour de Marché"
                style={{ height: '60px', width: 'auto' }}
              />
            </Link>

            {/* Actions mobiles : panier et icône utilisateur pour tous, nom utilisateur si connecté */}
            <div className="header-mobile-actions">
              <button type="button" onClick={() => setShowCartDrawer(true)} style={{ position: 'relative', padding: '12px', background: '#f0fdf4', borderRadius: '50%', color: '#059669', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '11px', fontWeight: 700, borderRadius: '50px', border: '2px solid white' }}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
              <button type="button" className="desktop-signup-btn" onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', borderRadius: '50px', fontWeight: 600, fontSize: '14px', color: 'white', cursor: 'pointer', padding: '8px 16px' }}>
                S'inscrire
              </button>
            </div>


            {/* Categories Button */}
            <div 
              className="header-desktop-nav"
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button type="button" style={{ 
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
                  width: 'min(700px, 90vw)',
                  maxWidth: '700px',
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
            <form onSubmit={handleSearch} className="header-desktop-search" style={{ flex: 1, maxWidth: '800px', marginRight: '12px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  {/* Icône utilisateur connecté avant 'Créer ma boutique' */}
                  <Link to="/buyer/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#059669', background: '#f0fdf4', borderRadius: '50%', padding: '10px', marginRight: '8px' }}>
                    <User size={20} />
                  </Link>
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
                        fontSize: '15px',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Sparkles size={16} />
                      <span className="create-shop-btn-text py-2 px-4 rounded">Créer ma boutique</span>
                    </Link>
                  )}

                  {/* Notifications */}
                  <button type="button" className="header-notifications-desktop" style={{
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
                    className="header-favorites-desktop"
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

                  {/* Cart et user mobile déplacés à droite, voir header-mobile-actions (supprimé sur mobile) */}

                  {/* Cart Link */}
                  <button type="button" onClick={() => setShowCartDrawer(true)} className="header-cart-desktop" style={{ position: 'relative', padding: '12px', color: '#059669', display: 'flex', alignItems: 'center' }}>
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
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setShowCartDrawer(true)} className="header-cart-desktop" style={{ position: 'relative', padding: '12px', background: '#f0fdf4', borderRadius: '50%', color: '#059669', display: 'flex', alignItems: 'center', marginRight: '8px', border: 'none', cursor: 'pointer' }}>
                    <ShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '11px', fontWeight: 700, borderRadius: '50px', border: '2px solid white' }}>
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </button>
                  <button type="button" onClick={() => navigate('/login')} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
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
          <div className="main-nav-bar" style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
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
            <img src={logoImage} alt="Jour de Marché" className="mobile-logo" />
            <button type="button"
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

            {/* Barre d'accès rapide mobile - après le logo (supprimée, plus d'icônes panier/utilisateur ici) */}

            {/* Menu principal mobile - scrollable horizontalement (masqué sur /categories) */}
            {location.pathname !== '/categories' && (
              <nav className="mobile-main-menu-scroll">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ minWidth: '120px', textAlign: 'center', padding: '14px', borderRadius: '10px', color: '#374151', fontWeight: 600, fontSize: '15px', background: '#f3f4f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>Accueil</Link>
                <Link to="/promotions" onClick={() => setMobileMenuOpen(false)} style={{ minWidth: '120px', textAlign: 'center', padding: '14px', borderRadius: '10px', color: '#dc2626', fontWeight: 700, fontSize: '15px', background: '#fef2f2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}><Sparkles size={18} />Promos</Link>
                <Link to="/nouveautes" onClick={() => setMobileMenuOpen(false)} style={{ minWidth: '120px', textAlign: 'center', padding: '14px', borderRadius: '10px', color: '#374151', fontWeight: 600, fontSize: '15px', background: '#f3f4f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>Nouveautés</Link>
                <Link to="/boutiques" onClick={() => setMobileMenuOpen(false)} style={{ minWidth: '120px', textAlign: 'center', padding: '14px', borderRadius: '10px', color: '#374151', fontWeight: 600, fontSize: '15px', background: '#f3f4f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>Boutiques</Link>
                <Link to="/category/restaurants" onClick={() => setMobileMenuOpen(false)} style={{ minWidth: '140px', textAlign: 'center', padding: '14px', borderRadius: '10px', color: '#374151', fontWeight: 600, fontSize: '15px', background: '#f3f4f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>🍽️ Restaurants</Link>
                <Link to="/categories" onClick={() => setMobileMenuOpen(false)} style={{ minWidth: '140px', textAlign: 'center', padding: '14px', borderRadius: '10px', color: '#f97316', fontWeight: 700, fontSize: '15px', background: '#fff7ed', textDecoration: 'none', whiteSpace: 'nowrap' }}>Tout voir →</Link>
              </nav>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
