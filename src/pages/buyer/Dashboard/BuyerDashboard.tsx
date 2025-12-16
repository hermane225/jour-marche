import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui';
import { buyerOrders } from '../../../data/mockData';
import { BuyerSidebar } from './BuyerSidebar';
import './BuyerDashboard.css';

export function BuyerDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' F CFA';
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

  return (
    <div className="buyer-dashboard">
      <BuyerSidebar />

      <main className="buyer-main">
        <div className="buyer-breadcrumb">
          <Link to="/buyer/dashboard">Tableau de Bord</Link>
          <span>/</span>
          <span>Mes Commandes</span>
        </div>

        <h1 className="buyer-title">Mes Commandes</h1>

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
                  <td className="order-number">{order.orderNumber}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.shopName}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <Link to={`/buyer/orders/${order.id}`} className="order-details-link">
                      Voir les détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
