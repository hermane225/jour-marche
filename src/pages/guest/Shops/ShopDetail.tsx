import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Star, Phone, Clock, Truck, Package, ArrowLeft, ShoppingCart, Heart, Store, MessageCircle, Share2 } from 'lucide-react';
import { useShop } from '../../../hooks/useShops';
import { useShopProducts } from '../../../hooks/useProducts';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

export function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const normalizeId = (value: unknown): string => {
    if (typeof value === 'string') return value.trim();
    if (value && typeof value === 'object') {
      const candidate = (value as { _id?: string; id?: string })._id || (value as { _id?: string; id?: string }).id || '';
      return String(candidate).trim();
    }
    return '';
  };
  
  // Fetch shop and products from API
  const { data: shop, isLoading: shopLoading } = useShop(id || '');
  const { data: shopProducts, isLoading: productsLoading } = useShopProducts(id || '', 100);
  const isOwner = !!normalizeId(user?.id) && !!normalizeId(shop?.sellerId) && normalizeId(user?.id) === normalizeId(shop?.sellerId);
  const purchasableProducts = (shopProducts || []).filter(
    (product) => product.stock > 0 && (product.status === 'active' || product.status === 'published')
  );
  
  // Scroll vers le haut quand la boutique change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const syncViewport = () => setIsMobile(media.matches);
    syncViewport();
    media.addEventListener('change', syncViewport);
    return () => media.removeEventListener('change', syncViewport);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  if (shopLoading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px'
      }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Chargement de la boutique...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px'
      }}>
        <Store size={64} color="#9ca3af" />
        <h2 style={{ margin: 0, color: '#1f2937' }}>Boutique non trouvée</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Cette boutique n'existe pas ou a été supprimée.</p>
        <Link 
          to="/boutiques"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: 'white',
            borderRadius: '50px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={18} />
          Retour aux boutiques
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Header de la boutique */}
      <section style={{ 
        background: shop.banner
          ? `linear-gradient(rgba(5,150,105,0.72), rgba(16,185,129,0.72)), url(${shop.banner}) center/cover no-repeat`
          : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Pattern décoratif */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', position: 'relative' }}>
          {/* Bouton retour */}
          <Link 
            to="/boutiques"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              textDecoration: 'none',
              marginBottom: '24px',
              opacity: 0.9,
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={18} />
            Toutes les boutiques
          </Link>

          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            {/* Logo */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '28px',
              border: '5px solid white',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              flexShrink: 0,
              background: 'white'
            }}>
              <img 
                src={shop.logo || '/jour_marché.png'} 
                alt={shop.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Infos principales */}
            <div style={{ flex: 1, color: 'white', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 800 }}>{shop.name}</h1>
                {shop.rating >= 4.5 && (
                  <span style={{
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ⭐ Top Vendeur
                  </span>
                )}
              </div>

              <p style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                opacity: 0.95,
                maxWidth: '600px',
                lineHeight: 1.6
              }}>
                {shop.description}
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={20} fill="white" color="white" />
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>{shop.rating.toFixed(1)}</span>
                  <span style={{ opacity: 0.8 }}>({Math.floor(shop.monthlySales / 10)} avis)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={20} />
                  <span style={{ fontWeight: 600 }}>{shop.totalProducts} produits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={20} />
                  <span style={{ fontWeight: 600 }}>{formatPrice(shop.monthlySales)}/mois</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {isOwner && (
                <>
                  <Link
                    to="/dashboard/shop/edit"
                    style={{
                      padding: '14px 24px',
                      background: 'white',
                      color: '#065f46',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '15px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Modifier boutique
                  </Link>
                  <Link
                    to="/dashboard/shop/add-product"
                    style={{
                      padding: '14px 24px',
                      background: '#f59e0b',
                      color: '#111827',
                      border: '1px solid #fcd34d',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '15px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(245, 158, 11, 0.45)',
                    }}
                  >
                    Ajouter produit
                  </Link>
                  <Link
                    to="/dashboard/shop"
                    style={{
                      padding: '14px 24px',
                      background: '#022c22',
                      color: 'white',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '15px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Dashboard admin
                  </Link>
                </>
              )}
              <button style={{
                padding: '14px 24px',
                background: 'white',
                color: '#059669',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <MessageCircle size={18} />
                Contacter
              </button>
              <button style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={20} />
              </button>
              <button style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Infos détaillées */}
      <section style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 24px',
        marginTop: '-40px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {/* Contact */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="#059669" />
              Contact
            </h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>{shop.phone}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Disponible 7j/7</p>
          </div>

          {/* Adresse */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color="#059669" />
              Adresse
            </h3>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>{shop.address}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Abidjan, Côte d'Ivoire</p>
          </div>

          {/* Livraison */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={18} color="#059669" />
              Livraison
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {shop.deliveryOptions?.delivery && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: '#f0fdf4',
                  color: '#059669',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  🚚 Livraison: {formatPrice(shop.deliveryOptions.deliveryFee)}
                </span>
              )}
              {shop.deliveryOptions?.pickup && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: '#eff6ff',
                  color: '#3b82f6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  📍 Retrait en boutique gratuit
                </span>
              )}
            </div>
          </div>

          {/* Horaires */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color="#059669" />
              Horaires
            </h3>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#059669' }}>Ouvert maintenant</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Lun - Sam: 7h - 19h</p>
          </div>
        </div>
      </section>

      {/* Produits de la boutique */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '20px 12px 28px' : '60px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '21px' : '28px', fontWeight: 800, color: '#1f2937' }}>
              Produits de {shop.name}
            </h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
              {purchasableProducts.length} produit{purchasableProducts.length !== 1 ? 's' : ''} disponible{purchasableProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {productsLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement des produits...</div>
          </div>
        ) : purchasableProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Package size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
            <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>
              Cette boutique n'a pas encore de produits.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: isMobile ? '10px' : '24px'
          }}>
            {purchasableProducts.map(product => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: isMobile ? '14px' : '24px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ aspectRatio: isMobile ? '0.95' : '1', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    />
                    {product.stock < 10 && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '50px'
                      }}>
                        ⚡ Stock limité
                      </span>
                    )}
                  </div>
                </Link>
                
                <div style={{ padding: isMobile ? '10px' : '20px' }}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                      margin: '0 0 12px 0',
                      fontSize: isMobile ? '13px' : '16px',
                      fontWeight: 700,
                      color: '#1f2937',
                      lineHeight: isMobile ? 1.3 : 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.title}
                    </h3>
                  </Link>
                  <p style={{
                    margin: '0',
                    color: '#6b7280',
                    fontSize: isMobile ? '12px' : '14px',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 1 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description || 'Aucune description disponible.'}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: isMobile ? '10px' : '16px'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '15px' : '20px',
                      fontWeight: 800,
                      color: '#059669'
                    }}>
                      {formatPrice(product.price)}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      style={{
                        padding: isMobile ? '9px' : '12px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        color: 'white',
                        border: 'none',
                        borderRadius: isMobile ? '10px' : '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <ShoppingCart size={isMobile ? 17 : 20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Styles responsive */}
      <style>{`
        @media (max-width: 768px) {
          .shop-detail-header {
            flex-direction: column;
            text-align: center; 
          }
        }
      `}</style>
    </div>
  );
}
