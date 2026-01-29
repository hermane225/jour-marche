import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, User, Package } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { Button, Input, Card } from '../../../components/ui';
import './DeliveryInfo.css';

interface DeliveryOption {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  hours: string;
  distance?: string;
}

// Mock data pour les points de relais
const RELAY_POINTS: DeliveryOption[] = [
  {
    id: 'relay_1',
    name: 'Point de Relais Marcory',
    address: '123 Avenue Giscard d\'Estaing, Marcory',
    phone: '+225 27 20 30 40 50',
    city: 'Abidjan',
    hours: 'Lun-Sam: 8h-18h, Dim: 9h-17h',
    distance: '2.3 km',
  },
  {
    id: 'relay_2',
    name: 'Point de Relais Plateau',
    address: '456 Rue du Commerce, Plateau',
    phone: '+225 27 20 25 35 45',
    city: 'Abidjan',
    hours: 'Lun-Sam: 9h-19h',
    distance: '4.5 km',
  },
  {
    id: 'relay_3',
    name: 'Point de Relais Cocody',
    address: '789 Boulevard de la Paix, Cocody',
    phone: '+225 27 20 35 45 55',
    city: 'Abidjan',
    hours: 'Lun-Dim: 8h-20h',
    distance: '5.8 km',
  },
  {
    id: 'relay_4',
    name: 'Point de Relais Yopougon',
    address: '321 Rue Principale, Yopougon',
    phone: '+225 27 20 40 50 60',
    city: 'Abidjan',
    hours: 'Lun-Sam: 8h-17h',
    distance: '8.2 km',
  },
];

