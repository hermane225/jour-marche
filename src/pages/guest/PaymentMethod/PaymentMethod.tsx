import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Wallet } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import './PaymentMethod.css';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<'mobile_money' | 'cash' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroller vers le haut au montage
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectPayment = (method: 'mobile_money' | 'cash') => {
    setSelectedPayment(method);
  };

  const handleProceed = () => {
    if (!selectedPayment) {
      alert('Veuillez sélectionner un mode de paiement');
      return;
    }

    setIsSubmitting(true);

    // Sauvegarder le mode de paiement
    sessionStorage.setItem('payment_method', selectedPayment);

    // Rediriger vers la page de paiement appropriée
    setTimeout(() => {
      if (selectedPayment === 'mobile_money') {
        navigate('/payment/mobile-money');
      } else {
        navigate('/order/confirmation');
      }
    }, 300);
  };

  return (
    <div className="payment-method-page">
      <div className="payment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="back-button-icon">
            <ChevronLeft size={20} />
          </span>
          <span className="back-button-text">Retour</span>
        </button>
        <h1>Mode de paiement</h1>
      </div>

      <div className="payment-container">
        <div className="payment-section">
          <div className="section-title">
            <CreditCard size={24} />
            <h2>Choisissez votre mode de paiement</h2>
          </div>

          <div className="payment-options">
            {/* Mobile Money */}
            <div
              className={`payment-card ${selectedPayment === 'mobile_money' ? 'active' : ''}`}
              onClick={() => handleSelectPayment('mobile_money')}
            >
              <input
                type="radio"
                name="payment"
                value="mobile_money"
                checked={selectedPayment === 'mobile_money'}
                onChange={() => handleSelectPayment('mobile_money')}
                className="payment-radio"
              />
              <div className="payment-card-content">
                <div className="payment-icon">📱</div>
                <div className="payment-info">
                  <h3>Mobile Money</h3>
                  <p>Payez directement avec votre compte mobile money</p>
                  <div className="payment-providers">
                    <span className="provider">Wave</span>
                    <span className="provider">Orange</span>
                    <span className="provider">Moov</span>
                    <span className="provider">MTN</span>
                  </div>
                </div>
              </div>
              <div className="payment-check">
                {selectedPayment === 'mobile_money' && <span>✓</span>}
              </div>
            </div>

            {/* Paiement à la livraison */}
            <div
              className={`payment-card ${selectedPayment === 'cash' ? 'active' : ''}`}
              onClick={() => handleSelectPayment('cash')}
            >
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={selectedPayment === 'cash'}
                onChange={() => handleSelectPayment('cash')}
                className="payment-radio"
              />
              <div className="payment-card-content">
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <h3>Paiement à la livraison</h3>
                  <p>Payez en espèces à la réception de votre commande</p>
                  <div className="payment-note">
                    <span>✓ Sans frais supplémentaires</span>
                  </div>
                </div>
              </div>
              <div className="payment-check">
                {selectedPayment === 'cash' && <span>✓</span>}
              </div>
            </div>
          </div>

          {/* Détails du paiement */}
          {selectedPayment && (
            <Card className="payment-details-card">
              <h3>Détails du paiement sélectionné</h3>
              {selectedPayment === 'mobile_money' && (
                <div className="details-content">
                  <p className="detail-title">Mobile Money</p>
                  <ul className="details-list">
                    <li>Paiement instantané et sécurisé</li>
                    <li>Accepte les 4 principaux opérateurs</li>
                    <li>Commande confirmée immédiatement après le paiement</li>
                    <li>Reçu de paiement envoyé par SMS</li>
                  </ul>
                </div>
              )}
              {selectedPayment === 'cash' && (
                <div className="details-content">
                  <p className="detail-title">Paiement à la livraison</p>
                  <ul className="details-list">
                    <li>Payez en espèces à la réception</li>
                    <li>Aucun frais de paiement en ligne</li>
                    <li>Commande confirmée après paiement</li>
                    <li>Quittance remise à la livraison</li>
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* Boutons d'action */}
          <div className="action-buttons">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              style={{ flex: 1 }}
            >
              Retour
            </Button>
            <Button
              variant="primary"
              onClick={handleProceed}
              style={{ flex: 1 }}
              disabled={!selectedPayment || isSubmitting}
            >
              {isSubmitting ? 'Traitement...' : 'Continuer'}
            </Button>
          </div>
        </div>

        {/* Aide et sécurité */}
        <Card className="help-card">
          <div className="help-section">
            <h3>🔒 Votre sécurité</h3>
            <ul>
              <li>Paiements sécurisés et cryptés</li>
              <li>Données personnelles protégées</li>
              <li>Certifié par les opérateurs</li>
            </ul>
          </div>
          <div className="help-section">
            <h3>❓ Questions?</h3>
            <p>Contactez notre équipe support</p>
            <p className="support-contact">+225 01 51 60 04 02</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
