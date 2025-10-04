export const API_BASE_URL = process.env.REACT_APP_API_URL || "https://silkworm-backend.onrender.com";

// Also add ML service URL
export const ML_API_URL = process.env.REACT_APP_ML_URL || "https://silkworm-ml.onrender.com";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://silkworm-backend.onrender.com";

const tokenKey = "seri_token";

// --- TOKEN HELPERS ---
export function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
}

function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// --- UTILITY ---
async function checkResponse(res) {
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// --- AUTH ---
export async function signup(payload) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return checkResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(res);
}

// --- UPLOAD IMAGE ---
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: authHeader(), // include token
    body: fd,
  });

  return checkResponse(res);
}

// --- GET UPLOAD HISTORY ---
export async function getHistory() {
  const res = await fetch(`${API_BASE_URL}/upload/history`, {
    headers: authHeader(),
  });
  return checkResponse(res);
}
