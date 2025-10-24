import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';
import './App.css';

// ✅ Logo local (mets ton fichier ici : src/assets/logo.png)
import logo from './assets/logo.png';

// Pages
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WithdrawalsPage from './pages/WithdrawalsPage';
import BillingPage from './pages/BillingPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import SupportPage from './pages/SupportPage';


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'fr');

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <nav className="navbar" data-testid="main-navbar">
      <div className="nav-container">
        <Link to="/" data-testid="nav-logo-link" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={logo}
            alt="IA VeloxQuant"
            className="nav-logo"
            style={{ height: 40, width: 'auto', display: 'block' }}
            onError={(e) => {
              // Fallback vers /public/logo.png si besoin
              e.currentTarget.onerror = null;
              e.currentTarget.src = process.env.PUBLIC_URL + '/logo.png';
            }}
          />
          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>IA VeloxQuant</span>
        </Link>

        <div className="nav-links" data-testid="nav-links">
          <Link to="/" className="nav-link" data-testid="nav-link-home">{t('nav.home')}</Link>
          <Link to="/pricing" className="nav-link" data-testid="nav-link-pricing">{t('nav.pricing')}</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" data-testid="nav-link-dashboard">{t('nav.dashboard')}</Link>
              <Link to="/withdrawals" className="nav-link">Retraits</Link>
              <Link to="/history" className="nav-link" data-testid="nav-link-history">{t('nav.history')}</Link>
              <Link to="/support" className="nav-link" data-testid="nav-link-support">{t('nav.support')}</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" data-testid="nav-link-admin">{t('nav.admin')}</Link>
              )}
              <button
                onClick={logout}
                className="nav-link"
                data-testid="nav-link-logout"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                title={t('nav.logout')}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" data-testid="nav-link-login">{t('nav.login')}</Link>
              <Link to="/register" className="nav-link" data-testid="nav-link-register">{t('nav.register')}</Link>
            </>
          )}

          <div className="lang-selector" data-testid="lang-selector">
            <button
              className={`lang-btn ${currentLang === 'fr' ? 'active' : ''}`}
              onClick={() => changeLang('fr')}
              data-testid="lang-btn-fr"
            >
              FR
            </button>
            <button
              className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => changeLang('en')}
              data-testid="lang-btn-en"
            >
              EN
            </button>
            <button
              className={`lang-btn ${currentLang === 'es' ? 'active' : ''}`}
              onClick={() => changeLang('es')}
              data-testid="lang-btn-es"
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer" data-testid="main-footer">
      <p>&copy; 2025 VeloxQuant IA. {t('footer.rights')}</p>
    </footer>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading" data-testid="loading-spinner">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function AppContent() {
  return (
    <div className="App" data-testid="app-container">
      {/* Masque tout badge/filigrane Emergent éventuel */}
      <style>{`
        a[href*="emergent"], [aria-label*="Emergent"], [title*="Emergent"],
        .emergent-badge, .emergent, .made-with-emergent {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/support" element={<SupportPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
           <Route
    path="/withdrawals"
    element={
      <ProtectedRoute>
        <WithdrawalsPage />
      </ProtectedRoute>
    }
 />

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
