import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui';
import { buyerOrders } from '../../../data/mockData';
import { BuyerSidebar } from './BuyerSidebar';
import { Package, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import './BuyerDashboard.css';

export function BuyerDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Livrée</Badge>;
      case 'in_progress':
        return <Badge variant="info">En cours</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="error">Annulée</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} color="#10b981" />;
      case 'in_progress':
        return <Clock size={20} color="#3b82f6" />;
      case 'pending':
        return <AlertCircle size={20} color="#f59e0b" />;
      case 'cancelled':
        return <AlertCircle size={20} color="#ef4444" />;
      default:
        return <Package size={20} color="#6b7280" />;
    }
  };

  // Statistiques
  const totalOrders = buyerOrders.length;
  const deliveredOrders = buyerOrders.filter(o => o.status === 'delivered').length;
  const pendingOrders = buyerOrders.filter(o => o.status === 'pending' || o.status === 'in_progress').length;
  const totalSpent = buyerOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="buyer-dashboard">
      <BuyerSidebar />

      <main className="buyer-main">
        <div className="buyer-header">
          <div>
            <h1 className="buyer-title">Mes Commandes</h1>
            <p className="buyer-subtitle">Suivi et gestion de vos achats</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b98122, #05966922)' }}>
              <Package size={24} color="#059669" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalOrders}</div>
              <div className="stat-label">Total commandes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b98122, #05966922)' }}>
              <CheckCircle size={24} color="#059669" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{deliveredOrders}</div>
              <div className="stat-label">Livrées</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f5a62222, #fbbf2422)' }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingOrders}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f622, #1d4ed822)' }}>
              <TrendingUp size={24} color="#3b82f6" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{formatPrice(totalSpent)}</div>
              <div className="stat-label">Total dépensé</div>
            </div>
          </div>
        </div>

        {/* Vue en cartes (mobile) et tableau (desktop) */}
        <div className="orders-view-toggle">
          <h2 className="orders-section-title">Historique des commandes</h2>
        </div>

        {/* Tableau Desktop */}
        <div className="buyer-orders-table-container">
          <table className="buyer-orders-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date</th>
                <th>Boutique</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buyerOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-number">#{order.orderNumber}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className="shop-name">{order.shopName}</td>
                  <td className="order-amount">{formatPrice(order.total)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <Link to={`/buyer/orders/${order.id}`} className="order-details-link">
                      Détails →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cartes Mobile */}
        <div className="orders-cards-container">
          {buyerOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-card-top">
                  <div className="order-card-number">Commande #{order.orderNumber}</div>
                  <div className="order-card-status">{getStatusBadge(order.status)}</div>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-card-row">
                  <span className="order-card-label">Date</span>
                  <span className="order-card-value">{formatDate(order.createdAt)}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Boutique</span>
                  <span className="order-card-value">{order.shopName}</span>
                </div>
                <div className="order-card-row">
                  <span className="order-card-label">Montant</span>
                  <span className="order-card-value price">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="order-card-footer">
                <Link to={`/buyer/orders/${order.id}`} className="order-card-link">
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
