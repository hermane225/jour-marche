import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Card } from '../../../components/ui';
import { shops } from '../../../data/mockData';
import './Shops.css';

export function Shops() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Statistiques fictives pour la bannière
  const stats = [
    { label: 'Boutiques', value: '2 500+' },
    { label: 'Clients', value: '50 000+' },
    { label: 'Produits', value: '10 000+' },
    { label: 'Livraison', value: '24h partout à Abidjan' },
  ];

  return (
    <div className="shops-page">
      {/* Hero amélioré */}
      <section className="shops-hero" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '56px 0 32px 0', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: 12, letterSpacing: '-1px' }}>Découvrez nos Boutiques d’Excellence</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.95, maxWidth: 600, margin: '0 auto' }}>
          Les meilleurs vendeurs, artisans et commerçants de Côte d’Ivoire réunis sur une seule plateforme. Achetez en toute confiance, vendez sans limite.
        </p>
        {/* Bandeau stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginTop: 36,
          flexWrap: 'wrap',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.13)',
              borderRadius: 16,
              padding: '18px 32px',
              minWidth: 120,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              fontWeight: 700,
              fontSize: '1.1rem',
              margin: '8px 0',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</div>
              <div style={{ fontSize: '1rem', opacity: 0.93 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filtres */}
      <section className="shops-filters">
        <div className="shops-filters-container">
          <button className="filter-btn active">Toutes</button>
          <button className="filter-btn">Alimentation</button>
          <button className="filter-btn">Restaurants</button>
          <button className="filter-btn">Mode</button>
          <button className="filter-btn">Électronique</button>
          <button className="filter-btn">Beauté</button>
        </div>
      </section>

      {/* Grille boutiques améliorée */}
      <section className="shops-grid-section">
        <div className="shops-grid">
          {shops.map(shop => (
            <Link to={`/shop/${shop.id}`} key={shop.id} style={{ textDecoration: 'none' }}>
              <Card className="shop-card" hover>
                <div className="shop-card-header" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 24px 0 24px' }}>
                  <img 
                    src={shop.logo}
                    alt={shop.name}
                    className="shop-logo"
                    style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '3px solid #fff', background: '#f3f4f6' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 className="shop-name" style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0, color: '#059669' }}>{shop.name}</h3>
                    <p className="shop-description" style={{ margin: 0, fontSize: '0.98rem', color: '#374151', opacity: 0.92 }}>{shop.description}</p>
                  </div>
                  {shop.rating >= 4.7 && (
                    <span style={{
                      background: 'linear-gradient(135deg, #f59e42, #fbbf24)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      borderRadius: 12,
                      padding: '6px 16px',
                      marginLeft: 8,
                      boxShadow: '0 2px 8px rgba(251,191,36,0.18)'
                    }}>⭐ Meilleur vendeur</span>
                  )}
                </div>
                <div className="shop-card-content" style={{ padding: '0 24px 24px 24px', flex: 1 }}>
                  <div className="shop-meta" style={{ display: 'flex', gap: 18, margin: '18px 0 10px 0' }}>
                    <div className="shop-meta-item" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 600 }}>
                      <Star size={15} className="star-icon" />
                      <span>{shop.rating.toFixed(1)}</span>
                    </div>
                    <div className="shop-meta-item" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280' }}>
                      <MapPin size={15} />
                      <span>{shop.address}</span>
                    </div>
                  </div>
                  <div className="shop-stats" style={{ display: 'flex', gap: 18, marginBottom: 10 }}>
                    <div className="shop-stat" style={{ textAlign: 'center' }}>
                      <span className="stat-value" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#059669' }}>{shop.totalProducts}</span>
                      <span className="stat-label" style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Produits</span>
                    </div>
                    <div className="shop-stat" style={{ textAlign: 'center' }}>
                      <span className="stat-value" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#059669' }}>{formatPrice(shop.monthlySales)}</span>
                      <span className="stat-label" style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Ventes/mois</span>
                    </div>
                  </div>
                  {shop.deliveryOptions && (
                    <div className="shop-delivery" style={{ marginBottom: 10 }}>
                      {shop.deliveryOptions.delivery && (
                        <span className="delivery-tag" style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 8, padding: '4px 10px', fontSize: '0.85rem', fontWeight: 600, marginRight: 8 }}>
                          🚚 Livraison {shop.deliveryOptions.deliveryFee} FCFA
                        </span>
                      )}
                      {shop.deliveryOptions.pickup && (
                        <span className="delivery-tag" style={{ background: '#fef9c3', color: '#b45309', borderRadius: 8, padding: '4px 10px', fontSize: '0.85rem', fontWeight: 600 }}>
                          📍 Retrait gratuit
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ textAlign: 'right', marginTop: 18 }}>
                    <span style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      borderRadius: 24,
                      padding: '8px 22px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.13)',
                      transition: 'background 0.2s',
                    }}>
                      Découvrir
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="shops-cta">
        <div className="shops-cta-content">
          <h2>Vous vendez quelque chose ?</h2>
          <p>Légumes, attiéké, riz local, plats cuisinés, vêtements... Formel ou informel, tout le monde peut vendre sur Jour de Marché !</p>
          <Link to="/seller/create-shop" className="cta-btn">
            Ouvrir ma boutique gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
}
