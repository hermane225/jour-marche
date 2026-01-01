import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Store, Truck, Shield, Clock, Star, ChevronLeft, ChevronRight, TrendingUp, Users, ShoppingBag, Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { products, categories, shops } from '../../../data/mockData';
import { useCart } from '../../../context/CartContext';
import type { Product } from '../../../types';

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const trendingProducts = products.slice(0, 12) as ProductWithPromo[];
  const featuredShops = shops.slice(0, 4);
  const mainCategories = categories.slice(0, 8);
  
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

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
                <Link 
                  to={heroSlides[currentSlide].link}
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 32px', 
                    background: 'white', 
                    color: '#1f2937',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s'
                  }}
                >
                  {heroSlides[currentSlide].cta}
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: currentSlide === index ? '40px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="hero-image-container" style={{ position: 'relative' }}>
              <div style={{
                width: '100%',
                height: '400px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src={heroSlides[currentSlide].image}
                  alt=""
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s'
                  }}
                />
              </div>
              
              <div className="floating-stat" style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                background: 'white',
                padding: '20px 24px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
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
        </div>

        <button 
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
        <button 
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
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

          <div className="products-grid">
            {trendingProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`} 
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: hoveredProduct === product.id 
                    ? '0 25px 50px rgba(0,0,0,0.15)' 
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  transform: hoveredProduct === product.id ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}>
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
                      {product.originalPrice && (
                        <span style={{ 
                          padding: '6px 14px', 
                          background: 'linear-gradient(135deg, #dc2626, #ef4444)', 
                          color: 'white', 
                          fontSize: '12px', 
                          fontWeight: 800, 
                          borderRadius: '50px',
                          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
                        }}>
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
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

                    {/* Action Buttons - apparaissent au hover */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      opacity: hoveredProduct === product.id ? 1 : 0,
                      transform: hoveredProduct === product.id ? 'translateX(0)' : 'translateX(20px)',
                      transition: 'all 0.3s ease'
                    }}>
                      <button style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onClick={(e) => { e.preventDefault(); }}
                      >
                        <Heart size={20} color="#ef4444" />
                      </button>
                      <button style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={(e) => { e.preventDefault(); }}
                      >
                        <Eye size={20} color="#6b7280" />
                      </button>
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
                      <div onClick={(e) => e.stopPropagation()}>
                        <button style={{
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
                  <div style={{ padding: '20px' }}>
                    {/* Shop name with badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', 
                        color: '#059669', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Store size={12} />
                        {product.shopName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>4.8</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '16px', 
                      fontWeight: 700, 
                      color: '#1f2937', 
                      lineHeight: 1.4, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      minHeight: '44px'
                    }}>
                      {product.title}
                    </h3>

                    {/* Price Section */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #fafafa, #f5f5f5)',
                      borderRadius: '14px',
                      marginTop: '12px'
                    }}>
                      <div>
                        <span style={{ 
                          fontSize: '22px', 
                          fontWeight: 800, 
                          color: '#059669',
                          display: 'block'
                        }}>
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span style={{ 
                            fontSize: '13px', 
                            color: '#9ca3af', 
                            textDecoration: 'line-through' 
                          }}>
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: addedProductId === product.id
                              ? 'linear-gradient(135deg, #10b981, #34d399)'
                              : 'linear-gradient(135deg, #059669, #10b981)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                            border: 'none',
                            cursor: 'pointer',
                            transform: addedProductId === product.id ? 'scale(1.15)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {addedProductId === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Categories */}
      <section style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1f2937', margin: '0 0 12px 0' }}>
              Explorez nos catégories
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
              Du marché traditionnel aux boutiques modernes
            </p>
          </div>

          <div className="categories-grid">
            {mainCategories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '32px 20px',
                  background: 'white',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '2px solid transparent',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                }}
              >
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>{category.icon}</span>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#1f2937', textAlign: 'center' }}>
                  {category.name}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textAlign: 'center', lineHeight: 1.4 }}>
                  {category.description}
                </p>
              </Link>
            ))}
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
            <div style={{ width: '400px', height: '400px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
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
            {featuredShops.map((shop, index) => {
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
            })}
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
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

          <div className="all-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {(products as ProductWithPromo[]).map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`} 
                style={{ textDecoration: 'none' }}
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
                  border: '1px solid #f3f4f6'
                }}>
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
                    {product.originalPrice && (
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
                      <button style={{
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
                      <button style={{
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
                  <div style={{ padding: '16px' }}>
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
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ 
                          fontSize: '18px', 
                          fontWeight: 800, 
                          color: '#059669'
                        }}>
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
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
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        style={{
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
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {addedProductId === product.id ? <Check size={16} /> : <ShoppingCart size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
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
          .hero-grid { grid-template-columns: 1fr; text-align: center; padding: 40px 24px !important; min-height: auto !important; }
          .hero-title { font-size: 36px; }
          .hero-image-container { display: none; }
          .hero-nav-btn { display: none !important; }
          .categories-grid, .shops-grid { grid-template-columns: repeat(2, 1fr); }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .cta-grid { grid-template-columns: 1fr; text-align: center; }
          .cta-image { display: none !important; }
        }
        
        @media (max-width: 640px) {
          .hero-title { font-size: 28px; }
          .hero-grid { padding: 32px 16px !important; }
          .stats-grid { justify-content: flex-start; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .shops-grid { grid-template-columns: 1fr; }
          .trust-grid { grid-template-columns: 1fr; }
          .floating-stat, .floating-stat-2 { display: none !important; }
        }
      `}</style>
    </div>
  );
}
