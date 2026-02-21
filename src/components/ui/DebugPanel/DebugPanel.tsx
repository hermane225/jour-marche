// Composant de débogage pour afficher les informations système
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { tokenManager } from '../../../services/api/client';
import { config } from '../../../config';

interface DebugInfo {
  isAuthenticated: boolean;
  hasToken: boolean;
  userRole: string;
  apiUrl: string;
  environment: string;
  tokenPreview: string;
}

export function DebugPanel() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculer debugInfo directement sans useEffect
  const token = tokenManager.getToken();
  const debugInfo: DebugInfo = {
    isAuthenticated: !!user,
    hasToken: tokenManager.hasToken(),
    userRole: user?.role || 'Non connecté',
    apiUrl: config.apiUrl || '(Proxy Vite)',
    environment: config.isDevelopment ? 'Développement' : 'Production',
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'Aucun',
  };

  // Afficher en mode mini par défaut
  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: debugInfo.hasToken ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '18px' }}>🐛</span>
        <span>{debugInfo.hasToken ? '✅ Connecté' : '❌ Non connecté'}</span>
      </div>
    );
  }

  // Panneau de débogage complet
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '400px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🐛</span>
          <span>Panneau de débogage</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
        <DebugRow
          label="Authentification"
          value={debugInfo.isAuthenticated ? '✅ Oui' : '❌ Non'}
          status={debugInfo.isAuthenticated ? 'success' : 'error'}
        />
        
        <DebugRow
          label="Token JWT"
          value={debugInfo.hasToken ? '✅ Présent' : '❌ Absent'}
          status={debugInfo.hasToken ? 'success' : 'error'}
        />

        <DebugRow
          label="Rôle utilisateur"
          value={debugInfo.userRole}
          status="neutral"
        />

        <DebugRow
          label="API Backend"
          value={debugInfo.apiUrl}
          status="neutral"
        />

        <DebugRow
          label="Environnement"
          value={debugInfo.environment}
          status="neutral"
        />

        {debugInfo.hasToken && (
          <DebugRow
            label="Token (aperçu)"
            value={debugInfo.tokenPreview}
            status="neutral"
            mono
          />
        )}
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={() => {
            console.group('🐛 INFORMATIONS DE DÉBOGAGE');
            console.log('Authentification:', debugInfo.isAuthenticated);
            console.log('Token présent:', debugInfo.hasToken);
            console.log('Utilisateur:', user);
            console.log('Token complet:', tokenManager.getToken());
            console.log('API URL:', config.apiUrl);
            console.log('Config complète:', config);
            console.groupEnd();
            alert('Informations détaillées affichées dans la console (F12)');
          }}
          style={{
            width: '100%',
            padding: '10px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          📋 Copier les détails dans la console
        </button>
      </div>
    </div>
  );
}

function DebugRow({ 
  label, 
  value, 
  status, 
  mono = false 
}: { 
  label: string; 
  value: string; 
  status: 'success' | 'error' | 'neutral';
  mono?: boolean;
}) {
  const statusColors = {
    success: '#10b981',
    error: '#ef4444',
    neutral: '#6b7280',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ color: '#6b7280', fontWeight: 500 }}>{label}:</span>
      <span
        style={{
          color: statusColors[status],
          fontWeight: 600,
          textAlign: 'right',
          fontFamily: mono ? 'monospace' : 'inherit',
          fontSize: mono ? '11px' : '13px',
        }}
      >
        {value}
      </span>
    </div>
  );
}
