import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card } from '../../../components/ui';
import { products } from '../../../data/mockData';
import './Promotions.css';

// Simuler des produits en promotion (valeurs fixes pour éviter les appels impurs)
const createPromoProducts = () => products.map((product, index) => ({
  ...product,
  originalPrice: Math.round(product.price * (1.2 + (index * 0.05))),
  discount: 15 + (index * 5) % 40,
  endsIn: new Date(Date.now() + (1 + index) * 24 * 60 * 60 * 1000),
  progressWidth: 20 + (index * 10) % 60,
}));

export function Promotions() {
  const promoProducts = useMemo(() => createPromoProducts(), []);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatTimeLeft = (index: number) => {
    const days = 1 + index;
    const hours = 12;
    return `${days}j ${hours}h`;
  };

  return (
    <div className="promotions-page">
      {/* Hero */}
      <section className="promotions-hero">
        <div className="promotions-hero-content">
          <span className="promo-tag">🔥 OFFRES LIMITÉES</span>
          <h1>Promotions Exclusives</h1>
          <p>Profitez de réductions incroyables sur une sélection de produits</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{promoProducts.length}</span>
              <span className="stat-text">Produits en promo</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">-50%</span>
              <span className="stat-text">Jusqu'à</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales */}
      <section className="flash-sales">
        <div className="flash-sales-header">
          <div className="flash-title">
            <span className="flash-icon">⚡</span>
            <h2>Ventes Flash</h2>
          </div>
          <div className="flash-timer">
            <Clock size={18} />
            <span>Se termine bientôt !</span>
          </div>
        </div>

        <div className="flash-sales-grid">
          {promoProducts.slice(0, 4).map(product => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <Card className="promo-card flash" hover>
                <div className="promo-card-image">
                  <img src={product.images[0]} alt={product.title} />
                  <span className="discount-badge">-{product.discount}%</span>
                  <div className="timer-badge">
                    <Clock size={12} />
                    {formatTimeLeft(promoProducts.indexOf(product))}
                  </div>
                </div>
                <div className="promo-card-content">
                  <h3>{product.title}</h3>
                  <div className="promo-prices">
                    <span className="price-old">{formatPrice(product.originalPrice)}</span>
                    <span className="price-new">{formatPrice(product.price)}</span>
                  </div>
                  <div className="promo-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${product.progressWidth}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">Quantité limitée</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Promo */}
      <section className="promo-categories">
        <div className="promo-categories-grid">
          <div className="promo-category-card food">
            <span className="category-icon">🍽️</span>
            <h3>Food & Restaurants</h3>
            <p>Jusqu'à -30% sur les plats</p>
            <Link to="/category/restaurants">Voir les offres →</Link>
          </div>
          <div className="promo-category-card mode">
            <span className="category-icon">👗</span>
            <h3>Mode & Accessoires</h3>
            <p>Jusqu'à -40% sur la mode</p>
            <Link to="/category/mode">Voir les offres →</Link>
          </div>
          <div className="promo-category-card tech">
            <span className="category-icon">📱</span>
            <h3>Électronique</h3>
            <p>Jusqu'à -25% sur le tech</p>
            <Link to="/category/electronique">Voir les offres →</Link>
          </div>
        </div>
      </section>

      {/* All Promotions */}
      <section className="all-promotions">
        <h2>Toutes les promotions</h2>
        <div className="promotions-grid">
          {promoProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <Card className="promo-card" hover>
                <div className="promo-card-image">
                  <img src={product.images[0]} alt={product.title} />
                  <span className="discount-badge">-{product.discount}%</span>
                </div>
                <div className="promo-card-content">
                  <span className="promo-shop">{product.shopName}</span>
                  <h3>{product.title}</h3>
                  <div className="promo-prices">
                    <span className="price-old">{formatPrice(product.originalPrice)}</span>
                    <span className="price-new">{formatPrice(product.price)}</span>
                  </div>
                  <span className="savings">
                    Économisez {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="promo-newsletter">
        <div className="newsletter-content">
          <h2>🔔 Ne ratez plus aucune promo !</h2>
          <p>Inscrivez-vous pour recevoir les meilleures offres en avant-première</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Votre email" />
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      </section>
    </div>
  );
}
