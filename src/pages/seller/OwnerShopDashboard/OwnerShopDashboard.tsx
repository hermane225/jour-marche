import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Building2, ImagePlus, Package2, Plus, Settings, Store, Trash2, BarChart3, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { useShopProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { productService, uploadService } from '../../../services/api';
import { shopService } from '../../../services/api/shops.service';
import type { CreateProductPayload, UpdateProductPayload } from '../../../services/api/products.service';
import { Button, Card, Input } from '../../../components/ui';
import type { Product } from '../../../types';
import './OwnerShopDashboard.css';

type ToastType = 'success' | 'error';

interface ToastState {
  type: ToastType;
  message: string;
}

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  tags: string;
  images: string[];
}

interface OwnerDashboardNavigationState {
  newShopCreated?: boolean;
  shopId?: string;
  shopName?: string;
  postCreateMessage?: string;
}

const DASHBOARD_PATHS = {
  info: '/dashboard/shop',
  edit: '/dashboard/shop/edit',
  products: '/dashboard/shop/products',
  addProduct: '/dashboard/shop/add-product',
  images: '/dashboard/shop/images',
  settings: '/dashboard/shop/settings',
};

const DELIVERY_OPTIONS = {
  pickup: 'retrait en magasin',
  local: 'livraison locale',
};

const emptyProductForm = (): ProductFormState => ({
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: '',
  tags: '',
  images: [],
});

