import { useEffect, useMemo, useState } from 'react';
import { Trash2, ShieldCheck, UserCog, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/api';
import type { AdminUser } from '../../../services/api/admin.service';
import './AdminUsers.css';

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadUsers = async () => {
    const data = await adminService.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadUsers();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => users.filter((u) => {
      const term = search.toLowerCase();
      const matchesSearch = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchesRole = roleFilter === 'all' || String(u.role) === roleFilter;
      return matchesSearch && matchesRole;
    }),
    [roleFilter, search, users]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUsers();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRole = async (id: string, role: string) => {
    const updated = await adminService.updateUserRole(id, role);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const handleStatus = async (id: string, status: string) => {
    const updated = await adminService.updateUserStatus(id, status);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await adminService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (loading) {
    return <div className="admin-page-loading">Chargement des utilisateurs...</div>;
  }

  return (
    <section className="admin-users-pro">
      <header className="admin-page-head">
        <div>
          <h2>Utilisateurs</h2>
          <p>Gestion roles, status et moderation comptes.</p>
        </div>
        <button className="ghost-btn" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refresh...' : 'Rafraichir'}
        </button>
      </header>

      <div className="admin-filters-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">Tous les roles</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
          <option value="driver">driver</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="entity-cell">
                    <span className="entity-avatar">{(user.name || 'U').charAt(0).toUpperCase()}</span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.phone || '-'}</small>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select value={String(user.role)} onChange={(e) => handleRole(user.id, e.target.value)}>
                    <option value="buyer">buyer</option>
                    <option value="seller">seller</option>
                    <option value="driver">driver</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <select value={user.status || (user.isActive ? 'active' : 'inactive')} onChange={(e) => handleStatus(user.id, e.target.value)}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="suspended">suspended</option>
                  </select>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn"><ShieldCheck size={14} /></button>
                    <button className="icon-btn"><UserCog size={14} /></button>
                    <button className="icon-btn danger" onClick={() => handleDelete(user.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
