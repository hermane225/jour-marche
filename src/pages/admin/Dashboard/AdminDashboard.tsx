import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Settings, Send, RefreshCw, Trash2, Shield, Store, Package, ShoppingCart, Users } from 'lucide-react';
import { adminService } from '../../../services/api';
import type { AdminOrder, AdminProduct, AdminShop, AdminUser, DashboardStats, PlatformSettings } from '../../../services/api/admin.service';
import './AdminDashboard.css';

type ToastType = 'success' | 'error';

interface ToastState {
  type: ToastType;
  message: string;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [stats, setStats] = useState<DashboardStats>({});
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>({});

  const [notifyForm, setNotifyForm] = useState({ title: '', message: '', role: 'all' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingNotify, setSendingNotify] = useState(false);

  const notify = (type: ToastType, message: string) => setToast({ type, message });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadAdminData = async () => {
    const [statsRes, usersRes, shopsRes, ordersRes, productsRes, settingsRes] = await Promise.all([
      adminService.getStats(),
      adminService.getUsers(),
      adminService.getShops(),
      adminService.getOrders(),
      adminService.getProducts(),
      adminService.getSettings(),
    ]);

    setStats(statsRes || {});
    setUsers(usersRes || []);
    setShops(shopsRes || []);
    setOrders(ordersRes || []);
    setProducts(productsRes || []);
    setSettings(settingsRes || {});
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadAdminData();
      } catch (error) {
        notify('error', error instanceof Error ? error.message : 'Erreur chargement admin');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadAdminData();
      notify('success', 'Donnees admin rafraichies');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec rafraichissement');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      notify('success', 'Parametres mis a jour');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec mise a jour parametres');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendNotification = async (e: FormEvent) => {
    e.preventDefault();
    if (!notifyForm.title.trim() || !notifyForm.message.trim()) {
      notify('error', 'Titre et message sont obligatoires');
      return;
    }
    try {
      setSendingNotify(true);
      await adminService.sendNotification({
        title: notifyForm.title.trim(),
        message: notifyForm.message.trim(),
        role: notifyForm.role === 'all' ? undefined : notifyForm.role,
      });
      setNotifyForm({ title: '', message: '', role: 'all' });
      notify('success', 'Notification envoyee');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec envoi notification');
    } finally {
      setSendingNotify(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const updated = await adminService.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      notify('success', 'Role utilisateur mis a jour');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec MAJ role');
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      const updated = await adminService.updateUserStatus(userId, status);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      notify('success', 'Statut utilisateur mis a jour');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec MAJ statut utilisateur');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      notify('success', 'Utilisateur supprime');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec suppression utilisateur');
    }
  };

  const handleUpdateShopStatus = async (shopId: string, status: string) => {
    try {
      const updated = await adminService.updateShopStatus(shopId, status);
      setShops((prev) => prev.map((s) => (s.id === shopId ? updated : s)));
      notify('success', 'Statut boutique mis a jour');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec MAJ statut boutique');
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    if (!window.confirm('Supprimer cette boutique ?')) return;
    try {
      await adminService.deleteShop(shopId);
      setShops((prev) => prev.filter((s) => s.id !== shopId));
      notify('success', 'Boutique supprimee');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec suppression boutique');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      notify('success', 'Statut commande mis a jour');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec MAJ statut commande');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await adminService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      notify('success', 'Produit supprime');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Echec suppression produit');
    }
  };

  const kpiCards = useMemo(
    () => [
      { label: 'Utilisateurs', value: Number(stats.totalUsers || users.length), icon: Users, tone: 'blue' },
      { label: 'Boutiques', value: Number(stats.totalShops || shops.length), icon: Store, tone: 'green' },
      { label: 'Commandes', value: Number(stats.totalOrders || orders.length), icon: ShoppingCart, tone: 'amber' },
      { label: 'Produits', value: Number(stats.totalProducts || products.length), icon: Package, tone: 'violet' },
    ],
    [orders.length, products.length, shops.length, stats.totalOrders, stats.totalProducts, stats.totalShops, stats.totalUsers, users.length]
  );

  if (loading) {
    return <div className="admin-dashboard-loading">Chargement des donnees admin...</div>;
  }

  return (
    <div className="admin-dashboard-pro">
      <section className="admin-kpi-grid">
        {kpiCards.map((card) => {
          const CardIcon = card.icon;
          return (
            <article key={card.label} className={`kpi-card tone-${card.tone}`}>
              <div>
                <p>{card.label}</p>
                <strong>{card.value.toLocaleString('fr-FR')}</strong>
              </div>
              <span className="kpi-icon"><CardIcon size={20} /></span>
            </article>
          );
        })}
      </section>

      <section className="admin-toolbar-row">
        <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Rafraichissement...' : 'Rafraichir'}
        </button>
        <p>Revenu total: <strong>{Number(stats.totalRevenue || 0).toLocaleString('fr-FR')} FCFA</strong></p>
      </section>

      <section className="admin-grid-two">
        <div className="admin-panel">
          <div className="panel-head">
            <h3><Users size={17} /> Utilisateurs</h3>
          </div>
          <div className="panel-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select value={String(u.role)} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}>
                        <option value="buyer">buyer</option>
                        <option value="seller">seller</option>
                        <option value="driver">driver</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <select value={u.status || (u.isActive ? 'active' : 'inactive')} onChange={(e) => handleUpdateUserStatus(u.id, e.target.value)}>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                        <option value="suspended">suspended</option>
                      </select>
                    </td>
                    <td>
                      <button className="row-icon danger" onClick={() => handleDeleteUser(u.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-head">
            <h3><Store size={17} /> Boutiques</h3>
          </div>
          <div className="panel-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Boutique</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Produits</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shops.slice(0, 8).map((shop) => (
                  <tr key={shop.id}>
                    <td>{shop.name}</td>
                    <td>{shop.ownerName || '-'}</td>
                    <td>
                      <select value={shop.status || 'active'} onChange={(e) => handleUpdateShopStatus(shop.id, e.target.value)}>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                        <option value="suspended">suspended</option>
                      </select>
                    </td>
                    <td>{shop.totalProducts || 0}</td>
                    <td>
                      <button className="row-icon danger" onClick={() => handleDeleteShop(shop.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="admin-grid-two">
        <div className="admin-panel">
          <div className="panel-head">
            <h3><ShoppingCart size={17} /> Commandes</h3>
          </div>
          <div className="panel-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber || order.id.slice(0, 8)}</td>
                    <td>{order.customerName || '-'}</td>
                    <td>{Number(order.total || 0).toLocaleString('fr-FR')} FCFA</td>
                    <td>
                      <select value={order.status || 'pending'} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="preparing">preparing</option>
                        <option value="in_delivery">in_delivery</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-head">
            <h3><Package size={17} /> Produits</h3>
          </div>
          <div className="panel-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Boutique</th>
                  <th>Prix</th>
                  <th>Qte</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.shopName || '-'}</td>
                    <td>{Number(product.price || 0).toLocaleString('fr-FR')} FCFA</td>
                    <td>{product.quantity || 0}</td>
                    <td>
                      <button className="row-icon danger" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="admin-grid-two">
        <form className="admin-panel" onSubmit={handleSaveSettings}>
          <div className="panel-head">
            <h3><Settings size={17} /> Parametres plateforme</h3>
          </div>
          <div className="panel-form-grid">
            <label>
              Site name
              <input value={String(settings.siteName || '')} onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))} />
            </label>
            <label>
              Currency
              <input value={String(settings.currency || '')} onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))} />
            </label>
            <label>
              Commission (%)
              <input type="number" value={Number(settings.commissionRate || 0)} onChange={(e) => setSettings((prev) => ({ ...prev, commissionRate: Number(e.target.value) }))} />
            </label>
            <label>
              Default delivery fee
              <input type="number" value={Number(settings.defaultDeliveryFee || 0)} onChange={(e) => setSettings((prev) => ({ ...prev, defaultDeliveryFee: Number(e.target.value) }))} />
            </label>
          </div>
          <div className="panel-actions">
            <button type="submit" className="primary-btn" disabled={savingSettings}>
              {savingSettings ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>

        <form className="admin-panel" onSubmit={handleSendNotification}>
          <div className="panel-head">
            <h3><Shield size={17} /> Notification globale</h3>
          </div>
          <div className="panel-form-grid single">
            <label>
              Titre
              <input value={notifyForm.title} onChange={(e) => setNotifyForm((prev) => ({ ...prev, title: e.target.value }))} />
            </label>
            <label>
              Message
              <textarea rows={4} value={notifyForm.message} onChange={(e) => setNotifyForm((prev) => ({ ...prev, message: e.target.value }))} />
            </label>
            <label>
              Cible role
              <select value={notifyForm.role} onChange={(e) => setNotifyForm((prev) => ({ ...prev, role: e.target.value }))}>
                <option value="all">all</option>
                <option value="buyer">buyer</option>
                <option value="seller">seller</option>
                <option value="driver">driver</option>
              </select>
            </label>
          </div>
          <div className="panel-actions">
            <button type="submit" className="primary-btn" disabled={sendingNotify}>
              <Send size={14} />
              {sendingNotify ? 'Envoi...' : 'Envoyer notification'}
            </button>
          </div>
        </form>
      </section>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
