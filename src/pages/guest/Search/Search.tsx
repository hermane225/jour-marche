import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  X, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Star, 
  Store,
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useProductSearch } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import '../../../styles/product-card-mobile.css';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Fetch data from API
  const { data: searchResults, isLoading: searchLoading } = useProductSearch(query || '', 100);
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  useEffect(() => {
    setSearchInput(query);
    // Scroll vers le haut quand la recherche change
    window.scrollTo(0, 0);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  // Filter and sort products from API results
  const filteredProducts = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];
    
    let results = searchResults.filter(product => {
      // Filtre par catégorie
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      // Filtre par prix
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesPrice;
    });

    // Tri
    switch (sortBy) {
      case 'price-asc':
        results = results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results = results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results = results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        results = results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Relevance - garder l'ordre
        break;
    }

    return results;
  }, [searchResults, selectedCategory, priceRange, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' F';
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 100000]);
    setSortBy('relevance');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header de recherche */}
      <div style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        padding: '40px 20px',
        marginBottom: '30px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 className="search-header-title" style={{ 
            color: 'white', 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🔍 Rechercher des produits
          </h1>
          
          <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="search-form-container" style={{ 
              display: 'flex', 
              background: 'white', 
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher poulet, garba, vêtements, téléphones..."
                className="search-input"
                style={{
                  flex: 1,
                  padding: '18px 24px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px'
                }}
              />
              <button
                type="submit"
                className="search-btn"
                style={{
                  padding: '18px 30px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}
              >
                <SearchIcon size={20} />
                <span className="search-btn-text">Rechercher</span>
              </button>
            </div>
          </form>

          {query && (
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              textAlign: 'center', 
              marginTop: '16px',
              fontSize: '15px'
            }}>
              {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''} pour "{query}"
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Barre de filtres */}
        <div className="search-filters-bar" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: showFilters ? '#059669' : 'white',
                color: showFilters ? 'white' : '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <SlidersHorizontal size={18} />
              Filtres
              {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 100000) && (
                <span style={{
                  background: showFilters ? 'white' : '#059669',
                  color: showFilters ? '#059669' : 'white',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  Actif
                </span>
              )}
            </button>

            {/* Tri */}
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  appearance: 'none',
                  padding: '12px 40px 12px 16px',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="newest">Plus récents</option>
                <option value="name">Nom A-Z</option>
              </select>
              <ChevronDown size={16} style={{ 
                position: 'absolute', 
                right: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6b7280'
              }} />
            </div>
          </div>

          {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 100000) && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                background: '#fef2f2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <X size={16} />
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Panel de filtres */}
        {showFilters && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div className="filter-panel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 50vw, 250px), 1fr))', gap: 'clamp(12px, 3vw, 24px)' }}>
              {/* Catégorie */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  color: '#374151'
                }}>
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Toutes les catégories</option>
                  {(allCategories || []).map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Prix minimum */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  color: '#374151'
                }}>
                  Prix minimum
                </label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Prix maximum */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  color: '#374151'
                }}>
                  Prix maximum
                </label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  placeholder="100000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        {searchLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '18px', color: '#6b7280' }}>Recherche en cours...</div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="search-results-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 50vw, 280px), 1fr))',
            gap: 'clamp(12px, 3vw, 24px)'
          }}>
            <div className="products-grid-jumia">
              {filteredProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <div className="product-card" style={{ position: 'relative' }}>
                    <div className="product-card__image">
                      <img src={product.images[0]} alt={product.title} />
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="product-card__badge--stock">Plus que {product.stock}</span>
                      )}
                    </div>
                    <div className="product-card__info">
                      <div className="product-card__shop">
                        <span className="product-card__shop-name">{product.shopName}</span>
                      </div>
                      <h3 className="product-card__title">{product.title}</h3>
                      <div className="product-card__price-section">
                        <span className="product-card__price">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#10b981',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.3s ease',
                        transform: addedProductId === product.id ? 'scale(1.2)' : 'scale(1)'
                      }}
                      onMouseOver={(e) => {
                        if (addedProductId !== product.id) {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (addedProductId !== product.id) {
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      {addedProductId === product.id ? (
                        <Check size={20} color="white" />
                      ) : (
                        <ShoppingCart size={20} color="white" />
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '20px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
              Aucun produit trouvé
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {query 
                ? `Nous n'avons pas trouvé de produits pour "${query}"`
                : "Entrez un terme de recherche pour trouver des produits"
              }
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600'
              }}
            >
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .search-header-title {
          font-size: 28px;
        }
        .search-form-container {
          display: flex;
          flex-direction: row;
        }
        .search-input {
          padding: 18px 24px;
        }
        .search-btn {
          padding: 18px 30px;
        }
        .search-btn-text {
          display: inline;
        }
        .search-filters-bar {
          flex-direction: row;
          align-items: center;
        }
        .search-results-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .filter-panel-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        @media (max-width: 768px) {
          .search-header-title {
            font-size: 22px !important;
          }
          .search-form-container {
            flex-direction: column !important;
          }
          .search-input {
            padding: 16px 20px !important;
            border-radius: 12px !important;
          }
          .search-btn {
            padding: 16px 24px !important;
            border-radius: 12px !important;
            margin-top: 12px !important;
            justify-content: center !important;
          }
          .search-btn-text {
            display: inline !important;
          }
          .search-filters-bar {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .search-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .filter-panel-grid {
            grid-template-columns: 1fr !important;
          }
          .product-card-title {
            font-size: 14px !important;
          }
          .product-card-price {
            font-size: 16px !important;
          }
          .product-card-btn {
            width: 38px !important;
            height: 38px !important;
          }
        }
        
        @media (max-width: 480px) {
          .search-header-title {
            font-size: 20px !important;
          }
          .search-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .product-card-info {
            padding: 12px !important;
          }
          .product-card-shop {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