export function OwnerShopDashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { id: routeShopId } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const normalizedUserId = String(user?.id || '').trim();
  const isOwnedByUser = useCallback(
    (sellerId: string) => String(sellerId || '').trim() === normalizedUserId,
    [normalizedUserId]
  );

  const {
    data: shops,
    isLoading: isShopLoading,
    error: shopsError,
    refetch: refetchShops,
  } = useApi(async () => {
    if (!user?.id) return [];

    const ownBySellerParam = await shopService.getShopsBySeller(user.id);
    const filteredFromSellerParam = ownBySellerParam.filter((item) => isOwnedByUser(item.sellerId));
    if (filteredFromSellerParam.length) return filteredFromSellerParam;

    // Fallback: certaines APIs ignorent sellerId selon le role,
    // on recupere alors la liste et on filtre par proprietaire.
    const { shops: allShops } = await shopService.getShops({ limit: 200 });
    return allShops.filter((item) => isOwnedByUser(item.sellerId));
  }, [isOwnedByUser, user?.id]);
  const { data: categories } = useCategories();
  const uniqueShops = useMemo(() => {
    const seen = new Set<string>();
    return (shops || []).filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [shops]);
  const shop = useMemo(
    () => (routeShopId ? uniqueShops.find((item) => item.id === routeShopId) || null : uniqueShops[0] || null),
    [routeShopId, uniqueShops]
  );

  const {
    data: products,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useShopProducts(shop?.id || '', 100);

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isShopSaving, setIsShopSaving] = useState(false);
  const [isProductSaving, setIsProductSaving] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileShopStep, setMobileShopStep] = useState(1);
  const [mobileProductStep, setMobileProductStep] = useState(1);
  const [mobileShopStepErrors, setMobileShopStepErrors] = useState<string[]>([]);
  const [mobileProductStepErrors, setMobileProductStepErrors] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormErrors, setProductFormErrors] = useState<string[]>([]);

  const [shopForm, setShopForm] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    phone: '',
    address: '',
    deliveryPickup: true,
    deliveryLocal: true,
    deliveryFee: 0,
    minimumOrder: 0,
    facebook: '',
    instagram: '',
    whatsapp: '',
    tiktok: '',
    businessHours: '',
  });

  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);

  useEffect(() => {
    if (!shop) return;
    setShopForm({
      name: shop.name || '',
      description: shop.description || '',
      logo: shop.logo || '',
      banner: shop.banner || '',
      phone: shop.phone || '',
      address: shop.address || '',
      deliveryPickup: shop.deliveryOptions?.pickup ?? true,
      deliveryLocal: shop.deliveryOptions?.delivery ?? true,
      deliveryFee: shop.deliveryOptions?.deliveryFee ?? 0,
      minimumOrder: shop.deliveryOptions?.freeDeliveryMinimum ?? 0,
      facebook: shop.socialMedia?.facebook || '',
      instagram: shop.socialMedia?.instagram || '',
      whatsapp: shop.socialMedia?.whatsapp || '',
      tiktok: shop.socialMedia?.tiktok || '',
      businessHours: shop.businessHours || '',
    });
  }, [shop]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const updateViewport = () => setIsMobileViewport(media.matches);
    updateViewport();
    media.addEventListener('change', updateViewport);
    return () => media.removeEventListener('change', updateViewport);
  }, []);

  const activeSection = useMemo(() => {
    if (location.pathname.endsWith('/manage/add-product')) return 'add-product';
    if (location.pathname.endsWith('/manage')) return 'info';
    if (location.pathname === DASHBOARD_PATHS.edit) return 'edit';
    if (location.pathname === DASHBOARD_PATHS.products) return 'products';
    if (location.pathname === DASHBOARD_PATHS.addProduct) return 'add-product';
    if (location.pathname === DASHBOARD_PATHS.images) return 'images';
    if (location.pathname === DASHBOARD_PATHS.settings) return 'settings';
    return 'info';
  }, [location.pathname]);
  const locationState = location.state as OwnerDashboardNavigationState | null;

  useEffect(() => {
    if (!locationState?.newShopCreated) return;

    setToast({
      type: 'success',
      message: locationState.postCreateMessage || 'Boutique créée. Postez votre premier produit pour commencer à vendre.',
    });

    // Nettoyer le state de navigation pour eviter de rejouer la notification.
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, locationState, navigate]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === 'active' || p.status === 'published').length;
    const inventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    return { totalProducts, activeProducts, inventory };
  }, [products]);

  const notify = (type: ToastType, message: string) => setToast({ type, message });
  const shouldShowStep = (step: number, currentStep: number): boolean =>
    !isMobileViewport || step === currentStep;

  useEffect(() => {
    setMobileShopStep(1);
    setMobileProductStep(1);
    setMobileShopStepErrors([]);
    setMobileProductStepErrors([]);
  }, [activeSection]);

  const validateShopStep = (step: number): string[] => {
    const errors: string[] = [];
    if (step === 1 && shopForm.name.trim().length < 2) {
      errors.push('Le nom de boutique doit contenir au moins 2 caracteres.');
    }
    if (step === 2 && !shopForm.deliveryPickup && !shopForm.deliveryLocal) {
      errors.push('Selectionnez au moins une option de livraison.');
    }
    return errors;
  };

  const validateProductStep = (step: number): string[] => {
    const errors: string[] = [];
    if (step === 1) {
      if (productForm.name.trim().length < 2) errors.push('Nom minimum 2 caracteres.');
      if (!productForm.category) {
        errors.push('La categorie est obligatoire.');
      }
      if (!productForm.price || Number(productForm.price) < 0) errors.push('Le prix doit etre >= 0.');
      if (!productForm.quantity || !Number.isInteger(Number(productForm.quantity)) || Number(productForm.quantity) < 0) {
        errors.push('La quantite doit etre un entier >= 0.');
      }
      if (!shop?.id) {
        errors.push('Impossible de detecter votre boutique.');
      }
    }
    if (step === 2 && !productForm.images.length) {
      errors.push('Ajoutez au moins une image avant de continuer.');
    }
    return errors;
  };

  const handleUploadImage = async (file: File, target: 'shop-logo' | 'shop-banner' | 'product-images') => {
    try {
      const uploaded = await uploadService.uploadSingle(file);
      if (target === 'shop-logo') {
        setShopForm((prev) => ({ ...prev, logo: uploaded.url }));
      }
      if (target === 'shop-banner') {
        setShopForm((prev) => ({ ...prev, banner: uploaded.url }));
      }
      if (target === 'product-images') {
        setProductForm((prev) => ({ ...prev, images: [...prev.images, uploaded.url] }));
      }
      notify('success', 'Image upload OK');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleDropProductImage = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await handleUploadImage(file, 'product-images');
  };

  const validateProductForm = (): string[] => {
    const errors: string[] = [];

    if (productForm.name.trim().length < 2) errors.push('Nom minimum 2 caracteres.');
    if (!productForm.category) {
      errors.push('La categorie est obligatoire.');
    }
    if (!productForm.price || Number(productForm.price) < 0) errors.push('Le prix doit etre >= 0.');
    if (!productForm.quantity || !Number.isInteger(Number(productForm.quantity)) || Number(productForm.quantity) < 0) {
      errors.push('La quantite doit etre un entier >= 0.');
    }
    if (!shop?.id) {
      errors.push('Impossible de detecter votre boutique.');
    }
    if (!productForm.images.length) errors.push('Au moins une image est requise.');

    return errors;
  };

  const handleSaveShop = async (e: FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    try {
      setIsShopSaving(true);
      await shopService.updateShop(shop.id, {
        name: shopForm.name.trim(),
        description: shopForm.description.trim(),
        logo: shopForm.logo || undefined,
        banner: shopForm.banner || undefined,
        phone: shopForm.phone.trim() || undefined,
        address: shopForm.address.trim() ? { street: shopForm.address.trim(), country: 'CI' } : undefined,
        deliveryOptions: [
          ...(shopForm.deliveryPickup ? [DELIVERY_OPTIONS.pickup] : []),
          ...(shopForm.deliveryLocal ? [DELIVERY_OPTIONS.local] : []),
        ],
        deliveryFee: Number(shopForm.deliveryFee || 0),
        minimumOrder: Number(shopForm.minimumOrder || 0),
        socialMedia: {
          facebook: shopForm.facebook || undefined,
          instagram: shopForm.instagram || undefined,
          whatsapp: shopForm.whatsapp || undefined,
          tiktok: shopForm.tiktok || undefined,
        },
        businessHours: shopForm.businessHours || undefined,
      });
      await refetchShops();
      notify('success', 'Boutique mise a jour');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Update shop failed');
    } finally {
      setIsShopSaving(false);
    }
  };

  const resetProductForm = () => {
    setProductForm(emptyProductForm());
    setProductFormErrors([]);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    const errors = validateProductForm();
    setProductFormErrors(errors);
    if (errors.length) {
      notify('error', errors[0]);
      return;
    }

    const basePayload = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      quantity: Number(productForm.quantity),
      images: productForm.images,
      tags: productForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      setIsProductSaving(true);
      if (editingProduct) {
        const updatePayload: UpdateProductPayload = {
          ...basePayload,
        };
        await productService.updateProduct(editingProduct.id, updatePayload);
        notify('success', 'Produit mis a jour');
      } else {
        const createPayload: CreateProductPayload = {
          ...basePayload,
          shop: shop.id,
        };
        const createdProduct = await productService.createProduct(createPayload);
        if (createdProduct.status !== 'active' && createdProduct.status !== 'published') {
          await productService.updateProductStatus(createdProduct.id, 'active');
        }
        notify('success', 'Produit ajoute');
      }

      await Promise.all([refetchProducts(), refetchShops()]);
      resetProductForm();
      navigate(DASHBOARD_PATHS.products);
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Save product failed');
    } finally {
      setIsProductSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await productService.deleteProduct(productId);
      await Promise.all([refetchProducts(), refetchShops()]);
      notify('success', 'Produit supprime');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    const current = product.status;
    const nextStatus: 'active' | 'inactive' = current === 'active' || current === 'published' ? 'inactive' : 'active';
    try {
      await productService.updateProductStatus(product.id, nextStatus);
      await refetchProducts();
      notify('success', `Statut: ${nextStatus}`);
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Status update failed');
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.title,
      description: product.description,
      price: String(product.price),
      quantity: String(product.stock),
      category: product.category || '',
      tags: '',
      images: product.images || [],
    });
    setProductFormErrors([]);
    setMobileProductStep(1);
    navigate(DASHBOARD_PATHS.addProduct);
  };

  if (isAuthLoading || isShopLoading) {
    return <div className="owner-shop-loading">Chargement dashboard boutique...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!shop) {
    return (
      <div className="owner-shop-empty">
        <h2>{shopsError ? 'Impossible de charger votre boutique.' : 'Vous n avez pas encore de boutique.'}</h2>
        {shopsError && <p className="owner-muted">Details: {shopsError.message}</p>}
        <Link to="/seller/create-shop">
          <Button variant="primary">Creer ma boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="owner-shop-layout">
      <aside className="owner-shop-sidebar">
        <div className="owner-shop-brand">
          <h2>Owner Dashboard</h2>
          <p>{shop.name}</p>
        </div>
        <nav className="owner-shop-nav">
          <Link to={DASHBOARD_PATHS.info} className={activeSection === 'info' ? 'active' : ''}><Store size={18} /> Ma boutique</Link>
          <Link to={DASHBOARD_PATHS.products} className={activeSection === 'products' ? 'active' : ''}><Package2 size={18} /> Produits</Link>
          <Link to={DASHBOARD_PATHS.addProduct} className={activeSection === 'add-product' ? 'active' : ''}><Plus size={18} /> Ajouter produit</Link>
          <Link to={DASHBOARD_PATHS.images} className={activeSection === 'images' ? 'active' : ''}><ImagePlus size={18} /> Images</Link>
          <Link to={DASHBOARD_PATHS.settings} className={activeSection === 'settings' ? 'active' : ''}><Settings size={18} /> Parametres</Link>
        </nav>
      </aside>

      <main className="owner-shop-main">
        {activeSection === 'info' && (
          <section className="owner-shop-section owner-hero reveal">
            <h1>Dashboard Boutique</h1>
            <p className="owner-muted">Pilotez boutique, produits et contenus depuis un seul ecran.</p>
            <div className="owner-shop-stats">
              <Card className="stat-card"><p>Total produits</p><strong>{stats.totalProducts}</strong></Card>
              <Card className="stat-card"><p>Produits actifs</p><strong>{stats.activeProducts}</strong></Card>
              <Card className="stat-card"><p>Stock global</p><strong>{stats.inventory}</strong></Card>
            </div>
            <Card className="owner-shop-summary">
              <h3><BarChart3 size={18} /> Resume boutique</h3>
              <p><strong>Nom:</strong> {shop.name}</p>
              <p><strong>Description:</strong> {shop.description || '-'}</p>
              <p><strong>Telephone:</strong> {shop.phone || '-'}</p>
              <p><strong>Adresse:</strong> {shop.address || '-'}</p>
              <div className="owner-shop-quick-actions">
                <Link to={DASHBOARD_PATHS.edit}><Button variant="primary">Modifier boutique</Button></Link>
                <Link to={DASHBOARD_PATHS.addProduct}><Button variant="secondary">Ajouter produit</Button></Link>
              </div>
            </Card>
          </section>
        )}

        {(activeSection === 'edit' || activeSection === 'images' || activeSection === 'settings') && (
          <section className="owner-shop-section reveal">
            <h1>{activeSection === 'edit' ? 'Modifier boutique' : activeSection === 'images' ? 'Gestion images' : 'Parametres boutique'}</h1>
            <form onSubmit={handleSaveShop} className="owner-shop-form polished-form">
              {isMobileViewport && (
                <div>
                  <p className="mobile-step-indicator">Etape {mobileShopStep}/3</p>
                  <div className="mobile-stepper">
                  <button type="button" className={`mobile-stepper-btn ${mobileShopStep === 1 ? 'active' : ''}`} onClick={() => setMobileShopStep(1)}>1. Infos</button>
                  <button type="button" className={`mobile-stepper-btn ${mobileShopStep === 2 ? 'active' : ''}`} onClick={() => setMobileShopStep(2)}>2. Livraison</button>
                  <button type="button" className={`mobile-stepper-btn ${mobileShopStep === 3 ? 'active' : ''}`} onClick={() => setMobileShopStep(3)}>3. Reseaux</button>
                </div>
                </div>
              )}

              {shouldShowStep(1, mobileShopStep) && (
                <div className="mobile-step">
                  <div className="owner-shop-grid">
                    <Input label="Nom" value={shopForm.name} onChange={(e) => setShopForm((prev) => ({ ...prev, name: e.target.value }))} required />
                    <Input label="Telephone" value={shopForm.phone} onChange={(e) => setShopForm((prev) => ({ ...prev, phone: e.target.value }))} />
                  </div>
                  <label className="owner-shop-field">
                    <span>Description</span>
                    <textarea rows={4} value={shopForm.description} onChange={(e) => setShopForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </label>
                  <Input label="Adresse" value={shopForm.address} onChange={(e) => setShopForm((prev) => ({ ...prev, address: e.target.value }))} />
                </div>
              )}

              {shouldShowStep(2, mobileShopStep) && (
                <div className="mobile-step">
                  <div className="owner-shop-grid">
                    <label className="owner-shop-upload">
                      <span>Logo</span>
                      <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) await handleUploadImage(file, 'shop-logo'); }} />
                      {shopForm.logo && <img src={shopForm.logo} alt="Logo preview" />}
                    </label>
                    <label className="owner-shop-upload">
                      <span>Banner</span>
                      <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) await handleUploadImage(file, 'shop-banner'); }} />
                      {shopForm.banner && <img src={shopForm.banner} alt="Banner preview" className="banner" />}
                    </label>
                  </div>

                  <div className="owner-shop-checks">
                    <label><input type="checkbox" checked={shopForm.deliveryPickup} onChange={(e) => setShopForm((prev) => ({ ...prev, deliveryPickup: e.target.checked }))} /> Retrait boutique</label>
                    <label><input type="checkbox" checked={shopForm.deliveryLocal} onChange={(e) => setShopForm((prev) => ({ ...prev, deliveryLocal: e.target.checked }))} /> Livraison locale</label>
                  </div>

                  <div className="owner-shop-grid">
                    <Input label="Frais livraison" type="number" value={String(shopForm.deliveryFee)} onChange={(e) => setShopForm((prev) => ({ ...prev, deliveryFee: Number(e.target.value || 0) }))} />
                    <Input label="Minimum commande" type="number" value={String(shopForm.minimumOrder)} onChange={(e) => setShopForm((prev) => ({ ...prev, minimumOrder: Number(e.target.value || 0) }))} />
                  </div>
                </div>
              )}

              {shouldShowStep(3, mobileShopStep) && (
                <div className="mobile-step">
                  <h3>Reseaux sociaux</h3>
                  <div className="owner-shop-grid">
                    <Input label="Facebook" value={shopForm.facebook} onChange={(e) => setShopForm((prev) => ({ ...prev, facebook: e.target.value }))} />
                    <Input label="Instagram" value={shopForm.instagram} onChange={(e) => setShopForm((prev) => ({ ...prev, instagram: e.target.value }))} />
                    <Input label="Whatsapp" value={shopForm.whatsapp} onChange={(e) => setShopForm((prev) => ({ ...prev, whatsapp: e.target.value }))} />
                    <Input label="TikTok" value={shopForm.tiktok} onChange={(e) => setShopForm((prev) => ({ ...prev, tiktok: e.target.value }))} />
                  </div>

                  <Input label="Horaires" value={shopForm.businessHours} onChange={(e) => setShopForm((prev) => ({ ...prev, businessHours: e.target.value }))} placeholder="Lun-Sam: 08h00 - 20h00" />
                </div>
              )}

              <div className="owner-shop-actions">
                {isMobileViewport && mobileShopStep > 1 && (
                  <Button type="button" variant="outline" onClick={() => {
                    setMobileShopStepErrors([]);
                    setMobileShopStep((prev) => Math.max(1, prev - 1));
                  }}>Precedent</Button>
                )}
                {isMobileViewport && mobileShopStep < 3 ? (
                  <Button type="button" variant="secondary" onClick={() => {
                    const errors = validateShopStep(mobileShopStep);
                    setMobileShopStepErrors(errors);
                    if (errors.length) return;
                    setMobileShopStep((prev) => Math.min(3, prev + 1));
                  }}>Suivant</Button>
                ) : (
                  <Button type="submit" variant="primary" isLoading={isShopSaving}>Enregistrer</Button>
                )}
              </div>
              {isMobileViewport && mobileShopStepErrors.length > 0 && (
                <Card className="form-errors">
                  <h4><AlertCircle size={16} /> Corriger ces champs</h4>
                  {mobileShopStepErrors.map((err) => <p key={err}>- {err}</p>)}
                </Card>
              )}
            </form>
          </section>
        )}

        {activeSection === 'products' && (
          <section className="owner-shop-section reveal">
            <h1>Gestion produits</h1>
            <p className="owner-muted">Toutes les actions backend: voir, modifier, supprimer, activer/desactiver.</p>
            {isProductsLoading ? (
              <p>Chargement produits...</p>
            ) : (
              <div className="owner-shop-products">
                {products.map((product) => (
                  <Card key={product.id} className="owner-shop-product-item">
                    <div className="owner-shop-product-head">
                      <div>
                        <h4>{product.title}</h4>
                        <p>{product.price.toLocaleString('fr-FR')} FCFA - Qte: {product.stock}</p>
                      </div>
                      <span className={`status-pill status-${product.status}`}>{product.status}</span>
                    </div>
                    <div className="owner-shop-product-actions">
                      <Button variant="outline" onClick={() => startEditProduct(product)}>Modifier</Button>
                      <Button variant="secondary" onClick={() => handleToggleProductStatus(product)}>
                        {product.status === 'active' || product.status === 'published' ? 'Desactiver' : 'Activer'}
                      </Button>
                      <Button variant="danger" leftIcon={<Trash2 size={16} />} onClick={() => handleDeleteProduct(product.id)}>Supprimer</Button>
                    </div>
                  </Card>
                ))}
                {!products.length && <Card><p>Aucun produit.</p></Card>}
              </div>
            )}
          </section>
        )}

        {activeSection === 'add-product' && (
          <section className="owner-shop-section add-product-shell reveal">
            <h1>{editingProduct ? 'Modifier produit' : 'Ajouter produit'}</h1>
            <p className="owner-muted">Formulaire connecte a l API reelle produits (name, category, price, quantity, shop, images).</p>

            <form onSubmit={handleSaveProduct} className="owner-shop-form polished-form">
              {isMobileViewport && (
                <div>
                  <p className="mobile-step-indicator">Etape {mobileProductStep}/3</p>
                  <div className="mobile-stepper">
                  <button type="button" className={`mobile-stepper-btn ${mobileProductStep === 1 ? 'active' : ''}`} onClick={() => setMobileProductStep(1)}>1. Details</button>
                  <button type="button" className={`mobile-stepper-btn ${mobileProductStep === 2 ? 'active' : ''}`} onClick={() => setMobileProductStep(2)}>2. Images</button>
                  <button type="button" className={`mobile-stepper-btn ${mobileProductStep === 3 ? 'active' : ''}`} onClick={() => setMobileProductStep(3)}>3. Validation</button>
                </div>
                </div>
              )}

              {shouldShowStep(1, mobileProductStep) && (
                <div className="mobile-step">
                  <div className="owner-shop-grid">
                    <Input label="Nom produit" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} required />
                    <div className="input-wrapper">
                      <label className="input-label">Categorie</label>
                      <select
                        className="owner-select"
                        value={productForm.category}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                        required
                      >
                        <option value="">Selectionner une categorie</option>
                        {(categories || []).map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {(!categories || categories.length === 0) && (
                        <small style={{ color: '#b45309', marginTop: 6, display: 'block' }}>
                          Aucune categorie chargee. Verifiez la connexion API puis reessayez.
                        </small>
                      )}
                    </div>
                  </div>

                  <label className="owner-shop-field">
                    <span>Description</span>
                    <textarea rows={4} value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </label>

                  <div className="owner-shop-grid">
                    <Input label="Prix" type="number" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} required />
                    <Input label="Quantite" type="number" value={productForm.quantity} onChange={(e) => setProductForm((prev) => ({ ...prev, quantity: e.target.value }))} required />
                  </div>

                  <Input label="Tags (optionnel)" value={productForm.tags} onChange={(e) => setProductForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="bio, promo, local" />
                </div>
              )}

              {shouldShowStep(2, mobileProductStep) && (
                <div className="mobile-step">
                  <div
                    className={`drop-zone ${isDraggingImage ? 'dragging' : ''}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={handleDropProductImage}
                  >
                    <ImagePlus size={20} />
                    <p>Glissez une image ici ou cliquez pour uploader</p>
                    <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) await handleUploadImage(file, 'product-images'); }} />
                  </div>

                  {productForm.images.length > 0 && (
                    <div className="product-image-grid">
                      {productForm.images.map((image) => (
                        <div key={image} className="product-image-item">
                          <img src={image} alt="Product" />
                          <button
                            type="button"
                            onClick={() => setProductForm((prev) => ({ ...prev, images: prev.images.filter((u) => u !== image) }))}
                            aria-label="Remove image"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {shouldShowStep(3, mobileProductStep) && (
                <div className="mobile-step">
                  {productFormErrors.length > 0 && (
                    <Card className="form-errors">
                      <h4><AlertCircle size={16} /> Corriger ces champs</h4>
                      {productFormErrors.map((err) => <p key={err}>- {err}</p>)}
                    </Card>
                  )}
                </div>
              )}

              <div className="owner-shop-actions">
                {isMobileViewport && mobileProductStep > 1 && (
                  <Button type="button" variant="outline" onClick={() => {
                    setMobileProductStepErrors([]);
                    setMobileProductStep((prev) => Math.max(1, prev - 1));
                  }}>Precedent</Button>
                )}
                {editingProduct && !isMobileViewport && <Button type="button" variant="outline" onClick={resetProductForm}>Annuler edition</Button>}
                {isMobileViewport && mobileProductStep < 3 ? (
                  <Button type="button" variant="secondary" onClick={() => {
                    const errors = validateProductStep(mobileProductStep);
                    setMobileProductStepErrors(errors);
                    if (errors.length) return;
                    setMobileProductStep((prev) => Math.min(3, prev + 1));
                  }}>Suivant</Button>
                ) : (
                  <Button type="submit" variant="primary" isLoading={isProductSaving}>{editingProduct ? 'Mettre a jour' : 'Ajouter le produit'}</Button>
                )}
              </div>
              {isMobileViewport && mobileProductStepErrors.length > 0 && (
                <Card className="form-errors">
                  <h4><AlertCircle size={16} /> Corriger ces champs</h4>
                  {mobileProductStepErrors.map((err) => <p key={err}>- {err}</p>)}
                </Card>
              )}
            </form>
          </section>
        )}
      </main>

      {toast && (
        <div className={`owner-shop-toast ${toast.type}`}>
          <Building2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
