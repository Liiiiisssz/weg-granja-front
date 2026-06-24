"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { estaLogado, getUsuario } from "../lib/auth";

export default function RotaProtegida({ children, papelNecessario }) {
  const router = useRouter();
  const [estado, setEstado] = useState("verificando");

  useEffect(() => {
    if (!estaLogado()) {
      router.replace("/login");
      return;
    }

    const usuario = getUsuario();
    if (papelNecessario && usuario?.papel !== papelNecessario) {
      setEstado("negado");
      return;
    }

    setEstado("liberado");
  }, [papelNecessario, router]);

  if (estado === "verificando") {
    return (
      <div style={estilos.centro}>
        <p style={estilos.texto}>Verificando acesso...</p>
      </div>
    );
  }

  if (estado === "negado") {
    return (
      <div style={estilos.centro}>
        <div style={estilos.cardNegado}>
          <h2 style={estilos.titulo}>Acesso negado</h2>
          <p style={estilos.texto}>
            Voce nao tem permissao para acessar esta area. Esta pagina exige o papel{" "}
            <strong>{papelNecessario}</strong>.
          </p>
          <button style={estilos.botao} onClick={() => router.replace("/login")}>
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return children;
}

const estilos = {
  centro: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F3F4F6",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  cardNegado: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "420px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  titulo: { color: "#DC2626", fontSize: "1.5rem", margin: "0 0 12px 0" },
  texto: { color: "#6B7280", margin: 0 },
  botao: {
    marginTop: "24px",
    background: "#0057B8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};