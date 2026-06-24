"use client";

const API_URL = "https://weg-granja-api.onrender.com";
const TOKEN_KEY = "weg_token";
const USER_KEY = "weg_user";

export { API_URL };

export function salvarSessao({ token, nome, email, papel }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ nome, email, papel }));
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function estaLogado() {
  return !!getToken();
}

export function temPapel(papel) {
  const u = getUsuario();
  return u && u.papel === papel;
}

export async function fazerLogin(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    let msg = "Email ou senha invalidos";
    try {
      const erro = await res.json();
      msg = erro.mensagem || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const dados = await res.json();
  salvarSessao(dados);
  return dados;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") window.location.href = "/login";
  }

  return res;
}