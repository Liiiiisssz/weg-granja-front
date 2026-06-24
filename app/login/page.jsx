"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fazerLogin } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit() {
    setErro("");
    setCarregando(true);
    try {
      const dados = await fazerLogin(email, senha);
      if (dados.papel === "ADMIN") {
        router.replace("/adm");
      } else if (dados.papel === "NUTRICIONISTA") {
        router.replace("/nutricionista");
      } else {
        router.replace("/");
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>WEG Granja</h1>
        <p style={s.desc}>Acesso restrito - faca login para continuar</p>

        {erro && <div style={s.erro}>{erro}</div>}

        <label style={s.label}>Email</label>
        <input
          style={s.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="seu@email.com"
        />

        <label style={s.label}>Senha</label>
        <input
          style={s.input}
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="senha"
        />

        <button style={s.botao} onClick={handleSubmit} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F3F4F6",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "24px",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0057B8",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  desc: { color: "#6B7280", fontSize: "0.95rem", margin: "0 0 28px 0" },
  erro: {
    background: "#FEE2E2",
    color: "#B91C1C",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },
  label: {
    display: "block",
    color: "#374151",
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "1rem",
    marginBottom: "20px",
    boxSizing: "border-box",
    outline: "none",
  },
  botao: {
    width: "100%",
    background: "#0057B8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};