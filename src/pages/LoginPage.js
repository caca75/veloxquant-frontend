// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Connexion échouée. Vérifiez vos identifiants.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="auth-card" style={{ maxWidth: 440, margin: '3rem auto', padding: '2rem' }}>
        <h1 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Connexion</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          Connectez-vous pour accéder à votre tableau de bord.
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 10,
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
                aria-label="Afficher/masquer le mot de passe"
              >
                {showPwd ? 'Masquer' : 'Afficher'}
              </button>
            </div>
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
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: 14 }}>
          Pas de compte ?{' '}
          <Link to="/register" style={{ color: '#10b981', fontWeight: 600 }}>
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}
