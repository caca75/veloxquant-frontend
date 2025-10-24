import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8001';
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [payments, setPayments] = useState([]);        // achats (manual payments)
  const [withdrawals, setWithdrawals] = useState([]);  // retraits
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejet paiement
  const [rejectReasonPay, setRejectReasonPay] = useState('');
  const [rejectingPayId, setRejectingPayId] = useState(null);

  // Rejet retrait
  const [rejectReasonW, setRejectReasonW] = useState('');
  const [rejectingWid, setRejectingWid] = useState(null);

  // Ajouter fonds / profits
  const [userIdentifier, setUserIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [profitAmount, setProfitAmount] = useState('');
  const [addingFunds, setAddingFunds] = useState(false);
  const [addingProfit, setAddingProfit] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };

  const refreshAll = async () => {
    setLoading(true);
    try {
      // 1) Paiements — sans filtre pour éviter de rater un statut
      const p = await axios.get(`${API}/admin/manual-payments`, { headers: authHeader });
      setPayments(Array.isArray(p.data) ? p.data : []);

      // 2) Retraits — si ta route existe, sinon commente ces 2 lignes
      try {
        const w = await axios.get(`${API}/admin/withdrawals`, { headers: authHeader });
        setWithdrawals(Array.isArray(w.data) ? w.data : []);
      } catch {
        setWithdrawals([]); // backend pas encore en place
      }

      // 3) Utilisateurs
      const u = await axios.get(`${API}/admin/users`, { headers: authHeader });
      setUsers(Array.isArray(u.data) ? u.data : []);
    } catch (e) {
      console.error(e);
      toast.error("Chargement admin impossible");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // --- Paiements (achats plan)
  const approvePayment = async (id) => {
    try {
      await axios.post(`${API}/admin/manual-payments/${id}/approve`, {}, { headers: authHeader });
      toast.success('Paiement approuvé ✅');
      refreshAll();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec approbation paiement');
    }
  };

  const rejectPayment = async (id) => {
    if (!rejectReasonPay.trim()) {
      toast.error('Donne une raison de rejet');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('reason', rejectReasonPay);
      await axios.post(`${API}/admin/manual-payments/${id}/reject`, fd, { headers: authHeader });
      toast.success('Paiement rejeté');
      setRejectingPayId(null);
      setRejectReasonPay('');
      refreshAll();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec rejet paiement');
    }
  };

  // --- Retraits
  const approveWithdrawal = async (id) => {
    try {
      await axios.post(`${API}/admin/withdrawals/${id}/approve`, {}, { headers: authHeader });
      toast.success('Retrait approuvé ✅');
      refreshAll();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec approbation retrait');
    }
  };

  const rejectWithdrawal = async (id) => {
    if (!rejectReasonW.trim()) {
      toast.error('Donne une raison de rejet');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('reason', rejectReasonW);
      await axios.post(`${API}/admin/withdrawals/${id}/reject`, fd, { headers: authHeader });
      toast.success('Retrait rejeté');
      setRejectingWid(null);
      setRejectReasonW('');
      refreshAll();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec rejet retrait');
    }
  };

  // --- Ajout de fonds
  const onAddFunds = async (e) => {
    e.preventDefault();
    if (!userIdentifier.trim() || !amount || parseFloat(amount) <= 0) {
      toast.error('Renseigne un utilisateur et un montant > 0');
      return;
    }
    setAddingFunds(true);
    try {
      const fd = new FormData();
      fd.append('user_identifier', userIdentifier);
      fd.append('amount', amount);
      const res = await axios.post(`${API}/admin/users/add-funds`, fd, { headers: authHeader });
      toast.success(`${res.data.amount_added}$ ajoutés à ${res.data.user_email}`);
      setUserIdentifier('');
      setAmount('');
      refreshAll();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec ajout fonds');
    } finally {
      setAddingFunds(false);
    }
  };

  // --- Ajout de profits (si tu as l’endpoint /admin/users/add-profit)
  const onAddProfit = async (e) => {
    e.preventDefault();
    if (!userIdentifier.trim() || !profitAmount || parseFloat(profitAmount) <= 0) {
      toast.error('Renseigne un utilisateur et un profit > 0');
      return;
    }
    setAddingProfit(true);
    try {
      // NOTE: Crée l’endpoint côté backend si pas présent (voir §3)
      const fd = new FormData();
      fd.append('user_identifier', userIdentifier);
      fd.append('amount', profitAmount);
      await axios.post(`${API}/admin/users/add-profit`, fd, { headers: authHeader });
      toast.success(`Profit ajouté`);
      setProfitAmount('');
      refreshAll();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec ajout profit (endpoint manquant ?)');
    } finally {
      setAddingProfit(false);
    }
  };

  if (loading) return <div className="loading">Chargement…</div>;

  const pendingPays = payments.filter(p => (p.status || '').toUpperCase() === 'PENDING');
  const pendingWithdrawals = withdrawals.filter(w => (w.status || '').toUpperCase() === 'PENDING');

  return (
    <div className="dashboard-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
        <h1 className="dashboard-title">{t('admin.title') || 'Administration'}</h1>
        <button className="btn-secondary" onClick={refreshAll}>Rafraîchir</button>
      </div>

      {/* Ajouter des fonds / profits */}
      <div className="stat-card" style={{marginBottom:'2rem', display:'grid', gap:16}}>
        <h2 style={{color:'#e2e8f0'}}>Crédits</h2>
        <form onSubmit={onAddFunds} style={{display:'grid', gap:12}}>
          <div className="form-group">
            <label className="form-label">Email ou ID</label>
            <input className="form-input" value={userIdentifier} onChange={(e)=>setUserIdentifier(e.target.value)} placeholder="user@example.com ou ID" />
          </div>
          <div className="form-group">
            <label className="form-label">Montant (USD)</label>
            <input type="number" min="0.01" step="0.01" className="form-input" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          </div>
          <button className="btn-primary" disabled={addingFunds}>{addingFunds ? 'Ajout…' : 'Ajouter des fonds'}</button>
        </form>

        <form onSubmit={onAddProfit} style={{display:'grid', gap:12}}>
          <div className="form-group">
            <label className="form-label">Email ou ID</label>
            <input className="form-input" value={userIdentifier} onChange={(e)=>setUserIdentifier(e.target.value)} placeholder="user@example.com ou ID" />
          </div>
          <div className="form-group">
            <label className="form-label">Profit (USD)</label>
            <input type="number" min="0.01" step="0.01" className="form-input" value={profitAmount} onChange={(e)=>setProfitAmount(e.target.value)} />
          </div>
          <button className="btn-secondary" disabled={addingProfit}>{addingProfit ? 'Ajout…' : 'Ajouter du profit'}</button>
          <div style={{color:'#94a3b8', fontSize:12}}>
            * Nécessite l’endpoint <code>/admin/users/add-profit</code> côté backend (voir §3).
          </div>
        </form>
      </div>

      {/* Paiements en attente */}
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{color:'#e2e8f0'}}>Achats en attente ({pendingPays.length})</h2>
        {pendingPays.length === 0 ? (
          <p style={{color:'#94a3b8'}}>Aucun paiement « PENDING »</p>
        ) : (
          <div style={{display:'grid', gap:16}}>
            {pendingPays.map(p => (
              <div key={p.id} className="stat-card">
                <div style={{display:'flex', justifyContent:'space-between', gap:16}}>
                  <div>
                    <div style={{fontWeight:700, color:'#10b981'}}>${p.amount_usd} — {p.currency}</div>
                    <div style={{color:'#cbd5e1'}}>User: {p.user_email || p.user_id}</div>
                    <div style={{color:'#cbd5e1'}}>Plan: {p.plan_name || p.plan_id}</div>
                    <div style={{color:'#94a3b8', fontSize:12}}>{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</div>
                    <div style={{marginTop:8, color:'#cbd5e1', wordBreak:'break-all'}}>TX: {p.tx_hash}</div>
                    {p.screenshot_url && (
                      <div style={{marginTop:8}}>
                        <a href={`${BACKEND_URL}${p.screenshot_url}`} target="_blank" rel="noreferrer" style={{color:'#60a5fa'}}>Voir la capture</a>
                      </div>
                    )}
                  </div>
                  <div style={{display:'grid', gap:8, minWidth:220}}>
                    <button className="btn-primary" onClick={() => approvePayment(p.id)}>Approuver</button>

                    {rejectingPayId === p.id ? (
                      <>
                        <textarea className="form-input" rows={3} placeholder="Raison du rejet..." value={rejectReasonPay} onChange={(e)=>setRejectReasonPay(e.target.value)} />
                        <div style={{display:'flex', gap:8}}>
                          <button className="btn-secondary" onClick={() => rejectPayment(p.id)} style={{background:'#ef4444', borderColor:'#ef4444'}}>Confirmer Rejet</button>
                          <button className="btn-secondary" onClick={() => { setRejectingPayId(null); setRejectReasonPay(''); }}>Annuler</button>
                        </div>
                      </>
                    ) : (
                      <button className="btn-secondary" onClick={() => setRejectingPayId(p.id)} style={{borderColor:'#ef4444', color:'#ef4444'}}>Rejeter</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Retraits en attente */}
      <div>
        <h2 style={{color:'#e2e8f0'}}>Retraits en attente ({pendingWithdrawals.length})</h2>
        {pendingWithdrawals.length === 0 ? (
          <p style={{color:'#94a3b8'}}>Aucun retrait « PENDING »</p>
        ) : (
          <div style={{display:'grid', gap:16}}>
            {pendingWithdrawals.map(w => (
              <div key={w.id} className="stat-card">
                <div style={{display:'flex', justifyContent:'space-between', gap:16}}>
                  <div>
                    <div style={{fontWeight:700, color:'#fbbf24'}}>${w.amount} — {w.crypto_type}</div>
                    <div style={{color:'#cbd5e1'}}>User: {w.user_email || w.user_id}</div>
                    <div style={{color:'#cbd5e1', wordBreak:'break-all'}}>Adresse: {w.crypto_address}</div>
                    <div style={{color:'#94a3b8', fontSize:12}}>{w.created_at ? new Date(w.created_at).toLocaleString() : ''}</div>
                  </div>
                  <div style={{display:'grid', gap:8, minWidth:220}}>
                    <button className="btn-primary" onClick={() => approveWithdrawal(w.id)}>Approuver</button>

                    {rejectingWid === w.id ? (
                      <>
                        <textarea className="form-input" rows={3} placeholder="Raison du rejet..." value={rejectReasonW} onChange={(e)=>setRejectReasonW(e.target.value)} />
                        <div style={{display:'flex', gap:8}}>
                          <button className="btn-secondary" onClick={() => rejectWithdrawal(w.id)} style={{background:'#ef4444', borderColor:'#ef4444'}}>Confirmer Rejet</button>
                          <button className="btn-secondary" onClick={() => { setRejectingWid(null); setRejectReasonW(''); }}>Annuler</button>
                        </div>
                      </>
                    ) : (
                      <button className="btn-secondary" onClick={() => setRejectingWid(w.id)} style={{borderColor:'#ef4444', color:'#ef4444'}}>Rejeter</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
