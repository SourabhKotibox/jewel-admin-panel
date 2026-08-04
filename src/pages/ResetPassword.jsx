import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import SeoHead from "../components/SeoHead";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const res = await api("/auth/user/reset-password", {
        method: "POST",
        body: { email, token, password },
        portal: "user",
      });
      setMsg(res.message || "Password updated.");
    } catch (ex) {
      setErr(ex.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory py-16 md:py-24">
      <SeoHead title="Reset Password" />
      <div className="container-luxe max-w-md mx-auto">
        <p className="eyebrow mb-2">Account</p>
        <h1 className="heading-display text-3xl text-noir mb-6">Reset password</h1>
        <form onSubmit={onSubmit} className="bg-white border border-champagne/20 p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">Email</label>
            <input
              type="email"
              required
              className="w-full border border-champagne/25 px-4 py-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">Reset token</label>
            <input
              required
              className="w-full border border-champagne/25 px-4 py-3 text-sm font-mono text-xs"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">New password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border border-champagne/25 px-4 py-3 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {err && <p className="text-sm text-rose-600">{err}</p>}
          {msg && <p className="text-sm text-champagne-dark">{msg}</p>}
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </button>
          <p className="text-center text-sm">
            <Link to="/account" className="link-underline text-champagne-dark">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
