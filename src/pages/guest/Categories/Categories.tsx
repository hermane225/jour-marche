import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { Card } from '../../../components/ui';
import '../../../styles/product-card-mobile.css';
import { useCategories } from '../../../hooks/useCategories';
import { useProducts } from '../../../hooks/useProducts';
import './Categories.css';

export function Categories() {
  const { slug, subSlug } = useParams<{ slug: string; subSlug?: string }>();
  const selectedCategory = slug || null;
  const selectedSubCategory = subSlug || null;
  const [showSubcategories, setShowSubcategories] = useState(true);

  // Fetch data from API
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();
  const productsResult = useProducts({ category: selectedCategory || undefined, limit: 100 });
  const allProducts = productsResult.data || [];
  const productsLoading = productsResult.isLoading;

  // Scroll vers le haut quand la catégorie change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, subSlug]);

  const currentCategory = useMemo(() => {
    if (!allCategories) return null;
    return allCategories.find(c => c.slug === selectedCategory) || null;
  }, [allCategories, selectedCategory]);

  const currentSubCategory = useMemo(() => {
    if (!currentCategory || !selectedSubCategory) return null;
    return currentCategory.subcategories?.find(s => s.slug === selectedSubCategory) || null;
  }, [currentCategory, selectedSubCategory]);

  // Filtrer les produits selon la catégorie et sous-catégorie
  const filteredProducts = useMemo(() => {
    if (!selectedCategory || allProducts.length === 0) return allProducts;
    
    return allProducts.filter(p => {
      if (selectedSubCategory) {
        // Si une sous-catégorie est sélectionnée, filtrer par sous-catégorie
        return p.category === selectedCategory || p.category === selectedSubCategory;
      }
      return p.category === selectedCategory;
    });
  }, [selectedCategory, selectedSubCategory, allProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="categories-page">
      {/* Hero */}
      <section className="categories-hero">
        {currentCategory ? (
          <div className="categories-hero-card">
            <div className="categories-hero-orb categories-hero-orb-right" />
            <div className="categories-hero-orb categories-hero-orb-left" />

            <div className="categories-hero-content">
              <h1 className="categories-hero-title">
                {currentCategory.icon} {currentCategory.name}
              </h1>
              {currentSubCategory && (
                <p className="categories-hero-subtitle">
                  {currentSubCategory.icon} {currentSubCategory.name}
                </p>
              )}
              <p className="categories-hero-description">
                {currentCategory.description}
              </p>
              <div className="categories-hero-actions">
                <span className="categories-hero-badge">
                  {filteredProducts.length} produits disponibles
                </span>
                {currentSubCategory ? (
                  <Link to={`/categories/${selectedCategory}`} className="categories-hero-link">
                    Retour a {currentCategory.name}
                  </Link>
                ) : (
                  <Link to="/categories" className="categories-hero-link">
                    Retour aux categories
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
            {(allCategories || []).map(category => (
              <Link to={`/categories/${category.slug}`} key={category.slug} className={`category-card ${selectedCategory === category.slug ? 'active' : ''}`}>
                <span className="category-card-icon">{category.icon}</span>
                <span className="category-card-name">{category.name}</span>
                <span className="category-card-count">
                  {allProducts.filter(p => p.category === category.slug).length} produits
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

        <div className="products-grid-jumia">
          {productsLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement des produits...</div>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <div className="product-card">
                <div className="product-card__image">
                  <img src={product.images[0]} alt={product.title} />
                  {product.isPerishable && (
                    <span className="product-card__badge--stock">Frais</span>
                  )}
                </div>
                <div className="product-card__info">
                  <div className="product-card__shop">
                    <span className="product-card__shop-name">{product.shopName}</span>
                  </div>
                  <h3 className="product-card__title">{product.title}</h3>
                  <div className="product-card__price-section">
                    <span className="product-card__price">{formatPrice(product.price)}</span>
                    {product.unit && product.unit !== 'piece' && (
                      <span className="product-card__original-price">/ {product.unit}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
          ) : (
            <div className="no-products" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p>Aucun produit trouvé dans cette catégorie</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
