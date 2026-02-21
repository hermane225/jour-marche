import { useEffect, useMemo, useState } from 'react';
import { Trash2, RefreshCw, Store, ShieldAlert } from 'lucide-react';
import { adminService } from '../../../services/api';
import type { AdminShop } from '../../../services/api/admin.service';
import './AdminSellers.css';

export function AdminSellers() {
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadShops = async () => {
    const data = await adminService.getShops();
    setShops(data);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadShops();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => shops.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.ownerName || '').toLowerCase().includes(search.toLowerCase())),
    [search, shops]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadShops();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatus = async (shopId: string, status: string) => {
    const updated = await adminService.updateShopStatus(shopId, status);
    setShops((prev) => prev.map((s) => (s.id === shopId ? updated : s)));
  };

  const handleDelete = async (shopId: string) => {
    if (!window.confirm('Supprimer cette boutique ?')) return;
    await adminService.deleteShop(shopId);
    setShops((prev) => prev.filter((s) => s.id !== shopId));
  };

  if (loading) {
    return <div className="admin-page-loading">Chargement des boutiques...</div>;
  }

  return (
    <section className="admin-sellers-pro">
      <header className="admin-page-head">
        <div>
          <h2>Boutiques</h2>
          <p>Moderation des boutiques vendeurs.</p>
        </div>
        <button className="ghost-btn" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refresh...' : 'Rafraichir'}
        </button>
      </header>

      <div className="admin-filters-row single">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher boutique ou owner" />
      </div>

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Boutique</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Produits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shop) => (
              <tr key={shop.id}>
                <td>
                  <div className="entity-cell">
                    <span className="entity-avatar"><Store size={14} /></span>
                    <strong>{shop.name}</strong>
                  </div>
                </td>
                <td>{shop.ownerName || '-'}</td>
                <td>
                  <select value={shop.status || 'active'} onChange={(e) => handleStatus(shop.id, e.target.value)}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="suspended">suspended</option>
                  </select>
                </td>
                <td>{shop.totalProducts || 0}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn"><ShieldAlert size={14} /></button>
                    <button className="icon-btn danger" onClick={() => handleDelete(shop.id)}><Trash2 size={14} /></button>
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
