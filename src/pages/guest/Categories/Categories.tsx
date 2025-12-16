import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../../components/ui';
import { categories, products } from '../../../data/mockData';
import './Categories.css';

export function Categories() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(slug || null);

  // Mettre à jour la catégorie sélectionnée quand l'URL change
  useEffect(() => {
    setSelectedCategory(slug || null);
  }, [slug]);

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
        <h1>{currentCategory ? `${currentCategory.icon} ${currentCategory.name}` : 'Toutes les Catégories'}</h1>
        <p>{currentCategory ? currentCategory.description : 'Explorez notre large sélection de produits par catégorie'}</p>
      </section>

      {/* Categories Grid */}
      <section className="categories-grid-section">
        <div className="categories-grid">
          {categories.map(category => (
            <Link
              key={category.id}
              to={selectedCategory === category.slug ? '/categories' : `/category/${category.slug}`}
              className={`category-card ${selectedCategory === category.slug ? 'active' : ''}`}
            >
              <span className="category-card-icon">{category.icon}</span>
              <span className="category-card-name">{category.name}</span>
              <span className="category-card-count">
                {products.filter(p => p.category === category.slug).length} produits
              </span>
            </Link>
          ))}
        </div>
      </section>

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
