import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { adminService } from '../../../services/api';
import type { AdminOrder } from '../../../services/api/admin.service';
import './AdminOrders.css';

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadOrders = async () => {
    const data = await adminService.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadOrders();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => orders.filter((o) => {
      const term = search.toLowerCase();
      const orderLabel = (o.orderNumber || o.id).toLowerCase();
      const customer = (o.customerName || '').toLowerCase();
      const matchesSearch = !term || orderLabel.includes(term) || customer.includes(term);
      const matchesStatus = statusFilter === 'all' || (o.status || 'pending') === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    [orders, search, statusFilter]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatus = async (orderId: string, status: string) => {
    const updated = await adminService.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  if (loading) {
    return <div className="admin-page-loading">Chargement des commandes...</div>;
  }

  return (
    <section className="admin-orders-pro">
      <header className="admin-page-head">
        <div>
          <h2>Commandes</h2>
          <p>Vue globale et mise a jour du cycle de commande.</p>
        </div>
        <button className="ghost-btn" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refresh...' : 'Rafraichir'}
        </button>
      </header>

      <div className="admin-filters-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher commande/client" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous statuts</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="preparing">preparing</option>
          <option value="in_delivery">in_delivery</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.orderNumber || order.id.slice(0, 8)}</strong></td>
                <td>{order.customerName || '-'}</td>
                <td>{Number(order.total || 0).toLocaleString('fr-FR')} FCFA</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '-'}</td>
                <td>
                  <select value={order.status || 'pending'} onChange={(e) => handleStatus(order.id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="preparing">preparing</option>
                    <option value="in_delivery">in_delivery</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="icon-btn"><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
