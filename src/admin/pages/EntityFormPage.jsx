import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import { entityConfigs } from "../data/entityConfigs.jsx";
import useCrudStore from "../store/useCrudStore";
import { api } from "../../api/client";
import notify from "../../utils/toast";
import {
  AdminCard,
  PrimaryButton,
  OutlineButton,
  fieldClass,
  labelClass,
} from "../components/AdminUI";
import ImageFieldInput from "../components/ImageFieldInput";
import RichTextEditor from "../components/RichTextEditor";

function buildEmpty(fields) {
  return fields.reduce((acc, f) => {
    if (f.type === "checkbox") {
      acc[f.key] = false;
    } else if (f.type === "number") {
      acc[f.key] = 0;
    } else if (f.options && f.options.length) {
      acc[f.key] = f.options[0];
    } else {
      acc[f.key] = "";
    }
    return acc;
  }, {});
}

function formFromRecord(fields, empty, existing) {
  if (!existing) return { ...empty };
  const next = { ...empty };
  fields.forEach((f) => {
    next[f.key] = existing[f.key] ?? empty[f.key];
  });
  return next;
}

export default function EntityFormPage({ entityKey: entityKeyProp }) {
  const { id, entityKey: entityKeyParam } = useParams();
  const entityKey = entityKeyProp || entityKeyParam;
  const navigate = useNavigate();
  const cfg = entityConfigs[entityKey];

  const getById = useCrudStore((s) => s.getById);
  const upsert = useCrudStore((s) => s.upsert);
  const fetchEntity = useCrudStore((s) => s.fetchEntity);

  const isNew = !id || id === "new";
  const existing = !isNew ? getById(entityKey, id) : null;

  const empty = useMemo(() => buildEmpty(cfg?.fields || []), [cfg]);
  const [form, setForm] = useState(() =>
    formFromRecord(cfg?.fields || [], empty, existing)
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(isNew || !!existing);
  const [dynamicOptions, setDynamicOptions] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!entityKey) return;
      await fetchEntity(entityKey);
      if (cancelled) return;
      if (!isNew) {
        const row = useCrudStore.getState().getById(entityKey, id);
        setForm(formFromRecord(cfg?.fields || [], empty, row));
        setReady(true);
      } else {
        setForm(formFromRecord(cfg?.fields || [], empty, null));
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [entityKey, id, isNew, fetchEntity, cfg, empty]);

  useEffect(() => {
    let cancelled = false;
    const fieldsWithApi = (cfg?.fields || []).filter((f) => f.optionsApi);
    if (!fieldsWithApi.length) return;

    (async () => {
      const results = await Promise.all(
        fieldsWithApi.map(async (f) => {
          try {
            const data = await api(f.optionsApi, { portal: "admin" });
            const items = Array.isArray(data) ? data : [];
            const mapped = items.map((item) => ({
              value: f.optionsValue
                ? String(item[f.optionsValue])
                : String(item.slug || item.code || item.id || item._id || ""),
              label: f.optionsLabel
                ? String(item[f.optionsLabel])
                : String(item.name || item.title || item.label || item.code || ""),
            })).filter((o) => o.value && o.label);
            return [f.key, mapped];
          } catch {
            return [f.key, []];
          }
        })
      );
      if (!cancelled) {
        setDynamicOptions(Object.fromEntries(results));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cfg]);

  if (!cfg) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-noir mb-4">Unknown entity</p>
        <Link to="/admin" className="text-champagne-dark underline text-sm">
          Back to admin
        </Link>
      </div>
    );
  }

  const listPath = cfg.listPath || cfg.basePath;

  if (ready && !isNew && !getById(entityKey, id)) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-noir mb-4">{cfg.singular} not found</p>
        <Link to={listPath} className="text-champagne-dark underline text-sm">
          Back to {cfg.title}
        </Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSendMsg("");
    try {
      await upsert(entityKey, isNew ? "new" : id, form);
      setSaved(true);
      notify.success(isNew ? `${cfg.singular} created` : `${cfg.singular} saved`);
      setTimeout(() => navigate(listPath), 500);
    } catch (err) {
      setError(err.message || "Save failed");
      notify.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const sendCampaign = async () => {
    if (isNew || entityKey !== "campaigns") return;
    setSending(true);
    setError("");
    setSendMsg("");
    try {
      // Persist latest edits first
      await upsert(entityKey, id, form);
      const res = await api(`/campaigns/${id}/send`, {
        method: "POST",
        portal: "admin",
      });
      if (res.campaign) {
        setForm((f) => ({
          ...f,
          status: res.campaign.status,
          sent: res.campaign.sent,
          openRate: res.campaign.openRate,
          date: res.campaign.date,
        }));
        await fetchEntity(entityKey);
      }
      setSendMsg(res.message || "Campaign sent");
      notify.success(res.message || "Campaign sent");
    } catch (err) {
      setError(err.message || "Send failed");
      notify.error(err.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-3xl w-full min-w-0 space-y-4 sm:space-y-6 px-0">
      <button
        type="button"
        onClick={() => navigate(listPath)}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-noir/50 hover:text-champagne-dark"
      >
        <ArrowLeft size={14} />
        Back to {cfg.title}
      </button>

      <div className="min-w-0">
        <p className="eyebrow mb-1">{isNew ? "Create" : "Edit"}</p>
        <h2 className="font-display text-2xl sm:text-3xl text-noir break-words">
          {isNew ? `New ${cfg.singular}` : `Edit ${cfg.singular}`}
        </h2>
        {!isNew && <p className="text-xs text-noir/40 mt-1 font-mono break-all">ID: {id}</p>}
      </div>

      <form onSubmit={submit} className="min-w-0">
        <AdminCard className="min-w-0">
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {(cfg.fields || []).map((f) =>
              f.type === "image" ? (
                <ImageFieldInput
                  key={f.key}
                  label={f.label}
                  fieldKey={f.key}
                  value={form[f.key] ?? ""}
                  onChange={(v) => setForm({ ...form, [f.key]: v })}
                  used={`admin-${entityKey}`}
                  entityKey={entityKey}
                />
              ) : f.type === "richtext" ? (
                <RichTextEditor
                  key={f.key}
                  label={f.label}
                  value={form[f.key] ?? ""}
                  onChange={(v) => setForm({ ...form, [f.key]: v })}
                />
              ) : (
              <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                <label className={labelClass}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    required={f.required}
                    rows={f.rows || 4}
                    className={fieldClass}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                 ) : f.type === "select" ? (
                   <select
                     className={fieldClass}
                     value={form[f.key] ?? ""}
                     onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                   >
                     {(dynamicOptions[f.key] || f.options || []).map((o) => {
                       const val = typeof o === "object" ? o.value : o;
                       const lbl = typeof o === "object" ? o.label : o;
                       return (
                         <option key={val} value={val}>
                           {lbl}
                         </option>
                       );
                     })}
                   </select>
                 ) : f.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                      className="accent-champagne w-4 h-4"
                    />
                    {f.checkLabel || "Enabled"}
                  </label>
                ) : f.type === "file" ? (
                  <input
                    type="file"
                    accept={f.accept || "image/*"}
                    className={fieldClass}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.files?.[0] || null })}
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    required={f.required && !(f.key === "password" && !isNew)}
                    className={fieldClass}
                    value={form[f.key] ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                )}
              </div>
              )
            )}
          </div>
        </AdminCard>

        {error && <p className="text-sm text-rose-600 mt-3 break-words">{error}</p>}
        {sendMsg && <p className="text-sm text-emerald-700 mt-3 break-words">{sendMsg}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <PrimaryButton type="submit" disabled={saving || sending} className="w-full sm:w-auto !justify-center">
            <Save size={14} />
            {saved ? "Saved" : saving ? "Saving…" : isNew ? `Create ${cfg.singular}` : "Save Changes"}
          </PrimaryButton>
          {entityKey === "campaigns" && !isNew ? (
            <PrimaryButton
              type="button"
              disabled={saving || sending || form.status === "Sent"}
              onClick={sendCampaign}
              className="w-full sm:w-auto !justify-center !bg-noir"
            >
              <Send size={14} />
              {sending ? "Sending…" : form.status === "Sent" ? "Already sent" : "Send Campaign"}
            </PrimaryButton>
          ) : null}
          <OutlineButton type="button" onClick={() => navigate(listPath)} className="w-full sm:w-auto !justify-center">
            Cancel
          </OutlineButton>
        </div>
      </form>
    </div>
  );
}
