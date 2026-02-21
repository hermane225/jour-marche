import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShops } from '../../../context/ShopContext';
import { useCategories } from '../../../hooks/useCategories';
import { uploadService, ApiException } from '../../../services/api';
import {
  Store,
  Camera,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
} from 'lucide-react';

const PHONE_REGEX = /^\+?[0-9]{8,15}$/;
const normalizePhone = (value: string): string => value.replace(/[\s\-().]/g, '');

// Quartiers / communes par ville
const QUARTIERS_PAR_VILLE: Record<string, string[]> = {
  'Abidjan': [
    'Abobo', 'Adjamé', 'Angré', 'Attecoubé', 'Bingerville', 'Cocody',
    'Koumassi', 'Marcory', 'Plateau', 'Port-Bouët', 'Riviera',
    'Treichville', 'Vridi', 'Yopougon', '2 Plateaux',
  ],
  'Yamoussoukro': [
    'Centre-ville', 'Dioulakro', 'Habitat', "N'Zuia", 'Fétékro',
  ],
  'Bouaké': [
    'Air France', 'Broukro', 'Commerce', 'Dar-Es-Salam', 'Koko',
    "N'Gattakro", 'Nimbo', 'Sokoura', 'Tolakro', 'Zone industrielle',
  ],
  'Daloa': [
    'Centre-ville', 'Gendarmerie', 'Kennedy', 'Lobia', 'Orly', 'Satellite',
  ],
  'Korhogo': [
    'Centre-ville', 'Koko', 'Nawavogo', 'Petit-Paris', 'Zone industrielle',
  ],
  'San-Pédro': [
    'Bardo', 'Centre-ville', 'Cité', 'Zone portuaire',
  ],
  'Gagnoa': [
    'Centre-ville', 'Dioulabougou', 'Gnagbodougnoa', 'Zépréguhé',
  ],
  'Divo': [
    'Centre-ville', 'Gbodougou', 'Guitry', 'Zone résidentielle',
  ],
  'Soubré': [
    'Centre-ville', 'Gare', 'Grand-Zattry', 'Méagui',
  ],
  'Abengourou': [
    'Centre-ville', 'Danguira', 'Filankro', 'Zone résidentielle',
  ],
  'Agboville': [
    'Centre-ville', 'Mbatto', "N'Dotré", 'Zone résidentielle',
  ],
  'Bondoukou': [
    'Centre-ville', 'Commerce', 'Tabagne',
  ],
  'Ferkéssédougou': [
    'Centre-ville', 'Dioulabougou', 'Ferké 1', 'Ferké 2',
  ],
};

const VILLES_CI = Object.keys(QUARTIERS_PAR_VILLE).concat([
  'Adzopé', 'Daoukro', 'Dimbokro', 'Bouna', 'Odienné',
  'Mankono', 'Duékoué', 'Danané', 'Guiglo', 'Sassandra', 'Issia',
]);


