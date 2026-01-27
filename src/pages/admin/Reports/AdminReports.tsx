import './AdminReports.css';

export function AdminReports() {
  return (
    <div className="admin-reports">
      <div className="page-header">
        <h2>Rapports & Statistiques</h2>
        <button className="download-btn">📥 Télécharger Rapport</button>
      </div>

      <div className="reports-grid">
        {/* Revenue Chart */}
        <div className="report-card">
          <h3>Revenus Mensuels</h3>
          <div className="chart-placeholder">
            <p>📊 Graphique de revenus</p>
          </div>
          <div className="chart-stats">
            <div className="stat-item">
              <span>Total Janvier</span>
              <strong>3,245,600 FCFA</strong>
            </div>
            <div className="stat-item">
              <span>Moyenne/jour</span>
              <strong>104,700 FCFA</strong>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="report-card">
          <h3>Commandes par Jour</h3>
          <div className="chart-placeholder">
            <p>📈 Graphique de commandes</p>
          </div>
          <div className="chart-stats">
            <div className="stat-item">
              <span>Total Commandes</span>
              <strong>1,248</strong>
            </div>
            <div className="stat-item">
              <span>Moyenne/jour</span>
              <strong>40 commandes</strong>
            </div>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="report-card">
          <h3>Distribution par Catégorie</h3>
          <div className="categories-list">
            <div className="category-item">
              <span>🍎 Fruits & Légumes</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '35%'}}></div>
              </div>
              <span className="percent">35%</span>
            </div>
            <div className="category-item">
              <span>🐟 Poisson & Viande</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '28%'}}></div>
              </div>
              <span className="percent">28%</span>
            </div>
            <div className="category-item">
              <span>🍞 Boulangerie</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '22%'}}></div>
              </div>
              <span className="percent">22%</span>
            </div>
            <div className="category-item">
              <span>🥫 Épicerie</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '15%'}}></div>
              </div>
              <span className="percent">15%</span>
            </div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="report-card">
          <h3>Métriques Clés</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="metric-icon">⭐</div>
              <div className="metric-content">
                <p>Rating Moyen</p>
                <strong>4.7/5.0</strong>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <p>Taux Livraison</p>
                <strong>98.5%</strong>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">😊</div>
              <div className="metric-content">
                <p>Satisfaction</p>
                <strong>96.2%</strong>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <p>Délai Moyen</p>
                <strong>2.3 jours</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
