import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginGuide.css';

export function AdminLoginGuide() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const adminCredentials = {
    email: 'admin@jourmarche.com',
    password: 'admin123' // Dans un vrai projet, ce serait hasé
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="admin-login-guide">
      <div className="guide-container">
        <div className="guide-header">
          <h1>🔐 Accès Admin - Jour Marché</h1>
          <p>Identifiants de démonstration pour tester le tableau de bord administrateur</p>
        </div>

        <div className="credentials-box">
          <div className="credential-item">
            <label>📧 Email Admin</label>
            <div className="credential-field">
              <code>{adminCredentials.email}</code>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(adminCredentials.email, 'email')}
              >
                {copied === 'email' ? '✅ Copié' : '📋 Copier'}
              </button>
            </div>
          </div>

          <div className="credential-item">
            <label>🔑 Mot de passe</label>
            <div className="credential-field">
              <code>admin123</code>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(adminCredentials.password, 'password')}
              >
                {copied === 'password' ? '✅ Copié' : '📋 Copier'}
              </button>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>📋 Étapes pour se connecter:</h3>
          <ol>
            <li>Cliquez sur le bouton "Se connecter"</li>
            <li>Entrez l'email: <code>admin@jourmarche.com</code></li>
            <li>Entrez le mot de passe: <code>admin123</code></li>
            <li>Cliquez sur "Se connecter"</li>
            <li>Vous serez redirigé vers le tableau de bord admin</li>
          </ol>
        </div>

        <div className="features-section">
          <h3>🎯 Fonctionnalités du tableau de bord admin:</h3>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h4>Tableau de Bord</h4>
              <p>Statistiques en temps réel et métriques clés</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📦</span>
              <h4>Commandes</h4>
              <p>Gestion complète des commandes et suivi</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🏪</span>
              <h4>Vendeurs</h4>
              <p>Gestion des vendeurs et boutiques</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h4>Utilisateurs</h4>
              <p>Gestion des comptes utilisateurs</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <h4>Rapports</h4>
              <p>Statistiques et rapports détaillés</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚙️</span>
              <h4>Paramètres</h4>
              <p>Configuration de la plateforme</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-login" onClick={() => navigate('/login')}>
            🔐 Aller à la page de connexion
          </button>
          <button className="btn-home" onClick={() => navigate('/')}>
            🏠 Retour à l'accueil
          </button>
        </div>

        <div className="security-note">
          <strong>⚠️ Note de sécurité:</strong>
          <p>Ces identifiants sont uniquement pour la démonstration. En production, utilisez:</p>
          <ul>
            <li>✅ Authentification forte (OAuth, 2FA)</li>
            <li>✅ Mots de passe chiffrés</li>
            <li>✅ Authentification par JWT tokens</li>
            <li>✅ Logs de sécurité</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