export default function DeliveryInfo() {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const [step, setStep] = useState<'info' | 'delivery'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
  });

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'relay'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedRelay, setSelectedRelay] = useState<string | null>(null);

  // Scroller vers le haut au montage
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInfoSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setStep('delivery');
  };

  const handleDeliverySubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (deliveryType === 'delivery' && !deliveryAddress) {
      alert('Veuillez entrer votre adresse de livraison');
      return;
    }

    if (deliveryType === 'relay' && !selectedRelay) {
      alert('Veuillez sélectionner un point de relais');
      return;
    }

    setIsSubmitting(true);

    // Sauvegarder les infos de livraison
    const relayInfo = deliveryType === 'relay' 
      ? RELAY_POINTS.find(r => r.id === selectedRelay)
      : null;

    const deliveryData = {
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: deliveryType === 'delivery' ? deliveryAddress : relayInfo?.address || '',
      deliveryType: deliveryType,
      relayInfo: deliveryType === 'relay' ? relayInfo : null,
    };

    sessionStorage.setItem('delivery_info', JSON.stringify(deliveryData));

    // Rediriger vers OrderReview
    setTimeout(() => {
      navigate('/order/review');
    }, 300);
  };

  if (cart.items.length === 0) {
    return (
      <div className="delivery-info-page">
        <div className="delivery-empty">
          <h2>Votre panier est vide</h2>
          <Button variant="primary" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-info-page">
      <div className="delivery-header">
        <button className="back-button" onClick={() => navigate('/cart')}>
          <ChevronLeft size={24} />
          Retour
        </button>
        <h1>Informations de livraison</h1>
      </div>

      <div className="delivery-container">
        {/* Progress indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${step === 'info' ? 'active' : 'completed'}`}>
            <div className="step-number">1</div>
            <div className="step-label">Vos informations</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'delivery' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Mode de livraison</div>
          </div>
        </div>

        {/* Étape 1: Informations client */}
        {step === 'info' && (
          <Card className="delivery-card">
            <div className="card-title">
              <User size={24} />
              <h2>Vos informations</h2>
            </div>

            <form onSubmit={handleInfoSubmit} className="delivery-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: yao patrick"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
                <p className="form-hint">Ce nom sera utilisé pour votre commande</p>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Numéro de téléphone *</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+225 07 XX XX XX XX"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                />
                <p className="form-hint">Le vendeur vous contactera à ce numéro</p>
              </div>

              <Button 
                variant="primary" 
                type="submit" 
                style={{ width: '100%' }}
              >
                Continuer vers la livraison
              </Button>
            </form>
          </Card>
        )}

        {/* Étape 2: Mode de livraison */}
        {step === 'delivery' && (
          <Card className="delivery-card">
            <div className="card-title">
              <MapPin size={24} />
              <h2>Mode de livraison</h2>
            </div>

            <form onSubmit={handleDeliverySubmit} className="delivery-form">
              {/* Options de livraison */}
              <div className="delivery-types">
                <label className={`delivery-type-option ${deliveryType === 'delivery' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={() => setDeliveryType('delivery')}
                  />
                  <div className="option-content">
                    <div className="option-header">
                      <span className="option-icon">🚚</span>
                      <span className="option-title">Livraison à domicile</span>
                    </div>
                    <p className="option-description">Livraison directement à votre adresse (Frais: 2,000 FCFA)</p>
                  </div>
                </label>

                <label className={`delivery-type-option ${deliveryType === 'relay' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="relay"
                    checked={deliveryType === 'relay'}
                    onChange={() => setDeliveryType('relay')}
                  />
                  <div className="option-content">
                    <div className="option-header">
                      <span className="option-icon">📦</span>
                      <span className="option-title">Retrait en point de relais</span>
                    </div>
                    <p className="option-description">Retrait gratuit dans le point de relais de votre choix</p>
                  </div>
                </label>
              </div>

              {/* Adresse de livraison */}
              {deliveryType === 'delivery' && (
                <div className="form-group">
                  <label htmlFor="address">Adresse de livraison *</label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Ex: Commune, Quartier, Rue, Numéro"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                  <p className="form-hint">Soyez aussi précis que possible pour faciliter la livraison</p>
                </div>
              )}

              {/* Points de relais */}
              {deliveryType === 'relay' && (
                <div className="relay-section">
                  <h3>Sélectionnez votre point de relais</h3>
                  <div className="relay-list">
                    {RELAY_POINTS.map((relay) => (
                      <label
                        key={relay.id}
                        className={`relay-option ${selectedRelay === relay.id ? 'active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="relay"
                          value={relay.id}
                          checked={selectedRelay === relay.id}
                          onChange={() => setSelectedRelay(relay.id)}
                        />
                        <div className="relay-content">
                          <div className="relay-header">
                            <div className="relay-name">{relay.name}</div>
                            {relay.distance && (
                              <div className="relay-distance">{relay.distance}</div>
                            )}
                          </div>
                          <div className="relay-details">
                            <div className="relay-detail">
                              <MapPin size={16} />
                              <span>{relay.address}</span>
                            </div>
                            <div className="relay-detail">
                              <Phone size={16} />
                              <span>{relay.phone}</span>
                            </div>
                            <div className="relay-detail">
                              <Package size={16} />
                              <span>{relay.hours}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <Button 
                  variant="secondary" 
                  type="button"
                  onClick={() => setStep('info')}
                  style={{ flex: 1 }}
                >
                  Retour
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Traitement...' : 'Continuer vers le résumé'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Résumé du panier */}
        <Card className="cart-summary">
          <h3>Résumé du panier</h3>
          <div className="summary-items">
            {cart.items.map((item) => (
              <div key={item.product.id} className="summary-item">
                <div className="summary-item-info">
                  <p className="summary-item-name">{item.product.title}</p>
                  <p className="summary-item-qty">Quantité: {item.quantity}</p>
                </div>
                <p className="summary-item-price">
                  {new Intl.NumberFormat('fr-FR').format(item.product.price * item.quantity)} FCFA
                </p>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total articles</span>
            <span>
              {new Intl.NumberFormat('fr-FR').format(
                cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
              )} FCFA
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
