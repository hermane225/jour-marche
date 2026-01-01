import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Phone, Clock, Truck, Package, ArrowLeft, ShoppingCart, Heart, Store, MessageCircle, Share2 } from 'lucide-react';
import { shops, products } from '../../../data/mockData';
import { useCart } from '../../../context/CartContext';

export function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const shop = shops.find(s => s.id === id);
  const shopProducts = products.filter(p => p.shopId === id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

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
        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
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
                src={shop.logo} 
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
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#1f2937' }}>
              Produits de {shop.name}
            </h2>
            <p style={{ margin: 0, color: '#6b7280' }}>
              {shopProducts.length} produit{shopProducts.length !== 1 ? 's' : ''} disponible{shopProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {shopProducts.length === 0 ? (
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {shopProducts.map(product => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
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
                
                <div style={{ padding: '20px' }}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                      margin: '0 0 12px 0',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#1f2937',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px'
                  }}>
                    <span style={{
                      fontSize: '20px',
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
                        padding: '12px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <ShoppingCart size={20} />
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
