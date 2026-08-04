import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { adminLogin, clearAuthError } from "../../store/redux/slices/authSlice";
import { PrimaryButton, fieldClass, labelClass, AdminCard } from "../components/AdminUI";
import { resolveLogo } from "../../store/useSettingsStore";
import useSettingsStore from "../../store/useSettingsStore";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, loading, error } = useSelector((s) => s.auth);
  const business = useSettingsStore((s) => s.business) || {};
  const [email, setEmail] = useState("admin@madhujewellery.com");
  const [password, setPassword] = useState("admin123");

  if (token && user && ["admin", "superadmin", "manager", "sales", "editor"].includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(adminLogin({ email, password }));
    if (adminLogin.fulfilled.match(result)) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex bg-white rounded-2xl px-4 py-3 border border-champagne/20 shadow-sm mb-4">
            <img src={resolveLogo(business.adminLogo)} alt="Logo" className="h-14 w-auto object-contain" />
          </div>
          <p className="eyebrow mb-2">Staff portal</p>
          <h1 className="font-display text-3xl text-noir">Admin Login</h1>
          <p className="text-sm text-noir/50 mt-1">Separate JWT access for Madhu administrators</p>
        </div>

        <AdminCard>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                autoComplete="username"
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </PrimaryButton>
            <p className="text-[11px] text-noir/40 text-center">
              Seed: admin@madhujewellery.com / admin123
            </p>
          </form>
        </AdminCard>

        <p className="text-center text-xs text-noir/40 space-x-3">
          <Link to="/" className="hover:text-champagne-dark">← Storefront</Link>
          <span>·</span>
          <Link to="/account" className="hover:text-champagne-dark">Customer login</Link>
        </p>
      </div>
    </div>
  );
}
