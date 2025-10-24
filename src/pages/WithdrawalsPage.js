import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8001';
const API = `${BACKEND_URL}/api`;

const WithdrawalsPage = () => {
  const { token } = useAuth();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [amount, setAmount] = useState('');
  const [crypto, setCrypto] = useState('USDT');
  const [address, setAddress] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/withdrawals/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) { toast.error('Montant invalide'); return; }
    if (!address.trim()) { toast.error('Adresse requise'); return; }

    setSending(true);
    try {
      await axios.post(`${API}/withdrawals/request`, {
        amount: a,
        crypto_address: address.trim(),
        crypto_type: crypto
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Demande envoyée');
      setAmount(''); setAddress('');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Échec de la demande');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Retraits</h1>

      <div className="stat-card" style={{ maxWidth: 720 }}>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Montant (USD)</label>
            <input type="number" min="0.01" step="0.01" className="form-input"
                   value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Réseau</label>
            <select className="form-input" value={crypto} onChange={(e) => setCrypto(e.target.value)}>
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="TRX">TRX</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input type="text" className="form-input"
                   value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <button className="btn-full" type="submit" disabled={sending}>
            {sending ? 'Envoi…' : 'Envoyer la demande'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: 12 }}>Mes demandes</h2>
        {loading ? (
          <div className="stat-card">Chargement…</div>
        ) : list.length === 0 ? (
          <div className="stat-card">Aucune demande.</div>
        ) : (
          <div className="stat-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Montant</th>
                  <th style={{ padding: '0.75rem' }}>Réseau</th>
                  <th style={{ padding: '0.75rem' }}>Adresse</th>
                  <th style={{ padding: '0.75rem' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {list.map((w) => (
                  <tr key={w.id} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      {w.created_at ? new Date(w.created_at).toLocaleString() : '-'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>${(w.amount || 0).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>{w.crypto_type}</td>
                    <td style={{ padding: '0.75rem', wordBreak: 'break-all' }}>{w.crypto_address}</td>
                    <td style={{ padding: '0.75rem' }}>{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalsPage;
