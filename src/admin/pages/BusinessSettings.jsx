import { useRef, useState, useEffect } from "react";
import {
  Save,
  Upload,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  MessageCircle,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import useSettingsStore, { resolveLogo } from "../../store/useSettingsStore";
import { api, uploadFile, assetUrl } from "../../api/client";
import notify from "../../utils/toast";
import {
  AdminCard,
  PrimaryButton,
  fieldClass,
  labelClass,
} from "../components/AdminUI";
import { IMAGE_RESOLUTIONS } from "../data/imageResolutionHints";

const socialFields = [
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/..." },
  { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://x.com/..." },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/..." },
  { key: "pinterest", label: "Pinterest", icon: Globe, placeholder: "https://pinterest.com/..." },
  { key: "website", label: "Website", icon: Globe, placeholder: "https://..." },
];

function LogoUploader({
  title,
  subtitle,
  preview,
  height,
  onUrl,
  onHeight,
  min = 32,
  max = 160,
  darkPreview = false,
  resolutionHint = "",
}) {
  const inputRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUrl(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`rounded-2xl border border-champagne/20 p-5 ${darkPreview ? "bg-noir" : "bg-stone-50"}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className={`font-display text-xl ${darkPreview ? "text-ivory" : "text-noir"}`}>{title}</p>
          <p className={`text-xs mt-0.5 ${darkPreview ? "text-ivory/45" : "text-noir/45"}`}>{subtitle}</p>
          {resolutionHint ? (
            <p className={`text-xs mt-2 leading-relaxed ${darkPreview ? "text-champagne/80" : "text-noir/60"}`}>
              Required resolution: <strong className={darkPreview ? "text-champagne" : "text-noir/80"}>{resolutionHint}</strong>
            </p>
          ) : null}
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${darkPreview ? "bg-champagne/15 text-champagne" : "bg-white border border-champagne/20 text-champagne-dark"}`}>
          <ImageIcon size={16} />
        </div>
      </div>

      <div className={`rounded-xl border border-dashed flex items-center justify-center mb-4 min-h-[100px] px-4 ${darkPreview ? "border-champagne/25 bg-noir-light" : "border-champagne/30 bg-white"}`}>
        {preview ? (
          <img
            src={preview}
            alt={title}
            style={{ height: `${height}px` }}
            className="w-auto max-w-full object-contain transition-all"
          />
        ) : (
          <p className={`text-xs ${darkPreview ? "text-ivory/40" : "text-noir/35"}`}>No logo</p>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className={`${labelClass} ${darkPreview ? "text-ivory/50" : ""}`}>Height · {height}px</label>
          <input
            type="range"
            min={min}
            max={max}
            value={height}
            onChange={(e) => onHeight(Number(e.target.value))}
            className="w-full accent-champagne"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <PrimaryButton type="button" onClick={() => inputRef.current?.click()} className="!text-[10px]">
            <Upload size={12} /> Upload
          </PrimaryButton>
        </div>
        <div className="flex gap-2">
          <input
            className={fieldClass}
            placeholder="Or paste image URL…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <PrimaryButton
            type="button"
            className="!px-3 shrink-0"
            onClick={() => {
              if (urlInput.trim()) {
                onUrl(urlInput.trim());
                setUrlInput("");
              }
            }}
          >
            Set
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default function BusinessSettings() {
  const business = useSettingsStore((s) => s.business);
  const updateBusiness = useSettingsStore((s) => s.updateBusiness);
  const updateSocial = useSettingsStore((s) => s.updateSocial);
  const [saved, setSaved] = useState(false);
  const faviconInputRef = useRef(null);
  const [faviconUrlInput, setFaviconUrlInput] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await api("/settings/admin", { portal: "admin" });
        if (!cancelled && settings?.business) updateBusiness(settings.business);
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [updateBusiness]);

  const onFaviconFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await uploadFile(file, { used: "favicon", name: file.name, portal: "admin" });
      const url = uploaded.url || uploaded.path || uploaded.src || "";
      if (url) {
        updateBusiness({ favicon: url.startsWith("http") || url.startsWith("data:") ? url : assetUrl(url) || url });
        notify.success("Favicon uploaded");
        return;
      }
    } catch {
      /* fall back to data URL */
    }
    const reader = new FileReader();
    reader.onload = () => updateBusiness({ favicon: reader.result });
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api("/settings/bulk", {
        method: "PUT",
        body: { business },
        portal: "admin",
      });
      notify.success("Business settings saved");
    } catch (err) {
      notify.error(err.message || "Saved locally only");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form onSubmit={save} className="animate-fade-up space-y-6 max-w-5xl">
      <div>
        <p className="eyebrow mb-1">Configuration</p>
        <p className="text-sm text-noir/55">
          Brand identity, logos, WhatsApp & social URLs — used on storefront and admin.
        </p>
      </div>

      <AdminCard title="Business Identity" subtitle="Legal & display name shown across the site">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ["businessName", "Business / Brand Name"],
            ["legalName", "Legal Company Name"],
            ["tagline", "Tagline"],
            ["supportEmail", "Support Email"],
            ["supportPhone", "Support Phone"],
            ["gstin", "GSTIN (optional)"],
            ["city", "City"],
            ["state", "State"],
            ["country", "Country"],
            ["pincode", "PIN Code"],
            ["currency", "Currency"],
            ["timezone", "Timezone"],
          ].map(([key, lab]) => (
            <div key={key}>
              <label className={labelClass}>{lab}</label>
              <input
                className={fieldClass}
                value={business[key] || ""}
                onChange={(e) => updateBusiness({ [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              rows={2}
              className={fieldClass}
              value={business.address}
              onChange={(e) => updateBusiness({ address: e.target.value })}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Logos & Favicon" subtitle="Storefront logo, admin logo, and browser tab icon">
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LogoUploader
            title="Storefront Logo"
            subtitle="Header logo on the customer website"
            preview={resolveLogo(business.storefrontLogo)}
            height={business.storefrontLogoHeight || 88}
            onUrl={(v) => updateBusiness({ storefrontLogo: v })}
            onHeight={(v) => updateBusiness({ storefrontLogoHeight: v })}
            min={48}
            max={140}
            resolutionHint={IMAGE_RESOLUTIONS.storefrontLogo}
          />
          <LogoUploader
            title="Admin Logo"
            subtitle="Sidebar logo in the admin panel"
            preview={resolveLogo(business.adminLogo)}
            height={business.adminLogoHeight || 48}
            onUrl={(v) => updateBusiness({ adminLogo: v })}
            onHeight={(v) => updateBusiness({ adminLogoHeight: v })}
            min={28}
            max={80}
            darkPreview
            resolutionHint={IMAGE_RESOLUTIONS.adminLogo}
          />
          <div className="lg:col-span-2">
            <label className={labelClass}>Mobile Storefront Height · {business.storefrontLogoMobileHeight || 72}px</label>
            <input
              type="range"
              min={40}
              max={100}
              value={business.storefrontLogoMobileHeight || 72}
              onChange={(e) => updateBusiness({ storefrontLogoMobileHeight: Number(e.target.value) })}
              className="w-full accent-champagne max-w-md"
            />
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-champagne/20 bg-stone-50 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-display text-xl text-noir">Favicon</p>
                <p className="text-xs mt-0.5 text-noir/45">
                  Icon shown in the browser tab
                </p>
                <p className="text-xs mt-2 text-noir/60 leading-relaxed">
                  Required resolution:{" "}
                  <strong className="text-noir/80">{IMAGE_RESOLUTIONS.favicon}</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg border border-champagne/25 bg-white flex items-center justify-center overflow-hidden">
                {business.favicon ? (
                  <img
                    src={
                      /^https?:\/\//i.test(business.favicon) || business.favicon.startsWith("data:")
                        ? business.favicon
                        : assetUrl(business.favicon)
                    }
                    alt="Favicon preview"
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-noir/35">None</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/png,image/x-icon,image/jpeg,image/webp,image/svg+xml,.ico"
                  className="hidden"
                  onChange={onFaviconFile}
                />
                <PrimaryButton type="button" onClick={() => faviconInputRef.current?.click()} className="!text-[10px]">
                  <Upload size={12} /> Upload favicon
                </PrimaryButton>
                {business.favicon ? (
                  <PrimaryButton
                    type="button"
                    className="!text-[10px] !bg-white !text-noir border border-champagne/30"
                    onClick={() => updateBusiness({ favicon: "" })}
                  >
                    Remove
                  </PrimaryButton>
                ) : null}
              </div>
            </div>
            <div className="flex gap-2 max-w-xl">
              <input
                className={fieldClass}
                placeholder="Or paste favicon URL…"
                value={faviconUrlInput}
                onChange={(e) => setFaviconUrlInput(e.target.value)}
              />
              <PrimaryButton
                type="button"
                className="!px-3 shrink-0"
                onClick={() => {
                  if (faviconUrlInput.trim()) {
                    updateBusiness({ favicon: faviconUrlInput.trim() });
                    setFaviconUrlInput("");
                  }
                }}
              >
                Set
              </PrimaryButton>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="WhatsApp" subtitle="Chat widget & enquiry number">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>WhatsApp Number (with country code)</label>
            <div className="relative">
              <MessageCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-champagne-dark" />
              <input
                className={`${fieldClass} !pl-10`}
                value={business.whatsapp}
                onChange={(e) => updateBusiness({ whatsapp: e.target.value })}
                placeholder="919619587978"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Default Chat Message</label>
            <input
              className={fieldClass}
              value={business.whatsappMessage}
              onChange={(e) => updateBusiness({ whatsappMessage: e.target.value })}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Social & Web URLs" subtitle="Instagram, Facebook, YouTube and more">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <div className="relative">
                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-champagne-dark" />
                <input
                  className={`${fieldClass} !pl-10`}
                  value={business.socials?.[key] || ""}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="flex items-center gap-3">
        <PrimaryButton type="submit">
          <Save size={14} />
          {saved ? "Business Settings Saved" : "Save Business Settings"}
        </PrimaryButton>
        <div className="flex items-center gap-2 text-xs text-noir/40">
          <Building2 size={14} />
          Applies to frontend & admin immediately
        </div>
      </div>
    </form>
  );
}
