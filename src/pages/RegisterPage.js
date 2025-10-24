// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(email.trim(), password, referral.trim() || null);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Inscription échouée. Vérifiez les informations saisies.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="auth-card" style={{ maxWidth: 520, margin: '3rem auto', padding: '2rem' }}>
        <h1 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Inscription</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          Créez votre compte pour accéder à VeloxQuant.
        </p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Code de parrainage (optionnel)</label>
            <input
              type="text"
              className="form-input"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="ABCDEFGH"
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', margin: '0.75rem 0 1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%' }}
          >
            {submitting ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: 14 }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: '#10b981', fontWeight: 600 }}>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
