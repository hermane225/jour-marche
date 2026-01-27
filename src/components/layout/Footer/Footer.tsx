import { Link } from 'react-router-dom';
import logoImage from '../../../assets/jour_marché.png';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img src={logoImage} alt="Jour de Marché" style={{ height: '45px', width: 'auto' }} />
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>Jour de Marché CI</span>
            </Link>
            <p className="footer-description">
              Le marché ivoirien en ligne. Vendez vos légumes, attiéké, plats cuisinés et plus encore. Ouvert à tous !
            </p>
          </div>

          {/* À Propos */}
          <div className="footer-section">
            <h4 className="footer-section-title">À Propos</h4>
            <ul className="footer-links">
              <li><Link to="/about">Qui sommes-nous ?</Link></li>
              <li><Link to="/terms">Conditions Générales</Link></li>
              <li><Link to="/privacy">Politique de Confidentialité</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contactez-nous</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/help">Aide</Link></li>
            </ul>
          </div>

          {/* Suivez-nous */}
          <div className="footer-section">
            <h4 className="footer-section-title">Suivez-nous</h4>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                Instagram
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Jour de Marché. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
