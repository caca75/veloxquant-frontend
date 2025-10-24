import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8001";
const API = `${BACKEND_URL}/api`;

function fmtDateTime(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function Badge({ status }) {
  if (!status) return null;
  const colors = {
    PENDING: "#f59e0b",
    APPROVED: "#10b981",
    ACTIVE: "#10b981",
    REJECTED: "#ef4444",
  };
  const bg = `${colors[status] || "#64748b"}22`;
  const fg = colors[status] || "#64748b";
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color: fg,
        padding: "4px 8px",
        borderRadius: 999,
      }}
    >
      {status}
    </span>
  );
}

const labelForType = (t) => {
  switch (t) {
    case "PAYMENT_SUBMITTED": return "Paiement soumis";
    case "PAYMENT_APPROVED": return "Paiement approuvé";
    case "PAYMENT_REJECTED": return "Paiement rejeté";
    case "SUBSCRIPTION_ACTIVATED": return "Abonnement activé";
    case "SUBSCRIPTION_EXTENDED": return "Abonnement prolongé";
    case "WITHDRAWAL_REQUESTED": return "Demande de retrait";
    case "WITHDRAWAL_APPROVED": return "Retrait approuvé";
    case "WITHDRAWAL_REJECTED": return "Retrait rejeté";
    case "ADMIN_ADD_FUNDS": return "Fonds ajoutés (admin)";
    case "ADMIN_ADD_PROFIT": return "Profit ajusté (admin)";
    default: return t;
  }
};

const HistoryPage = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtre simple (optionnel)
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const res = await axios.get(`${API}/history/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        toast.error("Impossible de charger l'historique");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((ev) => {
      const hay = [
        ev.event_type,
        ev.title,
        ev.status,
        JSON.stringify(ev.details || {}),
        String(ev.amount || ""),
        String(ev.currency || ""),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [events, search]);

  return (
    <div className="dashboard-container" data-testid="history-page">
      <h1 className="dashboard-title">Historique</h1>

      <div className="stat-card" style={{ marginBottom: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Rechercher</label>
          <input
            className="form-input"
            placeholder="paiement, retrait, rejeté, pro, 300, ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="stat-card">Aucun évènement trouvé.</div>
      ) : (
        <div className="pricing-grid" style={{ gridTemplateColumns: "1fr", gap: "12px" }}>
          {filtered.map((ev) => {
            const detail =
              typeof ev.details === "string"
                ? ev.details
                : ev.details
                ? JSON.stringify(ev.details)
                : "";

            return (
              <div key={ev.id} className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 16 }}>
                    {labelForType(ev.event_type)}
                  </div>
                  <Badge status={ev.status} />
                </div>

                <div style={{ marginTop: 6, color: "#94a3b8" }}>{ev.title}</div>

                <div style={{ marginTop: 10, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {ev.amount != null && (
                    <div>
                      <span style={{ color: "#94a3b8" }}>Montant&nbsp;:</span>{" "}
                      <strong style={{ color: "#e2e8f0" }}>
                        ${Number(ev.amount).toFixed(2)}
                      </strong>
                      {ev.currency && <span style={{ color: "#94a3b8" }}> ({ev.currency})</span>}
                    </div>
                  )}
                  {ev.related_id && (
                    <div>
                      <span style={{ color: "#94a3b8" }}>Réf.&nbsp;:</span>{" "}
                      <code>{ev.related_id}</code>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "#94a3b8" }}>Le&nbsp;:</span>{" "}
                    <span style={{ color: "#e2e8f0" }}>{fmtDateTime(ev.created_at)}</span>
                  </div>
                </div>

                {detail && (
                  <div
                    style={{
                      marginTop: 10,
                      background: "rgba(15,23,42,.5)",
                      borderRadius: 10,
                      padding: 10,
                      color: "#cbd5e1",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                      fontSize: 13,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {typeof ev.details === "object" ? JSON.stringify(ev.details, null, 2) : detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
