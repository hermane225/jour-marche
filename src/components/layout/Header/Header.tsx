import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
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
import { useShops as useShopContext } from '../../../context/ShopContext';
import { useCart } from '../../../context/CartContext';
import { useCategories } from '../../../hooks/useCategories';
import logoImage from '../../../assets/jour_marché.png';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { myShops, reloadMyShops } = useShopContext();
  const { cart, itemCount, removeFromCart, updateQuantity } = useCart();
  const { data: categories } = useCategories();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const ownedShops = (myShops || []).filter((shop, index, arr) =>
    shop.sellerId === user?.id && arr.findIndex((candidate) => candidate.id === shop.id) === index
  );
  const primaryOwnedShop = ownedShops[0];
  const hasOwnedShop = ownedShops.length > 0;
  const profileTarget = user?.role === 'admin'
    ? '/admin/profile'
    : user?.role === 'seller'
      ? (hasOwnedShop && primaryOwnedShop ? `/shop/${primaryOwnedShop.id}/manage` : '/seller/dashboard')
      : '/buyer/profile';
  const ordersTarget = user?.role === 'admin'
    ? '/admin/orders'
    : user?.role === 'seller'
      ? '/seller/orders'
      : '/buyer/orders';

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    reloadMyShops(user.id);
  }, [isAuthenticated, reloadMyShops, user?.id]);

  // ✅ Cleanup all drawer/menu states on navigation
  useEffect(() => {
    // Close all overlays when route changes
    setShowCartDrawer(false);
    setShowPaymentOptions(false);
    setMobileMenuOpen(false);
    setShowCategories(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  // ✅ Cleanup body overflow on mobile menu close and unmount
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    navigate('/', { replace: true });
  };

  return (
    <header>
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
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setShowCartDrawer(false)}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0, 0, 0, 0.5)', 
              zIndex: 1099,
              animation: 'fadeIn 0.3s ease'
            }} 
          />
          
          {/* Cart Sidebar */}
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            height: '100vh', 
            maxHeight: '100vh',
            width: 'min(420px, 100vw)', 
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', 
            boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.15)', 
            zIndex: 1100, 
            display: 'flex', 
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease',
            borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '1.25rem 1.5rem', 
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingCart size={22} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: 'white',
                    letterSpacing: '-0.02em'
                  }}>Mon Panier</h3>
                  <p style={{ 
                    margin: '0.2rem 0 0 0', 
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontWeight: 500
                  }}>{cart.items.length} article{cart.items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCartDrawer(false)} 
                style={{ 
                  border: 'none', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  padding: '10px', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items Container */}
            <div 
              className="cart-items-scroll-container"
              style={{ 
                flex: '1 1 auto', 
                overflowY: 'scroll', 
                overflowX: 'hidden',
                padding: '1rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minHeight: 0,
                maxHeight: 'calc(100vh - 280px)',
                WebkitOverflowScrolling: 'touch'
              }}>
              {cart.items.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#6b7280',
                  padding: '4rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: '50%',
                    padding: '2rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)'
                  }}>
                    <ShoppingCart size={48} style={{ color: '#10b981' }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#374151' }}>Votre panier est vide</p>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#9ca3af', maxWidth: '200px' }}>Explorez nos produits et ajoutez vos favoris !</p>
                  <Link 
                    to="/" 
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🛍️ Découvrir les produits
                  </Link>
                </div>
              ) : (
                cart.items.map((it) => (
                  <div 
                    key={it.product.id} 
                    style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      padding: '1rem',
                      background: 'white',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      alignItems: 'flex-start',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.12)';
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={it.product.images?.[0]} 
                        alt={it.product.title} 
                        style={{ 
                          width: 85, 
                          height: 85, 
                          objectFit: 'cover', 
                          borderRadius: 12,
                          flexShrink: 0,
                          border: '2px solid #f3f4f6'
                        }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                      }}>
                        {it.quantity}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '0.3rem',
                        fontSize: '0.95rem',
                        lineHeight: 1.3
                      }}>
                        {it.product.title}
                      </div>
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#6b7280',
                        marginBottom: '0.5rem'
                      }}>
                        {it.quantity} × {new Intl.NumberFormat('fr-FR').format(it.product.price)} FCFA
                      </div>
                      <div style={{ 
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#059669'
                      }}>
                        {new Intl.NumberFormat('fr-FR').format(it.quantity * it.product.price)} FCFA
                      </div>
                    </div>

                    {/* Controls */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 6,
                      flexShrink: 0
                    }}>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(it.product.id, it.quantity + 1)} 
                        style={{ 
                          border: '1px solid #d1d5db', 
                          background: 'white', 
                          padding: '6px 8px', 
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: '#059669',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0fdf4';
                          e.currentTarget.style.borderColor = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                      >
                        +
                      </button>
                      <span style={{ 
                        textAlign: 'center', 
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
                        {it.quantity}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(it.product.id, it.quantity - 1)} 
                        style={{ 
                          border: '1px solid #d1d5db', 
                          background: 'white', 
                          padding: '6px 8px', 
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: '#059669',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0fdf4';
                          e.currentTarget.style.borderColor = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                      >
                        −
                      </button>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(it.product.id)} 
                        style={{ 
                          border: 'none', 
                          background: '#fee2e2', 
                          color: '#dc2626', 
                          padding: '6px 8px',
                          borderRadius: 6,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          marginTop: '2px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fecaca';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                        }}
                      >
                        Suppr
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div style={{ 
                padding: '1.5rem', 
                borderTop: '1px solid #e5e7eb',
                background: 'white',
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)'
              }}>
                {/* Total */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '14px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div>
                    <div style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.85rem' }}>Total à payer</div>
                    <div style={{ color: '#374151', fontWeight: 400, fontSize: '0.75rem', marginTop: '2px' }}>Livraison non incluse</div>
                  </div>
                  <div style={{ 
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: '#059669',
                    textShadow: '0 1px 2px rgba(5, 150, 105, 0.1)'
                  }}>
                    {new Intl.NumberFormat('fr-FR').format(cart.total || 0)} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>FCFA</span>
                  </div>
                </div>

                {/* Buttons */}
                {!showPaymentOptions ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* <button 
                      type="button" 
                      onClick={() => setShowPaymentOptions(true)} 
                      style={{ 
                        textAlign: 'center', 
                        padding: '1rem', 
                        borderRadius: 10, 
                        background: 'linear-gradient(135deg, #10b981, #059669)', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                      }}
                    >
                      Passer la commande
                    </button> */}
                    <Link 
                      to="/cart" 
                      style={{ 
                        textAlign: 'center', 
                        padding: '1rem', 
                        borderRadius: 10, 
                        background: 'linear-gradient(135deg, #10b981, #059669)', 
                        border: 'none', 
                        color: 'white', 
                        textDecoration: 'none', 
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                      }}
                    >
                       Passer la commande
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ 
                        margin: '0 0 1rem 0', 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        color: '#1f2937'
                      }}>
                        Choisir le mode de paiement
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link 
                          to="/payment/mobile-money" 
                          style={{ 
                            padding: '1rem', 
                            borderRadius: 10, 
                            background: 'linear-gradient(135deg, #10b981, #059669)', 
                            color: 'white', 
                            textDecoration: 'none', 
                            fontWeight: 700,
                            textAlign: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          💳 Mobile Money
                        </Link>
                        <button 
                          type="button" 
                          onClick={() => navigate('/payment/cash-on-delivery')} 
                          style={{ 
                            padding: '1rem', 
                            borderRadius: 10, 
                            background: 'white', 
                            border: '1.5px solid #059669', 
                            color: '#059669', 
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            fontSize: '1rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f0fdf4';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          💰 À la livraison
                        </button>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowPaymentOptions(false)} 
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: 8, 
                        background: '#e5e7eb', 
                        border: 'none', 
                        color: '#374151', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#e5e7eb';
                      }}
                    >
                      ← Retour
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Profile Menu */}
      {showProfileMenu && isAuthenticated && (
        <>
          <button
            type="button"
            onClick={() => setShowProfileMenu(false)}
            aria-label="Fermer le menu profil"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'transparent',
              border: 'none',
              zIndex: 1200,
            }}
          />
          <div className="header-profile-menu" style={{
            position: 'fixed',
            top: '76px',
            right: '14px',
            width: 'min(320px, calc(100vw - 28px))',
            background: 'white',
            borderRadius: '14px',
            boxShadow: '0 14px 40px rgba(0,0,0,0.18)',
            border: '1px solid #e5e7eb',
            padding: '10px',
            zIndex: 1201
          }}>
            <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #f3f4f6', marginBottom: '6px' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>{user?.name || 'Mon compte'}</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>{user?.email}</p>
            </div>
            <Link to={profileTarget} onClick={() => setShowProfileMenu(false)} className="header-profile-menu-item">
              <User size={18} />
              Mon profil
            </Link>
            <Link to={ordersTarget} onClick={() => setShowProfileMenu(false)} className="header-profile-menu-item">
              <ShoppingCart size={18} />
              Historique commandes
            </Link>
            <button type="button" className="header-profile-menu-item danger" onClick={handleLogout}>
              <X size={18} />
              Déconnexion
            </button>
          </div>
        </>
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

            {/* Actions mobiles : compactes pour garder un header propre */}
            <div className="header-mobile-actions">
              <button type="button" onClick={() => setShowCartDrawer(true)} style={{ position: 'relative', padding: '12px', background: '#f0fdf4', borderRadius: '50%', color: '#059669', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '11px', fontWeight: 700, borderRadius: '50px', border: '2px solid white' }}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '6px',
                    }}
                    aria-label="Notifications"
                  >
                    <Bell size={19} />
                    <span style={{
                      position: 'absolute',
                      top: '7px',
                      right: '7px',
                      width: '8px',
                      height: '8px',
                      background: '#ef4444',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }} />
                  </button>
                  <Link
                    to={hasOwnedShop && primaryOwnedShop ? `/shop/${primaryOwnedShop.id}` : '/seller/create-shop'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: hasOwnedShop ? '#fff7ed' : '#f5f3ff',
                      color: hasOwnedShop ? '#c2410c' : '#7c3aed',
                      textDecoration: 'none',
                      marginRight: '6px',
                    }}
                    aria-label={hasOwnedShop ? 'Consulter ma boutique' : 'Créer ma boutique'}
                  >
                    <Store size={19} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    aria-label="Mon profil"
                  >
                    <User size={20} />
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', borderRadius: '50px', fontWeight: 600, fontSize: '14px', color: 'white', cursor: 'pointer', padding: '8px 16px' }}>
                  S'inscrire
                </button>
              )}
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
                    {(categories || []).map(cat => (
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
            <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  {/* Icône utilisateur connecté avant 'Créer ma boutique' */}
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#059669', background: '#f0fdf4', borderRadius: '50%', padding: '10px', marginRight: '8px', border: 'none', cursor: 'pointer' }}
                  >
                    <User size={20} />
                  </button>
                  {/* Owner/Create Shop Button */}
                  {hasOwnedShop && primaryOwnedShop ? (
                    <Link 
                      to={`/shop/${primaryOwnedShop.id}`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '7px 12px 7px 7px',
                        background: 'linear-gradient(135deg, #f97316, #fb923c)', 
                        color: 'white', 
                        borderRadius: '50px', 
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Store size={14} />
                      </div>
                      <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Consulter ma boutique</span>
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
                {(categories || []).slice(0, 8).map(cat => (
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
            {isAuthenticated && (
              <div style={{ marginBottom: '18px' }}>
                {hasOwnedShop && primaryOwnedShop ? (
                  <Link
                    to={`/shop/${primaryOwnedShop.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f97316, #fb923c)',
                      color: 'white',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Consulter ma boutique
                  </Link>
                ) : (
                  <Link
                    to="/seller/create-shop"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                      color: 'white',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Créer ma boutique
                  </Link>
                )}
              </div>
            )}

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
