import { useState } from 'react';
import { Button, Input } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

type Provider = 'wave' | 'orange' | 'moov' | 'mtn';

export default function MobileMoneyPayment() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [withdrawalCode, setWithdrawalCode] = useState('');

  const providers = [
    { id: 'wave' as Provider, name: 'Wave', logo: '/wave.png' },
    { id: 'orange' as Provider, name: 'Orange Money', logo: '/orange.png' },
    { id: 'moov' as Provider, name: 'Moov Money', logo: '/moov.png' },
    { id: 'mtn' as Provider, name: 'MTN', logo: '/mtn.png' },
  ];

  // Simuler un paiement mobile money
  const handlePay = () => {
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

    // Ici, vous pouvez intégrer une API de paiement réelle
    if (selectedProvider === 'wave') {
      // Redirection vers l'application Wave
      alert('Redirection vers l\'application Wave...');
      // window.location.href = 'wave://pay'; // Exemple d'URL scheme
    } else if (selectedProvider === 'moov' || selectedProvider === 'mtn') {
      // Envoi d'un message de confirmation
      alert(`Un message de confirmation a été envoyé à ${phoneNumber}. Veuillez confirmer le paiement.`);
    } else if (selectedProvider === 'orange') {
      // Utilisation du code de retrait
      alert(`Paiement Orange Money initié avec le code de retrait ${withdrawalCode}.`);
    }

    setTimeout(() => {
      alert(`Paiement ${providers.find(p => p.id === selectedProvider)?.name} réussi !`);
      navigate('/');
    }, 1500);
  };

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
                Détail du montant (XOF)
              </label>
              <div style={{ marginBottom: '4px' }}>
                Prix du produit: {(cart.total - (cart.deliveryFee || 0)).toLocaleString()} XOF
              </div>
              <div style={{ marginBottom: '4px' }}>
                Frais de livraison: {(cart.deliveryFee || 0).toLocaleString()} XOF
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                Total: {cart.total.toLocaleString()} XOF
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
              />
            </div>
          )}
        </div>
      )}

      <Button variant="primary" onClick={handlePay} fullWidth size="lg" disabled={!selectedProvider}>
        Payer maintenant
      </Button>
      <Button variant="secondary" onClick={() => navigate(-1)} fullWidth style={{ marginTop: 12 }}>
        Annuler
      </Button>
    </div>
  );
}
