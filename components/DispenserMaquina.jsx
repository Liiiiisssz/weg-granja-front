"use client"
import { useState } from "react";

const API_URL = "http://localhost:8080";

export default function DispenserMaquina() {
  const [matricula, setMatricula] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [trayPhase, setTrayPhase] = useState("idle"); // idle | in | hold | out
  const [, setCounter] = useState(null);
  const [, setAuthenticated] = useState(false);

  const dispensar = async () => {
    if (!matricula.trim() || loading) return;
    setLoading(true);
    setMsg(null);
    setAuthenticated(false);

    try {
      const res = await fetch(
        `${API_URL}/dispenser/dispensar/${matricula.trim()}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (res.ok) {
        setAuthenticated(true);
        setMsg({ type: "ok", text: data.mensagem, nome: data.colaboradorNome, data });
        setCounter({ usadas: data.porcoesUtilizadas, total: data.limiteTotal });

        setTrayPhase("in");
        setTimeout(() => setTrayPhase("hold"), 600);
        setTimeout(() => setTrayPhase("out"), 3200);
        setTimeout(() => { setTrayPhase("idle"); setAuthenticated(false); }, 4200);
      } else {
        setMsg({ type: "err", text: data.mensagem });
      }
    } catch {
      setMsg({ type: "err", text: "Servidor offline. Verifique se a API está rodando." });
    } finally {
      setLoading(false);
    }
  };

  const isReady = matricula.trim().length > 0 && !loading;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "monospace",
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .tray-in  { animation: slideUp  0.5s ease forwards; }
        .tray-out { animation: fadeOut  0.8s ease forwards; }
        input:focus { outline: none; }
        button:hover:not(:disabled) { background: #0068d6 !important; filter: brightness(1.1); }
        button { transition: filter 0.15s ease, transform 0.1s ease; }
        button:active:not(:disabled) { transform: scale(0.98); }
      `}</style>

      <div style={{
        background: "#2a2a2a",
        borderRadius: "16px",
        padding: "40px",
        width: "900px",
        maxWidth: "95vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "monospace",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "28px",
          letterSpacing: "3px",
          borderLeft: "5px solid #0057B8",
          paddingLeft: "16px",
          lineHeight: 1.2,
        }}>
          WEG Granja
        </h1>

        <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start" }}>

          {/* Left: large chicken image */}
          <img
            src="/frango.jfif"
            alt="Frango na grelha"
            style={{
              width: "480px",
              height: "420px",
              objectFit: "cover",
              borderRadius: "12px",
              flexShrink: 0,
              display: "block",
            }}
          />

          {/* Right: controls */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>

            {/* Matrícula input */}
            <div>
              <label style={{
                display: "block",
                color: "#aaa",
                fontSize: "13px",
                marginBottom: "6px",
                fontFamily: "monospace",
                letterSpacing: "1px",
              }}>
                Matrícula
              </label>
              <input
                type="text"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                onKeyDown={e => e.key === "Enter" && dispensar()}
                placeholder="Digite sua matrícula..."
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "monospace",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* DISPENSAR button */}
            <button
              onClick={dispensar}
              disabled={!isReady}
              style={{
                background: isReady ? "#0057B8" : "#444",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                padding: "18px",
                borderRadius: "8px",
                border: "none",
                cursor: isReady ? "pointer" : "not-allowed",
                width: "100%",
                fontFamily: "monospace",
              }}
            >
              {loading ? "PROCESSANDO..." : "DISPENSAR"}
            </button>

            {/* Status message */}
            <div style={{ minHeight: "20px" }}>
              {msg && (
                <span style={{
                  color: msg.type === "ok" ? "#22cc44" : "#cc2222",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  lineHeight: 1.5,
                }}>
                  {msg.type === "ok" ? "✓ " : "✗ "}
                  {msg.text}
                  {msg.data && (
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      {" — "}{msg.data.porcoesRestantes} de {msg.data.limiteTotal} restantes
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Black box / output tray */}
            <div style={{
              background: "#000",
              height: "160px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              {trayPhase !== "idle" && (
                <img
                  src="/frango-tray.png"
                  alt="Porção dispensada"
                  className={trayPhase === "out" ? "tray-out" : "tray-in"}
                  onError={e => { e.currentTarget.src = "/frango.jfif"; }}
                  style={{
                    maxHeight: "140px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
