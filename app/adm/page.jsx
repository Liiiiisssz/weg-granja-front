"use client";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080";

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
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#aaa",
    cursor: "pointer",
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
  greenBtn: {
    background: "#006600",
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
        <h1 style={s.title}>Administração</h1>
        <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>Gestão de colaboradores</p>

        {/* ── Form ── */}
        <div style={s.section}>
          <h2 style={s.subtitle}>Cadastrar colaborador</h2>
          <form style={s.form} onSubmit={handleCadastrar}>
            <label style={s.label}>
              Nome
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Nome completo"
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
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              Vale segunda refeição
            </label>

            <button type="submit" disabled={saving} style={s.submitBtn}>
              {saving ? "CADASTRANDO..." : "CADASTRAR"}
            </button>

            {formMsg && (
              <span style={formMsg.type === "ok" ? s.ok : s.err}>
                {formMsg.type === "ok" ? "✓ " : "✗ "}{formMsg.text}
              </span>
            )}
          </form>
        </div>

        {/* ── Table ── */}
        <div style={s.section}>
          <h2 style={s.subtitle}>Colaboradores cadastrados</h2>
          {listErr ? (
            <span style={s.err}>Erro ao carregar: {listErr}</span>
          ) : colaboradores.length === 0 ? (
            <span style={{ color: "#555", fontSize: "13px" }}>Nenhum colaborador cadastrado.</span>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  {["ID", "Nome", "Matrícula", "Turno", "2ª Refeição", "Ativo", "Ações"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colaboradores.map(c => (
                  <tr key={c.id}
                    onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={s.td}>{c.id}</td>
                    <td style={s.td}>{c.nome}</td>
                    <td style={s.td}>{c.matricula}</td>
                    <td style={s.td}>{c.turno}</td>
                    <td style={s.td}>{c.temSegundaRefeicao ? "Sim" : "Não"}</td>
                    <td style={s.td}>
                      <span style={{ color: c.ativo ? "#00cc44" : "#666" }}>
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
          )}
        </div>
      </div>
    </div>
  );
}
