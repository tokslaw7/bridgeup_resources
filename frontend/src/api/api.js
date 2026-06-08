// Thin API client for the BridgeUp backend. Uses the Vite dev proxy (/api -> :4000).

const BASE = '/api';
const TOKEN_KEY = 'bridgeup_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/** Build headers, attaching the bearer token when present. */
function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

async function handle(res) {
  if (res.status === 401) {
    // Token missing/expired — clear it so the UI can react.
    setToken(null);
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.errors?.join(', ') || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// ---- Auth ----
export function signup(payload) {
  return fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function login(payload) {
  return fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function fetchMe() {
  return fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then(handle);
}
