"use client";
import { useState, useEffect } from "react";

const API_URL = "https://weg-granja-api.onrender.com";

const today = () => new Date().toISOString().slice(0, 10);

const s = {
  page: {
    background: "#F3F4F6",
    minHeight: "100vh",
    color: "#1F2937",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "40px 24px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "800",
    color: "#0057B8",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  desc: {
    color: "#6B7280",
    fontSize: "1rem",
    margin: 0,
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    marginBottom: "32px",
  },
  subtitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 24px 0",
    paddingBottom: "12px",
    borderBottom: "1px solid #E5E7EB",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    alignItems: "end",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#4B5563",
  },
  input: {
    background: "#FFFFFF",
    border: "1px solid #D1D5DB",
    color: "#111827",
    padding: "12px 16px",
    borderRadius: "8px",
    width: "100%",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    background: "#0057B8",
    color: "#FFFFFF",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    fontSize: "1rem",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 87, 184, 0.3)",
  },
  msgContainer: {
    gridColumn: "1 / -1",
    marginTop: "-8px",
  },
  ok: { color: "#059669", fontSize: "0.875rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" },
  err: { color: "#DC2626", fontSize: "0.875rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" },
  tableWrapper: {
    overflowX: "auto",
  },
  table: { 
    width: "100%", 
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    background: "#F9FAFB",
    padding: "16px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6B7280",
    borderBottom: "1px solid #E5E7EB",
  },
  td: {
    padding: "16px",
    fontSize: "0.875rem",
    color: "#111827",
    borderBottom: "1px solid #E5E7EB",
  },
  redBtn: {
    background: "#FEE2E2",
    color: "#991B1B",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    cursor: "pointer",
    border: "none",
    fontWeight: "700",
  },
};

export default function NutricionistaPage() {
  const [date, setDate] = useState(today());
  const [tipoRefeicao, setTipoRefeicao] = useState("ALMOCO");
  const [limitePorcoes, setLimitePorcoes] = useState(1);
  const [formMsg, setFormMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const [configs, setConfigs] = useState([]);
  const [configsErr, setConfigsErr] = useState(null);

  const [retiradas, setRetiradas] = useState([]);
  const [retiradasErr, setRetiradasErr] = useState(null);

  const loadConfigs = async () => {
    try {
      const res = await fetch(`${API_URL}/configuracoes-diarias`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setConfigs(await res.json());
      setConfigsErr(null);
    } catch (e) {
      setConfigsErr(e.message);
    }
  };

  const loadRetiradas = async () => {
    try {
      const res = await fetch(`${API_URL}/retiradas`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRetiradas(await res.json());
      setRetiradasErr(null);
    } catch (e) {
      setRetiradasErr(e.message);
    }
  };

  useEffect(() => {
    loadConfigs();
    loadRetiradas();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormMsg(null);
    try {
      const res = await fetch(`${API_URL}/configuracoes-diarias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: date, tipoRefeicao, limitePorcoes: Number(limitePorcoes) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.mensagem || data.message || `HTTP ${res.status}`);
      setFormMsg({ type: "ok", text: "Configuração salva com sucesso." });
      loadConfigs();
    } catch (e) {
      setFormMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/configuracoes-diarias/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      loadConfigs();
    } catch (e) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  };

  const formatTime = (dataHora) => {
    if (!dataHora) return "—";
    try {
      return new Date(dataHora).toTimeString().slice(0, 5);
    } catch {
      return dataHora;
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        
        <div style={s.header}>
          <h1 style={s.title}>Nutricionista</h1>
          <p style={s.desc}>Gestão de limites de proteína e monitoramento de refeições</p>
        </div>

        {/* ── Form Card ── */}
        <div style={s.card}>
          <h2 style={s.subtitle}>Configurar limite do dia</h2>
          <form style={s.form} onSubmit={handleSave}>
            <label style={s.label}>
              Data
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                style={s.input}
              />
            </label>

            <label style={s.label}>
              Refeição
              <select
                value={tipoRefeicao}
                onChange={e => setTipoRefeicao(e.target.value)}
                style={s.input}
              >
                <option value="ALMOCO">Almoço</option>
                <option value="JANTA">Janta</option>
              </select>
            </label>

            <label style={s.label}>
              Limite de porções
              <input
                type="number"
                min={1}
                value={limitePorcoes}
                onChange={e => setLimitePorcoes(e.target.value)}
                required
                style={s.input}
              />
            </label>

            <div>
              <button type="submit" disabled={saving} style={{...s.submitBtn, opacity: saving ? 0.7 : 1}}>
                {saving ? "SALVANDO..." : "SALVAR CONFIGURAÇÃO"}
              </button>
            </div>

            {formMsg && (
              <div style={s.msgContainer}>
                <span style={formMsg.type === "ok" ? s.ok : s.err}>
                  {formMsg.type === "ok" ? "✅" : "❌"} {formMsg.text}
                </span>
              </div>
            )}
          </form>
        </div>

        {/* ── Configs Table Card ── */}
        <div style={s.card}>
          <h2 style={s.subtitle}>Configurações cadastradas</h2>
          {configsErr ? (
            <span style={s.err}>❌ Erro ao carregar: {configsErr}</span>
          ) : configs.length === 0 ? (
            <span style={{ color: "#6B7280", fontSize: "0.875rem" }}>Nenhuma configuração cadastrada.</span>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["ID", "Data", "Refeição", "Limite", "Ações"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {configs.map(c => (
                    <tr key={c.id}
                      onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      style={{ transition: "background 0.2s" }}
                    >
                      <td style={s.td}>{c.id}</td>
                      <td style={{...s.td, fontWeight: "500"}}>{c.data}</td>
                      <td style={s.td}>{c.tipoRefeicao}</td>
                      <td style={s.td}>{c.limitePorcoes}</td>
                      <td style={s.td}>
                        <button style={s.redBtn} onClick={() => handleDelete(c.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Retiradas Table Card ── */}
        <div style={s.card}>
          <h2 style={s.subtitle}>Histórico de retiradas de hoje</h2>
          {retiradasErr ? (
            <span style={s.err}>❌ Erro ao carregar: {retiradasErr}</span>
          ) : retiradas.length === 0 ? (
            <span style={{ color: "#6B7280", fontSize: "0.875rem" }}>Nenhuma retirada registrada hoje até o momento.</span>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Nome", "Matrícula", "Turno", "Refeição", "Horário"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {retiradas.map((r, i) => (
                    <tr key={i}
                      onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      style={{ transition: "background 0.2s" }}
                    >
                      <td style={{...s.td, fontWeight: "500"}}>{r.colaboradorNome ?? r.nome ?? "—"}</td>
                      <td style={s.td}>{r.matricula ?? "—"}</td>
                      <td style={s.td}>{r.turno ?? "—"}</td>
                      <td style={s.td}>{r.tipoRefeicao ?? r.refeicao ?? "—"}</td>
                      <td style={{...s.td, color: "#0057B8", fontWeight: "600"}}>{formatTime(r.dataHora)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}