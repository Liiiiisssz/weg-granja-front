"use client"
import { useState } from "react";

const API_URL = "https://weg-granja-api.onrender.com";

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

  // Cor da iluminação da cabine de comida baseada no estado físico da máquina
  const getChamberLight = () => {
    if (loading) return "rgba(245, 158, 11, 0.15)"; // Luz âmbar processando
    if (trayPhase === "in" || trayPhase === "hold") return "rgba(16, 185, 129, 0.2)"; // Luz verde: liberado!
    if (msg && msg.type === "err") return "rgba(239, 68, 68, 0.15)"; // Luz vermelha: erro
    return "rgba(254, 243, 199, 0.6)"; // Luz amarela quentinha de estufa em espera
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#e2e8f0",
      backgroundImage: "linear-gradient(to bottom, #f1f5f9, #cbd5e1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <style>{`
        @keyframes physicalDrop {
          0% { transform: translateY(-80px) scale(0.9); opacity: 0; }
          60% { transform: translateY(5px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes physicalLift {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(40px); }
        }
        .tray-in { animation: physicalDrop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .tray-out { animation: physicalLift 0.4s ease-in forwards; }
        
        input:focus {
          border-color: #0057B8 !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(0, 87, 184, 0.15) !important;
        }
        .action-btn:hover:not(:disabled) {
          background: #004b9e !important;
          box-shadow: 0 4px 12px rgba(0, 87, 184, 0.3) !important;
        }
        .action-btn:active:not(:disabled) {
          transform: scale(0.99);
        }
      `}</style>

      {/* Corpo Físico do Dispenser (Simula eletrodoméstico/totem industrial integrado) */}
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "32px",
        width: "950px",
        maxWidth: "95vw",
        boxSizing: "border-box",
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
      }}>
        
        {/* Painel Frontal Superior */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Logo Simples WEG */}
            <div style={{ background: "#0057B8", width: "12px", height: "24px", borderRadius: "3px" }} />
            <h1 style={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
              WEG <span style={{ color: "#0057B8", fontWeight: "600" }}>Granja</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%", 
              background: loading ? "#f59e0b" : "#10b981", display: "inline-block"
            }} />
            <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>
              {loading ? "Dispensando..." : "Pronto para Uso"}
            </span>
          </div>
        </div>

        {/* Corpo da Máquina - Divisão Dupla */}
        <div style={{ display: "flex", gap: "32px", alignItems: "stretch" }}>

          {/* Janela de Visualização do Menu (Esquerda) */}
          <div style={{ width: "420px", position: "relative", flexShrink: 0 }}>
            <img
              src="/frangos.png"
              alt="Frango Pronto"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "380px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              padding: "16px",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
              color: "#ffffff"
            }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", opacity: 0.9, textTransform: "uppercase" }}>Refeição Atual</span>
              <p style={{ margin: "2px 0 0 0", fontSize: "1.1rem", fontWeight: "600" }}>Porção de Proteína Padrão</p>
            </div>
          </div>

          {/* Painel de Controle e Compartimento de Saída (Direita) */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "24px"
          }}>
            
            {/* Bloco de Comando Interativo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{
                  display: "block",
                  color: "#475569",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  marginBottom: "6px",
                  textTransform: "uppercase"
                }}>
                  Insira sua Matrícula
                </label>
                <input
                  type="text"
                  value={matricula}
                  onChange={e => setMatricula(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && dispensar()}
                  placeholder="Digite aqui para validar..."
                  style={{
                    width: "100%",
                    background: "#f8fafc",
                    border: "2px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    color: "#0f172a",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    boxSizing: "border-box",
                    transition: "all 0.15s ease",
                    textAlign: "center"
                  }}
                />
              </div>

              <button
                onClick={dispensar}
                disabled={!isReady}
                className="action-btn"
                style={{
                  background: isReady ? "#0057B8" : "#94a3b8",
                  color: "#ffffff",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  padding: "16px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: isReady ? "pointer" : "not-allowed",
                  width: "100%",
                  transition: "all 0.15s ease",
                }}
              >
                {loading ? "VALIDANDO ACESSO..." : "SOLICITAR REFEIÇÃO"}
              </button>
            </div>

            {/* Tela de Informações / Status da Liberação */}
            <div style={{
              background: msg ? (msg.type === "ok" ? "#f0fdf4" : "#fef2f2") : "#f8fafc",
              border: msg ? (msg.type === "ok" ? "1px solid #bbf7d0" : "1px solid #fecaca") : "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px 16px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              boxSizing: "border-box"
            }}>
              {msg ? (
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: msg.type === "ok" ? "#166534" : "#991b1b", fontSize: "0.9rem", fontWeight: "600" }}>
                    {msg.type === "ok" ? "✓ Liberação Concluída" : `✗ ${msg.text}`}
                  </span>
                  {msg.data && (
                    <span style={{ fontSize: "0.75rem", background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                      Refeições Disp.: {msg.data.porcoesRestantes}/{msg.data.limiteTotal}
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: "500" }}>Aguardando identificação no painel...</span>
              )}
            </div>

            {/* NICHO FÍSICO DO DISPENSER (Simula a gaveta/abertura da máquina real) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Compartimento de Retirada</span>
              <div style={{
                background: "#f1f5f9",
                height: "160px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "2px solid #cbd5e1",
                // Profundidade interna realista (Box-shadow Inset)
                boxShadow: "inset 0 6px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.02)",
                position: "relative",
              }}>
                
                {/* Iluminação Interna da Cabine */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle, ${getChamberLight()} 0%, transparent 80%)`,
                  transition: "background 0.3s ease",
                  pointerEvents: "none",
                  zIndex: 1
                }} />

                {/* Base interna de inox/plástico onde o prato repousa */}
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0, height: "16px",
                  background: "linear-gradient(to top, #e2e8f0, #cbd5e1)",
                  borderTop: "1px solid #bbf7d0",
                  zIndex: 1
                }} />

                {trayPhase !== "idle" ? (
                  <img
                    src="/frango.png"
                    alt="Porção liberada"
                    className={trayPhase === "out" ? "tray-out" : "tray-in"}
                    onError={e => { e.currentTarget.src = "/frango.jfif"; }}
                    style={{
                      maxHeight: "110px",
                      width: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.15))",
                      zIndex: 2,
                    }}
                  />
                ) : (
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.5px", zIndex: 2 }}>
                    Aguardando queda do prato...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}