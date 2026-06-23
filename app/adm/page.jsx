"use client";
import { useState, useEffect } from "react";

const API_URL = "https://weg-granja-api.onrender.com";

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
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#4B5563",
    cursor: "pointer",
    paddingBottom: "12px",
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
  badgeAtivo: {
    background: "#D1FAE5",
    color: "#065F46",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "700",
    display: "inline-block",
  },
  badgeInativo: {
    background: "#F3F4F6",
    color: "#4B5563",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "700",
    display: "inline-block",
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
  greenBtn: {
    background: "#E0E7FF",
    color: "#3730A3",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    cursor: "pointer",
    border: "none",
    fontWeight: "700",
  },
};

export default function AdmPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turno, setTurno] = useState("MANHA");
  const [temSegundaRefeicao, setTemSegundaRefeicao] = useState(false);
  const [formMsg, setFormMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const [colaboradores, setColaboradores] = useState([]);
  const [listErr, setListErr] = useState(null);

  const loadColaboradores = async () => {
    try {
      const res = await fetch(`${API_URL}/colaboradores?apenasAtivos=false`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setColaboradores(await res.json());
      setListErr(null);
    } catch (e) {
      setListErr(e.message);
    }
  };

  useEffect(() => { loadColaboradores(); }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormMsg(null);
    try {
      const res = await fetch(`${API_URL}/colaboradores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, matricula, turno, temSegundaRefeicao }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.mensagem || data.message || `HTTP ${res.status}`);
      setFormMsg({ type: "ok", text: `Colaborador "${nome}" cadastrado com sucesso.` });
      setNome("");
      setMatricula("");
      setTurno("MANHA");
      setTemSegundaRefeicao(false);
      loadColaboradores();
    } catch (e) {
      setFormMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleInativar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/colaboradores/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      loadColaboradores();
    } catch (e) {
      alert(`Erro ao inativar: ${e.message}`);
    }
  };

  const handleReativar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/colaboradores/${id}/reativar`, { method: "PATCH" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      loadColaboradores();
    } catch (e) {
      alert(`Erro ao reativar: ${e.message}`);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        
        <div style={s.header}>
          <h1 style={s.title}>Administração</h1>
          <p style={s.desc}>Gestão integrada de colaboradores</p>
        </div>

        {/* ── Form Card ── */}
        <div style={s.card}>
          <h2 style={s.subtitle}>Cadastrar novo colaborador</h2>
          <form style={s.form} onSubmit={handleCadastrar}>
            <label style={s.label}>
              Nome Completo
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Ex: João da Silva"
                style={s.input}
              />
            </label>

            <label style={s.label}>
              Matrícula
              <input
                type="text"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                required
                placeholder="Ex: 123456"
                style={s.input}
              />
            </label>

            <label style={s.label}>
              Turno
              <select
                value={turno}
                onChange={e => setTurno(e.target.value)}
                style={s.input}
              >
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="NOITE">Noite</option>
              </select>
            </label>

            <label style={s.checkRow}>
              <input
                type="checkbox"
                checked={temSegundaRefeicao}
                onChange={e => setTemSegundaRefeicao(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#0057B8", cursor: "pointer" }}
              />
              Vale 2ª refeição
            </label>

            <div>
              <button type="submit" disabled={saving} style={{...s.submitBtn, opacity: saving ? 0.7 : 1}}>
                {saving ? "CADASTRANDO..." : "CADASTRAR"}
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

        {/* ── Table Card ── */}
        <div style={s.card}>
          <h2 style={s.subtitle}>Colaboradores cadastrados</h2>
          {listErr ? (
            <span style={s.err}>❌ Erro ao carregar: {listErr}</span>
          ) : colaboradores.length === 0 ? (
            <span style={{ color: "#6B7280", fontSize: "0.875rem" }}>Nenhum colaborador cadastrado no momento.</span>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["ID", "Nome", "Matrícula", "Turno", "2ª Refeição", "Status", "Ações"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colaboradores.map(c => (
                    <tr key={c.id}
                      onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      style={{ transition: "background 0.2s" }}
                    >
                      <td style={s.td}>{c.id}</td>
                      <td style={{...s.td, fontWeight: "500"}}>{c.nome}</td>
                      <td style={s.td}>{c.matricula}</td>
                      <td style={s.td}>{c.turno}</td>
                      <td style={s.td}>{c.temSegundaRefeicao ? "Sim" : "Não"}</td>
                      <td style={s.td}>
                        <span style={c.ativo ? s.badgeAtivo : s.badgeInativo}>
                          {c.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td style={s.td}>
                        {c.ativo ? (
                          <button style={s.redBtn} onClick={() => handleInativar(c.id)}>
                            Inativar
                          </button>
                        ) : (
                          <button style={s.greenBtn} onClick={() => handleReativar(c.id)}>
                            Reativar
                          </button>
                        )}
                      </td>
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