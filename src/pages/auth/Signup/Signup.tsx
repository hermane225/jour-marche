import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, User, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import logoImage from '../../../assets/jour_marché.png';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name || email.split('@')[0], 'buyer');
      navigate('/');
    } catch {
      setError('Cet email est déjà utilisé.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return { level: 0, text: '', color: '#e5e7eb' };
    if (password.length < 6) return { level: 1, text: 'Faible', color: '#ef4444' };
    if (password.length < 10) return { level: 2, text: 'Moyen', color: '#f59e0b' };
    return { level: 3, text: 'Fort', color: '#10b981' };
  };

  const strength = passwordStrength();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)'
    }}>
      {/* Left Side - Branding */}
      <div style={{ 
        flex: 1, 
        display: 'none',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }} className="signup-left-panel">
        <style>{`
          @media (min-width: 1024px) {
            .signup-left-panel { display: flex !important; flex-direction: column; }
          }
        `}</style>
        
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
          zIndex: 0
        }} />
        
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 1
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <Link to="/" style={{ marginBottom: '60px' }}>
            <img src={logoImage} alt="Jour de Marché" style={{ height: '100px', width: 'auto' }} />
          </Link>

          {/* Main Text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: '50px',
              marginBottom: '24px',
              width: 'fit-content'
            }}>
              <Sparkles size={18} color="white" />
              <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Rejoignez la communauté</span>
            </div>

            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 800, 
              color: 'white', 
              lineHeight: 1.2,
              marginBottom: '20px'
            }}>
              Créez votre<br />
              compte gratuit
            </h1>

            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: 1.7,
              maxWidth: '450px',
              marginBottom: '40px'
            }}>
              Achetez des produits locaux ou vendez les vôtres. 
              Du village à la ville, tout le monde est bienvenu !
            </p>

            {/* Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Accès à des milliers de produits locaux',
                'Achetez en toute sécurité',
                'Vendez gratuitement vos produits',
                'Livraison rapide à Abidjan'
              ].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={16} color="white" />
                  </div>
                  <span style={{ color: 'white', fontSize: '16px' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            © 2024 Jour de Marché CI. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '440px',
          background: 'white',
          borderRadius: '32px',
          padding: '50px 40px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.08)'
        }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="mobile-logo-signup">
            <style>{`
              @media (min-width: 1024px) {
                .mobile-logo-signup { display: none !important; }
              }
            `}</style>
            <Link to="/">
              <img src={logoImage} alt="Jour de Marché" style={{ height: '80px', width: 'auto' }} />
            </Link>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: '#1f2937',
              marginBottom: '10px'
            }}>
              Inscription
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              Créez votre compte et rejoignez la communauté
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Nom complet <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optionnel)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '14px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                  }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email ou téléphone
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Mail size={20} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '14px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '14px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength */}
              {password.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: level <= strength.level ? strength.color : '#e5e7eb',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: strength.color, fontWeight: 500 }}>
                    {strength.text}
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '14px 16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <p style={{ margin: 0, color: '#dc2626', fontSize: '14px' }}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px',
                background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.35)',
                transition: 'all 0.3s'
              }}
            >
              {isLoading ? (
                <div style={{
                  width: '22px',
                  height: '22px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            margin: '28px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Google Button */}
          <button
            type="button"
            style={{
              width: '100%',
              padding: '16px',
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.background = '#faf5ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.background = 'white';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            S'inscrire avec Google
          </button>

          {/* Login Link */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: '28px', 
            color: '#6b7280',
            fontSize: '15px'
          }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ 
              color: '#7c3aed', 
              fontWeight: 700, 
              textDecoration: 'none'
            }}>
              Se connecter
            </Link>
          </p>

          {/* Terms */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            color: '#9ca3af',
            fontSize: '12px',
            lineHeight: 1.6
          }}>
            En vous inscrivant, vous acceptez nos{' '}
            <Link to="/terms" style={{ color: '#7c3aed', textDecoration: 'none' }}>
              Conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link to="/privacy" style={{ color: '#7c3aed', textDecoration: 'none' }}>
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
