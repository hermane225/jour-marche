import React, { useContext, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { OrderContext } from "../../../context/OrderContext";
import "./Profile.css";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const orderCtx = useContext(OrderContext);
  const orders = (orderCtx?.orders ?? []) as import("../../../types").Order[];

  // Formulaire d'édition
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      {user ? (
        <div className="profile-info">
          <img
            src={form.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name)}
            alt="Avatar"
            className="profile-avatar"
          />
          <div className="profile-details">
            {editMode ? (
              <form className="profile-edit-form" onSubmit={handleSubmit}>
                <label>Nom : <input name="name" value={form.name} onChange={handleChange} /></label>
                <label>Email : <input name="email" value={form.email} onChange={handleChange} /></label>
                <label>Téléphone : <input name="phone" value={form.phone} onChange={handleChange} /></label>
                <label>Avatar : <input name="avatar" value={form.avatar} onChange={handleChange} /></label>
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={() => setEditMode(false)}>Annuler</button>
              </form>
            ) : (
              <>
                <p><strong>Nom :</strong> {user.name}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Téléphone :</strong> {user.phone}</p>
                <p><strong>Rôle :</strong> {user.role}</p>
                <p><strong>Inscrit le :</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</p>
                <button className="profile-edit-btn" onClick={() => setEditMode(true)}>Modifier le profil</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Utilisateur non connecté.</p>
      )}
      <hr />
      {/* Adresse de livraison */}
      <div className="profile-section">
        <h2>Adresse de livraison</h2>
        <p>Exemple : Cocody, Abidjan, Côte d'Ivoire</p>
        <button className="profile-edit-btn">Modifier l'adresse</button>
      </div>
      <hr />
      {/* Méthodes de paiement */}
      <div className="profile-section">
        <h2>Méthodes de paiement</h2>
        <ul>
          <li>Mobile Money (Orange, MTN, Moov)</li>
          <li>Carte bancaire</li>
          <li>Espèces à la livraison</li>
        </ul>
        <button className="profile-edit-btn">Gérer mes moyens de paiement</button>
      </div>
      <hr />
      {/* Favoris / Produits suivis */}
      <div className="profile-section">
        <h2>Favoris / Produits suivis</h2>
        <p>Aucun produit favori pour le moment.</p>
      </div>
      <hr />
      {/* Statistiques d'achats */}
      <div className="profile-section">
        <h2>Statistiques d'achats</h2>
        <p>Total commandes : {orders.length}</p>
        <p>Total dépensé : {orders.reduce((sum: number, o: import("../../../types").Order) => sum + o.total, 0)} FCFA</p>
      </div>
      <hr />
      <div className="profile-orders">
        <h2>Historique des commandes</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order: import("../../../types").Order) => (
              <li key={order.id}>
                <strong>Commande :</strong> {order.orderNumber} | <strong>Date :</strong> {new Date(order.createdAt).toLocaleDateString()} | <strong>Total :</strong> {order.total} FCFA | <strong>Statut :</strong> {order.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
