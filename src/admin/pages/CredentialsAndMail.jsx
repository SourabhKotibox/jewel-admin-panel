import { useState } from "react";
import { Save, Shield, Mail, KeyRound, User } from "lucide-react";
import useSettingsStore from "../../store/useSettingsStore";
import { api } from "../../api/client";
import notify from "../../utils/toast";
import {
  AdminCard,
  PrimaryButton,
  fieldClass,
  labelClass,
} from "../components/AdminUI";

export function Credentials() {
  const credentials = useSettingsStore((s) => s.credentials);
  const updateCredentials = useSettingsStore((s) => s.updateCredentials);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (credentials.newPassword && credentials.newPassword !== credentials.confirmPassword) {
      setError("New password and confirm password do not match.");
      notify.error("Passwords do not match");
      return;
    }
    if (credentials.newPassword && credentials.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      notify.error("Password must be at least 8 characters");
      return;
    }
    try {
      const body = { name: credentials.name, phone: credentials.phone || "" };
      if (credentials.newPassword) body.password = credentials.newPassword;
      const res = await api("/auth/admin/profile", {
        method: "PUT",
        body,
        portal: "admin",
      });
      if (res.user) {
        updateCredentials({
          name: res.user.name || credentials.name,
          email: res.user.email || credentials.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        updateCredentials({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
      notify.success("Profile updated");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setError(err.message || "Update failed");
      notify.error(err.message || "Update failed");
    }
  };

  return (
    <form onSubmit={save} className="animate-fade-up space-y-6 max-w-2xl">
      <div>
        <p className="eyebrow mb-1">Security</p>
        <p className="text-sm text-noir/55">Update admin profile and login credentials.</p>
      </div>

      <AdminCard title="Profile" subtitle="Displayed in the admin header">
        <div className="p-5 grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-champagne-dark" />
              <input
                className={`${fieldClass} !pl-10`}
                value={credentials.name}
                onChange={(e) => updateCredentials({ name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Login Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-champagne-dark" />
              <input
                type="email"
                className={`${fieldClass} !pl-10`}
                value={credentials.email}
                onChange={(e) => updateCredentials({ email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <input className={`${fieldClass} opacity-70`} value={credentials.role} readOnly />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Change Password" subtitle="Leave blank to keep current password">
        <div className="p-5 grid grid-cols-1 gap-5">
          {[
            ["currentPassword", "Current Password"],
            ["newPassword", "New Password"],
            ["confirmPassword", "Confirm New Password"],
          ].map(([key, lab]) => (
            <div key={key}>
              <label className={labelClass}>{lab}</label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-champagne-dark" />
                <input
                  type="password"
                  className={`${fieldClass} !pl-10`}
                  value={credentials[key]}
                  onChange={(e) => updateCredentials({ [key]: e.target.value })}
                  autoComplete="new-password"
                />
              </div>
            </div>
          ))}
          {error && (
            <p className="text-sm text-rose-600 flex items-center gap-2">
              <Shield size={14} /> {error}
            </p>
          )}
        </div>
      </AdminCard>

      <PrimaryButton type="submit">
        <Save size={14} />
        {saved ? "Credentials Updated" : "Update Credentials"}
      </PrimaryButton>
    </form>
  );
}

export function MailSettings() {
  const mail = useSettingsStore((s) => s.mail);
  const updateMail = useSettingsStore((s) => s.updateMail);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/settings/bulk", {
        method: "PUT",
        body: { mail },
        portal: "admin",
      });
      notify.success("Mail settings saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      const m = err.message || "Could not save to server — kept locally";
      setError(m);
      notify.error(m);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <form onSubmit={save} className="animate-fade-up space-y-6 max-w-3xl">
      <div>
        <p className="eyebrow mb-1">Communications</p>
        <p className="text-sm text-noir/55">SMTP configuration and automated email triggers.</p>
      </div>

      <AdminCard title="SMTP / Mail Driver">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Driver</label>
            <select
              className={fieldClass}
              value={mail.driver}
              onChange={(e) => updateMail({ driver: e.target.value })}
            >
              <option value="smtp">SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
              <option value="ses">Amazon SES</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Encryption</label>
            <select
              className={fieldClass}
              value={mail.encryption}
              onChange={(e) => updateMail({ encryption: e.target.value })}
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
          {[
            ["host", "Host"],
            ["port", "Port"],
            ["username", "Username"],
            ["password", "Password"],
            ["fromName", "From Name"],
            ["fromEmail", "From Email"],
            ["replyTo", "Reply-To"],
            ["adminAlertEmail", "Admin Alert Email"],
          ].map(([key, lab]) => (
            <div key={key}>
              <label className={labelClass}>{lab}</label>
              <input
                type={key === "password" ? "password" : "text"}
                className={fieldClass}
                value={mail[key]}
                onChange={(e) => updateMail({ [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Email Triggers" subtitle="Which events send mail to customers / admin">
        <div className="p-5 space-y-1">
          {[
            ["orderPlaced", "Order placed confirmation"],
            ["orderShipped", "Order shipped notification"],
            ["orderDelivered", "Order delivered notification"],
            ["welcomeEmail", "Welcome email on signup"],
            ["newsletter", "Newsletter campaigns"],
            ["lowStockAlert", "Low stock alert to admin"],
          ].map(([key, lab]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 py-3 border-b border-champagne/10 text-sm last:border-0"
            >
              <span>{lab}</span>
              <button
                type="button"
                onClick={() => updateMail({ [key]: !mail[key] })}
                className={`w-12 h-7 rounded-full transition-colors relative ${mail[key] ? "bg-champagne" : "bg-stone-200"}`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${mail[key] ? "left-5" : "left-0.5"}`}
                />
              </button>
            </label>
          ))}
        </div>
      </AdminCard>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <p className="text-xs text-noir/45">
        Without SMTP host/username/password, order emails are skipped (logged on server). Configure
        Gmail SMTP or any provider, then save.
      </p>
      <PrimaryButton type="submit">
        <Save size={14} />
        {saved ? "Mail Settings Saved" : "Save Mail Settings"}
      </PrimaryButton>
    </form>
  );
}
