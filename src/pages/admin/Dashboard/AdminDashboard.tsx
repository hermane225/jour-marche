import './AdminDashboard.css';

export function AdminDashboard() {
  const stats = [
    {
      title: 'Revenus',
      value: '1,245,600 FCFA',
      change: '+12.5%',
      icon: '💰',
      color: 'green'
    },
    {
      title: 'Commandes',
      value: '1,248',
      change: '+8.2%',
      icon: '📦',
      color: 'blue'
    },
    {
      title: 'Vendeurs',
      value: '156',
      change: '+4.1%',
      icon: '🏪',
      color: 'purple'
    },
    {
      title: 'Utilisateurs',
      value: '3,847',
      change: '+15.3%',
      icon: '👥',
      color: 'orange'
    }
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'Jean Dupont', amount: '45,000 FCFA', status: 'Livré' },
    { id: '#ORD002', customer: 'Marie Traore', amount: '32,500 FCFA', status: 'En cours' },
    { id: '#ORD003', customer: 'Pierre Kone', amount: '58,900 FCFA', status: 'Attente' },
    { id: '#ORD004', customer: 'Aissatou Diallo', amount: '21,500 FCFA', status: 'Livré' },
    { id: '#ORD005', customer: 'Kofi Mensah', amount: '39,200 FCFA', status: 'En cours' },
  ];

  const topSellers = [
    { name: 'Marché Frais', products: 324, sales: '892,000 FCFA' },
    { name: 'Épicerie du Centre', products: 287, sales: '756,500 FCFA' },
    { name: 'Fruits & Légumes Premium', products: 198, sales: '425,300 FCFA' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card stat-${stat.color}`}>
            <div className="stat-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className={`stat-change positive`}>{stat.change}</span>
            </div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Commandes Récentes</h3>
            <a href="/admin/orders" className="view-all">Voir tout →</a>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Meilleurs Vendeurs</h3>
            <a href="/admin/sellers" className="view-all">Voir tout →</a>
          </div>
          <div className="sellers-list">
            {topSellers.map((seller, idx) => (
              <div key={idx} className="seller-item">
                <div className="seller-badge">{idx + 1}</div>
                <div className="seller-info">
                  <p className="seller-name">{seller.name}</p>
                  <p className="seller-stats">{seller.products} produits • {seller.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span>Ajouter Vendeur</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>Générer Rapport</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📧</span>
            <span>Envoyer Notification</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
}
