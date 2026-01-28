import { useState, useEffect } from 'react';
import { Button, Input } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useOrders } from '../../../context/OrderContext';

type Provider = 'wave' | 'orange' | 'moov' | 'mtn';

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

export default function MobileMoneyPayment() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [withdrawalCode, setWithdrawalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [orderTotal, setOrderTotal] = useState<OrderTotal | null>(null);

  useEffect(() => {
    // Scroller vers le haut au montage de la page
    window.scrollTo(0, 0);
    
    // Récupérer les infos sauvegardées
    const savedDeliveryInfo = sessionStorage.getItem('delivery_info');
    const savedOrderTotal = sessionStorage.getItem('order_total');

    if (!savedDeliveryInfo || !savedOrderTotal) {
      // Si les infos ne sont pas disponibles, rediriger vers le panier
      navigate('/cart');
      return;
    }

    if (savedDeliveryInfo) {
      setDeliveryInfo(JSON.parse(savedDeliveryInfo));
    }
    if (savedOrderTotal) {
      setOrderTotal(JSON.parse(savedOrderTotal));
    }
    
    setIsLoaded(true);
  }, [navigate]);

  const providers = [
    { id: 'wave' as Provider, name: 'Wave', logo: '/wave.png' },
    { id: 'orange' as Provider, name: 'Orange Money', logo: '/orange.png' },
    { id: 'moov' as Provider, name: 'Moov Money', logo: '/moov.png' },
    { id: 'mtn' as Provider, name: 'MTN', logo: '/mtn.png' },
  ];

  // Simuler un paiement mobile money
  const handlePay = async () => {
    if (!selectedProvider) {
      alert('Veuillez sélectionner un fournisseur Mobile Money.');
      return;
    }

    if (!phoneNumber) {
      alert('Veuillez saisir votre numéro de téléphone.');
      return;
    }

    if (selectedProvider === 'orange' && !withdrawalCode) {
      alert('Veuillez entrer le code de retrait.');
      return;
    }

    setIsProcessing(true);

    // Ici, vous pouvez intégrer une API de paiement réelle
    if (selectedProvider === 'wave') {
      // Redirection vers l'application Wave
      console.log('Redirection vers l\'application Wave...');
      // window.location.href = 'wave://pay'; // Exemple d'URL scheme
    } else if (selectedProvider === 'moov' || selectedProvider === 'mtn') {
      // Envoi d'un message de confirmation
      console.log(`Un message de confirmation a été envoyé à ${phoneNumber}`);
    } else if (selectedProvider === 'orange') {
      // Utilisation du code de retrait
      console.log(`Paiement Orange Money initié avec le code de retrait ${withdrawalCode}`);
    }

    // Simuler le délai de traitement du paiement
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Créer la commande après le paiement réussi
    if (deliveryInfo && orderTotal) {
      const shopId = cart.items[0]?.product.shopId || 'shop_1';
      const shopName = cart.items[0]?.product.shopName || 'Boutique';

      const newOrder = createOrder({
        items: cart.items,
        total: orderTotal.total,
        customerName: deliveryInfo.name,
        customerPhone: deliveryInfo.phone,
        customerAddress: deliveryInfo.address,
        paymentMethod: 'mobile_money',
        shopId: shopId,
        shopName: shopName,
        deliveryType: orderTotal.deliveryType,
        deliveryFee: orderTotal.deliveryFee,
      });

      setOrderNumber(newOrder.orderNumber);
      setOrderSuccess(true);
      clearCart();
      
      // Nettoyer le sessionStorage
      sessionStorage.removeItem('delivery_info');
      sessionStorage.removeItem('order_total');
    }

    setIsProcessing(false);
  };

  if (orderSuccess) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: 40, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
        <div style={{ fontSize: 60, color: '#059669', marginBottom: 20 }}>✓</div>
        <h2 style={{ fontSize: 28, color: '#1f2937', marginBottom: 10 }}>Commande passée avec succès !</h2>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#059669', marginBottom: 8 }}>
          N° {orderNumber}
        </p>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 30 }}>
          Votre paiement a été traité avec succès. Une confirmation a été envoyée à {deliveryInfo?.phone}.
        </p>
        <Button variant="primary" onClick={() => navigate('/')} style={{ width: '100%' }}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  // Si les données ne sont pas encore chargées
  if (!isLoaded || !deliveryInfo || !orderTotal) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
        <div style={{ width: 50, height: 50, border: '4px solid #f0f0f0', borderTop: '4px solid #059669', borderRadius: '50%', margin: '20px auto', animation: 'spin 1s linear infinite' }} />
        <p>Chargement des informations de paiement...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
      <h2>Paiement Mobile Money</h2>
      <p>Sélectionnez votre fournisseur Mobile Money :</p>

      <div style={{ marginBottom: 24 }}>
        {providers.map((provider) => (
          <label
            key={provider.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              marginBottom: '8px',
              border: `2px solid ${selectedProvider === provider.id ? '#007bff' : '#e0e0e0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedProvider === provider.id ? '#f0f8ff' : '#fff',
            }}
          >
            <input
              type="radio"
              name="provider"
              value={provider.id}
              checked={selectedProvider === provider.id}
              onChange={() => setSelectedProvider(provider.id)}
              style={{ marginRight: '12px' }}
              disabled={isProcessing}
            />
            <img src={provider.logo} alt={provider.name} style={{ width: '32px', height: '32px', marginRight: '12px' }} />
            <span style={{ fontWeight: 'bold' }}>{provider.name}</span>
          </label>
        ))}
      </div>

      {selectedProvider && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>
            Détails du paiement {providers.find(p => p.id === selectedProvider)?.name}
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Détail du montant (FCFA)
              </label>
              <div style={{ marginBottom: '4px' }}>
                Prix du produit: {(orderTotal?.subtotal ?? 0).toLocaleString('fr-FR')} FCFA
              </div>
              <div style={{ marginBottom: '4px' }}>
                Frais de livraison: {(orderTotal?.deliveryFee ?? 0).toLocaleString('fr-FR')} FCFA
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                Total: {(orderTotal?.total ?? 0).toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input
              label={`Numéro ${providers.find(p => p.id === selectedProvider)?.name}`}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={
                selectedProvider === 'orange' ? '+225 07 xxxxxx' :
                selectedProvider === 'moov' ? '+225 01 xxxxxx' :
                selectedProvider === 'mtn' ? '+225 05 xxxxxx' :
                'Numéro Wave'
              }
              required
              disabled={isProcessing}
            />
          </div>

          {selectedProvider === 'orange' && (
            <div style={{ marginBottom: '16px' }}>
              <Input
                label="Code de retrait"
                type="text"
                value={withdrawalCode}
                onChange={(e) => setWithdrawalCode(e.target.value)}
                placeholder="XXXX"
                required
                disabled={isProcessing}
              />
            </div>
          )}
        </div>
      )}

      <Button variant="primary" onClick={handlePay} fullWidth size="lg" disabled={!selectedProvider || isProcessing}>
        {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
      </Button>
      <Button variant="secondary" onClick={() => navigate(-1)} fullWidth style={{ marginTop: 12 }} disabled={isProcessing}>
        Annuler
      </Button>
    </div>
  );
}
