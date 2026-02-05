import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Button, Card } from '../../../components/ui';
import './CartReview.css';

export function CartReview() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const deliveryFee = 2000;
  const subtotal = cart.total;
  const total = subtotal + deliveryFee;

  if (cart.items.length === 0) {
    return (
      <div className="cart-review-page">
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

  const handleContinue = () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Sauvegarder l'URL de retour pour après la connexion
      sessionStorage.setItem('redirectAfterLogin', '/delivery/info');
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    // Naviguer vers les infos de livraison
    setTimeout(() => {
      navigate('/delivery/info');
    }, 300);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="cart-review-page">
      <div className="cart-review-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="cart-review-title">Réviser mon panier</h1>
      </div>

      <div className="cart-review-container">
        {/* Articles du panier */}
        <div className="cart-review-items">
          <Card className="items-card">
            <h2 className="items-section-title">Mes articles</h2>
            <div className="items-list">
              {cart.items.map((cartItem) => (
                <div key={`${cartItem.product.id}-${cartItem.selectedVariants?.color}-${cartItem.selectedVariants?.size}`} className="cart-item">
                  <div className="item-image">
                    <img src={cartItem.product.images[0]} alt={cartItem.product.title} />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{cartItem.product.title}</h3>
                    <p className="item-shop">{cartItem.product.shopName}</p>
                    {cartItem.selectedVariants?.color && <p className="item-variant">Couleur: {cartItem.selectedVariants.color}</p>}
                    {cartItem.selectedVariants?.size && <p className="item-variant">Taille: {cartItem.selectedVariants.size}</p>}
                    <p className="item-price">{formatPrice(cartItem.product.price)}</p>
                  </div>

                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity - 1)}
                        disabled={cartItem.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-value">{cartItem.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <p className="item-subtotal">
                      {formatPrice(cartItem.product.price * cartItem.quantity)}
                    </p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(cartItem.product.id)}
                    title="Supprimer l'article"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Résumé et prix */}
        <div className="cart-review-summary">
          <Card className="summary-card">
            <h2 className="summary-title">Résumé de la commande</h2>

            <div className="summary-row">
              <span className="summary-label">Sous-total</span>
              <span className="summary-value">{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Frais de livraison</span>
              <span className="summary-value">{formatPrice(deliveryFee)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span className="summary-label">Total</span>
              <span className="summary-value">{formatPrice(total)}</span>
            </div>

            <div className="summary-actions">
              <Button
                variant="secondary"
                onClick={handleBack}
                style={{ width: '100%' }}
              >
                Continuer mes achats
              </Button>
              <Button
                variant="primary"
                onClick={handleContinue}
                disabled={isProcessing || cart.items.length === 0}
                style={{ width: '100%' }}
              >
                {isProcessing ? 'Chargement...' : 'Procéder à la livraison'}
              </Button>
            </div>

            <p className="summary-note">
              Vous pourrez modifier votre adresse à l'étape suivante
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CartReview;
