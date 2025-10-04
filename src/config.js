// src/api.js
import API_BASE_URL from "./config";

const tokenKey = "seri_token";

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

async function checkResponse(res) {
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function signup(payload) {
  // payload: { name, email, password, phone, village, language }
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
  return checkResponse(res); // expected { token, user }
}

export async function uploadImage(file) {
  // file: File object from <input type="file">
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      ...authHeader()
      // DO NOT set 'Content-Type' when sending FormData — browser sets it
    },
    body: fd,
  });
  return checkResponse(res); // expected { label, confidence, filename, ... }
}

export async function getUploads() {
  const res = await fetch(`${API_BASE_URL}/uploads`, {
    headers: { ...authHeader() },
  });
  return checkResponse(res); // expected array of uploads
}

export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: { ...authHeader() },
  });
  return checkResponse(res);
}
