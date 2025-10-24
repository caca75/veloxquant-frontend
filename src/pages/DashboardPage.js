import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// === BASE API ================================================================
const RAW_BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8001';
const BACKEND_URL = RAW_BACKEND.replace(/\/+$/, ''); // enlève / final s'il existe
export const API = `${BACKEND_URL}/api`;
// ============================================================================

const fmtMoney = (n) =>
  (Number(n || 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'USD' });

const DashboardPage = () => {
  const { token, user } = useAuth();

  const [me, setMe] = useState(null);
  const [active, setActive] = useState(null); // { subscription, plan }
  const [cyclesToday, setCyclesToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const headersAuth = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // Charge: profil, sub actif, cycles du jour
  useEffect(() => {
    const load = async () => {
      try {
        // 1) me
        const meRes = await axios.get(`${API}/auth/me`, { headers: headersAuth });
        setMe(meRes.data);

        // 2) active subscription
        const subRes = await axios.get(`${API}/subscriptions/active`, { headers: headersAuth });
        setActive(subRes.data);

        // 3) cycles (compte ceux du jour)
        const cyclesRes = await axios.get(`${API}/cycles/my-cycles`, { headers: headersAuth });
        const list = Array.isArray(cyclesRes.data) ? cyclesRes.data : [];
        const today0 = new Date();
        today0.setHours(0, 0, 0, 0);
        const count = list.filter((c) => {
          const t = new Date(c.start_time);
          return t >= today0;
        }).length;
        setCyclesToday(count);
      } catch (e) {
        console.error(e);
        toast.error("Impossible de charger le tableau de bord");
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token, headersAuth]);

  const maxPerDay = active?.plan?.max_cycles_per_day || 0;
  const canStart =
    !!active?.plan &&
    cyclesToday < maxPerDay;

  const handleStartCycle = async () => {
    if (!canStart) {
      toast.error("Limite quotidienne atteinte ou aucun plan actif.");
      return;
    }
    setStarting(true);
    try {
      await axios.post(
        `${API}/cycles/start`,
        { initial_balance: 1000 },
        { headers: headersAuth }
      );
      toast.success('Cycle démarré ✅');
      // rafraîchir le compteur
      setCyclesToday((x) => x + 1);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Impossible de démarrer un cycle";
      toast.error(msg);
    } finally {
      setStarting(false);
    }
  };

  const referralLink = me?.referral_code
    ? `${window.location.origin}/register?ref=${me.referral_code}`
    : '';

  if (loading) {
    return <div className="loading">Chargement…</div>;
  }

  return (
    <div className="dashboard-container" data-testid="dashboard-page" style={{ paddingBottom: 80 }}>
      <h1 className="dashboard-title">Tableau de bord</h1>

      {/* Stat cards */}
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="stat-card">
          <div className="stat-title">SOLDE DISPONIBLE</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {fmtMoney(me?.balance)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">BÉNÉFICE TOTAL</div>
          <div className="stat-value">{fmtMoney(me?.profit_total)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">CYCLES ACTIFS (AUJOURD’HUI)</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {cyclesToday} <span style={{ color: '#94a3b8' }}>/ {maxPerDay}</span>
          </div>
          <div className="stat-hint">Réinitialisation chaque jour à 00h00.</div>
        </div>
      </div>

      {/* Parrainage */}
      <div className="stat-card" style={{ marginTop: 16 }}>
        <div className="stat-title">PARRAINAGE</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }}>
          <div>
            <div className="form-label">Votre code :</div>
            <div className="badge" style={{ fontWeight: 700 }}>{me?.referral_code || '—'}</div>
          </div>

          <div>
            <div className="form-label">Lien :</div>
            <div className="form-row" style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                readOnly
                value={referralLink}
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(referralLink || '');
                    toast.success('Lien copié ✅');
                  } catch {
                    toast.error('Copie impossible');
                  }
                }}
              >
                Copier
              </button>
            </div>
            <div className="stat-hint" style={{ marginTop: 6 }}>
              Gagnez <strong>50% du premier achat</strong> de chaque filleul (ajouté à votre <em>solde</em>).
            </div>
          </div>

          <div className="stat-hint" style={{ marginTop: 6 }}>
            Primes cumulées : <strong>{fmtMoney(0)}</strong>
            {/* Si tu veux afficher les primes réelles, expose un champ/endpoint et remplace 0. */}
          </div>
        </div>
      </div>

      {/* Plan actif */}
      <div className="stat-card" style={{ marginTop: 16 }}>
        <div className="stat-title">PLAN ACTIF</div>

        {!active?.plan ? (
          <div style={{ color: '#94a3b8' }}>
            Aucun plan actif. Consultez la page <Link to="/pricing">Tarifs</Link> pour acheter un plan.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#e2e8f0' }}>
                {active.plan.name_fr || active.plan.name}
              </div>
              <div style={{ color: '#94a3b8', marginTop: 4 }}>
                Prix : <strong>{fmtMoney(active.plan.price_usd)}</strong>
                {' • '}
                Cycles / jour : <strong>{active.plan.max_cycles_per_day}</strong>
              </div>
              <div style={{ color: '#94a3b8', marginTop: 4 }}>
                Début : {new Date(active.subscription.start_date).toLocaleString()}
                {' • '}
                Fin : {new Date(active.subscription.end_date).toLocaleString()}
              </div>
              <div className="stat-hint" style={{ marginTop: 8 }}>
                * L’activation du plan et les retraits sont validés manuellement par un administrateur.
              </div>
            </div>

            <div>
              <button
                className="btn-primary"
                disabled={!canStart || starting}
                onClick={handleStartCycle}
              >
                {starting ? 'Démarrage…' : 'Démarrer un cycle'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
