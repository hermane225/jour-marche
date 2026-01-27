import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui';
import { SellerLayout } from '../Layout/SellerLayout';
import { shops, sellerProducts } from '../../../data/mockData';
import './ShopPage.css';

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const shop = shops[0]; // Pour la démo

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' CFA';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'low_stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'draft':
        return <Badge variant="neutral">Draft</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const filteredProducts = sellerProducts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="shop-page">
        {/* Shop Header */}
        <Card className="shop-header-card">
          <div className="shop-header">
            <div className="shop-header-logo">
              <img src={shop.logo} alt={shop.name} />
            </div>
            <div className="shop-header-info">
              <h1>{shop.name}</h1>
              <p>{shop.description}</p>
              <p className="shop-header-location">{shop.address}</p>
            </div>
            <Button variant="outline">Edit Boutique Details</Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="shop-stats-grid">
          <Card className="shop-stat-card">
            <p className="shop-stat-label">Total Products</p>
            <p className="shop-stat-value">{shop.totalProducts}</p>
          </Card>
          <Card className="shop-stat-card">
            <p className="shop-stat-label">Monthly Sales</p>
            <p className="shop-stat-value">{formatPrice(shop.monthlySales)}</p>
          </Card>
          <Card className="shop-stat-card">
            <p className="shop-stat-label">Average Rating</p>
            <p className="shop-stat-value">{shop.rating}/5</p>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="shop-products-card">
          <div className="shop-products-header">
            <h2>My Products</h2>
            <div className="shop-products-actions">
              <div className="shop-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search my products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="shop-filter-select">
                <option>All Categories</option>
                <option>Mode</option>
                <option>Électronique</option>
              </select>
              <select className="shop-filter-select">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Low Stock</option>
              </select>
              <Link to="/seller/products/create">
                <Button variant="primary" leftIcon={<Plus size={18} />}>
                  Ajouter un nouveau produit
                </Button>
              </Link>
            </div>
          </div>

          {/* Products Table */}
          <div className="shop-products-table-container">
            <table className="shop-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="shop-product-cell">
                        <img src={product.images[0]} alt={product.title} />
                        <span>{product.title}</span>
                      </div>
                    </td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>
                      <div className="shop-product-actions">
                        <button className="shop-action-btn edit">
                          <Pencil size={16} />
                        </button>
                        <button className="shop-action-btn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="shop-pagination">
            <span>Showing 1 to {filteredProducts.length} of {shop.totalProducts} results</span>
            <div className="shop-pagination-btns">
              <button disabled>Previous</button>
              <button>Next</button>
            </div>
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
}
