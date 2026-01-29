import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, User, Package, CheckCircle, MessageSquare } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { Button, Input, Card } from '../../../components/ui';
import './OrderReview.css';

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'pickup' | 'delivery' | 'relay';
  relayInfo?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    commune?: string;
    distance?: number;
    customerFee?: number;  // Frais payés par le client
    driverFee?: number;    // Frais payés par Jour Marché au livreur
  };
}

// Générer un numéro de colis unique
const generateParcelNumber = () => {
  const prefix = 'JDM';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export default function OrderReview() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [parcelNumber, setParcelNumber] = useState('');

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

  // Frais de livraison selon le type
  // - Livraison à domicile: 2000 FCFA
  // - Point relais: petits frais fixes (ex: 200 FCFA) payés par client
  // - Retrait boutique: gratuit
  const getDeliveryFee = () => {
    if (deliveryInfo.deliveryType === 'delivery') return 2000;
    if (deliveryInfo.deliveryType === 'relay' && deliveryInfo.relayInfo?.customerFee) {
      return deliveryInfo.relayInfo.customerFee;
    }
    return 0;
  };
  
  const deliveryFee = getDeliveryFee();
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;
  
  // Frais livreur (payés par Jour Marché, pas par le client)
  const driverFee = deliveryInfo.relayInfo?.driverFee || 0;

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

    // Si c'est un point relais, confirmer directement avec paiement au retrait
    if (deliveryInfo.deliveryType === 'relay') {
      const newParcelNumber = generateParcelNumber();
      setParcelNumber(newParcelNumber);
      
      // Sauvegarder la commande
      const orderData = {
        parcelNumber: newParcelNumber,
        deliveryInfo,
        items: cart.items,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: 'cash_on_pickup',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem('last_order', JSON.stringify(orderData));
      
      // Vider le panier
      clearCart();
      
      // Afficher la confirmation
      setTimeout(() => {
        setIsProcessing(false);
        setOrderConfirmed(true);
      }, 1500);
      return;
    }

    // Vider le panier pour les autres modes
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

  // Écran de confirmation pour point relais
  if (orderConfirmed && deliveryInfo.deliveryType === 'relay') {
    return (
      <div className="order-review-page">
        <div className="order-confirmation-success">
          <div className="success-animation">
            <CheckCircle size={80} color="#10b981" />
          </div>
          
          <h1 style={{ color: '#059669', marginBottom: '0.5rem' }}>Commande confirmée !</h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Votre commande a été enregistrée avec succès
          </p>

          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '2px solid #10b981', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <Package size={32} color="#059669" style={{ marginBottom: '0.5rem' }} />
              <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Numéro de colis</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', letterSpacing: '2px' }}>
                {parcelNumber}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <MessageSquare size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
                  📱 SMS envoyé au {deliveryInfo.phone}
                </p>
                <p style={{ color: '#a16207', fontSize: '0.9rem' }}>
                  Vous recevrez un SMS avec le numéro de colis et les instructions de retrait.
                  Conservez ce numéro pour récupérer votre commande.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#374151' }}>📍 Point de retrait</h3>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
              <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                {deliveryInfo.relayInfo?.name}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                {deliveryInfo.relayInfo?.address}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                📞 {deliveryInfo.relayInfo?.phone}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                🕐 {deliveryInfo.relayInfo?.hours}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#0369a1' }}>💰 Paiement au retrait</h3>
            <p style={{ color: '#0c4a6e', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Montant à payer lors du retrait :
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>
              {formatPrice(total)}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Paiement en espèces ou Mobile Money accepté au point de retrait
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="secondary"
              onClick={() => navigate('/orders')}
              style={{ flex: 1 }}
            >
              Mes commandes
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              style={{ flex: 1 }}
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                {deliveryInfo.deliveryType === 'relay' && deliveryInfo.relayInfo && (
                  <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="info-label">
                      <Package size={18} />
                      Point de retrait
                    </span>
                    <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', width: '100%' }}>
                      <p style={{ fontWeight: 600, color: '#059669', marginBottom: '0.25rem' }}>
                        {deliveryInfo.relayInfo.name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {deliveryInfo.relayInfo.address}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        📞 {deliveryInfo.relayInfo.phone}
                      </p>
                    </div>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Type de livraison</span>
                  <span className="info-value">
                    {deliveryInfo.deliveryType === 'delivery' 
                      ? 'Livraison à domicile' 
                      : deliveryInfo.deliveryType === 'relay' 
                        ? 'Retrait en point relais' 
                        : 'Retrait en boutique'}
                  </span>
                </div>
                {deliveryInfo.deliveryType === 'relay' && (
                  <div className="info-row" style={{ background: '#fffbeb', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                    <span style={{ color: '#92400e', fontSize: '0.9rem' }}>
                      💰 Paiement au retrait du colis
                    </span>
                  </div>
                )}
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
                <span>Sous-total produits</span>
                <span className="price-value">{formatPrice(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>
                  {deliveryInfo.deliveryType === 'delivery' 
                    ? 'Frais de livraison' 
                    : deliveryInfo.deliveryType === 'relay'
                      ? 'Frais de service relais'
                      : 'Frais de retrait'
                  }
                </span>
                <span className="price-value" style={{ color: deliveryFee === 0 ? '#059669' : undefined }}>
                  {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="price-divider" />
              <div className="price-row total">
                <span>Total à payer</span>
                <span className="price-value total-value">{formatPrice(total)}</span>
              </div>
            </div>
            
            {/* Exemple concret pour point relais */}
            {deliveryInfo.deliveryType === 'relay' && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '13px', color: '#374151', marginBottom: '12px', fontWeight: 600 }}>
                  📋 Détail du fonctionnement
                </p>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#059669' }}>✓ Vous payez:</strong> {formatPrice(total)}
                  </p>
                  <p style={{ marginBottom: '8px', paddingLeft: '16px' }}>
                    → Produit(s): {formatPrice(subtotal)}<br/>
                    → Frais service: {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratuit'}
                  </p>
                  <div style={{
                    padding: '8px 12px',
                    background: '#fff7ed',
                    borderRadius: '8px',
                    marginTop: '8px',
                    color: '#9a3412',
                    fontSize: '11px'
                  }}>
                    💡 <strong>Note:</strong> Jour Marché paie le livreur un tarif fixe de {formatPrice(driverFee)} pour déposer votre colis au point relais ({deliveryInfo.relayInfo?.commune || 'Zone'}).
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Bouton de confirmation */}
          <Button
            variant="primary"
            onClick={handleProceedToPayment}
            style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 'bold' }}
            disabled={!deliveryInfo.name || !deliveryInfo.phone || (deliveryInfo.deliveryType === 'delivery' && !deliveryInfo.address) || isProcessing}
          >
            {isProcessing 
              ? 'Traitement...' 
              : deliveryInfo.deliveryType === 'relay' 
                ? 'Confirmer (Paiement au retrait)' 
                : 'Valider et continuer'}
          </Button>

          {deliveryInfo.deliveryType === 'relay' && (
            <p className="payment-info" style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', color: '#059669', textAlign: 'center' }}>
              📦 Vous paierez <strong>{formatPrice(total)}</strong> lors du retrait de votre colis au point relais.
            </p>
          )}

          <p className="payment-info">
            En cliquant sur "Valider", vous acceptez nos conditions d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
}
