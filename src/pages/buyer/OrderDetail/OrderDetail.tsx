import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { buyerOrders } from '../../../data/mockData';
import { Package, MapPin, CreditCard, Calendar, Phone, CheckCircle, Clock, AlertCircle, Truck } from 'lucide-react';
import './OrderDetail.css';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = buyerOrders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="not-found">
          <h1>Commande non trouvée</h1>
          <p>La commande que vous recherchez n'existe pas.</p>
          <Link to="/buyer/dashboard" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} color="#10b981" />;
      case 'in_progress':
        return <Truck size={24} color="#3b82f6" />;
      case 'pending':
        return <Clock size={24} color="#f59e0b" />;
      case 'cancelled':
        return <AlertCircle size={24} color="#ef4444" />;
      default:
        return <Package size={24} color="#6b7280" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      in_progress: 'En cours de livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      in_progress: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  // Timeline des statuts
  const timeline = [
    { status: 'pending', label: 'Commande reçue', date: order.createdAt, completed: true },
    { status: 'in_progress', label: 'Préparation en cours', date: new Date(order.createdAt.getTime() + 3600000), completed: order.status !== 'pending' },
    { status: 'in_progress', label: 'En livraison', date: new Date(order.createdAt.getTime() + 7200000), completed: order.status === 'in_progress' || order.status === 'delivered' },
    { status: 'delivered', label: 'Livrée', date: new Date(order.createdAt.getTime() + 10800000), completed: order.status === 'delivered' }
  ];

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div>
          <Link to="/buyer/dashboard" className="breadcrumb-link">← Retour aux commandes</Link>
          <h1>Commande #{order.orderNumber}</h1>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <div className={`order-status-badge status-${order.status}`}>
          {getStatusIcon(order.status)}
          <span>{getStatusLabel(order.status)}</span>
        </div>
      </div>

      <div className="order-detail-grid">
        {/* Timeline */}
        <section className="order-section order-timeline">
          <h2>Suivi de votre commande</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className={`timeline-item ${item.completed ? 'completed' : ''}`}>
                <div className="timeline-marker">
                  <div className={`timeline-dot status-${item.status}`}></div>
                  {index < timeline.length - 1 && <div className={`timeline-line ${item.completed ? 'completed' : ''}`}></div>}
                </div>
                <div className="timeline-content">
                  <h4>{item.label}</h4>
                  <p>{new Intl.DateTimeFormat('fr-FR', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Infos pratiques */}
        <section className="order-section order-info">
          {/* Adresse de livraison */}
          <div className="info-block">
            <div className="info-header">
              <MapPin size={20} />
              <h3>Adresse de livraison</h3>
            </div>
            <div className="info-content">
              <p className="address-main">Cocody, Abidjan</p>
              <p className="address-detail">Côte d'Ivoire</p>
            </div>
          </div>

          {/* Moyen de paiement */}
          <div className="info-block">
            <div className="info-header">
              <CreditCard size={20} />
              <h3>Moyen de paiement</h3>
            </div>
            <div className="info-content">
              <p className="payment-method">Mobile Money - Orange</p>
              <p className="payment-status">✓ Payé</p>
            </div>
          </div>

          {/* Contact vendeur */}
          <div className="info-block">
            <div className="info-header">
              <Phone size={20} />
              <h3>Contacter le vendeur</h3>
            </div>
            <div className="info-content">
              <button className="btn btn-secondary btn-sm">
                Envoyer un message
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Produits */}
      <section className="order-section order-products">
        <h2>Articles commandés</h2>
        <div className="products-list">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="product-item">
                <div className="product-image">
                  <Package size={32} color="#6b7280" />
                </div>
                <div className="product-info">
                  <h4>{item.name || 'Produit'}</h4>
                  <p className="product-shop">{order.shopName}</p>
                  <p className="product-quantity">Quantité : {item.quantity || 1}</p>
                </div>
                <div className="product-price">
                  {formatPrice((item.price || 0) * (item.quantity || 1))}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-items">Aucun article dans cette commande</p>
          )}
        </div>
      </section>

      {/* Résumé */}
      <section className="order-section order-summary">
        <h2>Résumé de la commande</h2>
        <div className="summary-content">
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{formatPrice(order.total * 0.9)}</span>
          </div>
          <div className="summary-row">
            <span>Frais de livraison</span>
            <span>{formatPrice(order.total * 0.1)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="order-section order-actions">
        <div className="actions-grid">
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button className="btn btn-secondary">
              Annuler la commande
            </button>
          )}
          {order.status === 'delivered' && (
            <>
              <button className="btn btn-secondary">
                Retourner l'article
              </button>
              <button className="btn btn-secondary">
                Laisser un avis
              </button>
            </>
          )}
          <Link to="/buyer/dashboard" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </section>
    </div>
  );
}
