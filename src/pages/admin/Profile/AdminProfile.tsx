import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BadgeCheck, CalendarClock, Mail, Phone, Save, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './AdminProfile.css';

type ToastType = 'success' | 'error';

interface ToastState {
  type: ToastType;
  message: string;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const createForm = (name?: string, email?: string, phone?: string, avatar?: string): ProfileForm => ({
  name: name || '',
  email: email || '',
  phone: phone || '',
  avatar: avatar || '',
});

export function AdminProfile() {
  const { user, updateUser, isLoading } = useAuth();
  const [form, setForm] = useState<ProfileForm>(() => createForm());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm(createForm(user.name, user.email, user.phone, user.avatar));
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      form.name.trim() !== (user.name || '').trim() ||
      form.email.trim() !== (user.email || '').trim() ||
      form.phone.trim() !== (user.phone || '').trim() ||
      form.avatar.trim() !== (user.avatar || '').trim()
    );
  }, [form.avatar, form.email, form.name, form.phone, user]);

  const joinedAt = useMemo(() => {
    if (!user?.createdAt) return '-';
    return new Date(user.createdAt).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [user?.createdAt]);

  const initial = (form.name || user?.name || 'A').trim().charAt(0).toUpperCase();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    if (form.name.trim().length < 2) {
      setToast({ type: 'error', message: 'Le nom doit contenir au moins 2 caracteres.' });
      return;
    }

    try {
      setSaving(true);
      await updateUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        avatar: form.avatar.trim() || undefined,
      });
      setToast({ type: 'success', message: 'Profil admin mis a jour avec succes.' });
    } catch (error) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Echec de mise a jour du profil.' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !user) {
    return <div className="admin-profile-loading">Chargement du profil...</div>;
  }

  return (
    <section className="admin-profile-pro">
      <header className="admin-profile-head">
        <div>
          <h2>Profil Administrateur</h2>
          <p>Chaque admin dispose d'un profil unique lie a son compte API.</p>
        </div>
        <span className="admin-profile-role">
          <Shield size={15} />
          {user?.role || 'admin'}
        </span>
      </header>

      <div className="admin-profile-grid">
        <article className="profile-card identity">
          <div className="identity-avatar-wrap">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name || 'Admin'} className="identity-avatar-image" />
            ) : (
              <span className="identity-avatar-fallback">{initial}</span>
            )}
          </div>
          <h3>{form.name || 'Administrateur'}</h3>
          <p>{form.email || 'email@jour-marche.com'}</p>

          <ul className="identity-meta">
            <li>
              <CalendarClock size={14} />
              Membre depuis {joinedAt}
            </li>
            <li>
              <BadgeCheck size={14} />
              Compte verifie pour la gestion plateforme
            </li>
          </ul>
        </article>

        <form className="profile-card edit-form" onSubmit={handleSubmit}>
          <h3>Informations du compte</h3>
          <div className="profile-form-grid">
            <label>
              Nom complet
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Votre nom"
                required
              />
            </label>
            <label>
              Email
              <div className="input-with-icon">
                <Mail size={15} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </label>
            <label>
              Telephone
              <div className="input-with-icon">
                <Phone size={15} />
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+225 00 00 00 00"
                />
              </div>
            </label>
            <label>
              URL Avatar
              <input
                value={form.avatar}
                onChange={(e) => setForm((prev) => ({ ...prev, avatar: e.target.value }))}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="profile-actions">
            <button type="submit" className="save-btn" disabled={!hasChanges || saving}>
              <Save size={15} />
              {saving ? 'Mise a jour...' : 'Sauvegarder le profil'}
            </button>
          </div>
        </form>
      </div>

      {toast && <div className={`admin-profile-toast ${toast.type}`}>{toast.message}</div>}
    </section>
  );
}
