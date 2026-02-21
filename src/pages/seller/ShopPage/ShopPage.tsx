import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui';
import { SellerLayout } from '../Layout/SellerLayout';
import { useAuth } from '../../../context/AuthContext';
import { useShops as useShopContext } from '../../../context/ShopContext';
import { useSellerShops } from '../../../hooks/useShops';
import { useShopProducts } from '../../../hooks/useProducts';
import { uploadService } from '../../../services/api';
import type { UpdateShopPayload } from '../../../services/api/shops.service';
import './ShopPage.css';

interface EditShopForm {
  name: string;
  description: string;
  phone: string;
  address: string;
  logo: string;
  banner: string;
}

const PHONE_REGEX = /^\+?[0-9]{8,15}$/;

const normalizePhone = (value: string): string =>
  value.replace(/[\s\-().]/g, '');

export function ShopPage() {
  const { user } = useAuth();
  const { updateShop, deleteShop } = useShopContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditShopForm>({
    name: '',
    description: '',
    phone: '',
    address: '',
    logo: '',
    banner: '',
  });
  
  const { data: sellerShops, refetch } = useSellerShops(user?.id || '');
  const shop = sellerShops && sellerShops.length > 0 ? sellerShops[0] : null;
  const { data: shopProducts } = useShopProducts(shop?.id || '', 100);
  const isOwner = !!user?.id && !!shop?.sellerId && user.id === shop.sellerId;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' CFA';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'inactive':
        return <Badge variant="neutral">Inactive</Badge>;
      case 'discontinued':
        return <Badge variant="warning">Discontinued</Badge>;
      case 'low_stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'draft':
        return <Badge variant="neutral">Draft</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const filteredProducts = useMemo(() => {
    if (!shopProducts) return [];
    return shopProducts.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shopProducts, searchQuery]);

  const openEditModal = () => {
    if (!shop || !isOwner) return;
    setActionError(null);
    setEditForm({
      name: shop.name || '',
      description: shop.description || '',
      phone: shop.phone || '',
      address: shop.address || '',
      logo: shop.logo || '',
      banner: shop.banner || '',
    });
    setIsEditOpen(true);
  };

  const updateEditField = (key: keyof EditShopForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file: File, field: 'logo' | 'banner') => {
    try {
      const uploaded = await uploadService.uploadSingle(file);
      updateEditField(field, uploaded.url);
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Echec de l'upload de l'image.");
    }
  };

  const handleSaveShop = async () => {
    if (!shop || !isOwner) {
      setActionError('Seul le proprietaire peut modifier cette boutique.');
      return;
    }

    const name = editForm.name.trim();
    if (name.length < 2) {
      setActionError('Le nom de la boutique est obligatoire (2 caracteres min).');
      return;
    }

    const phoneNormalized = normalizePhone(editForm.phone.trim());
    if (phoneNormalized && !PHONE_REGEX.test(phoneNormalized)) {
      setActionError('Numero de telephone invalide. Utilisez 8 a 15 chiffres (option + autorisee).');
      return;
    }

    const payload: UpdateShopPayload = {
      name,
      description: editForm.description.trim(),
      phone: phoneNormalized || undefined,
      logo: editForm.logo || undefined,
      banner: editForm.banner || undefined,
      address: editForm.address.trim()
        ? { street: editForm.address.trim(), country: 'CI' }
        : undefined,
    };

    try {
      setIsSaving(true);
      setActionError(null);
      await updateShop(shop.id, payload);
      await refetch();
      setIsEditOpen(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Echec de la mise a jour de la boutique.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteShop = async () => {
    if (!shop || !isOwner) {
      setActionError('Seul le proprietaire peut supprimer cette boutique.');
      return;
    }

    const confirmed = window.confirm('Confirmer la suppression de cette boutique ?');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setActionError(null);
      await deleteShop(shop.id);
      await refetch();
      navigate('/seller/create-shop');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Echec de la suppression de la boutique.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!shop) {
    return (
      <SellerLayout>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>Vous n'avez pas encore de boutique. <Link to="/seller/create-shop">Creer une boutique</Link></p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="shop-page">
        {shop.banner && (
          <Card className="shop-header-card">
            <div style={{ margin: '-24px -24px 16px -24px', overflow: 'hidden' }}>
              <img src={shop.banner} alt={`${shop.name} banner`} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            </div>
          </Card>
        )}

        <Card className="shop-header-card">
          <div className="shop-header">
            <div className="shop-header-logo">
              <img src={shop.logo || '/jour_marché.png'} alt={shop.name} />
            </div>
            <div className="shop-header-info">
              <h1>{shop.name}</h1>
              <p>{shop.description}</p>
              <p className="shop-header-location">{shop.address}</p>
              {!isOwner && (
                <p style={{ color: '#dc2626', fontWeight: 600, marginTop: 6 }}>
                  Cette boutique ne vous appartient pas. Modification interdite.
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="outline" onClick={openEditModal} disabled={!isOwner}>
                Modifier
              </Button>
              <Button variant="danger" onClick={handleDeleteShop} disabled={!isOwner || isDeleting} isLoading={isDeleting}>
                Supprimer
              </Button>
            </div>
          </div>
          {actionError && <p style={{ marginTop: 12, color: '#dc2626' }}>{actionError}</p>}
        </Card>

        <div className="shop-stats-grid">
          <Card className="shop-stat-card">
            <p className="shop-stat-label">Total Products</p>
            <p className="shop-stat-value">{shop.totalProducts}</p>
          </Card>
          <Card className="shop-stat-card">
            <p className="shop-stat-label">Monthly Sales</p>
            <p className="shop-stat-value">{formatPrice(shop.monthlySales)}</p>
          </Card>
          <Card className="shop-stat-card">
            <p className="shop-stat-label">Average Rating</p>
            <p className="shop-stat-value">{shop.rating}/5</p>
          </Card>
        </div>

        <Card className="shop-products-card">
          <div className="shop-products-header">
            <h2>My Products</h2>
            <div className="shop-products-actions">
              <div className="shop-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search my products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="shop-filter-select">
                <option>All Categories</option>
                <option>Mode</option>
                <option>Electronique</option>
              </select>
              <select className="shop-filter-select">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Low Stock</option>
              </select>
              <Link to="/seller/products/create">
                <Button variant="primary" leftIcon={<Plus size={18} />}>
                  Ajouter un nouveau produit
                </Button>
              </Link>
            </div>
          </div>

          <div className="shop-products-table-container">
            <table className="shop-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="shop-product-cell">
                        <img src={product.images[0]} alt={product.title} />
                        <span>{product.title}</span>
                      </div>
                    </td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>
                      <div className="shop-product-actions">
                        <button className="shop-action-btn edit">
                          <Pencil size={16} />
                        </button>
                        <button className="shop-action-btn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="shop-pagination">
            <span>Showing 1 to {filteredProducts.length} of {shop.totalProducts} results</span>
            <div className="shop-pagination-btns">
              <button disabled>Previous</button>
              <button>Next</button>
            </div>
          </div>
        </Card>
      </div>

      {isEditOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div style={{ background: '#fff', borderRadius: 12, width: 'min(680px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Modifier la boutique</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <label>
                Nom
                <input value={editForm.name} onChange={(e) => updateEditField('name', e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
              </label>
              <label>
                Description
                <textarea value={editForm.description} onChange={(e) => updateEditField('description', e.target.value)} rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
              </label>
              <label>
                Telephone
                <input
                  value={editForm.phone}
                  onChange={(e) => updateEditField('phone', e.target.value.replace(/[^0-9+\s\-().]/g, ''))}
                  placeholder="+225 0700000000"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
                />
              </label>
              <label>
                Adresse
                <input value={editForm.address} onChange={(e) => updateEditField('address', e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
              </label>

              <label>
                Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await uploadImage(file, 'logo');
                  }}
                  style={{ display: 'block', marginTop: 6 }}
                />
                {editForm.logo && <img src={editForm.logo} alt="Logo preview" style={{ marginTop: 8, width: 72, height: 72, borderRadius: 8, objectFit: 'cover' }} />}
              </label>

              <label>
                Banner
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await uploadImage(file, 'banner');
                  }}
                  style={{ display: 'block', marginTop: 6 }}
                />
                {editForm.banner && <img src={editForm.banner} alt="Banner preview" style={{ marginTop: 8, width: '100%', height: 120, borderRadius: 8, objectFit: 'cover' }} />}
              </label>
            </div>

            <div style={{ marginTop: 14 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 15, color: '#374151' }}>Apercu live</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, background: '#f9fafb' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#6b7280' }}>Avant</p>
                  <div style={{ height: 74, borderRadius: 8, overflow: 'hidden', background: '#e5e7eb', marginBottom: 8 }}>
                    {shop.banner ? (
                      <img src={shop.banner} alt="Banner avant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <img src={shop.logo || '/jour_marché.png'} alt="Logo avant" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', background: '#fff' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700 }}>{shop.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{shop.phone || '-'}</p>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: 13 }}>{shop.description || '-'}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#6b7280' }}>{shop.address || '-'}</p>
                </div>

                <div style={{ border: '1px solid #bbf7d0', borderRadius: 10, padding: 10, background: '#f0fdf4' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#065f46' }}>Apres</p>
                  <div style={{ height: 74, borderRadius: 8, overflow: 'hidden', background: '#dcfce7', marginBottom: 8 }}>
                    {editForm.banner ? (
                      <img src={editForm.banner} alt="Banner apres" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <img src={editForm.logo || '/jour_marché.png'} alt="Logo apres" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', background: '#fff' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700 }}>{editForm.name.trim() || '-'}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#065f46' }}>{editForm.phone.trim() || '-'}</p>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: 13 }}>{editForm.description.trim() || '-'}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#065f46' }}>{editForm.address.trim() || '-'}</p>
                </div>
              </div>
            </div>

            {actionError && <p style={{ color: '#dc2626', marginTop: 10 }}>{actionError}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
              <Button variant="primary" onClick={handleSaveShop} isLoading={isSaving}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
