import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useOrders } from '../../../context/OrderContext';
import { Button, Input, Card } from '../../../components/ui';
import './Cart.css';

export function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash'>('mobile_money');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const deliveryFee = 2000;
  const subtotal = cart.total;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Créer la commande
    const shopId = cart.items[0]?.product.shopId || 'shop_1';
    const shopName = cart.items[0]?.product.shopName || 'Boutique';

    const newOrder = createOrder({
      items: cart.items,
      total: total,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      paymentMethod: paymentMethod,
      shopId: shopId,
      shopName: shopName,
      deliveryType: 'delivery',
      deliveryFee: deliveryFee,
    });

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    setOrderNumber(newOrder.orderNumber);
    setOrderSuccess(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <div className="cart-success">
          <div className="cart-success-icon">✓</div>
          <h2>Commande passée avec succès !</h2>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>
            N° {orderNumber}
          </p>
          <p>Votre commande a été envoyée au vendeur. Vous recevrez une confirmation par SMS.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et commencez vos achats !</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Explorer les produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Panier / Checkout</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-section">
          <Card className="cart-items-card">
            <h3>Produits ({cart.items.length})</h3>
            
            <div className="cart-items-list">
              {cart.items.map(item => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.product.images[0]} alt={item.product.title} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h4>{item.product.title}</h4>
                    <p className="cart-item-shop">{item.product.shopName}</p>
                    {item.selectedVariants?.color && (
                      <p className="cart-item-variant">Couleur: {item.selectedVariants.color}</p>
                    )}
                    <p className="cart-item-price">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Checkout Form */}
          <Card className="cart-checkout-card">
            <h3>Informations de livraison</h3>
            
            <form onSubmit={handleSubmit} className="cart-form">
              <Input
                label="Nom complet"
                placeholder="Entrez votre nom"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                required
              />

              <Input
                label="Numéro de téléphone"
                type="tel"
                placeholder="+225 XX XX XX XX"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                required
              />

              <Input
                label="Adresse de livraison"
                placeholder="Commune, Quartier, Rue..."
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                required
              />

              <div className="cart-payment-section">
                <h4>Mode de paiement</h4>
                <div className="cart-payment-options">
                  <label className={`cart-payment-option ${paymentMethod === 'mobile_money' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="mobile_money"
                      checked={paymentMethod === 'mobile_money'}
                      onChange={() => setPaymentMethod('mobile_money')}
                    />
                    <span className="cart-payment-icon">📱</span>
                    <span>Mobile Money</span>
                  </label>
                  
                  <label className={`cart-payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <span className="cart-payment-icon">💵</span>
                    <span>Cash à la livraison</span>
                  </label>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-section">
          <Card className="cart-summary-card">
            <h3>Récapitulatif</h3>
            
            <div className="cart-summary-lines">
              <div className="cart-summary-line">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cart-summary-line">
                <span>Frais de livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="cart-summary-line cart-summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              fullWidth 
              size="lg"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            >
              Passer commande
            </Button>

            <p className="cart-summary-note">
              En passant commande, vous acceptez nos <Link to="/terms">conditions générales</Link>.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
