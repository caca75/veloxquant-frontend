import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8001';
const API = `${BACKEND_URL}/api`;

// Définition des taux par plan (par jour)
const ROI_BY_PRICE = {
  100: 0.15,   // Starter
  350: 0.35,   // Pro
  9000: 0.75,  // Elite
};
const ROI_BY_NAME = {
  Starter: 0.15, Pro: 0.35, Elite: 0.75,
  'Débutant': 0.15, 'Élite': 0.75,
};

function fmtMoney(n) {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getPlanRoi(plan) {
  if (!plan) return 0;
  if (ROI_BY_NAME[plan.name]) return ROI_BY_NAME[plan.name];
  if (ROI_BY_NAME[plan.name_fr]) return ROI_BY_NAME[plan.name_fr];
  const byPrice = ROI_BY_PRICE[Math.round(plan.price_usd)];
  return byPrice ?? 0;
}

const PricingPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API}/plans`);
      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/billing', { state: { selectedPlan: plan } });
  };

  const getPlanName = (plan) => {
    if (i18n.language === 'fr') return plan.name_fr;
    if (i18n.language === 'es') return plan.name_es;
    return plan.name;
  };

  const getPlanFeatures = (plan) => {
    const base = (() => {
      if (i18n.language === 'fr') return plan.features_fr;
      if (i18n.language === 'es') return plan.features_es;
      return plan.features;
    })() || [];

    const roi = getPlanRoi(plan);
    const extra = [
      roi > 0 ? `Rendement journalier estimé : ${(roi * 100).toFixed(0)}%` : null,
      roi > 0 ? `Gain estimé / jour : $${fmtMoney(plan.price_usd * roi)}` : null,
      `Achat vérifié manuellement par un administrateur. Les retraits sont généralement validés à partir de 21 jours après activation.`,
    ].filter(Boolean);

    return [...extra, ...base];
  };

  if (loading) {
    return <div className="loading" data-testid="loading-spinner">Loading...</div>;
  }

  return (
    <div data-testid="pricing-page" style={{minHeight: 'calc(100vh - 200px)'}}>

      {/* Bandeau explicatif */}
      <section className="stat-card" style={{maxWidth: 1200, margin: '0 auto 2rem'}}>
        <h2 style={{fontSize: 22, color: '#e2e8f0', fontWeight: 700, marginBottom: 8}}>Comment ça marche ?</h2>
        <ol style={{color: '#94a3b8', lineHeight: 1.6, marginLeft: 18}}>
          <li>Choisissez un plan ci-dessous et payez le montant indiqué.</li>
          <li>Un administrateur vérifie votre paiement et <b>active votre plan</b>.</li>
          <li>Vos cycles quotidiens génèrent un rendement selon le plan (voir cartes).</li>
          <li><b>Information :</b> les retraits sont généralement validés à partir de 21 jours après activation (validation manuelle par l’administrateur).</li>
        </ol>
        <div style={{marginTop: 8, fontSize: 12, color: '#94a3b8'}}>
          * Les rendements affichés sont des objectifs indicatifs. Investir comporte des risques.
        </div>
      </section>

      {/* Grille des plans */}
      <section className="pricing-section" data-testid="pricing-section">
        <h2 className="section-title" data-testid="pricing-title">{t('pricing.title') || 'Nos Plans'}</h2>

        <div className="pricing-grid" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {plans.map((plan, index) => {
            const roi = getPlanRoi(plan);
            const name = getPlanName(plan);
            const features = getPlanFeatures(plan);
            return (
              <div
                key={plan.id}
                className={`pricing-card ${index === 1 ? 'featured' : ''}`}
                data-testid={`pricing-card-${(plan.name || '').toLowerCase()}`}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(15px)',
                  border: index === 1 ? '2px solid #10b981' : '2px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '1.5rem',
                  padding: '3rem',
                  transition: 'all 0.4s ease'
                }}
              >
                <h3 className="plan-name" style={{fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#f1f5f9'}}>
                  {name}
                </h3>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6}}>
                  <div className="plan-price" style={{fontSize: '3.0rem', fontWeight: '800', color: '#10b981'}}>
                    ${plan.price_usd}
                  </div>
                  {roi > 0 && (
                    <div style={{color: '#eab308', fontWeight: 700}}>
                      {(roi * 100).toFixed(0)}% / jour
                    </div>
                  )}
                </div>

                {roi > 0 && (
                  <div style={{color: '#94a3b8', marginBottom: '1rem'}}>
                    Gain estimé / jour : <b>${fmtMoney(plan.price_usd * roi)}</b>
                  </div>
                )}

                <p className="plan-period" style={{color: '#94a3b8', marginBottom: '1.25rem'}}>
                  {t('pricing.monthly') || 'Mensuel'} • Validation manuelle par l’admin
                </p>

                <ul className="plan-features" style={{listStyle: 'none', marginBottom: '2rem'}}>
                  {features.map((feature, idx) => (
                    <li key={idx} style={{padding: '0.6rem 0', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <span style={{color: '#10b981', fontWeight: '700', fontSize: '1.1rem'}}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="btn-primary"
                  data-testid={`select-plan-${(plan.name || '').toLowerCase()}`}
                  style={{width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '600', fontSize: '1.125rem', cursor: 'pointer', transition: 'background 0.3s ease'}}
                >
                  {t('pricing.selectPlan') || 'Choisir ce plan'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
