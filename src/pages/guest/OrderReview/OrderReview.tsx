import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { Button, Input, Card } from '../../../components/ui';
import './OrderReview.css';

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'pickup' | 'delivery';
  relayInfo?: any;
}

export default function OrderReview() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Scroller vers le haut au montage
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Récupérer les informations du formulaire précédent (via sessionStorage ou props)
  const savedDeliveryInfo = sessionStorage.getItem('delivery_info');
  const initialDeliveryInfo: DeliveryInfo = savedDeliveryInfo 
    ? JSON.parse(savedDeliveryInfo)
    : {
        name: '',
        phone: '',
        address: '',
        deliveryType: 'delivery',
      };

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(initialDeliveryInfo);
  const [editedInfo, setEditedInfo] = useState<DeliveryInfo>(initialDeliveryInfo);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const deliveryFee = deliveryInfo.deliveryType === 'delivery' ? 2000 : 0;
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleEditAddress = () => {
    setEditedInfo(deliveryInfo);
    setIsEditing(true);
  };

  const handleSaveAddress = (e: FormEvent) => {
    e.preventDefault();
    setDeliveryInfo(editedInfo);
    sessionStorage.setItem('delivery_info', JSON.stringify(editedInfo));
    setIsEditing(false);
  };

  const handleProceedToPayment = () => {
    setIsProcessing(true);

    // Vider le panier
    clearCart();

    // Sauvegarder les infos de livraison et le montant
    sessionStorage.setItem('delivery_info', JSON.stringify(deliveryInfo));
    sessionStorage.setItem('order_total', JSON.stringify({
      subtotal,
      deliveryFee,
      total,
      deliveryType: deliveryInfo.deliveryType,
    }));

    // Rediriger vers la page de sélection du mode de paiement
    setTimeout(() => {
      navigate('/payment/method');
    }, 300);
  };

  if (cart.items.length === 0) {
    return (
      <div className="order-review-page">
        <div className="order-review-empty">
          <h2>Votre panier est vide</h2>
          <Button variant="primary" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-review-page">
      <div className="order-review-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
          Retour
        </button>
        <h1>Confirmation de commande</h1>
      </div>

      <div className="order-review-container">
        {/* Colonne gauche: Résumé de la commande */}
        <div className="order-review-main">
          {/* Articles */}
          <Card>
            <div className="card-header">
              <h2>Résumé de votre commande</h2>
            </div>
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item.product.id} className="order-item">
                  {item.product.images && item.product.images.length > 0 && (
                    <img src={item.product.images[0]} alt={item.product.title} className="item-image" />
                  )}
                  <div className="item-details">
                    <h3>{item.product.title}</h3>
                    <p className="item-shop">{item.product.shopName}</p>
                    <div className="item-quantity">
                      Quantité: <span className="quantity-badge">{item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-price">
                    <div className="unit-price">{formatPrice(item.product.price)}</div>
                    <div className="total-price">{formatPrice(item.product.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Informations de livraison */}
          <Card>
            <div className="card-header">
              <h2>Informations de livraison</h2>
              {!isEditing && (
                <button className="edit-button" onClick={handleEditAddress}>
                  Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="delivery-form" onSubmit={handleSaveAddress}>
                <div className="form-group">
                  <label>
                    <User size={18} />
                    Nom complet
                  </label>
                  <Input
                    type="text"
                    placeholder="Votre nom"
                    value={editedInfo.name}
                    onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={18} />
                    Numéro de téléphone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+225 0X XX XX XX XX"
                    value={editedInfo.phone}
                    onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type de livraison</label>
                  <div className="delivery-options">
                    <label className="delivery-option">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={editedInfo.deliveryType === 'delivery'}
                        onChange={() => setEditedInfo({ ...editedInfo, deliveryType: 'delivery' })}
                      />
                      <span>Livraison à domicile (+{formatPrice(2000)})</span>
                    </label>
                    <label className="delivery-option">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={editedInfo.deliveryType === 'pickup'}
                        onChange={() => setEditedInfo({ ...editedInfo, deliveryType: 'pickup' })}
                      />
                      <span>Retrait en boutique (Gratuit)</span>
                    </label>
                  </div>
                </div>

                {editedInfo.deliveryType === 'delivery' && (
                  <div className="form-group">
                    <label>
                      <MapPin size={18} />
                      Adresse de livraison
                    </label>
                    <Input
                      type="text"
                      placeholder="Votre adresse complète"
                      value={editedInfo.address}
                      onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="form-actions">
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Enregistrer
                  </Button>
                </div>
              </form>
            ) : (
              <div className="delivery-info-display">
                <div className="info-row">
                  <span className="info-label">
                    <User size={18} />
                    Nom
                  </span>
                  <span className="info-value">{deliveryInfo.name || '-'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <Phone size={18} />
                    Téléphone
                  </span>
                  <span className="info-value">{deliveryInfo.phone || '-'}</span>
                </div>
                {deliveryInfo.deliveryType === 'delivery' && (
                  <div className="info-row">
                    <span className="info-label">
                      <MapPin size={18} />
                      Adresse
                    </span>
                    <span className="info-value">{deliveryInfo.address || '-'}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Type de livraison</span>
                  <span className="info-value">
                    {deliveryInfo.deliveryType === 'delivery' ? 'Livraison à domicile' : 'Retrait en boutique'}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Colonne droite: Résumé du prix et options de paiement */}
        <div className="order-review-sidebar">
          {/* Résumé du prix */}
          <Card className="price-summary">
            <div className="card-header">
              <h2>Résumé du montant</h2>
            </div>
            <div className="price-details">
              <div className="price-row">
                <span>Sous-total</span>
                <span className="price-value">{formatPrice(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>
                  Frais de {deliveryInfo.deliveryType === 'delivery' ? 'livraison' : 'retrait'}
                </span>
                <span className="price-value">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="price-divider" />
              <div className="price-row total">
                <span>Total à payer</span>
                <span className="price-value total-value">{formatPrice(total)}</span>
              </div>
            </div>
          </Card>

          {/* Bouton de confirmation */}
          <Button
            variant="primary"
            onClick={handleProceedToPayment}
            style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 'bold' }}
            disabled={!deliveryInfo.name || !deliveryInfo.phone || (deliveryInfo.deliveryType === 'delivery' && !deliveryInfo.address) || isProcessing}
          >
            {isProcessing ? 'Traitement...' : 'Valider et continuer'}
          </Button>

          <p className="payment-info">
            En cliquant sur "Procéder au paiement", vous acceptez nos conditions d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
}
