import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { adminService } from '../../../services/api';
import './AdminReports.css';

export function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [shopsCount, setShopsCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [statsData, orders, users, products, shops] = await Promise.all([
          adminService.getStats(),
          adminService.getOrders(),
          adminService.getUsers(),
          adminService.getProducts(),
          adminService.getShops(),
        ]);
        setStats(statsData || {});
        setOrdersCount(orders.length);
        setUsersCount(users.length);
        setProductsCount(products.length);
        setShopsCount(shops.length);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const distribution = useMemo(() => {
    const total = Math.max(usersCount + shopsCount + productsCount + ordersCount, 1);
    return [
      { label: 'Utilisateurs', value: usersCount, pct: Math.round((usersCount / total) * 100), tone: 'blue' },
      { label: 'Boutiques', value: shopsCount, pct: Math.round((shopsCount / total) * 100), tone: 'green' },
      { label: 'Produits', value: productsCount, pct: Math.round((productsCount / total) * 100), tone: 'violet' },
      { label: 'Commandes', value: ordersCount, pct: Math.round((ordersCount / total) * 100), tone: 'amber' },
    ];
  }, [ordersCount, productsCount, shopsCount, usersCount]);

  if (loading) {
    return <div className="admin-page-loading">Chargement des rapports...</div>;
  }

  return (
    <section className="admin-reports-pro">
      <header className="admin-page-head">
        <div>
          <h2>Rapports</h2>
          <p>Vue consolidée performance plateforme et activité.</p>
        </div>
        <button className="primary-export-btn">
          <Download size={16} />
          Exporter
        </button>
      </header>

      <div className="report-top-grid">
        <article className="report-stat-card">
          <p>Revenu total</p>
          <strong>{Number(stats.totalRevenue || 0).toLocaleString('fr-FR')} FCFA</strong>
          <span><TrendingUp size={14} /> Aujourd'hui: {Number(stats.revenueToday || 0).toLocaleString('fr-FR')} FCFA</span>
        </article>
        <article className="report-stat-card">
          <p>Commandes</p>
          <strong>{Number(stats.totalOrders || ordersCount).toLocaleString('fr-FR')}</strong>
          <span><BarChart3 size={14} /> Aujourd'hui: {Number(stats.ordersToday || 0).toLocaleString('fr-FR')}</span>
        </article>
      </div>

      <div className="report-grid-two">
        <article className="report-panel">
          <h3>Distribution activité</h3>
          <div className="distribution-list">
            {distribution.map((item) => (
              <div key={item.label} className="distribution-item">
                <div className="distribution-head">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="distribution-track">
                  <div className={`distribution-fill tone-${item.tone}`} style={{ width: `${item.pct}%` }} />
                </div>
                <small>{item.pct}%</small>
              </div>
            ))}
          </div>
        </article>

        <article className="report-panel">
          <h3>Indicateurs clés</h3>
          <ul className="kpi-list">
            <li><span>Utilisateurs actifs</span><strong>{Number(stats.totalUsers || usersCount).toLocaleString('fr-FR')}</strong></li>
            <li><span>Boutiques actives</span><strong>{Number(stats.totalShops || shopsCount).toLocaleString('fr-FR')}</strong></li>
            <li><span>Produits publiés</span><strong>{Number(stats.totalProducts || productsCount).toLocaleString('fr-FR')}</strong></li>
            <li><span>Commandes en attente</span><strong>{Number(stats.pendingOrders || 0).toLocaleString('fr-FR')}</strong></li>
            <li><span>Nouveaux users (jour)</span><strong>{Number(stats.newUsersToday || 0).toLocaleString('fr-FR')}</strong></li>
          </ul>
        </article>
      </div>
    </section>
  );
}
