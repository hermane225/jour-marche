import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, X, Plus, Check } from 'lucide-react';
import { Button, Input, Card } from '../../../components/ui';
import { SellerLayout } from '../Layout/SellerLayout';
import { categories } from '../../../data/mockData';
import './CreateProduct.css';

export function CreateProduct() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    // Options pour produits alimentaires
    isPerishable: false,
    unit: 'piece' as 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'lot',
  });
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['Blanc', 'Noir']);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  // Catégories alimentaires pour afficher les options spécifiques
  const foodCategories = ['alimentation', 'restaurants', 'boulangerie', 'boissons', 'epicerie'];
  const isFoodProduct = foodCategories.includes(formData.category);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const handleSubmit = async (e: FormEvent, _asDraft: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de création de produit
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setShowSuccess(true);

    // Redirection après 2 secondes
    setTimeout(() => {
      navigate('/seller/products');
    }, 2000);
  };

  return (
    <SellerLayout>
      <div className="create-product-page">
        {/* Breadcrumb */}
        <nav className="create-product-breadcrumb">
          <Link to="/seller/dashboard">Tableau de bord</Link>
          <span>/</span>
          <Link to="/seller/products">Produits</Link>
          <span>/</span>
          <span>Nouveau Produit</span>
        </nav>

        <div className="create-product-header">
          <h1>Ajouter un nouveau produit</h1>
          <div className="create-product-actions">
            <Button 
              variant="outline" 
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
            >
              Enregistrer comme brouillon
            </Button>
            <Button 
              variant="primary" 
              onClick={(e) => handleSubmit(e, false)}
              isLoading={isLoading}
            >
              Publier le produit
            </Button>
          </div>
        </div>

        <form className="create-product-form">
          <div className="create-product-main">
            {/* Left Column */}
            <div className="create-product-left">
              {/* General Info */}
              <Card className="create-product-card">
                <h3>Informations Générales</h3>
                <Input
                  label="Titre du produit"
                  placeholder="Ex: Poulet braisé, T-shirt en coton..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <div className="create-product-textarea-wrapper">
                  <label>Description du produit</label>
                  <textarea
                    placeholder="Décrivez votre produit en détail..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={5}
                  />
                </div>
                
                {/* Catégorie */}
                <div className="create-product-select-wrapper">
                  <label>Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options pour produits alimentaires */}
                {isFoodProduct && (
                  <div className="food-options">
                    <div className="food-option-row">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.isPerishable}
                          onChange={(e) => setFormData({...formData, isPerishable: e.target.checked})}
                        />
                        <span>Produit périssable</span>
                      </label>
                    </div>
                    <div className="create-product-select-wrapper">
                      <label>Unité de vente</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value as any})}
                      >
                        <option value="piece">À la pièce</option>
                        <option value="kg">Au kilogramme (kg)</option>
                        <option value="g">Au gramme (g)</option>
                        <option value="l">Au litre (l)</option>
                        <option value="ml">Au millilitre (ml)</option>
                        <option value="lot">Par lot</option>
                      </select>
                    </div>
                  </div>
                )}
              </Card>

              {/* Images */}
              <Card className="create-product-card">
                <h3>Images du produit</h3>
                <div className="create-product-images">
                  <label className="create-product-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      hidden
                    />
                    <Upload size={24} />
                    <span className="upload-link">Cliquez pour parcourir</span>
                    <span className="upload-hint">ou glissez-déposez vos images ici</span>
                  </label>

                  {images.length > 0 && (
                    <div className="create-product-image-preview">
                      {images.map((img, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={img} alt={`Preview ${index + 1}`} />
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            className="image-remove-btn"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Variants */}
              <Card className="create-product-card">
                <h3>Variantes</h3>
                <p className="create-product-hint">
                  Ajoutez des options si votre produit existe en plusieurs versions, comme la taille ou la couleur.
                </p>

                {/* Sizes */}
                <div className="variant-section">
                  <div className="variant-header">
                    <label>Taille</label>
                    <button type="button" className="variant-trash">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="variant-tags">
                    {sizes.map(size => (
                      <span key={size} className="variant-tag">
                        {size}
                        <button type="button" onClick={() => removeSize(size)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Ajouter..."
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                      className="variant-input"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="variant-section">
                  <div className="variant-header">
                    <label>Couleur</label>
                    <button type="button" className="variant-trash">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="variant-tags">
                    {colors.map(color => (
                      <span key={color} className="variant-tag">
                        {color}
                        <button type="button" onClick={() => removeColor(color)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Ajouter..."
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                      className="variant-input"
                    />
                  </div>
                </div>

                <button type="button" className="add-option-btn">
                  <Plus size={16} />
                  <span>Ajouter une option</span>
                </button>
              </Card>
            </div>

            {/* Right Column */}
            <div className="create-product-right">
              {/* Pricing */}
              <Card className="create-product-card">
                <h3>Tarification et Inventaire</h3>
                <div className="price-input-wrapper">
                  <Input
                    label="Prix"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                  <span className="price-currency">FCFA</span>
                </div>
                <Input
                  label="Quantité en stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
                />
              </Card>
            </div>
          </div>
        </form>

        {/* Success Toast */}
        {showSuccess && (
          <div className="create-product-toast">
            <Check size={20} />
            <span>Produit ajouté avec succès !</span>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
