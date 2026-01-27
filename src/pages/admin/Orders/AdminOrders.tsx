import { useState } from 'react';
import './AdminOrders.css';

export function AdminOrders() {
  const [orders] = useState([
    { id: '#ORD001', customer: 'Jean Dupont', date: '2026-01-27', total: '45,000 FCFA', items: 3, status: 'Livré' },
    { id: '#ORD002', customer: 'Marie Traore', date: '2026-01-26', total: '32,500 FCFA', items: 2, status: 'En cours' },
    { id: '#ORD003', customer: 'Pierre Kone', date: '2026-01-26', total: '58,900 FCFA', items: 5, status: 'Attente' },
    { id: '#ORD004', customer: 'Aissatou Diallo', date: '2026-01-25', total: '21,500 FCFA', items: 1, status: 'Livré' },
    { id: '#ORD005', customer: 'Kofi Mensah', date: '2026-01-25', total: '39,200 FCFA', items: 4, status: 'En cours' },
  ]);

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h2>Gestion des Commandes</h2>
        <div className="filter-bar">
          <input type="text" placeholder="Rechercher une commande..." className="search-input" />
          <select className="filter-select">
            <option>Tous les statuts</option>
            <option>En cours</option>
            <option>Livré</option>
            <option>Attente</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Articles</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td><strong>{order.total}</strong></td>
                <td>{order.items}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Détails">👁️</button>
                    <button className="btn-icon" title="Éditer">✏️</button>
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
