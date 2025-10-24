import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-content">
          <h1 className="hero-title" data-testid="hero-title">
            {t('hero.title')}
          </h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <div className="hero-buttons">
            <Link 
              to={user ? "/dashboard" : "/register"} 
              className="btn-primary"
              data-testid="hero-cta-primary"
            >
              {t('hero.cta')}
            </Link>
            <Link 
              to="/pricing" 
              className="btn-secondary"
              data-testid="hero-cta-secondary"
            >
              {t('hero.cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" data-testid="features-section">
        <h2 className="section-title" data-testid="features-title">{t('features.title')}</h2>
        <div className="features-grid">
          <div className="feature-card" data-testid="feature-card-1">
            <img 
              src="https://images.unsplash.com/photo-1745509267699-1b1db256601e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2hhcnRzfGVufDB8fHx8MTc2MDU1NTM2MXww&ixlib=rb-4.1.0&q=85" 
              alt="AI Trading" 
              className="feature-icon"
            />
            <h3 className="feature-title">{t('features.feature1')}</h3>
            <p className="feature-desc">{t('features.feature1Desc')}</p>
          </div>
          <div className="feature-card" data-testid="feature-card-2">
            <img 
              src="https://images.pexels.com/photos/6132773/pexels-photo-6132773.jpeg" 
              alt="Secure Payments" 
              className="feature-icon"
            />
            <h3 className="feature-title">{t('features.feature2')}</h3>
            <p className="feature-desc">{t('features.feature2Desc')}</p>
          </div>
          <div className="feature-card" data-testid="feature-card-3">
            <img 
              src="https://images.unsplash.com/photo-1745301754104-4effee07d6ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHx0cmFkaW5nJTIwY2hhcnRzfGVufDB8fHx8MTc2MDU1NTM2MXww&ixlib=rb-4.1.0&q=85" 
              alt="Real-Time Analytics" 
              className="feature-icon"
            />
            <h3 className="feature-title">{t('features.feature3')}</h3>
            <p className="feature-desc">{t('features.feature3Desc')}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" data-testid="how-section" style={{padding: '6rem 2rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
        <h2 className="section-title">{t('howItWorks.title')}</h2>
        <div className="steps-container" style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem'}}>
          <div className="step-card" data-testid="step-card-1" style={{textAlign: 'center', padding: '2rem'}}>
            <div className="step-number" style={{width: '70px', height: '70px', background: '#10b981', color: 'white', fontSize: '2rem', fontWeight: '700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>1</div>
            <h3 className="step-title" style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#f1f5f9'}}>{t('howItWorks.step1')}</h3>
            <p className="step-desc" style={{color: '#94a3b8', lineHeight: '1.6'}}>{t('howItWorks.step1Desc')}</p>
          </div>
          <div className="step-card" data-testid="step-card-2" style={{textAlign: 'center', padding: '2rem'}}>
            <div className="step-number" style={{width: '70px', height: '70px', background: '#10b981', color: 'white', fontSize: '2rem', fontWeight: '700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>2</div>
            <h3 className="step-title" style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#f1f5f9'}}>{t('howItWorks.step2')}</h3>
            <p className="step-desc" style={{color: '#94a3b8', lineHeight: '1.6'}}>{t('howItWorks.step2Desc')}</p>
          </div>
          <div className="step-card" data-testid="step-card-3" style={{textAlign: 'center', padding: '2rem'}}>
            <div className="step-number" style={{width: '70px', height: '70px', background: '#10b981', color: 'white', fontSize: '2rem', fontWeight: '700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>3</div>
            <h3 className="step-title" style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#f1f5f9'}}>{t('howItWorks.step3')}</h3>
            <p className="step-desc" style={{color: '#94a3b8', lineHeight: '1.6'}}>{t('howItWorks.step3Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;