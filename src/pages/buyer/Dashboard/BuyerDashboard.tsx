import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BuyerSidebar } from './BuyerSidebar';
import { Badge } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useOrders } from '../../../context/OrderContext';
import { orderService } from '../../../services/api';
import type { Order } from '../../../types';
import { Package, TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw, UserCircle2 } from 'lucide-react';
import './BuyerDashboard.css';

export function BuyerDashboard() {
  const { user } = useAuth();
  const { orders: localOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<'api' | 'local'>('api');
  const [error, setError] = useState<string | null>(null);

  const getLocalUserOrders = () => {
    if (!user) return [];
    return localOrders.filter((order) => {
      const byName = order.customerName?.trim().toLowerCase() === user.name?.trim().toLowerCase();
      const byPhone = Boolean(user.phone) && Boolean(order.customerPhone) && order.customerPhone === user.phone;
      return byName || byPhone;
    });
  };

  const loadOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      setError(null);
      if (!user?.id) {
        setOrders([]);
        setSource('api');
        return;
      }
      const result = await orderService.getBuyerOrders(user.id, { limit: 100, sortBy: 'createdAt', sortOrder: 'desc' });
      setOrders(result.orders);
      setSource('api');
    } catch {
      const fallback = getLocalUserOrders();
      setOrders(fallback);
      setSource('local');
      setError("Impossible de charger vos commandes depuis l'API. Affichage local temporaire.");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
        return <Badge variant="success">Livree</Badge>;
      case 'in_delivery':
      case 'ready_for_pickup':
      case 'preparing':
      case 'confirmed':
        return <Badge variant="info">En cours</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="error">Annulee</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} color="#10b981" />;
      case 'in_delivery':
      case 'ready_for_pickup':
      case 'preparing':
      case 'confirmed':
        return <Clock size={20} color="#3b82f6" />;
      case 'pending':
        return <AlertCircle size={20} color="#f59e0b" />;
      case 'cancelled':
        return <AlertCircle size={20} color="#ef4444" />;
      default:
        return <Package size={20} color="#6b7280" />;
    }
  };

  const totalOrders = orders.length;
  const deliveredOrders = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);
  const pendingOrders = useMemo(
    () => orders.filter((o) => ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'in_delivery'].includes(o.status)).length,
    [orders]
  );
  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-';

  if (loading) {
    return (
      <div className="buyer-dashboard">
        <BuyerSidebar />
        <main className="buyer-main">
          <div className="buyer-dashboard-loading">Chargement de votre dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">
      <BuyerSidebar />

      <main className="buyer-main">
        <div className="buyer-header">
          <div className="buyer-hero-profile">
            <div className="buyer-hero-avatar">
              {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <UserCircle2 size={34} />}
            </div>
            <div>
              <h1 className="buyer-title">Bonjour {user?.name || 'Acheteur'}</h1>
              {/* <p className="buyer-subtitle">Profil client unique base sur votre compte API</p> */}
              <p className="buyer-member-since">Membre depuis: {memberSince}</p>
            </div>
          </div>
          <div className="buyer-header-actions">
            <button type="button" className="buyer-refresh-btn" onClick={() => loadOrders(true)} disabled={refreshing}>
              <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </button>
            {/* <span className={`buyer-source-badge ${source}`}>{source === 'api' ? 'Source API' : 'Source locale'}</span> */}
          </div>
        </div>

        {error && <p className="buyer-dashboard-alert">{error}</p>}

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
              <div className="stat-label">Livrees</div>
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
              <div className="stat-label">Total depense</div>
            </div>
          </div>
        </div>

        <div className="orders-view-toggle">
          <h2 className="orders-section-title">Historique des commandes</h2>
        </div>

        <div className="buyer-orders-table-container">
          {orders.length === 0 ? (
            <div className="buyer-empty-state">Aucune commande pour ce compte pour le moment.</div>
          ) : (
            <table className="buyer-orders-table">
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Date</th>
                  <th>Boutique</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-number">#{order.orderNumber}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="shop-name">{order.shopName}</td>
                    <td className="order-amount">{formatPrice(order.total)}</td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </td>
                    <td>
                      <Link to={`/buyer/orders/${order.id}`} className="order-details-link">
                        Details {'->'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="orders-cards-container">
          {orders.length === 0 ? (
            <div className="buyer-empty-state">Aucune commande pour ce compte pour le moment.</div>
          ) : (
            orders.map((order) => (
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
                    Voir les details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
