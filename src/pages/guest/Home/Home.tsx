import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Store, Truck, Shield, Clock, Star, ChevronLeft, ChevronRight, TrendingUp, Users, ShoppingBag, Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import type { Product } from '../../../types';
import { useProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { usePopularShops } from '../../../hooks/useShops';
import '../../../styles/product-card-mobile.css';


// Extension du type Product pour inclure originalPrice
type ProductWithPromo = Product & { originalPrice?: number };

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent, product: ProductWithPromo) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as Product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };
  

  const heroSlides = [
    {
      title: "Le marché de Côte d'Ivoire",
      subtitle: "à portée de clic",
      description: "Poulets, garba, grillades, légumes du village, attiéké frais, plats cuisinés, mode, artisanat...",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200",
      color: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      cta: "Explorer les produits",
      link: "/categories"
    },
    {
      title: "Tout le monde vend",
      subtitle: "sans difficulté !",
      description: "Du village à la ville, tout le monde peut vendre ! Vendeur de garba, grillardier, éleveur de poulets... C'est pour toi !",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
      color: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
      cta: "Commencer à vendre",
      link: "/seller/create-shop"
    },
    {
      title: "Livraison rapide",
      subtitle: "partout à Abidjan",
      description: "Recevez vos commandes fraîches directement chez vous ou au bureau.",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200",
      color: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
      cta: "Commander maintenant",
      link: "/categories"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data from API
  const productsResult = useProducts({ limit: 50 });
  const categoriesResult = useCategories();
  const shopsResult = usePopularShops(10);
  
  const allCategories = categoriesResult.data;
  const categoriesLoading = categoriesResult.isLoading;
  const popularShops = shopsResult.data;
  const shopsLoading = shopsResult.isLoading;

  // Extract products array from paginated response
  const allProducts = productsResult.data || [];
  const productsLoading = productsResult.isLoading;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  // Use memoized data with fallback to empty arrays
  const trendingProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return allProducts.slice(0, 12) as ProductWithPromo[];
  }, [allProducts]);

  const featuredShops = useMemo(() => {
    if (!popularShops || popularShops.length === 0) return [];
    return popularShops.slice(0, 4);
  }, [popularShops]);

  const mainCategories = useMemo(() => {
    if (!allCategories || allCategories.length === 0) return [];
    return allCategories.slice(0, 8);
  }, [allCategories]);

  // Produits des boutiques populaires
  const featuredShopProducts = useMemo(() => {
    if (!allProducts || !featuredShops || allProducts.length === 0 || featuredShops.length === 0) return [];
    return allProducts.filter(product =>
      featuredShops.some(shop => shop.id === product.shopId)
    ).slice(0, 8) as ProductWithPromo[];
  }, [allProducts, featuredShops]);
  
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Composant ProductCard compact style Jumia
  const renderProductCard = (product: ProductWithPromo) => (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className="product-card">
        {/* Image Container */}
        <div className="product-card__image">
          <img
            src={product.images[0]}
            alt={product.title}
          />
          {/* Badges */}
          <div className="product-card__badges">
            {!!product.originalPrice && (
              <span className="product-card__badge--discount">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
            {product.stock < 10 && (
              <span className="product-card__badge--stock">
                Stock limité
              </span>
            )}
          </div>
          {/* Action Buttons - desktop only */}
          <div className="product-card__actions">
            <button type="button" className="product-card__action-btn" onClick={(e) => { e.preventDefault(); }}>
              <Heart size={16} color="#ef4444" />
            </button>
            <button type="button" className="product-card__action-btn" onClick={(e) => { e.preventDefault(); }}>
              <Eye size={16} color="#6b7280" />
            </button>
          </div>
          {/* Quick Add Button - desktop only */}
          <div className="product-card__quick-add-overlay">
            <div onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="product-card__quick-add-btn"
                onClick={(e) => handleAddToCart(e, product)}
              >
                {addedProductId === product.id ? (
                  <><Check size={16} /> Ajouté !</>
                ) : (
                  <><ShoppingCart size={16} /> Ajouter au panier</>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Product Info */}
        <div className="product-card__info">
          {/* Shop name with rating */}
          <div className="product-card__shop">
            <Store size={10} color="#059669" />
            <span className="product-card__shop-name">{product.shopName}</span>
            <div className="product-card__rating">
              <Star size={10} fill="#fbbf24" color="#fbbf24" />
              <span>4.8</span>
            </div>
          </div>
          {/* Title */}
          <h3 className="product-card__title">{product.title}</h3>
          {/* Price Section */}
          <div className="product-card__price-section">
            <div className="product-card__price-wrapper">
              <span className="product-card__price">{formatPrice(product.price)}</span>
              {!!product.originalPrice && (
                <span className="product-card__original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <button
                type="button"
                className={`product-card__add-btn ${addedProductId === product.id ? 'product-card__add-btn--added' : ''}`}
                onClick={(e) => handleAddToCart(e, product)}
              >
                {addedProductId === product.id ? <Check size={14} /> : <ShoppingCart size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{ background: '#fafafa' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          background: heroSlides[currentSlide].color,
          transition: 'background 0.5s ease'
        }}>
          <div className="hero-grid" style={{ 
            maxWidth: '1280px', 
            margin: '0 auto', 
            padding: '30px 24px',
            alignItems: 'center',
            minHeight: '300px'
          }}>
            <div style={{ color: 'white' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(255,255,255,0.2)', 
                padding: '8px 16px', 
                borderRadius: '50px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 500
              }}>
                <Sparkles size={16} />
                La marketplace à l'ivoirienne
              </div>
              <h1 className="hero-title" style={{ 
                fontWeight: 800, 
                lineHeight: 1.1, 
                margin: '0 0 16px 0'
              }}>
                {heroSlides[currentSlide].title}
                <br />
                <span style={{ opacity: 0.9 }}>{heroSlides[currentSlide].subtitle}</span>
              </h1>
              <p style={{ 
                fontSize: '18px', 
                opacity: 0.9, 
                marginBottom: '32px',
                maxWidth: '500px',
                lineHeight: 1.6
              }}>
                {heroSlides[currentSlide].description}
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {heroSlides[currentSlide].description}
              </div>
              <Link to={heroSlides[currentSlide].link} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '18px 36px', background: 'white', color: '#059669', borderRadius: '50px', fontWeight: 700, fontSize: '17px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                {heroSlides[currentSlide].cta}
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hero-image-container" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={heroSlides[currentSlide].image} alt="Hero" style={{ width: '100%', maxWidth: '420px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
            </div>
            {/* Floating stats */}
            <div className="floating-stat" style={{
              position: 'absolute',
              bottom: '30px',
              left: '-20px',
              background: 'white',
              padding: '16px 20px',
              borderRadius: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '24px', color: '#1f2937' }}>2,500+</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Vendeurs actifs</p>
              </div>
            </div>
            <div className="floating-stat-2" style={{
              position: 'absolute',
              top: '20px',
              right: '-20px',
              background: 'white',
              padding: '16px 20px',
              borderRadius: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ display: 'flex' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <span style={{ fontWeight: 600, color: '#1f2937' }}>4.9/5</span>
            </div>
          </div>
        </div>
        <button type="button"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="hero-nav-btn"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={24} color="#374151" />
        </button>
        <button type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="hero-nav-btn"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={24} color="#374151" />
        </button>
      </section>


      {/* Produits - Juste après le hero */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #f97316, #fb923c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={20} color="white" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  🔥 Tendances du moment
                </span>
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1f2937', margin: 0 }}>
                Nos meilleurs produits
              </h2>
            </div>
            <Link to="/categories" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              borderRadius: '50px',
              fontWeight: 600, 
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              Voir tout <ArrowRight size={18} />
            </Link>
          </div>
          <div className="products-grid-jumia">
            {productsLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement des produits...</div>
              </div>
            ) : productsResult.error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#ef4444' }}>Erreur: {productsResult.error.message}</div>
              </div>
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map(renderProductCard)
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Aucun produit disponible pour le moment</div>
              </div>
            )}
          </div>
          {/* Load More Button */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              to="/categories"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 40px',
                background: 'white',
                color: '#059669',
                border: '3px solid #059669',
                borderRadius: '60px',
                fontWeight: 700,
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Découvrir plus de produits
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>



      {/* Quick Stats */}
      <section style={{ background: 'white', borderBottom: '1px solid #f3f4f6', padding: '24px 0' }}>
        <div className="stats-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {[
            { icon: <ShoppingBag size={24} />, value: '10,000+', label: 'Produits', color: '#059669' },
            { icon: <Store size={24} />, value: '2,500+', label: 'Boutiques', color: '#8b5cf6' },
            { icon: <Users size={24} />, value: '50,000+', label: 'Clients', color: '#f97316' },
            { icon: <Truck size={24} />, value: '24h', label: 'Livraison', color: '#06b6d4' },
          ].map((stat, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '24px', color: '#1f2937' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Produits des boutiques populaires */}
      {featuredShopProducts.length > 0 && (
        <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #fafafa 0%, #f0fdf4 100%)' }}>
          <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Store size={20} />
                  </div>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1f2937' }}>
                    Produits populaires des vendeurs
                  </h2>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#6b7280' }}>
                  Découvrez les meilleurs produits de nos vendeurs partenaires
                </p>
              </div>
              <Link
                to="/boutiques"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                  color: 'white',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}
              >
                Voir toutes les boutiques <ArrowRight size={18} />
              </Link>
            </div>
            <div className="products-grid">
              {featuredShopProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  style={{ textDecoration: 'none' }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: hoveredProduct === product.id
                        ? '0 25px 50px rgba(0,0,0,0.15)'
                        : '0 4px 20px rgba(0,0,0,0.08)',
                      transform: hoveredProduct === product.id ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Image Container */}
                    <div style={{
                      aspectRatio: '1',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
                    }}>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          transform: hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {product.stock < 10 && (
                          <span style={{ 
                            padding: '6px 14px', 
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
                      {/* Quick Add Button */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '12px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        transform: hoveredProduct === product.id ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          <button type="button" style={{
                            width: '100%',
                            padding: '14px',
                            background: addedProductId === product.id
                              ? 'linear-gradient(135deg, #10b981, #34d399)'
                              : 'linear-gradient(135deg, #059669, #10b981)',
                            border: 'none',
                            borderRadius: '14px',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                            transform: addedProductId === product.id ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                          }}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            {addedProductId === product.id ? (
                              <>
                                <Check size={18} />
                                Ajouté !
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={18} />
                                Ajouter au panier
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Product Info */}
                    <div style={{ padding: '12px' }}>
                      {/* Shop name with badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          padding: '3px 8px',
                          background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                          color: '#8b5cf6',
                          fontSize: '10px',
                          fontWeight: 600,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <Store size={10} />
                          {product.shopName}
                        </span>
                      </div>
                      {/* Title */}
                      <h3 style={{
                        margin: '0 0 8px 0',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1f2937',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '36px'
                      }}>
                        {product.title}
                      </h3>
                      {/* Price Section */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px'
                      }}>
                        <div>
                          <span style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#059669',
                            display: 'block'
                          }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          <button type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: addedProductId === product.id
                                ? 'linear-gradient(135deg, #10b981, #34d399)'
                                : 'linear-gradient(135deg, #059669, #10b981)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                              border: 'none',
                              cursor: 'pointer',
                              transform: addedProductId === product.id ? 'scale(1.1)' : 'scale(1)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {addedProductId === product.id ? <Check size={14} /> : <ShoppingCart size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              padding: '10px 24px',
              borderRadius: '50px',
              marginBottom: '16px'
            }}>
              <ShoppingBag size={18} color="#059669" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Catégories
              </span>
            </div>
            <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#1f2937', margin: '0 0 16px 0', lineHeight: 1.2 }}>
              Explorez nos catégories
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              Du marché traditionnel aux boutiques modernes, trouvez tout ce dont vous avez besoin
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            marginBottom: '48px'
          }}>
            {categoriesLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement des catégories...</div>
              </div>
            ) : categoriesResult.error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#ef4444' }}>Erreur: {categoriesResult.error.message}</div>
              </div>
            ) : mainCategories.length > 0 ? (
              mainCategories.map((category, idx) => {
              const categoryColors = [
                { bg: '#10b981', light: '#dcfce7', icon: '🥬' },
                { bg: '#8b5cf6', light: '#f3e8ff', icon: '🥣' },
                { bg: '#f97316', light: '#fed7aa', icon: '🌾' },
                { bg: '#06b6d4', light: '#cffafe', icon: '🍽️' },
                { bg: '#ec4899', light: '#fce7f3', icon: '🥩' },
                { bg: '#f59e0b', light: '#fef3c7', icon: '🌶️' },
                { bg: '#14b8a6', light: '#ccfbf1', icon: '🧃' },
                { bg: '#3b82f6', light: '#dbeafe', icon: '🥐' },
              ];
              const color = categoryColors[idx % categoryColors.length];
              const productCount = allProducts.filter(p => p.category === category.slug).length;
              
              return (
                <Link 
                  key={category.id}
                  to={`/category/${category.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0',
                    background: 'white',
                    borderRadius: '24px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: '2px solid transparent',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.borderColor = color.bg;
                    e.currentTarget.style.boxShadow = `0 25px 50px ${color.bg}25, 0 0 0 1px ${color.bg}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Gradient Header */}
                  <div style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${color.bg} 0%, ${color.bg}dd 100%)`,
                    padding: '32px 24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Background Pattern */}
                    <div style={{
                      position: 'absolute',
                      top: '-40px',
                      right: '-40px',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      opacity: 0.5
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '-30px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      opacity: 0.3
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        fontSize: '56px',
                        marginBottom: '12px',
                        display: 'block'
                      }}>
                        {category.icon}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      padding: '6px 12px',
                      borderRadius: '50px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                      position: 'relative',
                      zIndex: 2
                    }}>
                      {productCount}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{
                    padding: '24px',
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 8px 0',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#1f2937'
                      }}>
                        {category.name}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: 1.5
                      }}>
                        {category.description}
                      </p>
                    </div>
                    
                    {/* Footer Badge */}
                    <div style={{
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: `1px solid ${color.light}`
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: color.bg,
                        background: color.light,
                        padding: '4px 12px',
                        borderRadius: '50px'
                      }}>
                        Voir les produits
                      </span>
                      <ArrowRight size={18} color={color.bg} style={{ transition: 'transform 0.3s ease' }} />
                    </div>
                  </div>
                </Link>
              );
            })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Aucune catégorie disponible</div>
              </div>
            )}
          </div>


          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link 
              to="/categories"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              Voir toutes les catégories
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner - Devenir Vendeur */}
      <section style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        <div className="cta-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', alignItems: 'center', position: 'relative' }}>
          <div style={{ color: 'white' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2, margin: '0 0 20px 0' }}>
              Vendez sans difficulté !
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.95, lineHeight: 1.7, marginBottom: '32px' }}>
              Poulets, garba, grillades, légumes du village, attiéké, plats cuisinés, vêtements...
              <strong> Du village à Abidjan, tout le monde vend ici !</strong>
              <br /><br />
              🐔 Éleveur de poulets ? <strong>C'est pour toi !</strong><br />
              🍖 Grillardier, vendeur de garba ? <strong>C'est pour toi !</strong><br />
              🌾 Villageois avec des produits frais ? <strong>C'est pour toi !</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {['Inscription simple - juste votre numéro !', 'Créez votre boutique en 2 minutes', 'Gérez tout depuis votre téléphone'].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#8b5cf6', fontSize: '14px' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '16px' }}>{item}</span>
                </div>
              ))}
            </div>

            <Link to="/seller/create-shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '18px 36px', background: 'white', color: '#7c3aed', borderRadius: '50px', fontWeight: 700, fontSize: '17px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <Sparkles size={22} />
              Ouvrir ma boutique gratuitement
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="cta-image" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', height: 'clamp(300px, 80vw, 400px)', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: 'clamp(20px, 5vw, 30px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#1f2937' }}>Ma Boutique</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Tableau de bord</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#059669' }}>127</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Ventes</p>
                  </div>
                  <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#d97706' }}>4.9★</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Note</p>
                  </div>
                </div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '12px', padding: '16px', color: 'white', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>+125,000 FCFA</p>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Gains ce mois</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shops - Design amélioré */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #fafafa 0%, #f0fdf4 100%)' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              padding: '10px 24px',
              borderRadius: '50px',
              marginBottom: '16px'
            }}>
              <Store size={20} color="#059669" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Nos vendeurs
              </span>
            </div>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#1f2937', margin: '0 0 12px 0' }}>
              Boutiques populaires
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Découvrez les meilleurs vendeurs de Côte d'Ivoire
            </p>
          </div>

          <div className="shops-grid">
            {shopsLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement des boutiques...</div>
              </div>
            ) : shopsResult.error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#ef4444' }}>Erreur: {shopsResult.error.message}</div>
              </div>
            ) : featuredShops.length > 0 ? (
              featuredShops.map((shop, index) => {
              const gradients = [
                'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
              ];
              const bgGradient = gradients[index % gradients.length];
              
              return (
                <Link key={shop.id} to={`/shop/${shop.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '28px', 
                    overflow: 'hidden', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)', 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'; 
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)'; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; 
                    }}
                  >
                    {/* Header avec gradient */}
                    <div style={{ 
                      height: '120px', 
                      background: bgGradient,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Pattern décoratif */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-30px',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                      }} />
                      
                      {/* Badge Top Vendeur */}
                      {shop.rating >= 4.5 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '16px', 
                          right: '16px', 
                          padding: '8px 16px', 
                          background: 'rgba(255,255,255,0.95)', 
                          backdropFilter: 'blur(10px)',
                          color: '#059669', 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          borderRadius: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}>
                          <span>⭐</span> Top Vendeur
                        </div>
                      )}
                      
                      {/* Logo boutique */}
                      <div style={{
                        position: 'absolute',
                        bottom: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}>
                        <div style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '50%',
                          border: '5px solid white',
                          overflow: 'hidden',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          background: 'white'
                        }}>
                          <img 
                            src={shop.logo} 
                            alt={shop.name} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div style={{ padding: '55px 24px 24px 24px', textAlign: 'center' }}>
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '20px', 
                        fontWeight: 800, 
                        color: '#1f2937'
                      }}>
                        {shop.name}
                      </h3>
                      
                      {/* Stats inline */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '16px', 
                        marginBottom: '16px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '15px' }}>
                            {shop.rating.toFixed(1)}
                          </span>
                        </div>
                        <span style={{ color: '#d1d5db' }}>•</span>
                        <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
                          {shop.totalProducts} produits
                        </span>
                      </div>
                      
                      <p style={{ 
                        margin: '0 0 20px 0', 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        lineHeight: 1.6,
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden',
                        minHeight: '44px'
                      }}>
                        {shop.description}
                      </p>
                      
                      {/* Bouton visiter */}
                      <div style={{
                        padding: '14px 24px',
                        background: bgGradient,
                        borderRadius: '14px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        <Eye size={18} />
                        Visiter la boutique
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Aucune boutique disponible</div>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link 
              to="/boutiques" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '18px 40px', 
                background: 'white', 
                color: '#059669', 
                border: '3px solid #059669', 
                borderRadius: '60px', 
                fontWeight: 700, 
                fontSize: '16px', 
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Découvrir toutes les boutiques
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Tous les Produits */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              padding: '10px 24px',
              borderRadius: '50px',
              marginBottom: '16px'
            }}>
              <ShoppingBag size={20} color="#d97706" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Catalogue complet
              </span>
            </div>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#1f2937', margin: '0 0 12px 0' }}>
              Tous nos produits
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Explorez notre large sélection de produits ivoiriens
            </p>
          </div>

          <div className="all-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 50vw, 240px), 1fr))', gap: 'clamp(12px, 3vw, 24px)' }}>
            {productsLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement des produits...</div>
              </div>
            ) : productsResult.error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#ef4444' }}>Erreur: {productsResult.error.message}</div>
              </div>
            ) : allProducts.length > 0 ? (
              (allProducts as ProductWithPromo[]).map((product) => (
              <div 
                key={product.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: hoveredProduct === product.id 
                    ? '0 20px 40px rgba(0,0,0,0.12)' 
                    : '0 4px 15px rgba(0,0,0,0.06)',
                  transform: hoveredProduct === product.id ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f3f4f6',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Link 
                    to={`/product/${product.id}`} 
                    style={{ textDecoration: 'none', display: 'block', flex: 1 }}
                  >
                    {/* Image */}
                    <div style={{ 
                      aspectRatio: '1', 
                      overflow: 'hidden', 
                      position: 'relative',
                      background: '#f8fafc'
                    }}>
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          transition: 'transform 0.4s ease',
                          transform: hoveredProduct === product.id ? 'scale(1.08)' : 'scale(1)'
                        }} 
                      />
                      
                      {/* Badge promo */}
                      {!!product.originalPrice && (
                        <span style={{ 
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          padding: '5px 12px', 
                          background: '#dc2626', 
                          color: 'white', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          borderRadius: '50px'
                        }}>
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                      
                      {/* Actions rapides */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        transform: hoveredProduct === product.id ? 'translateX(0)' : 'translateX(15px)',
                        transition: 'all 0.3s ease'
                      }}>
                        <button type="button" style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: 'none',
                          background: 'white',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Heart size={16} color="#ef4444" />
                        </button>
                        <button type="button" style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: 'none',
                          background: 'white',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Eye size={16} color="#059669" />
                        </button>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Store size={12} color="#6b7280" />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{product.shopName}</span>
                      </div>
                      
                      <h3 style={{ 
                        margin: '0 0 10px 0', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#1f2937',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px'
                      }}>
                        {product.title}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <div>
                          <span style={{ 
                            fontSize: '18px', 
                            fontWeight: 800, 
                            color: '#059669'
                          }}>
                            {formatPrice(product.price)}
                          </span>
                          {!!product.originalPrice && (
                            <span style={{ 
                              display: 'block',
                              fontSize: '12px', 
                              color: '#9ca3af', 
                              textDecoration: 'line-through' 
                            }}>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Add to cart button outside link */}
                  <button 
                    type="button"
                    data-action="add-to-cart"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(e, product);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: addedProductId === product.id 
                        ? 'linear-gradient(135deg, #10b981, #34d399)' 
                        : 'linear-gradient(135deg, #059669, #10b981)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transform: addedProductId === product.id ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      zIndex: 10
                    }}
                  >
                    {addedProductId === product.id ? <Check size={16} /> : <ShoppingCart size={16} />}
                  </button>
                </div>
              </div>
            ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Aucun produit disponible</div>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link 
              to="/categories" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '18px 40px', 
                background: 'linear-gradient(135deg, #d97706, #f59e0b)', 
                color: 'white', 
                borderRadius: '60px', 
                fontWeight: 700, 
                fontSize: '16px', 
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(217, 119, 6, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.35)';
              }}
            >
              Explorer par catégorie
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ background: 'white', padding: '60px 0', borderTop: '1px solid #f3f4f6' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="trust-grid">
            {[
              { icon: <Truck size={32} />, title: 'Livraison rapide', desc: 'Partout à Abidjan sous 24h', color: '#059669' },
              { icon: <Shield size={32} />, title: 'Paiement sécurisé', desc: 'Mobile Money, Carte, Cash', color: '#8b5cf6' },
              { icon: <Clock size={32} />, title: 'Service client', desc: 'Disponible 7j/7', color: '#f97316' },
              { icon: <Star size={32} />, title: 'Qualité garantie', desc: 'Vendeurs vérifiés', color: '#06b6d4' },
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', borderRadius: '20px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                  {item.icon}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        .hero-title { font-size: 52px; }
        .stats-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 24px; }
        .categories-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
        .shops-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
        .cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        
        @media (max-width: 1280px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
        }
        
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; text-align: center; padding: 40px 0 !important; min-height: auto !important; }
          .hero-title { font-size: 36px; }
          .hero-image-container { display: block !important; }
          .hero-nav-btn { display: none !important; }
          .categories-grid, .shops-grid { grid-template-columns: repeat(2, 1fr); }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .cta-grid { grid-template-columns: 1fr; text-align: center; }
          .cta-image { display: block !important; }
          .hero-grid, .stats-grid, .cta-grid, .container { padding-left: 0 !important; padding-right: 0 !important; max-width: 100vw !important; }
        }
        
        @media (max-width: 640px) {
          .hero-title { font-size: 28px; }
          .hero-grid { padding: 32px 0 !important; }
          .stats-grid { justify-content: flex-start; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .shops-grid { grid-template-columns: 1fr; }
          .trust-grid { grid-template-columns: 1fr; }
          .floating-stat, .floating-stat-2 { display: none !important; }
          .container { padding-left: 0 !important; padding-right: 0 !important; max-width: 100vw !important; }
        }
      `}</style>
    </div>
  );
}
