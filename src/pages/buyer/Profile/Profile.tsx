import React, { useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { OrderContext } from "../../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../../services/api";
import { MapPin, CreditCard, TrendingUp, Package } from "lucide-react";
import "./Profile.css";

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const orderCtx = useContext(OrderContext);
  const localOrders = useMemo(
    () => ((orderCtx?.orders ?? []) as import("../../../types").Order[]),
    [orderCtx?.orders]
  );
  const [orders, setOrders] = useState<import("../../../types").Order[]>(localOrders);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profil d'édition
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || ""
  });

  // Adresses
  const [addresses, setAddresses] = useState<Array<{id: string; street: string; city: string; zipCode: string; country: string; isDefault: boolean}>>([
    { id: '1', street: '123 Rue Example', city: 'Cocody', zipCode: '01', country: 'Côte d\'Ivoire', isDefault: true }
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', zipCode: '', country: '' });

  // Paiements
  const [payments, setPayments] = useState<Array<{id: string; type: string; name: string; lastDigits: string; isDefault: boolean}>>([
    { id: '1', type: 'mobile', name: 'Mobile Money - Orange', lastDigits: '****1234', isDefault: true },
    { id: '2', type: 'cash', name: 'Espèces à la livraison', lastDigits: '', isDefault: false }
  ]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: 'mobile', name: '', lastDigits: '' });

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      setOrdersLoading(true);
      try {
        const result = await orderService.getBuyerOrders(user.id, { limit: 100, sortBy: 'createdAt', sortOrder: 'desc' });
        setOrders(result.orders);
      } catch {
        setOrders(localOrders);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [localOrders, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(form);
      setEditMode(false);
    } catch {
      // L'erreur est deja geree dans le contexte auth.
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.street && newAddress.city) {
      setAddresses([...addresses.filter(a => !a.isDefault), { id: Date.now().toString(), ...newAddress, isDefault: false }]);
      setNewAddress({ street: '', city: '', zipCode: '', country: '' });
      setShowAddressForm(false);
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPayment.name) {
      setPayments([...payments.filter(p => !p.isDefault), { id: Date.now().toString(), ...newPayment, isDefault: false }]);
      setNewPayment({ type: 'mobile', name: '', lastDigits: '' });
      setShowPaymentForm(false);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const deletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mon Profil</h1>
        <p>Gérez votre compte et vos informations personnelles</p>
        <div className="profile-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/buyer/orders')}>
            Mes commandes
          </button>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>

      {user ? (
        <>
          {/* Section Profil */}
          <section className="profile-section">
            <div className="section-header">
              <h2>Informations personnelles</h2>
            </div>
            <div className="profile-info">
              <img
                src={form.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name)}
                alt="Avatar"
                className="profile-avatar"
              />
              <div className="profile-details">
                {editMode ? (
                  <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Nom complet <span style={{ color: '#ef4444' }}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-ZÀ-ÿ\s\-']*$/.test(value) || value === '') {
                            handleChange(e);
                          }
                        }}
                        placeholder="Votre nom"
                        required
                        pattern="[a-zA-ZÀ-ÿ\s\-']+"
                        title="Utilisez uniquement des lettres"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                        title="Entrez un email valide"
                      />
                    </div>
                    <div className="form-group">
                      <label>Téléphone <span style={{ color: '#ef4444' }}>*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          handleChange({ ...e, target: { ...e.target, value } });
                        }}
                        placeholder="+225 XXXXXXXXXX"
                        required
                        pattern="[0-9+\s]+"
                        inputMode="numeric"
                        title="Entrez uniquement des chiffres"
                      />
                    </div>
                    <div className="form-group">
                      <label>URL Avatar</label>
                      <input 
                        type="url"
                        name="avatar" 
                        value={form.avatar} 
                        onChange={handleChange} 
                        placeholder="https://exemple.com/avatar.jpg"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Enregistrer</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="info-item">
                      <span className="label">Nom :</span>
                      <span className="value">{user.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email :</span>
                      <span className="value">{user.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Téléphone :</span>
                      <span className="value">{user.phone || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Inscrit depuis :</span>
                      <span className="value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}</span>
                    </div>
                    <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                      Modifier le profil
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Section Adresses */}
          <section className="profile-section">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={24} color="#059669" />
                <h2>Adresses de livraison</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                {showAddressForm ? 'Annuler' : '+ Ajouter'}
              </button>
            </div>

            {showAddressForm && (
              <form className="form-card" onSubmit={handleAddAddress}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rue/Adresse</label>
                    <input 
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      placeholder="Ex: 123 Rue Principale"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ville</label>
                    <input 
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="Ex: Cocody"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Code postal</label>
                    <input 
                      type="text"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                      placeholder="Code postal"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pays</label>
                    <input 
                      type="text"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      placeholder="Côte d'Ivoire"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Ajouter l'adresse</button>
                </div>
              </form>
            )}

            <div className="addresses-list">
              {addresses.length > 0 ? (
                addresses.map(addr => (
                  <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                    <div className="address-content">
                      {addr.isDefault && <span className="badge-default">Adresse par défaut</span>}
                      <p className="address-street">{addr.street}</p>
                      <p className="address-city">{addr.city}, {addr.zipCode} {addr.country}</p>
                    </div>
                    <div className="address-actions">
                      {!addr.isDefault && (
                        <button className="btn-text" onClick={() => setDefaultAddress(addr.id)}>
                          Définir par défaut
                        </button>
                      )}
                      <button className="btn-delete" onClick={() => deleteAddress(addr.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Aucune adresse enregistrée</p>
              )}
            </div>
          </section>

          {/* Section Paiements */}
          <section className="profile-section">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard size={24} color="#059669" />
                <h2>Moyens de paiement</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                {showPaymentForm ? 'Annuler' : '+ Ajouter'}
              </button>
            </div>

            {showPaymentForm && (
              <form className="form-card" onSubmit={handleAddPayment}>
                <div className="form-group">
                  <label>Type de paiement</label>
                  <select 
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({...newPayment, type: e.target.value})}
                    className="form-select"
                  >
                    <option value="mobile">Mobile Money</option>
                    <option value="card">Carte bancaire</option>
                    <option value="cash">Espèces à la livraison</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nom/Numéro</label>
                  <input 
                    type="text"
                    value={newPayment.name}
                    onChange={(e) => setNewPayment({...newPayment, name: e.target.value})}
                    placeholder="Ex: Orange Money, Visa"
                    required
                  />
                </div>
                {newPayment.type !== 'cash' && (
                  <div className="form-group">
                    <label>4 derniers chiffres</label>
                    <input 
                      type="text"
                      value={newPayment.lastDigits}
                      onChange={(e) => setNewPayment({...newPayment, lastDigits: e.target.value})}
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                )}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Ajouter le paiement</button>
                </div>
              </form>
            )}

            <div className="payments-list">
              {payments.length > 0 ? (
                payments.map(payment => (
                  <div key={payment.id} className={`payment-card ${payment.isDefault ? 'default' : ''}`}>
                    <div className="payment-content">
                      {payment.isDefault && <span className="badge-default">Paiement par défaut</span>}
                      <p className="payment-name">{payment.name}</p>
                      {!!payment.lastDigits && <p className="payment-digits">****{payment.lastDigits}</p>}
                    </div>
                    <div className="payment-actions">
                      {!payment.isDefault && (
                        <button className="btn-text" onClick={() => setPayments(payments.map(p => ({...p, isDefault: p.id === payment.id})))}>
                          Définir par défaut
                        </button>
                      )}
                      <button className="btn-delete" onClick={() => deletePayment(payment.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Aucun moyen de paiement enregistré</p>
              )}
            </div>
          </section>

          {/* Section Statistiques */}
          <section className="profile-section">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={24} color="#059669" />
                <h2>Statistiques d'achats</h2>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{orders.length}</div>
                <div className="stat-label">Commandes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{orders.reduce((sum: number, o: import("../../../types").Order) => sum + o.total, 0).toLocaleString()} FCFA</div>
                <div className="stat-label">Total dépensé</div>
              </div>
            </div>
          </section>

          {/* Section Historique */}
          <section className="profile-section">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={24} color="#059669" />
                <h2>Historique des commandes</h2>
              </div>
            </div>
            <div className="orders-list">
              {ordersLoading ? (
                <p className="empty-state">Chargement des commandes...</p>
              ) : orders.length > 0 ? (
                orders.map((order: import("../../../types").Order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-info">
                      <p className="order-number">Commande #{order.orderNumber}</p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="order-total">{order.total.toLocaleString()} FCFA</div>
                    <div className={`order-status status-${order.status}`}>{order.status}</div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Aucune commande trouvée</p>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="not-logged-in">
          <p>Vous devez être connecté pour voir votre profil.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
