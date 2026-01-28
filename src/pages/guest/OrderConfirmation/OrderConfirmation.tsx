import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Phone, User, Package, Clock } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useOrders } from '../../../context/OrderContext';
import { Button, Card } from '../../../components/ui';
import './OrderConfirmation.css';

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'pickup' | 'delivery';
}

interface OrderTotal {
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'mobile_money' | 'cash';
  deliveryType: 'pickup' | 'delivery';
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [orderTotal, setOrderTotal] = useState<OrderTotal | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  useEffect(() => {
    // Récupérer les infos sauvegardées
    const savedDeliveryInfo = sessionStorage.getItem('delivery_info');
    const savedOrderTotal = sessionStorage.getItem('order_total');

    if (!savedDeliveryInfo || !savedOrderTotal) {
      // Si les infos ne sont pas disponibles, rediriger vers le panier
      navigate('/cart');
      return;
    }

    const deliveryData: DeliveryInfo = JSON.parse(savedDeliveryInfo);
    const totalData: OrderTotal = JSON.parse(savedOrderTotal);

    setDeliveryInfo(deliveryData);
    setOrderTotal(totalData);

    // Créer la commande
    if (cart.items.length > 0) {
      const shopId = cart.items[0]?.product.shopId || 'shop_1';
      const shopName = cart.items[0]?.product.shopName || 'Boutique';

      const newOrder = createOrder({
        items: cart.items,
        total: totalData.total,
        customerName: deliveryData.name,
        customerPhone: deliveryData.phone,
        customerAddress: deliveryData.address,
        paymentMethod: totalData.paymentMethod,
        shopId: shopId,
        shopName: shopName,
        deliveryType: totalData.deliveryType,
        deliveryFee: totalData.deliveryFee,
      });

      setOrderNumber(newOrder.orderNumber);
      clearCart();
      
      // Nettoyer le sessionStorage
      sessionStorage.removeItem('delivery_info');
      sessionStorage.removeItem('order_total');
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="order-confirmation-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Traitement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!deliveryInfo || !orderTotal) {
    return (
      <div className="order-confirmation-page">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>Les informations de commande sont manquantes.</p>
          <Button variant="primary" onClick={() => navigate('/cart')}>
            Retour au panier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* En-tête avec succès */}
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle size={80} />
          </div>
          <h1>Commande confirmée !</h1>
          <p className="order-number">Numéro de commande: <strong>#{orderNumber}</strong></p>
        </div>

        <div className="confirmation-grid">
          {/* Colonne 1: État et paiement */}
          <Card className="status-card">
            <div className="card-header">
              <h2>
                <Clock size={20} />
                État de la commande
              </h2>
            </div>
            <div className="status-content">
              <div className="status-badge status-pending">
                En attente
              </div>
              <p className="status-description">
                Votre commande a été reçue et est actuellement en attente de confirmation par le vendeur.
              </p>
              
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <strong>Commande reçue</strong>
                    <p>Juste à l'instant</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <strong>Confirmée par le vendeur</strong>
                    <p>En attente...</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <strong>Prête pour la livraison</strong>
                    <p>En attente...</p>
                  </div>
                </div>
                {orderTotal.deliveryType === 'delivery' && (
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-text">
                      <strong>Livraison en cours</strong>
                      <p>En attente...</p>
                    </div>
                  </div>
                )}
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <strong>{orderTotal.deliveryType === 'delivery' ? 'Livrée' : 'Retirée'}</strong>
                    <p>En attente...</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Colonne 2: Détails de livraison et paiement */}
          <div className="details-column">
            {/* Informations de livraison */}
            <Card>
              <div className="card-header">
                <h2>
                  {orderTotal.deliveryType === 'delivery' ? (
                    <>
                      <MapPin size={20} />
                      Adresse de livraison
                    </>
                  ) : (
                    <>
                      <Package size={20} />
                      Retrait en boutique
                    </>
                  )}
                </h2>
              </div>
              <div className="delivery-details">
                <div className="detail-row">
                  <User size={18} />
                  <div>
                    <p className="detail-label">Nom</p>
                    <p className="detail-value">{deliveryInfo.name}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <Phone size={18} />
                  <div>
                    <p className="detail-label">Téléphone</p>
                    <p className="detail-value">{deliveryInfo.phone}</p>
                  </div>
                </div>
                {orderTotal.deliveryType === 'delivery' && (
                  <div className="detail-row">
                    <MapPin size={18} />
                    <div>
                      <p className="detail-label">Adresse</p>
                      <p className="detail-value">{deliveryInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Informations de paiement */}
            <Card>
              <div className="card-header">
                <h2>Informations de paiement</h2>
              </div>
              <div className="payment-info">
                <div className="payment-row">
                  <span>Sous-total</span>
                  <span>{formatPrice(orderTotal.subtotal)}</span>
                </div>
                <div className="payment-row">
                  <span>
                    Frais de {orderTotal.deliveryType === 'delivery' ? 'livraison' : 'retrait'}
                  </span>
                  <span>{formatPrice(orderTotal.deliveryFee)}</span>
                </div>
                <div className="payment-divider"></div>
                <div className="payment-row total">
                  <span>Total à payer</span>
                  <span>{formatPrice(orderTotal.total)}</span>
                </div>
                <div className="payment-method">
                  <p className="payment-label">Mode de paiement</p>
                  <p className="payment-value">
                    Paiement à la livraison (espèces)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <div className="action-info">
            <p>
              📱 Un SMS de confirmation a été envoyé à <strong>{deliveryInfo.phone}</strong>
            </p>
            <p>
              Vous recevrez une autre notification lorsque le vendeur confirmera votre commande.
            </p>
          </div>
          <div className="action-buttons">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/buyer/orders')}
              style={{ flex: 1 }}
            >
              Voir mes commandes
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
              style={{ flex: 1 }}
            >
              Continuer les achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
