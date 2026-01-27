import { useState } from 'react';
import './AdminSellers.css';

export function AdminSellers() {
  const [sellers] = useState([
    { id: 1, name: 'Marché Frais', owner: 'Jean Traore', status: 'Actif', products: 324, rating: 4.8 },
    { id: 2, name: 'Épicerie du Centre', owner: 'Marie Dupont', status: 'Actif', products: 287, rating: 4.5 },
    { id: 3, name: 'Fruits & Légumes Premium', owner: 'Pierre Kone', status: 'Actif', products: 198, rating: 4.9 },
    { id: 4, name: 'Poissonnerie Océan', owner: 'Aissatou Diallo', status: 'Suspendu', products: 156, rating: 4.2 },
    { id: 5, name: 'Boulangerie Excellence', owner: 'Kofi Mensah', status: 'Actif', products: 245, rating: 4.7 },
  ]);

  return (
    <div className="admin-sellers">
      <div className="page-header">
        <h2>Gestion des Vendeurs</h2>
        <button className="add-btn">➕ Ajouter Vendeur</button>
      </div>

      <div className="sellers-table-container">
        <table className="sellers-table">
          <thead>
            <tr>
              <th>Vendeur</th>
              <th>Propriétaire</th>
              <th>Statut</th>
              <th>Produits</th>
              <th>Évaluation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>
                  <div className="seller-name-cell">
                    <span className="seller-avatar">🏪</span>
                    <span>{seller.name}</span>
                  </div>
                </td>
                <td>{seller.owner}</td>
                <td>
                  <span className={`status-badge status-${seller.status.toLowerCase()}`}>
                    {seller.status}
                  </span>
                </td>
                <td>{seller.products}</td>
                <td>
                  <div className="rating">
                    <span className="stars">{'⭐'.repeat(Math.floor(seller.rating))}</span>
                    <span>{seller.rating}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Voir">👁️</button>
                    <button className="btn-icon" title="Éditer">✏️</button>
                    <button className="btn-icon" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
