import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Card } from '../../../components/ui';
import { shops } from '../../../data/mockData';
import './Shops.css';

export function Shops() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <div className="shops-page">
      {/* Hero */}
      <section className="shops-hero">
        <h1>🏪 Nos Boutiques</h1>
        <p>Découvrez les meilleurs vendeurs de Côte d'Ivoire</p>
      </section>

      {/* Filters */}
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

      {/* Shops Grid */}
      <section className="shops-grid-section">
        <div className="shops-grid">
          {shops.map(shop => (
            <Link to={`/shop/${shop.id}`} key={shop.id}>
              <Card className="shop-card" hover>
                <div className="shop-card-header">
                  <img 
                    src={shop.logo} 
                    alt={shop.name}
                    className="shop-logo"
                  />
                  {shop.rating >= 4.7 && (
                    <span className="shop-badge">Top Vendeur</span>
                  )}
                </div>
                <div className="shop-card-content">
                  <h3 className="shop-name">{shop.name}</h3>
                  <p className="shop-description">{shop.description}</p>
                  
                  <div className="shop-meta">
                    <div className="shop-meta-item">
                      <Star size={14} className="star-icon" />
                      <span>{shop.rating.toFixed(1)}</span>
                    </div>
                    <div className="shop-meta-item">
                      <MapPin size={14} />
                      <span>{shop.address}</span>
                    </div>
                  </div>

                  <div className="shop-stats">
                    <div className="shop-stat">
                      <span className="stat-value">{shop.totalProducts}</span>
                      <span className="stat-label">Produits</span>
                    </div>
                    <div className="shop-stat">
                      <span className="stat-value">{formatPrice(shop.monthlySales)}</span>
                      <span className="stat-label">Ventes/mois</span>
                    </div>
                  </div>

                  {shop.deliveryOptions && (
                    <div className="shop-delivery">
                      {shop.deliveryOptions.delivery && (
                        <span className="delivery-tag">
                          🚚 Livraison {shop.deliveryOptions.deliveryFee} FCFA
                        </span>
                      )}
                      {shop.deliveryOptions.pickup && (
                        <span className="delivery-tag">
                          📍 Retrait gratuit
                        </span>
                      )}
                    </div>
                  )}
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
