import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronDown, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { Button, Card, Badge } from '../../../components/ui';
import { products } from '../../../data/mockData';
import './ProductDetail.css';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produit non trouvé</h2>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' XOF';
  };

  const colorVariant = product.variants?.find(v => v.type === 'color');

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Produits similaires (même catégorie)
  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <nav className="product-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      {/* Product Main */}
      <div className="product-main">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="product-gallery-main">
            <img 
              src={product.images[selectedImage]} 
              alt={product.title} 
            />
          </div>
          {product.images.length > 1 && (
            <div className="product-gallery-thumbs">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`product-gallery-thumb ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <Link to={`/shop/${product.shopId}`} className="product-shop-link">
            Vendu par : {product.shopName}
          </Link>

          <h1 className="product-title">{product.title}</h1>

          <div className="product-price-stock">
            <span className="product-price">{formatPrice(product.price)}</span>
            <Badge variant={product.stock > 0 ? 'success' : 'error'}>
              {product.stock > 0 ? 'En Stock' : 'Rupture de stock'}
            </Badge>
          </div>

          {/* Color Variant */}
          {colorVariant && (
            <div className="product-variant">
              <label>Couleur</label>
              <div className="product-variant-select">
                <select 
                  value={selectedColor} 
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Sélectionner</option>
                  {colorVariant.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={20} />
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="product-quantity">
            <label>Quantité</label>
            <div className="product-quantity-control">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button 
            variant={addedToCart ? "primary" : "secondary"}
            fullWidth 
            size="lg"
            leftIcon={addedToCart ? <Check size={20} /> : <ShoppingCart size={20} />}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={addedToCart ? { background: '#10b981', borderColor: '#10b981' } : undefined}
          >
            {addedToCart ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="product-tabs-header">
          <button 
            className={`product-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`product-tab ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Caractéristiques
          </button>
          <button 
            className={`product-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Avis Clients (0)
          </button>
        </div>

        <div className="product-tabs-content">
          {activeTab === 'description' && (
            <div className="product-description">
              <h3>Description du Produit</h3>
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="product-specs">
              <h3>Caractéristiques</h3>
              <p>Catégorie: {product.category}</p>
              <p>Stock disponible: {product.stock} unités</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="product-reviews">
              <p>Aucun avis pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="product-similar">
          <h2>Produits Similaires</h2>
          <div className="product-similar-grid">
            {similarProducts.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="product-similar-link">
                <Card className="product-similar-card" hover padding="none">
                  <div className="product-similar-image">
                    <img src={p.images[0]} alt={p.title} />
                  </div>
                  <div className="product-similar-info">
                    <h4>{p.title}</h4>
                    <p className="product-similar-shop">{p.shopName}</p>
                    <p className="product-similar-price">{formatPrice(p.price)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