export function CreateShop() {
  const navigate = useNavigate();
  const { addShop } = useShops();
  const { data: categories, isLoading: catsLoading } = useCategories();

  // ✅ Ref pour suivre le statut de montage du composant
  const isMountedRef = useRef(true);
  const isNavigatingRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // logo = URL obtenue après upload sur l'API
  const [logo, setLogo] = useState<string | null>(null);
  // logoPreview = base64 pour affichage immédiat pendant l'upload
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Étape 1
    name: '',
    description: '',
    category: '',       // MongoId depuis l'API
    // Étape 2
    phone: '',
    city: '',
    commune: '',        // utilisé comme address.street
    addressDetail: '',
    // Étape 3
    pickup: true,       // 'retrait en magasin'
    deliveryLocal: false, // 'livraison locale'
    deliveryNational: false, // 'livraison nationale'
    deliveryFee: '',
    minimumOrder: '',
  });

  // ✅ Protection contre les mises à jour après démontage
  useEffect(() => {
    window.scrollTo(0, 0);
    
    return () => {
      // ✅ Marquer le composant comme démonté au nettoyage
      isMountedRef.current = false;
    };
  }, []);

  // ✅ Fonction sécurisée pour naviguer avec vérification de montage
  const safeNavigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (!isMountedRef.current || isNavigatingRef.current) {
      console.log('⚠️ Navigation ignorée: composant démonté ou navigation en cours');
      return;
    }
    
    isNavigatingRef.current = true;
    
    // ✅ Utiliser replace pour éviter l'historique problématique
    navigate(to, { replace: options?.replace ?? true });
  }, [navigate]);

  const TOTAL_STEPS = 3;
  const steps = [
    { number: 1, title: 'Boutique', icon: Store },
    { number: 2, title: 'Contact', icon: Phone },
    { number: 3, title: 'Livraison', icon: Package },
  ];

  const isStepValid = () => {
    if (currentStep === 1) return formData.name.trim().length >= 2 && formData.category !== '';
    if (currentStep === 2) return formData.phone.trim() !== '' && formData.city !== '';
    if (currentStep === 3) return formData.pickup || formData.deliveryLocal || formData.deliveryNational;
    return false;
  };

  const scrollTop = () => {
    // ✅ Scroll simple et immédiat pour éviter les problèmes pendant démontage
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // Ignorer si le composant est démonté
      console.debug('scrollTop ignoré:', e);
    }
  };
  const nextStep = () => { setCurrentStep(p => Math.min(p + 1, TOTAL_STEPS)); scrollTop(); };
  const prevStep = () => { setCurrentStep(p => Math.max(p - 1, 1)); scrollTop(); };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);

    // Prévisualisation base64 immédiate
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload réel vers l'API
    setLogoUploading(true);
    try {
      const uploaded = await uploadService.uploadSingle(file);
      setLogo(uploaded.url);
    } catch {
      setLogoPreview(null);
      setLogo(null);
      setLogoError('Impossible d\'uploader le logo. Réessayez.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerError(null);

    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);

    setBannerUploading(true);
    try {
      const uploaded = await uploadService.uploadSingle(file);
      setBanner(uploaded.url);
    } catch {
      setBannerPreview(null);
      setBanner(null);
      setBannerError('Impossible d uploader la banniere. Reessayez.');
    } finally {
      setBannerUploading(false);
    }
  };

  // Soumission finale uniquement (la navigation par étapes passe par les boutons onClick)
  const handleFinalSubmit = async () => {
    // ✅ Empêcher les soumissions multiples
    if (isLoading) {
      console.warn('⚠️ [CREATE SHOP] Soumission déjà en cours, ignorée');
      return;
    }

    // ✅ Validation : Vérifier que la catégorie existe
    const categoryValue = formData.category.trim();
    if (!categoryValue) {
      setSubmitError('Veuillez sélectionner une catégorie valide.');
      setCurrentStep(1); // Retour à l'étape 1
      return;
    }

    // Vérifier que la catégorie sélectionnée existe bien dans la liste
    const categoryExists = categories?.some(cat => cat.id === categoryValue);
    if (!categoryExists) {
      setSubmitError(`Catégorie invalide. Veuillez en sélectionner une dans la liste.`);
      setCurrentStep(1);
      return;
    }

    const phoneNormalized = normalizePhone(formData.phone.trim());
    if (!PHONE_REGEX.test(phoneNormalized)) {
      setSubmitError('Numero de telephone invalide. Utilisez 8 a 15 chiffres (option + autorisee).');
      setCurrentStep(2);
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    // Construire deliveryOptions comme tableau de strings selon le validateur API
    const deliveryOptions: string[] = [];
    if (formData.pickup)          deliveryOptions.push('retrait en magasin');
    if (formData.deliveryLocal)   deliveryOptions.push('livraison locale');
    if (formData.deliveryNational) deliveryOptions.push('livraison nationale');

    // Construire address comme objet (validateur : address.city, address.street, address.country)
    const address = {
      street: [formData.commune, formData.addressDetail].filter(Boolean).join(' - ') || undefined,
      city: formData.city || undefined,
      country: 'CI',
    };

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      category: categoryValue,
      logo: logo || undefined,
      banner: banner || undefined,
      phone: phoneNormalized || undefined,
      address,
      deliveryOptions: deliveryOptions.length ? deliveryOptions : undefined,
      deliveryFee: formData.deliveryFee ? Number(formData.deliveryFee) : undefined,
      minimumOrder: formData.minimumOrder ? Number(formData.minimumOrder) : undefined,
    };

    console.group('🏪 [CREATE SHOP] Soumission formulaire');
    console.log('Données formulaire:', formData);
    console.log('Catégorie validée:', categoryExists ? `✅ ${categoryValue}` : '❌ Invalide');
    console.log('Payload final:', payload);
    console.log('Token présent:', !!localStorage.getItem('jour_marche_token'));
    console.groupEnd();

    try {
      const newShop = await addShop(payload);

      console.log('✅ [CREATE SHOP] Boutique créée avec succès:', newShop);
      
      // ✅ Différer la navigation pour laisser React terminer ses mises à jour
      // Cela évite l'erreur "removeChild" causée par la mise à jour du state pendant le démontage
      // Utiliser safeNavigate pour vérifier que le composant est toujoursmounted
      setTimeout(() => {
        if (isMountedRef.current && !isNavigatingRef.current) {
          isNavigatingRef.current = true;
          navigate('/seller/products/create', {
            state: { shopId: newShop.id, shopName: newShop.name },
            replace: true,
          });
        }
      }, 100);
      
      // Retourner immédiatement pour éviter toute autre mise à jour
      return;
    } catch (err) {
      console.error('❌ [CREATE SHOP] Erreur finale:', err);
      
      // ✅ Affichage amélioré des erreurs avec err.details
      let errorMessage = 'Echec de la creation de la boutique';
      
      if (err instanceof ApiException) {
        errorMessage = err.message || errorMessage;

        // 🔍 Afficher précisément err.details
        if (err.details && Object.keys(err.details).length > 0) {
          console.group('📋 [CREATE SHOP] Détails de l\'erreur');
          console.table(err.details);
          console.groupEnd();
          
          const detailsText = Object.entries(err.details)
            .map(([field, messages]) => {
              const fieldLabel = field === 'category' ? 'Catégorie' :
                                 field === 'name' ? 'Nom' :
                                 field === 'phone' ? 'Téléphone' : field;
              return `${fieldLabel}: ${(messages || []).join(', ')}`;
            })
            .join(' | ');
          if (detailsText) {
            errorMessage += ` \n\n📋 Détails : ${detailsText}`;
          }
        }

        // Messages spécifiques selon le code HTTP
        if (err.status === 401) {
          errorMessage += '\n\n🔐 Vous devez être connecté.';
        } else if (err.status === 403) {
          errorMessage += '\n\n⛔ Permission refusée.';
        } else if (err.status === 404) {
          errorMessage += '\n\n🏷️ Catégorie introuvable. Rechargez la page et sélectionnez une catégorie active.';
        } else if (err.status === 409) {
          errorMessage += '\n\n🏪 Une boutique avec ce nom existe déjà.';
        } else if (err.status === 400 || err.status === 422 || err.code === 'VALIDATION_ERROR') {
          errorMessage += '\n\n⚠️ Vérifiez les données saisies (voir détails ci-dessus).';
        } else if (err.status >= 500) {
          errorMessage += '\n\n🔧 Erreur serveur. Consultez la console (F12).';
        }

        // Afficher le code d'erreur si disponible
        if (err.code) {
          errorMessage += `\n\n🏷️ Code: ${err.code}`;
        }
        if (err.requestId) {
          errorMessage += `\n\n🧾 Référence: ${err.requestId}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
        
        // Suggestions contextuelles
        if (err.message.includes('401') || err.message.includes('authentification')) {
          errorMessage += '\n\n🔐 Vous devez être connecté.';
        } else if (err.message.includes('category') || err.message.includes('categorie')) {
          errorMessage += '\n\n🏷️ Catégorie invalide ou manquante.';
        } else if (err.message.includes('500')) {
          errorMessage += '\n\n🔧 Erreur serveur. Consultez la console (F12).';
        }
      }

      setSubmitError(errorMessage);
      setIsLoading(false); // Seulement en cas d'erreur
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < TOTAL_STEPS) {
      e.preventDefault();
      if (isStepValid()) nextStep();
    }
  };

  //  Styles 
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', fontSize: '15px',
    border: '2px solid #e5e7eb', borderRadius: '12px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: 'white',
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: 'pointer',
    appearance: 'none' as React.CSSProperties['appearance'],
    background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 14px center`,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: '#374151',
  };
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#8b5cf6');
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#e5e7eb');

  //  �tape 1 
  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 700, color: '#1f2937' }}>
          Informations de la boutique
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Le nom et la description sont les premieres choses vues par vos clients.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Logo de la boutique</label>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', width: '110px', height: '110px',
          border: logoUploading ? '3px dashed #8b5cf6' : '3px dashed #d1d5db', borderRadius: '16px',
          cursor: logoUploading ? 'wait' : 'pointer', background: '#f9fafb', overflow: 'hidden', position: 'relative',
        }}>
          <input type="file" accept="image/*" onChange={handleLogoUpload} hidden disabled={logoUploading} />
          {(logoPreview || logo) ? (
            <span style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
              <img src={logoPreview || logo!} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {logoUploading && (
                <span style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.4)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', display: 'inline-block',
                  }} />
                </span>
              )}
            </span>
          ) : (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <Camera size={28} color={logoUploading ? '#8b5cf6' : '#9ca3af'} />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {logoUploading ? 'Upload...' : 'Ajouter'}
              </span>
            </span>
          )}
        </label>
        {logoError && (
          <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#ef4444' }}>{logoError}</p>
        )}
      </div>

      <div>
        <label style={labelStyle}>Banniere de la boutique (optionnel)</label>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '120px', border: bannerUploading ? '3px dashed #8b5cf6' : '3px dashed #d1d5db',
          borderRadius: '16px', cursor: bannerUploading ? 'wait' : 'pointer', background: '#f9fafb',
          overflow: 'hidden', position: 'relative',
        }}>
          <input type="file" accept="image/*" onChange={handleBannerUpload} hidden disabled={bannerUploading} />
          {(bannerPreview || banner) ? (
            <span style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
              <img src={bannerPreview || banner!} alt="Banniere" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            </span>
          ) : (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '16px' }}>
              <Camera size={28} color={bannerUploading ? '#8b5cf6' : '#9ca3af'} />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {bannerUploading ? 'Upload...' : 'Ajouter une banniere'}
              </span>
            </span>
          )}
        </label>
        {bannerError && (
          <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#ef4444' }}>{bannerError}</p>
        )}
      </div>

      <div>
        <label style={labelStyle}>
          Nom de la boutique <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Ex: Chez Mariam"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      <div>
        <label style={labelStyle}>Description (optionnel)</label>
        <textarea
          placeholder="Decrivez vos produits et ce qui rend votre boutique unique..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      {/* Catégorie - obligatoire, MongoId depuis l'API */}
      <div>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={15} color="#6b7280" />
          Catégorie <span style={{ color: '#ef4444' }}>*</span>
        </label>
        {catsLoading ? (
          <div style={{ padding: '14px 18px', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#9ca3af', fontSize: '14px' }}>
            Chargement des catégories...
          </div>
        ) : (
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            style={selectStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          >
            <option value="">Sélectionnez une catégorie</option>
            {(categories || []).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );

  //  �tape 2 
  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 700, color: '#1f2937' }}>
          Contact & Localisation
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Comment vous joindre et ou se trouve votre boutique.
        </p>
      </div>

      <div>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={15} color="#6b7280" />
          Telephone <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="tel"
          placeholder="07 XX XX XX XX"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\s\-().]/g, '') })}
          required
          inputMode="numeric"
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      <div>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={15} color="#6b7280" />
          Ville <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value, commune: '' })}
          required
          style={selectStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        >
          <option value="">Selectionnez une ville</option>
          {VILLES_CI.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {QUARTIERS_PAR_VILLE[formData.city]?.length > 0 && (
        <div>
          <label style={labelStyle}>
            {formData.city === 'Abidjan' ? 'Commune' : 'Quartier'}
          </label>
          <select
            value={formData.commune}
            onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
            style={selectStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          >
            <option value="">
              {formData.city === 'Abidjan' ? 'Selectionnez une commune' : 'Selectionnez un quartier'}
            </option>
            {(QUARTIERS_PAR_VILLE[formData.city] || []).map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label style={labelStyle}>Precision adresse (optionnel)</label>
        <input
          type="text"
          placeholder="Quartier, rue, repere..."
          value={formData.addressDetail}
          onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>
    </div>
  );

  //  �tape 3 
  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 700, color: '#1f2937' }}>
          Options de livraison
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Choisissez comment vos clients recuperent leurs commandes.
        </p>
      </div>

      {/* Retrait en boutique */}
      <button
        type="button"
        onClick={() => setFormData(p => ({ ...p, pickup: !p.pickup }))}
        style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
          border: formData.pickup ? '2px solid #10b981' : '2px solid #e5e7eb',
          borderRadius: '14px', background: formData.pickup ? '#f0fdf4' : 'white',
          cursor: 'pointer', width: '100%',
        }}
      >
        <span style={{ fontSize: '24px' }}>🏪</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>Retrait en boutique</p>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>Le client vient chercher sa commande chez vous</p>
        </div>
        {formData.pickup && <CheckCircle size={20} color="#10b981" />}
      </button>

      {/* Livraison locale */}
      <button
        type="button"
        onClick={() => setFormData(p => ({ ...p, deliveryLocal: !p.deliveryLocal }))}
        style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
          border: formData.deliveryLocal ? '2px solid #10b981' : '2px solid #e5e7eb',
          borderRadius: '14px', background: formData.deliveryLocal ? '#f0fdf4' : 'white',
          cursor: 'pointer', width: '100%',
        }}
      >
        <span style={{ fontSize: '24px' }}>🛵</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>Livraison locale</p>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>Livraison dans votre ville</p>
        </div>
        {formData.deliveryLocal && <CheckCircle size={20} color="#10b981" />}
      </button>

      {/* Livraison nationale */}
      <button
        type="button"
        onClick={() => setFormData(p => ({ ...p, deliveryNational: !p.deliveryNational }))}
        style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
          border: formData.deliveryNational ? '2px solid #10b981' : '2px solid #e5e7eb',
          borderRadius: '14px', background: formData.deliveryNational ? '#f0fdf4' : 'white',
          cursor: 'pointer', width: '100%',
        }}
      >
        <span style={{ fontSize: '24px' }}>🚚</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>Livraison nationale</p>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>Livraison partout en Cote d'Ivoire</p>
        </div>
        {formData.deliveryNational && <CheckCircle size={20} color="#10b981" />}
      </button>

      {/* Frais de livraison si livraison active */}
      {(formData.deliveryLocal || formData.deliveryNational) && (
        <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Frais de livraison (FCFA)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number" min={0} placeholder="Ex: 1000"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                style={{ ...inputStyle, paddingRight: '70px' }}
                onFocus={focusBorder} onBlur={blurBorder}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>FCFA</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Commande minimum pour livraison gratuite (optionnel)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number" min={0} placeholder="Ex: 10000"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                style={{ ...inputStyle, paddingRight: '70px' }}
                onFocus={focusBorder} onBlur={blurBorder}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>FCFA</span>
            </div>
          </div>
        </div>
      )}

      {/* Resume */}
      <div style={{ padding: '18px', background: '#f0fdf4', borderRadius: '14px', border: '1.5px solid #86efac' }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#059669', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={17} /> Pret a creer votre boutique !
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: 1.6 }}>
          <strong>"{formData.name || 'Ma Boutique'}"</strong>
          {[formData.commune, formData.city].filter(Boolean).length > 0 ? (
            <span> — {[formData.commune, formData.city].filter(Boolean).join(', ')}</span>
          ) : null}
          {formData.phone ? <span> · {formData.phone}</span> : null}
        </p>
      </div>
    </div>
  );

  //  Rendu 
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button" onClick={() => navigate(-1)}
            style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex' }}
          >
            <ArrowLeft size={20} color="#374151" />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Sparkles size={18} color="#8b5cf6" />
              Creer ma boutique
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Gratuit  En quelques minutes</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Progression */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Etape {currentStep} / {TOTAL_STEPS}</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(currentStep / TOTAL_STEPS) * 100}%`,
              background: 'linear-gradient(90deg, #8b5cf6, #10b981)',
              borderRadius: '3px', transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            {steps.map(step => {
              const Icon = step.icon;
              const done = currentStep > step.number;
              const active = currentStep === step.number;
              return (
                <div key={step.number} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: done ? '#059669' : active ? '#8b5cf6' : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done ? <CheckCircle size={18} color="white" /> : <Icon size={18} color={active ? 'white' : '#9ca3af'} />}
                  </div>
                  <span style={{ fontSize: '11px', color: active ? '#8b5cf6' : done ? '#059669' : '#9ca3af', fontWeight: active ? 600 : 400 }}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carte du formulaire */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div onKeyDown={handleKeyDown}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {submitError && (
              <div style={{
                marginTop: '16px', padding: '12px 16px',
                background: '#fef2f2', border: '1.5px solid #fca5a5',
                borderRadius: '10px', color: '#b91c1c', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                ⚠️ {submitError}
              </div>
            )}

            {/* Navigation */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: '28px', paddingTop: '20px',
              borderTop: '1px solid #f3f4f6', gap: '12px',
            }}>
              {currentStep > 1 ? (
                <button
                  type="button" onClick={prevStep}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '12px 20px', border: '2px solid #e5e7eb',
                    borderRadius: '12px', background: 'white',
                    color: '#374151', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={16} /> Retour
                </button>
              ) : <div />}

              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button" onClick={nextStep} disabled={!isStepValid()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '13px 28px', border: 'none', borderRadius: '12px',
                    background: isStepValid() ? 'linear-gradient(135deg, #8b5cf6, #10b981)' : '#e5e7eb',
                    color: isStepValid() ? 'white' : '#9ca3af',
                    fontWeight: 700, fontSize: '15px',
                    cursor: isStepValid() ? 'pointer' : 'not-allowed',
                    flex: 1, justifyContent: 'center', maxWidth: '240px', marginLeft: 'auto',
                  }}
                >
                  Continuer <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isLoading || !isStepValid()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '13px 28px', border: 'none', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    color: 'white', fontWeight: 700, fontSize: '15px',
                    cursor: isLoading ? 'wait' : 'pointer',
                    flex: 1, justifyContent: 'center', maxWidth: '240px', marginLeft: 'auto',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                  }}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '17px', height: '17px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', display: 'inline-block',
                      }} />
                      Creation...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={17} /> Creer ma boutique</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

