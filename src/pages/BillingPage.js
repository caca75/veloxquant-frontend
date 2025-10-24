import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// === BASE API ================================================================
const RAW_BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8001';
const BACKEND_URL = RAW_BACKEND.replace(/\/+$/, '');
export const API = `${BACKEND_URL}/api`;
// ============================================================================

const fmtMoney = (n) =>
  (Number(n || 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'USD' });

const BillingPage = () => {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Plan éventuellement transmis par /pricing : navigate('/billing', { state: { selectedPlan } })
  const planFromState = location.state?.selectedPlan || null;

  const [addresses, setAddresses] = useState({ btc: '', usdt: '', trx: '' });
  const [plans, setPlans] = useState(planFromState ? [planFromState] : []);
  const [selectedPlanId, setSelectedPlanId] = useState(planFromState?.id || '');
  const [currency, setCurrency] = useState('USDT'); // USDT | BTC | TRX
  const [amountUSD, setAmountUSD] = useState(planFromState?.price_usd || '');
  const [txHash, setTxHash] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const headersAuth = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) || planFromState || null,
    [plans, selectedPlanId, planFromState]
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        // Adresses de paiement
        const addrRes = await axios.get(`${API}/billing/addresses`);
        setAddresses(addrRes.data || {});

        // Charger les plans si non fournis par state
        if (!planFromState) {
          const pRes = await axios.get(`${API}/plans`);
          const list = Array.isArray(pRes.data) ? pRes.data : [];
          setPlans(list);
          if (list.length > 0) {
            setSelectedPlanId(list[0].id);
            setAmountUSD(list[0].price_usd);
          }
        } else {
          setPlans([planFromState]);
          setSelectedPlanId(planFromState.id);
          setAmountUSD(planFromState.price_usd);
        }
      } catch (e) {
        console.error(e);
        toast.error("Impossible de charger les infos de facturation");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate, planFromState]);

  useEffect(() => {
    if (selectedPlan) setAmountUSD(selectedPlan.price_usd);
  }, [selectedPlan]);

  const currentAddress =
    currency === 'BTC' ? addresses.btc :
    currency === 'TRX' ? addresses.trx :
    addresses.usdt;

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value || '');
      toast.success('Adresse copiée ✅');
    } catch {
      toast.error('Copie impossible');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error('Sélectionnez un plan');
      return;
    }
    if (!currentAddress) {
      toast.error(`Adresse ${currency} non renseignée côté serveur`);
      return;
    }
    if (!txHash.trim()) {
      toast.error('Le hash de transaction est requis');
      return;
    }
    if (!screenshot) {
      toast.error("Ajoutez la capture d'écran");
      return;
    }

    setSending(true);
    try {
      const fd = new FormData();
      fd.append('plan_id', selectedPlan.id);
      fd.append('currency', currency.toUpperCase());
      fd.append('amount_usd', String(amountUSD || selectedPlan.price_usd));
      fd.append('tx_hash', txHash.trim());
      fd.append('screenshot', screenshot);

      await axios.post(`${API}/billing/manual/submit`, fd, {
        headers: { ...headersAuth },
      });

      toast.success('Paiement soumis. Il sera vérifié sous peu ✅');
      // navigate('/history'); // si tu as une page historique dédiée
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.detail || 'Soumission impossible';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="loading">Chargement…</div>;

  return (
    <div className="dashboard-container" data-testid="billing-page">
      <h1 className="dashboard-title">Paiement & activation</h1>

      {/* Plan sélectionné / choix de plan */}
      <div className="stat-card">
        {!planFromState && (
          <>
            <div className="form-label">Choisir un plan</div>
            <select
              className="form-input"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.name_fr || p.name)} — {fmtMoney(p.price_usd)}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedPlan && (
          <div style={{ marginTop: 12, color: '#94a3b8' }}>
            <div style={{ fontWeight: 700, color: '#e2e8f0' }}>
              {(selectedPlan.name_fr || selectedPlan.name)}
            </div>
            <div>
              Prix : <strong>{fmtMoney(selectedPlan.price_usd)}</strong> — Cycles / jour :{' '}
              <strong>{selectedPlan.max_cycles_per_day}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Adresses de paiement avec boutons Copier */}
      <div className="stat-card">
        <div className="stat-title">Adresses de paiement</div>

        <div className="pay-row" style={{ display: 'grid', gap: 12 }}>
          {/* BTC */}
          <div className="pay-item" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <div style={{ color: '#94a3b8' }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0' }}>Bitcoin :</div>
              <div>{addresses.btc || <span style={{ color: '#ef4444' }}>Non défini</span>}</div>
            </div>
            <button className="btn-secondary" onClick={() => copy(addresses.btc)} disabled={!addresses.btc}>
              Copier
            </button>
          </div>

          {/* USDT */}
          <div className="pay-item" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <div style={{ color: '#94a3b8' }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0' }}>USDT :</div>
              <div>{addresses.usdt || <span style={{ color: '#ef4444' }}>Non défini</span>}</div>
            </div>
            <button className="btn-secondary" onClick={() => copy(addresses.usdt)} disabled={!addresses.usdt}>
              Copier
            </button>
          </div>

          {/* TRX */}
          <div className="pay-item" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <div style={{ color: '#94a3b8' }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0' }}>TRX :</div>
              <div>{addresses.trx || <span style={{ color: '#ef4444' }}>Non défini</span>}</div>
            </div>
            <button className="btn-secondary" onClick={() => copy(addresses.trx)} disabled={!addresses.trx}>
              Copier
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire de soumission */}
      <div className="stat-card">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <div className="form-label">Monnaie</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['USDT', 'BTC', 'TRX'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrency(c)}
                  style={{
                    borderColor: currency === c ? '#10b981' : undefined,
                    color: currency === c ? '#10b981' : undefined,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Adresse {currency}</div>
            <div className="form-row" style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" readOnly value={currentAddress || ''} />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => copy(currentAddress)}
                disabled={!currentAddress}
              >
                Copier
              </button>
            </div>
            {!currentAddress && (
              <div className="stat-hint" style={{ color: '#ef4444', marginTop: 6 }}>
                Adresse {currency} non configurée côté serveur (variables d’environnement PAY_ADDR_*).
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="form-label">Montant (USD)</div>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="form-input"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="form-label">Hash de transaction</div>
            <input
              type="text"
              className="form-input"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Collez le TX hash"
              required
            />
          </div>

          <div className="form-group">
            <div className="form-label">Télécharger la capture d'écran</div>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="stat-hint" style={{ marginBottom: 12 }}>
            Votre paiement sera vérifié manuellement par un administrateur (statut « PENDING »).
          </div>

          <button type="submit" className="btn-full" disabled={sending || !currentAddress}>
            {sending ? 'Envoi…' : 'Soumettre pour validation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingPage;
