import React from 'react';
import { useTranslation } from 'react-i18next';

const SupportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-container" data-testid="support-page" style={{minHeight: 'calc(100vh - 200px)'}}>
      <h1 className="dashboard-title" data-testid="support-title">{t('nav.support')}</h1>
      
      <div className="stat-card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <h2 style={{fontSize: '1.75rem', marginBottom: '1.5rem', color: '#10b981'}}>Contact Support</h2>
        
        <div style={{marginBottom: '2rem'}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color: '#f1f5f9'}}>Email</h3>
          <p style={{color: '#cbd5e1'}}>
            <a href="mailto:support@veloxquant.com" style={{color: '#10b981', textDecoration: 'none'}}>
              support@veloxquant.com
            </a>
          </p>
        </div>

        <div style={{marginBottom: '2rem'}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color: '#f1f5f9'}}>FAQ</h3>
          <div style={{display: 'grid', gap: '1.5rem'}}>
            <div>
              <h4 style={{fontSize: '1.125rem', color: '#10b981', marginBottom: '0.5rem'}}>
                How do I start trading?
              </h4>
              <p style={{color: '#cbd5e1', lineHeight: '1.6'}}>
                Choose a subscription plan, complete the payment, and once approved by our admin, you can start launching 24-hour trading cycles.
              </p>
            </div>
            <div>
              <h4 style={{fontSize: '1.125rem', color: '#10b981', marginBottom: '0.5rem'}}>
                How long does payment verification take?
              </h4>
              <p style={{color: '#cbd5e1', lineHeight: '1.6'}}>
                Payment verification typically takes a few minutes to a few hours. You'll receive a notification once approved.
              </p>
            </div>
            <div>
              <h4 style={{fontSize: '1.125rem', color: '#10b981', marginBottom: '0.5rem'}}>
                What cryptocurrencies do you accept?
              </h4>
              <p style={{color: '#cbd5e1', lineHeight: '1.6'}}>
                We accept Bitcoin (BTC), Tron (TRX), and Tether (USDT) for payments.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color: '#f1f5f9'}}>Legal</h3>
          <p style={{color: '#cbd5e1', lineHeight: '1.6'}}>
            For terms of service and privacy policy, please contact us at the email above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;