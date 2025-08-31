import React, { useState, useEffect } from "react";
import { tryOn, ollamaPrompt, absolutize, customerLogin, getToken, logout } from "./api";

function LoginView({ onLoggedIn, defaultEmail = "sazusalim@gmail.com", defaultPassword = "123456" }) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await customerLogin({ email, password });
      onLoggedIn();
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(120deg,#ffe3e3,#eef5ff)" }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: 380,
          padding: 24,
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Login</h2>
        <p style={{ marginTop: 0, color: "#666", fontSize: 13 }}>You must login before generating images.</p>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          required
        />
        <button
          disabled={loading}
          style={{
            marginTop: 6,
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: "#1a73e8",
            color: "white",
            fontWeight: 600,
          }}
        >
          {loading ? "Signing in…" : "Login"}
        </button>
        {error && <div style={{ color: "crimson", fontSize: 13 }}>{error}</div>}
        <div style={{ marginTop: 4, fontSize: 12, color: "#666" }}>
          Endpoint: <code>/backend/api/v1/auth/customer-login</code>
        </div>
      </form>
    </div>
  );
}

function Preview({ file, label }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!file) return setSrc(null);
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <strong>{label}</strong>
      <div
        style={{
          width: 280,
          height: 320,
          border: "1px solid #eee",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        {src ? (
          <img src={src} alt={label} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        ) : (
          <span style={{ color: "#888" }}>No image</span>
        )}
      </div>
    </div>
  );
}

function TryOnView() {
  const [customer, setCustomer] = useState(null);
  const [garment, setGarment] = useState(null);


  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [useOllama, setUseOllama] = useState(true);
  const [notes, setNotes] = useState("studio lighting, clean background, ecommerce look");
  const [removeBg, setRemoveBg] = useState(true);
  const [error, setError] = useState("");
  const [usedPrompt, setUsedPrompt] = useState("");

  const handleSuggest = async () => {
    if (!useOllama) return;
    try {
      const data = await ollamaPrompt({ notes, product: "tshirt" });
      if (data?.prompt) setPrompt(data.prompt);
    } catch {
      // ignore
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultUrl("");
    setUsedPrompt("");

    if (!customer || !garment) {
      setError("Please select both Customer & Product images.");
      return;
    }
    if (!prompt.trim()) {
      setError("Prompt is required (no auto-prompting).");
      return;
    }

    setLoading(true);
    try {
      const data = await tryOn({
        customer,
        garment,
        prompt: prompt.trim(),
        removeBgFirst: removeBg,
        notes,
      });
      if (data?.result_url) setResultUrl(absolutize(data.result_url));
      setUsedPrompt(data?.used_prompt || prompt.trim());
      if (!data?.result_url) setError(data?.error || "Unknown error");
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(120deg,#ffe3e3,#eef5ff)", padding: 24 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0, marginRight: "auto" }}>AI Try-On</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          
        </div>
        <button
          onClick={logout}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
        >
          Logout
        </button>
      </header>

      <p style={{ marginTop: 0, color: "#444" }}>
        Left: Customer photo → Right: AI result. Prompt generator optional; Replicate does image try-on.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
        {/* Left column */}
        <div>
          <Preview file={customer} label="Customer Photo" />
          <input type="file" accept="image/*" onChange={(e) => setCustomer(e.target.files?.[0] || null)} style={{ marginTop: 8 }} />
        </div>

        {/* Middle column */}
        <div>
          <Preview file={garment} label="Product / Garment" />
          <input type="file" accept="image/*" onChange={(e) => setGarment(e.target.files?.[0] || null)} style={{ marginTop: 8 }} />

          <div style={{ marginTop: 12 }}>
            <label>
              <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} /> Remove garment background (rembg)
            </label>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={useOllama} onChange={(e) => setUseOllama(e.target.checked)} />
              Use prompt suggester
            </label>
            <textarea
              rows="3"
              placeholder="Notes (e.g., studio lighting, catalog look)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="Manual prompt (required)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                required
              />
              <button
                type="button"
                onClick={handleSuggest}
                disabled={!useOllama}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
              >
                Suggest
              </button>
            </div>
          </div>

          <button disabled={loading} style={{ marginTop: 12, padding: "10px 16px", borderRadius: 12, border: "none", background: "#1a73e8", color: "white", fontWeight: 600 }}>
            {loading ? "Generating…" : "Generate Try-On"}
          </button>
          {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
          {usedPrompt && (
            <div style={{ color: "#333", marginTop: 8, fontSize: 12 }}>
              <b>Used prompt:</b> {usedPrompt}
            </div>
          )}
        </div>

        {/* Right column */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <strong>AI Result</strong>
            <div
              style={{
                width: 280,
                height: 320,
                border: "1px solid #eee",
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
              }}
            >
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="AI try-on result"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  onError={() => setError("Could not load result image")}
                />
              ) : (
                <span style={{ color: "#888" }}>{loading ? "Working…" : "No result yet"}</span>
              )}
            </div>
            {resultUrl && (
              <a href={resultUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                Open full size
              </a>
            )}
          </div>
        </div>
      </form>

      <footer style={{ marginTop: 24, fontSize: 12, color: "#666" }}>
        Backend: <code>POST /backend/api/v1/photo/tryon</code> • Login: <code>POST /backend/api/v1/auth/customer-login</code>
      </footer>
    </div>
  );
}

export default function App() {
  const [token, setTokenState] = useState(getToken());
  const isLoggedIn = !!token;

  // reflect storage changes (in case of multi-tab)
  useEffect(() => {
    const onStorage = () => setTokenState(getToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!isLoggedIn) {
    return <LoginView onLoggedIn={() => setTokenState(getToken())} />;
  }

  return <TryOnView />;
}
