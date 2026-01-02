import { Link, useParams } from 'react-router-dom';
import { Card } from '../../../components/ui';
import { categories, products } from '../../../data/mockData';
import './Categories.css';

export function Categories() {
  const { slug } = useParams<{ slug: string }>();
  const selectedCategory = slug || null;

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const currentCategory = categories.find(c => c.slug === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="categories-page">
      {/* Hero */}
      <section className="categories-hero">
        {selectedCategory === 'restaurants' ? (
          <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 28,
              padding: '48px 24px 36px 24px',
              marginBottom: 28,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}>
            {/* Pattern décoratif */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-75px',
              left: '-75px',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)'
            }} />

            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: 14, letterSpacing: '-1px', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                🍽️ Restaurants, Maquis & Plein Air
              </h1>
              <p style={{ fontSize: '1.3rem', opacity: 0.98, maxWidth: 700, margin: '0 auto', color: '#fff', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                Vivez une expérience culinaire unique : savourez les meilleurs plats ivoiriens dans nos <span style={{ fontWeight: 700 }}>restaurants</span>, <span style={{ fontWeight: 700 }}>maquis animés</span> et <span style={{ fontWeight: 700 }}>espaces plein air</span>. Garba, grillades, spécialités locales, ambiance conviviale et fraîcheur garantie. <span style={{ fontWeight: 700 }}>Commandez, partagez, profitez !</span>
              </p>
            </div>
          </div>
        ) : null}
      </section>

      {/* Categories Grid */}
      {!selectedCategory && (
        <section className="categories-grid-section">
          <div className="categories-grid">
            {categories.map(category => (
              <Link to={`/categories/${category.slug}`} key={category.slug} className={`category-card ${selectedCategory === category.slug ? 'active' : ''}`}>
                <span className="category-card-icon">{category.icon}</span>
                <span className="category-card-name">{category.name}</span>
                <span className="category-card-count">
                  {products.filter(p => p.category === category.slug).length} produits
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="categories-products">
        <div className="categories-products-header">
          <h2>
            {selectedCategory 
              ? `${currentCategory?.icon} ${currentCategory?.name}`
              : 'Tous les produits'}
          </h2>
          <span className="products-count">{filteredProducts.length} produits</span>
        </div>

        <div className="categories-products-grid">
          {filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <Card className="product-card" hover>
                <div className="product-card-image">
                  <img src={product.images[0]} alt={product.title} />
                  {product.isPerishable && (
                    <span className="product-badge perishable">Frais</span>
                  )}
                </div>
                <div className="product-card-content">
                  <span className="product-shop">{product.shopName}</span>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-price">
                    <span className="price-current">{formatPrice(product.price)}</span>
                    {product.unit && product.unit !== 'piece' && (
                      <span className="price-unit">/ {product.unit}</span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>Aucun produit trouvé dans cette catégorie</p>
          </div>
        )}
      </section>
    </div>
  );
}
