// ---------- Config ----------
export const API_BASE = "http://localhost:7000/backend/api/v1/photo";
export const AUTH_BASE = "http://localhost:7000/backend/api/v1/auth";

// e.g., "http://localhost:7000"
const BACKEND_ORIGIN = new URL(API_BASE).origin;

// ---------- URL helper ----------
export function absolutize(u) {
  if (!u) return u;
  return /^https?:\/\//i.test(u) ? u : `${BACKEND_ORIGIN}${u}`;
}

// ---------- Token helpers ----------
export const TOKEN_KEY = "token";              // access token (RAW, no "Bearer ")
export const REFRESH_TOKEN_KEY = "refresh_token";

export function setToken(token) {
  if (typeof token !== "string") return;
  let t = token.trim();
  if (t.startsWith("Bearer ")) t = t.slice(7).trim();  // store raw
  if (t) localStorage.setItem(TOKEN_KEY, t);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setRefreshToken(rt) {
  if (typeof rt !== "string") return;
  const val = rt.trim();
  if (val) localStorage.setItem(REFRESH_TOKEN_KEY, val);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}
export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ---------- Common response handler ----------
async function handle(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    const msg = json?.message || json?.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  // Unwrap common envelope: { statusCode, success, message, data }
  return json?.data ?? json;
}

// ---------- Auth ----------
export async function customerLogin({ email, password }) {
  const res = await fetch(`${AUTH_BASE}/customer-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // With your response, this returns: { accessToken, refreshToken }
  const payload = await handle(res);

  const accessToken = payload?.accessToken;
  const refreshToken = payload?.refreshToken;

  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Login succeeded but accessToken missing in response");
  }

  setToken(accessToken);            // RAW token (no "Bearer ")
  if (typeof refreshToken === "string") setRefreshToken(refreshToken);

  return {
    token: getToken(),
    refreshToken: getRefreshToken(),
  };
}

export function logout() {
  clearToken();
  clearRefreshToken();
}

// ---------- Photo / Try-On ----------
export async function tryOn({ customer, garment, prompt, removeBgFirst, notes }) {
  const form = new FormData();
  form.append("customer", customer);
  form.append("garment", garment);
  if (prompt) form.append("prompt", prompt); // backend requires a prompt
  form.append("notes", notes || "");
  form.append("remove_bg_first", removeBgFirst ? "true" : "false");

  const token = getToken(); // RAW token
  if (!token) throw new Error("Please log in first");

  // IMPORTANT: send RAW token (NO "Bearer ")
  const res = await fetch(`${API_BASE}/tryon`, {
    method: "POST",
    headers: { Authorization: token },
    body: form, // don't set Content-Type with FormData
  });

  return handle(res);
}

/** Optional: prompt suggester (unauthenticated) */
export async function ollamaPrompt({ notes, product }) {
  const form = new FormData();
  form.append("notes", notes || "");
  form.append("product", product || "garment");
  const res = await fetch(`${API_BASE}/text_prompt`, { method: "POST", body: form });
  return handle(res); // -> { prompt, warning }
}
