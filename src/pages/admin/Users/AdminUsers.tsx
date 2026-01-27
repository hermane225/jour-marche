import { useState } from 'react';
import './AdminUsers.css';

export function AdminUsers() {
  const [users] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Buyer', status: 'Actif', joined: '2026-01-15' },
    { id: 2, name: 'Marie Traore', email: 'marie@example.com', role: 'Buyer', status: 'Actif', joined: '2026-01-10' },
    { id: 3, name: 'Pierre Kone', email: 'pierre@example.com', role: 'Seller', status: 'Actif', joined: '2025-12-20' },
    { id: 4, name: 'Aissatou Diallo', email: 'aissatou@example.com', role: 'Seller', status: 'Inactif', joined: '2025-11-05' },
    { id: 5, name: 'Kofi Mensah', email: 'kofi@example.com', role: 'Buyer', status: 'Actif', joined: '2026-01-22' },
  ]);

  return (
    <div className="admin-users">
      <div className="page-header">
        <h2>Gestion des Utilisateurs</h2>
        <button className="add-btn">➕ Ajouter Utilisateur</button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-name-cell">
                    <span className="user-avatar">{user.name.charAt(0)}</span>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joined}</td>
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
