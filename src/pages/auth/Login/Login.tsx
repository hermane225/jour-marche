import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShoppingBag, Store, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import logoImage from '../../../assets/jour_marché.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Identifiants incorrects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)'
    }}>
      {/* Left Side - Branding */}
      <div style={{ 
        flex: 1, 
        display: 'none',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }} className="login-left-panel">
        <style>{`
          @media (min-width: 1024px) {
            .login-left-panel { display: flex !important; flex-direction: column; }
          }
        `}</style>
        
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
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
              <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>La marketplace à l'ivoirienne</span>
            </div>

            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 800, 
              color: 'white', 
              lineHeight: 1.2,
              marginBottom: '20px'
            }}>
              Bienvenue sur<br />
              Jour de Marché
            </h1>

            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: 1.7,
              maxWidth: '450px',
              marginBottom: '40px'
            }}>
              Découvrez des milliers de produits locaux, du village à la ville. 
              Poulets, garba, légumes frais, mode, artisanat... Tout est là !
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px' }}>
              {[
                { icon: <ShoppingBag size={24} />, value: '10,000+', label: 'Produits' },
                { icon: <Store size={24} />, value: '2,500+', label: 'Boutiques' },
                { icon: <Users size={24} />, value: '50,000+', label: 'Clients' },
              ].map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginBottom: '10px'
                  }}>
                    {stat.icon}
                  </div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: 'white' }}>{stat.value}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{stat.label}</p>
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
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="mobile-logo">
            <style>{`
              @media (min-width: 1024px) {
                .mobile-logo { display: none !important; }
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
              Connexion
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              Ravi de vous revoir ! Connectez-vous pour continuer.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
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
                    e.target.style.borderColor = '#10b981';
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#374151'
                }}>
                  Mot de passe
                </label>
                <Link to="/forgot-password" style={{ 
                  fontSize: '13px', 
                  color: '#059669',
                  textDecoration: 'none',
                  fontWeight: 500
                }}>
                  Mot de passe oublié ?
                </Link>
              </div>
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
                  placeholder="••••••••"
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
                    e.target.style.borderColor = '#10b981';
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
                background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #059669, #10b981)',
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
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
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
                  Se connecter
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
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.background = '#f0fdf4';
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
            Continuer avec Google
          </button>

          {/* Sign Up Link */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: '28px', 
            color: '#6b7280',
            fontSize: '15px'
          }}>
            Pas encore de compte ?{' '}
            <Link to="/signup" style={{ 
              color: '#059669', 
              fontWeight: 700, 
              textDecoration: 'none'
            }}>
              S'inscrire gratuitement
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
