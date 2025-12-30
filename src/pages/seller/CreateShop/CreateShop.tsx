import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Upload, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Shield,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  Globe,
  Instagram,
  Facebook
} from 'lucide-react';

export function CreateShop() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Étape 1 - Infos de base
    shopName: '',
    description: '',
    category: '',
    // Étape 2 - Contact
    phone: '',
    whatsapp: '',
    email: '',
    // Étape 3 - Localisation
    city: '',
    commune: '',
    address: '',
    // Étape 4 - Horaires et livraison
    openingHours: '',
    closingHours: '',
    deliveryZones: [] as string[],
    deliveryFee: '',
    // Étape 5 - Réseaux sociaux (optionnel)
    instagram: '',
    facebook: '',
    website: '',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const categories = [
    { id: 'legumes-fruits', name: 'Légumes & Fruits', icon: '🥦' },
    { id: 'cereales', name: 'Céréales & Vivriers', icon: '🌾' },
    { id: 'attieke-manioc', name: 'Attiéké & Manioc', icon: '🫘' },
    { id: 'restaurants', name: 'Plats cuisinés', icon: '🍛' },
    { id: 'poissons-viandes', name: 'Poissons & Viandes', icon: '🥩' },
    { id: 'epices-condiments', name: 'Épices & Condiments', icon: '🌶️' },
    { id: 'boissons', name: 'Boissons & Jus', icon: '🧃' },
    { id: 'boulangerie', name: 'Boulangerie & Pâtisserie', icon: '🥐' },
    { id: 'mode', name: 'Mode & Vêtements', icon: '👗' },
    { id: 'beaute', name: 'Beauté & Cosmétiques', icon: '💄' },
    { id: 'artisanat', name: 'Artisanat Local', icon: '🎨' },
    { id: 'autre', name: 'Autre', icon: '📦' },
  ];

  const cities = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Daloa', 'Korhogo'];
  const communes = ['Cocody', 'Plateau', 'Marcory', 'Treichville', 'Yopougon', 'Abobo', 'Adjamé', 'Koumassi', 'Port-Bouët', 'Bingerville'];
  const zones = ['Cocody', 'Plateau', 'Marcory', 'Treichville', 'Yopougon', 'Abobo', 'Adjamé', 'Koumassi', 'Port-Bouët', 'Bingerville', 'Riviera', 'Angré', '2 Plateaux'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogo(reader.result as string);
        } else {
          setCoverImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDeliveryZone = (zone: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones.includes(zone)
        ? prev.deliveryZones.filter(z => z !== zone)
        : [...prev.deliveryZones, zone]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de création de boutique
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    navigate('/seller/dashboard');
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.shopName && formData.category;
      case 2:
        return formData.phone;
      case 3:
        return formData.city && formData.commune;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: 'Boutique', icon: Store },
    { number: 2, title: 'Contact', icon: Phone },
    { number: 3, title: 'Localisation', icon: MapPin },
    { number: 4, title: 'Livraison', icon: Package },
    { number: 5, title: 'Réseaux', icon: Globe },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f5f3ff 100%)' }}>
      {/* Header */}
      <div className="create-shop-page-header">
        <div className="create-shop-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => navigate(-1)}
              style={{ padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              <ArrowLeft size={20} color="#374151" />
            </button>
            <div>
              <h1 className="create-shop-header-title">
                <Sparkles size={24} color="#8b5cf6" />
                <span className="create-shop-header-text">Ouvrir ma boutique gratuitement</span>
              </h1>
              <p className="create-shop-header-subtitle">
                Créez votre boutique en ligne en quelques minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="create-shop-container">
        <div className="create-shop-layout">
          
          {/* Sidebar - Avantages */}
          <div className="create-shop-sidebar">
            {/* Progress Steps */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Progression
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <div 
                      key={step.number}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '14px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: isActive ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : isCompleted ? '#f0fdf4' : 'transparent',
                        border: isActive ? '2px solid #10b981' : '2px solid transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: isCompleted ? 'linear-gradient(135deg, #059669, #10b981)' : isActive ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted || isActive ? 'white' : '#9ca3af'
                      }}>
                        {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: isActive ? '#059669' : isCompleted ? '#059669' : '#6b7280' }}>
                          {step.title}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                          Étape {step.number}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Avantages */}
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', borderRadius: '20px', padding: '24px', color: 'white' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 700 }}>
                ✨ Créer ma boutique gratuitement
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>100% Gratuit</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Pas de frais, pas d'abonnement</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Ouvert à tous</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Formel ou informel, bienvenue !</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Vendez plus</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Touchez des clients partout en CI</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Simple à utiliser</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Publiez en quelques clics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="create-shop-form-container">
            {/* Mobile Progress Indicator */}
            <div className="create-shop-mobile-progress">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Étape {currentStep} sur 5</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{Math.round((currentStep / 5) * 100)}%</span>
              </div>
              <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(currentStep / 5) * 100}%`, 
                  background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              
              {/* Étape 1 - Informations de base */}
              {currentStep === 1 && (
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                    Informations de votre boutique
                  </h2>
                  <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#6b7280' }}>
                    Commencez par les informations essentielles de votre boutique
                  </p>

                  {/* Images Upload */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
                      Images de la boutique
                    </h3>
                    <div className="create-shop-images-grid">
                      {/* Logo */}
                      <div>
                        <label style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '160px',
                          height: '160px',
                          border: '3px dashed #e5e7eb',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          background: '#fafafa',
                          overflow: 'hidden',
                          transition: 'all 0.2s'
                        }}>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} hidden />
                          {logo ? (
                            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <>
                              <Camera size={32} color="#9ca3af" />
                              <span style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Logo</span>
                            </>
                          )}
                        </label>
                      </div>
                      
                      {/* Cover */}
                      <div>
                        <label style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: '160px',
                          border: '3px dashed #e5e7eb',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          background: '#fafafa',
                          overflow: 'hidden',
                          transition: 'all 0.2s'
                        }}>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} hidden />
                          {coverImage ? (
                            <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <>
                              <Upload size={32} color="#9ca3af" />
                              <span style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Image de couverture</span>
                              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Recommandé: 1200x400px</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Shop Name */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                      Nom de la boutique <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Chez Mariam - Saveurs d'Afrique"
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '14px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Category */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                      Catégorie principale <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="create-shop-categories-grid">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px 12px',
                            border: formData.category === cat.id ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
                            borderRadius: '14px',
                            background: formData.category === cat.id ? '#f5f3ff' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: formData.category === cat.id ? '#7c3aed' : '#6b7280', textAlign: 'center' }}>
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                      Description de la boutique
                    </label>
                    <textarea
                      placeholder="Décrivez votre boutique, vos produits, ce qui vous rend unique..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '15px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>
              )}

              {/* Étape 2 - Contact */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                    Coordonnées de contact
                  </h2>
                  <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#6b7280' }}>
                    Comment vos clients peuvent vous joindre
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Phone */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Phone size={16} color="#6b7280" />
                        Numéro de téléphone <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+225 07 XX XX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</span>
                        WhatsApp (optionnel)
                      </label>
                      <input
                        type="tel"
                        placeholder="+225 07 XX XX XX XX"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#25d366'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        Les clients pourront vous contacter directement sur WhatsApp
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Mail size={16} color="#6b7280" />
                        Email (optionnel)
                      </label>
                      <input
                        type="email"
                        placeholder="contact@maboutique.ci"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 3 - Localisation */}
              {currentStep === 3 && (
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                    Localisation de votre boutique
                  </h2>
                  <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#6b7280' }}>
                    Où se trouve votre boutique physique ou zone d'activité
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* City */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <MapPin size={16} color="#6b7280" />
                        Ville <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none',
                          background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 16px center'
                        }}
                      >
                        <option value="">Sélectionnez une ville</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Commune */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        Commune <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={formData.commune}
                        onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none',
                          background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 16px center'
                        }}
                      >
                        <option value="">Sélectionnez une commune</option>
                        {communes.map(commune => (
                          <option key={commune} value={commune}>{commune}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        Adresse complète (optionnel)
                      </label>
                      <textarea
                        placeholder="Quartier, rue, repère..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '15px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 4 - Horaires et Livraison */}
              {currentStep === 4 && (
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                    Horaires et livraison
                  </h2>
                  <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#6b7280' }}>
                    Configurez vos horaires d'ouverture et zones de livraison
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Horaires */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Clock size={16} color="#6b7280" />
                        Horaires d'ouverture
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#6b7280' }}>
                            Ouverture
                          </label>
                          <input
                            type="time"
                            value={formData.openingHours}
                            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '14px 16px',
                              fontSize: '16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#6b7280' }}>
                            Fermeture
                          </label>
                          <input
                            type="time"
                            value={formData.closingHours}
                            onChange={(e) => setFormData({ ...formData, closingHours: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '14px 16px',
                              fontSize: '16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Zones de livraison */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Package size={16} color="#6b7280" />
                        Zones de livraison
                      </label>
                      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280' }}>
                        Sélectionnez les zones où vous pouvez livrer
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {zones.map(zone => (
                          <button
                            key={zone}
                            type="button"
                            onClick={() => toggleDeliveryZone(zone)}
                            style={{
                              padding: '10px 18px',
                              border: formData.deliveryZones.includes(zone) ? '2px solid #10b981' : '2px solid #e5e7eb',
                              borderRadius: '50px',
                              background: formData.deliveryZones.includes(zone) ? '#dcfce7' : 'white',
                              color: formData.deliveryZones.includes(zone) ? '#059669' : '#6b7280',
                              fontWeight: 500,
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {formData.deliveryZones.includes(zone) && <span style={{ marginRight: '6px' }}>✓</span>}
                            {zone}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Frais de livraison */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        Frais de livraison moyens
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          placeholder="1500"
                          value={formData.deliveryFee}
                          onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '16px 80px 16px 20px',
                            fontSize: '16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 600 }}>
                          FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 5 - Réseaux sociaux */}
              {currentStep === 5 && (
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                    Réseaux sociaux (optionnel)
                  </h2>
                  <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#6b7280' }}>
                    Connectez vos réseaux sociaux pour plus de visibilité
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Instagram */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Instagram size={16} color="#E4405F" />
                        Instagram
                      </label>
                      <input
                        type="text"
                        placeholder="@maboutique"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Facebook size={16} color="#1877F2" />
                        Facebook
                      </label>
                      <input
                        type="text"
                        placeholder="facebook.com/maboutique"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        <Globe size={16} color="#6b7280" />
                        Site web
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.maboutique.ci"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Résumé */}
                  <div style={{ marginTop: '40px', padding: '24px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '16px', border: '2px solid #86efac' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={22} />
                      Prêt à lancer votre boutique !
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#166534', lineHeight: 1.6 }}>
                      Votre boutique <strong>"{formData.shopName || 'Ma Boutique'}"</strong> sera créée dans la catégorie{' '}
                      <strong>{categories.find(c => c.id === formData.category)?.name || 'Non définie'}</strong>.
                      Vous pourrez ajouter vos produits immédiatement après la création.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="create-shop-nav-buttons">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'white',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      border: 'none',
                      borderRadius: '12px',
                      background: isStepValid() ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)' : '#e5e7eb',
                      color: isStepValid() ? 'white' : '#9ca3af',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: isStepValid() ? 'pointer' : 'not-allowed',
                      boxShadow: isStepValid() ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                    }}
                  >
                    Continuer
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '16px 32px',
                      border: 'none',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: isLoading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span style={{ 
                          width: '20px', 
                          height: '20px', 
                          border: '3px solid rgba(255,255,255,0.3)', 
                          borderTopColor: 'white', 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }}></span>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Créer ma boutique
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .create-shop-page-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 20px 0;
        }
        
        .create-shop-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .create-shop-header-title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .create-shop-header-subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }
        
        .create-shop-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        
        .create-shop-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
        }
        
        .create-shop-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .create-shop-mobile-progress {
          display: none;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .create-shop-form-container {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .create-shop-nav-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }
        
        .create-shop-categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        .create-shop-images-grid {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 20px;
        }
        
        @media (max-width: 1024px) {
          .create-shop-container {
            padding: 24px 16px;
          }
          
          .create-shop-layout {
            grid-template-columns: 1fr;
          }
          
          .create-shop-sidebar {
            display: none;
          }
          
          .create-shop-mobile-progress {
            display: block;
          }
          
          .create-shop-form-container {
            padding: 24px;
            border-radius: 16px;
          }
          
          .create-shop-categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .create-shop-header-inner {
            padding: 0 16px;
          }
          
          .create-shop-header-title {
            font-size: 16px;
          }
          
          .create-shop-header-text {
            display: none;
          }
          
          .create-shop-header-title::after {
            content: 'Ma boutique';
            font-size: 16px;
          }
          
          .create-shop-header-subtitle {
            display: none;
          }
          
          .create-shop-container {
            padding: 16px 12px;
          }
          
          .create-shop-categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .create-shop-images-grid {
            grid-template-columns: 1fr;
          }
          
          .create-shop-form-container {
            padding: 16px;
            border-radius: 12px;
          }
          
          .create-shop-nav-buttons {
            flex-direction: column;
            gap: 12px;
          }
          
          .create-shop-nav-buttons button {
            width: 100%;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .create-shop-categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .create-shop-form-container {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
