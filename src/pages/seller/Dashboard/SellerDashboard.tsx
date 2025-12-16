import { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Package, Clock, CheckCircle, XCircle, Truck, Eye, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../../../components/ui';
import { SellerLayout } from '../Layout/SellerLayout';
import { useOrders } from '../../../context/OrderContext';
import type { Order, OrderStatus } from '../../../types';
import './SellerDashboard.css';

export function SellerDashboard() {
  const { sellerOrders, updateOrderStatus, newOrdersCount } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Calculer les stats basées sur les vraies commandes
  const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = sellerOrders.length;
  const pendingOrders = sellerOrders.filter(o => o.status === 'pending').length;
  const completedOrders = sellerOrders.filter(o => o.status === 'delivered').length;

  const stats = [
    { label: 'Revenu total', value: totalRevenue.toLocaleString('fr-FR'), unit: 'FCFA', change: 5.4, positive: true },
    { label: 'Commandes', value: totalOrders.toString(), unit: '', change: 2.1, positive: true },
    { label: 'En attente', value: pendingOrders.toString(), unit: '', change: pendingOrders > 0 ? pendingOrders : 0, positive: pendingOrders > 0 },
    { label: 'Livrées', value: completedOrders.toString(), unit: '', change: 10, positive: true },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'preparing': return '#8b5cf6';
      case 'ready_for_pickup': return '#06b6d4';
      case 'in_delivery': return '#f97316';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready_for_pickup': return 'Prête';
      case 'in_delivery': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'preparing': return <Package size={16} />;
      case 'ready_for_pickup': return <Package size={16} />;
      case 'in_delivery': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <SellerLayout>
      <div className="seller-dashboard">
        <div className="seller-dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1 className="seller-dashboard-title">Tableau de Bord</h1>
            {newOrdersCount > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fef3c7',
                color: '#d97706',
                padding: '8px 16px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '14px',
                animation: 'pulse 2s infinite'
              }}>
                <Bell size={18} />
                {newOrdersCount} nouvelle{newOrdersCount > 1 ? 's' : ''} commande{newOrdersCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <Link to="/seller/boutiques/create">
            <Button variant="secondary" leftIcon={<Plus size={20} />}>
              Créer une nouvelle boutique
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="seller-stats-grid">
          {stats.map((stat, index) => (
            <Card key={index} className="seller-stat-card">
              <p className="seller-stat-label">{stat.label}</p>
              <div className="seller-stat-value">
                <span>{stat.value}</span>
                {stat.unit && <span className="seller-stat-unit">{stat.unit}</span>}
              </div>
              <div className={`seller-stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{stat.positive ? '+' : ''}{stat.change}%</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Commandes récentes */}
        <Card className="seller-orders-card" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
              Commandes récentes
            </h3>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {sellerOrders.length} commande{sellerOrders.length !== 1 ? 's' : ''}
            </span>
          </div>

          {sellerOrders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <Package size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
              <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#6b7280' }}>
                Aucune commande pour le moment
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>
                Les commandes de vos clients apparaîtront ici
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sellerOrders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: order.status === 'pending' ? '#fffbeb' : '#f9fafb',
                    borderRadius: '12px',
                    border: order.status === 'pending' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `${getStatusColor(order.status)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: getStatusColor(order.status)
                    }}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1f2937', fontSize: '15px' }}>
                        #{order.orderNumber}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                        {order.customerName} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span style={{ fontWeight: 700, color: '#1f2937', minWidth: '100px', textAlign: 'right' }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#374151'
                      }}
                    >
                      <Eye size={14} />
                      Détails
                    </button>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'white'
                        }}
                      >
                        <CheckCircle size={14} />
                        Confirmer
                      </button>
                    )}

                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: '#8b5cf6',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'white'
                        }}
                      >
                        <Package size={14} />
                        Préparer
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ready_for_pickup')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: '#06b6d4',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'white'
                        }}
                      >
                        Prête !
                      </button>
                    )}

                    {(order.status === 'ready_for_pickup' || order.status === 'in_delivery') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'white'
                        }}
                      >
                        <CheckCircle size={14} />
                        Livrée
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal détails commande */}
        {selectedOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setSelectedOrder(null)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: '24px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                  Commande #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f3f4f6',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '50px',
                background: `${getStatusColor(selectedOrder.status)}20`,
                color: getStatusColor(selectedOrder.status),
                fontWeight: 600,
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {getStatusIcon(selectedOrder.status)}
                {getStatusLabel(selectedOrder.status)}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 600, color: '#6b7280' }}>
                  Client
                </h4>
                <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#1f2937' }}>{selectedOrder.customerName}</p>
                <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>{selectedOrder.customerPhone}</p>
                <p style={{ margin: 0, color: '#6b7280' }}>{selectedOrder.customerAddress}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 600, color: '#6b7280' }}>
                  Articles ({selectedOrder.items.length})
                </h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    marginBottom: '8px'
                  }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#1f2937' }}>
                        {item.product.title}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '16px',
                background: '#f0fdf4',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, color: '#059669' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>

              <p style={{ margin: '16px 0 0 0', fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
                Commandé le {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
          </div>
        )}

        {/* Performance Chart */}
        <Card className="seller-chart-card" style={{ marginTop: '24px' }}>
          <div className="seller-chart-header">
            <h3>Performance des Ventes</h3>
            <div className="seller-chart-filters">
              <button className="seller-chart-filter">7 jours</button>
              <button className="seller-chart-filter active">30 jours</button>
              <button className="seller-chart-filter">90 jours</button>
            </div>
          </div>
          <div className="seller-chart-placeholder">
            <p>Graphique des ventes à venir</p>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </SellerLayout>
  );
}
