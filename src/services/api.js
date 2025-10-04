// src/services/api.js
const API_BASE_URL = "https://silkworm-backend.onrender.com/";

// --- AUTH ---
export async function signup(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json(); // contains token
}

// --- UPLOAD IMAGE ---
export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return res.json();
}

// --- GET UPLOAD HISTORY ---
export async function getHistory(token) {
  const res = await fetch(`${API_BASE_URL}/upload/history`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
