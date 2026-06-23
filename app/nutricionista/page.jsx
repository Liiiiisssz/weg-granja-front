"use client";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080";

const today = () => new Date().toISOString().slice(0, 10);

const s = {
  page: {
    background: "#1a1a1a",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "monospace",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#0057B8",
    marginBottom: "8px",
    letterSpacing: "2px",
  },
  section: {
    marginTop: "40px",
  },
  subtitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderBottom: "1px solid #444",
    paddingBottom: "8px",
    marginBottom: "16px",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "480px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
    color: "#aaa",
  },
  input: {
    background: "#111",
    border: "1px solid #333",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: "6px",
    width: "100%",
    fontFamily: "monospace",
    fontSize: "14px",
    boxSizing: "border-box",
    colorScheme: "dark",
  },
  submitBtn: {
    background: "#0057B8",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    fontFamily: "monospace",
    fontSize: "14px",
    alignSelf: "flex-start",
  },
  ok: { color: "#00cc44", fontSize: "13px" },
  err: { color: "#cc3333", fontSize: "13px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#2a2a2a",
    padding: "10px",
    textAlign: "left",
    fontSize: "13px",
    color: "#aaa",
    borderBottom: "1px solid #333",
  },
  td: {
    padding: "10px",
    fontSize: "13px",
    borderBottom: "1px solid #222",
  },
  redBtn: {
    background: "#cc0000",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
    fontFamily: "monospace",
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
        <h1 style={s.title}>Nutricionista</h1>
        <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>Gestão de limites de proteína</p>

        {/* ── Form ── */}
        <div style={s.section}>
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

            <button type="submit" disabled={saving} style={s.submitBtn}>
              {saving ? "SALVANDO..." : "SALVAR"}
            </button>

            {formMsg && (
              <span style={formMsg.type === "ok" ? s.ok : s.err}>
                {formMsg.type === "ok" ? "✓ " : "✗ "}{formMsg.text}
              </span>
            )}
          </form>
        </div>

        {/* ── Configs table ── */}
        <div style={s.section}>
          <h2 style={s.subtitle}>Configurações cadastradas</h2>
          {configsErr ? (
            <span style={s.err}>Erro ao carregar: {configsErr}</span>
          ) : configs.length === 0 ? (
            <span style={{ color: "#555", fontSize: "13px" }}>Nenhuma configuração cadastrada.</span>
          ) : (
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
                  <tr key={c.id} style={{ cursor: "default" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={s.td}>{c.id}</td>
                    <td style={s.td}>{c.data}</td>
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
          )}
        </div>

        {/* ── Retiradas table ── */}
        <div style={s.section}>
          <h2 style={s.subtitle}>Histórico de retiradas de hoje</h2>
          {retiradasErr ? (
            <span style={s.err}>Erro ao carregar: {retiradasErr}</span>
          ) : retiradas.length === 0 ? (
            <span style={{ color: "#555", fontSize: "13px" }}>Nenhuma retirada registrada hoje.</span>
          ) : (
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
                    onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={s.td}>{r.colaboradorNome ?? r.nome ?? "—"}</td>
                    <td style={s.td}>{r.matricula ?? "—"}</td>
                    <td style={s.td}>{r.turno ?? "—"}</td>
                    <td style={s.td}>{r.tipoRefeicao ?? r.refeicao ?? "—"}</td>
                    <td style={s.td}>{formatTime(r.dataHora)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
