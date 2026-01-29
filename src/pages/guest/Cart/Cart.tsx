import { useState, type FormEvent, useEffect } from 'react';
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

  // Scroller vers le haut au montage
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const deliveryFee = 2000;
  const subtotal = cart.total;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Rediriger vers la page de révision du panier
    navigate('/cart/review');
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
      <h1 className="cart-title">Panier </h1>

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

          {/* Récapitulatif et bouton de paiement */}
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
            >
              Passer ma commande
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
