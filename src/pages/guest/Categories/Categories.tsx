import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui';
import { categories, products } from '../../../data/mockData';
import './Categories.css';

export function Categories() {
  const { slug, subSlug } = useParams<{ slug: string; subSlug?: string }>();
  const selectedCategory = slug || null;
  const selectedSubCategory = subSlug || null;
  const [showSubcategories, setShowSubcategories] = useState(true);

  // Scroll vers le haut quand la catégorie change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, subSlug]);

  const currentCategory = categories.find(c => c.slug === selectedCategory);
  const currentSubCategory = currentCategory?.subcategories?.find(s => s.slug === selectedSubCategory);

  // Filtrer les produits selon la catégorie et sous-catégorie
  const filteredProducts = selectedCategory 
    ? products.filter(p => {
        if (selectedSubCategory) {
          // Si une sous-catégorie est sélectionnée, filtrer par sous-catégorie
          return p.category === selectedCategory || p.category === selectedSubCategory;
        }
        return p.category === selectedCategory;
      })
    : products;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="categories-page">
      {/* Hero */}
      <section className="categories-hero">
        {currentCategory ? (
          <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 28,
              padding: '60px 24px 48px 24px',
              marginBottom: 28,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
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

            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-1px', color: '#fff' }}>
                {currentCategory.icon} {currentCategory.name}
              </h1>
              {currentSubCategory && (
                <p style={{ fontSize: '1.4rem', opacity: 1, marginBottom: 12, color: '#fff', fontWeight: 700 }}>
                  {currentSubCategory.icon} {currentSubCategory.name}
                </p>
              )}
              <p style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: 700, margin: '0 auto 24px', color: '#fff', fontWeight: 500, lineHeight: 1.6 }}>
                {currentCategory.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700
                }}>
                  {filteredProducts.length} produits disponibles
                </span>
                {currentSubCategory ? (
                  <Link to={`/categories/${selectedCategory}`} style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ← Retour à {currentCategory.name}
                  </Link>
                ) : (
                  <Link to="/categories" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ← Retour aux catégories
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Sous-catégories */}
      {selectedCategory && currentCategory?.subcategories && currentCategory.subcategories.length > 0 && !selectedSubCategory && (
        <section className="subcategories-section">
          <div className="subcategories-header">
            <h2>Explorer {currentCategory.name}</h2>
            <button 
              className="toggle-subcategories-btn"
              onClick={() => setShowSubcategories(!showSubcategories)}
            >
              {showSubcategories ? 'Masquer' : 'Afficher'} les sous-catégories
            </button>
          </div>
          {showSubcategories && (
            <div className="subcategories-grid">
              {currentCategory.subcategories.map(sub => (
                <Link 
                  to={`/categories/${selectedCategory}/${sub.slug}`} 
                  key={sub.id} 
                  className="subcategory-card"
                >
                  <span className="subcategory-icon">{sub.icon}</span>
                  <span className="subcategory-name">{sub.name}</span>
                </Link>
              ))}
              <Link 
                to={`/categories/${selectedCategory}`} 
                className="subcategory-card subcategory-all"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSubcategories(false);
                  window.scrollTo({ top: document.querySelector('.categories-products')?.getBoundingClientRect().top! + window.scrollY - 100, behavior: 'smooth' });
                }}
              >
                <span className="subcategory-icon">📦</span>
                <span className="subcategory-name">Voir tous les produits</span>
              </Link>
            </div>
          )}
        </section>
      )}

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
