import { useRef, useState } from "react";
import { Link2, Upload, Loader2, X } from "lucide-react";
import { assetUrl, uploadFile } from "../../api/client";
import { OutlineButton, fieldClass, labelClass } from "./AdminUI";
import { resolutionFor, aspectFor } from "../data/imageResolutionHints";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

/**
 * Image field: paste a URL and/or upload via Multer.
 * Always shows recommended resolution under the label.
 */
export default function ImageFieldInput({
  label,
  fieldKey,
  value = "",
  onChange,
  used = "cms-home",
  entityKey = "",
  dimensionsHint = "",
  previewAspect = "",
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const hint = dimensionsHint || resolutionFor(fieldKey, entityKey);
  const aspect = previewAspect || aspectFor(fieldKey);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const res = await uploadFile(file, {
        used: `${used}:${fieldKey || label}`,
        name: file.name,
        portal: "admin",
      });
      const url = res.url || res.absoluteUrl;
      if (!url) throw new Error("Upload succeeded but no URL returned");
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed — login as admin first");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:col-span-2 space-y-3">
      <label className={labelClass}>
        {label}
        {fieldKey ? (
          <span className="ml-2 normal-case tracking-normal text-noir/25 font-mono text-[9px]">
            {fieldKey}
          </span>
        ) : null}
      </label>
      <p className="text-xs text-noir/55 -mt-1 mb-1 leading-relaxed">
        Required resolution: <strong className="text-noir/80">{hint}</strong>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-noir/40">
          <Upload size={12} /> Upload image
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <OutlineButton
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="!py-2 !px-3"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload size={14} /> Choose file
            </>
          )}
        </OutlineButton>
        {value ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:underline"
            onClick={() => onChange("")}
          >
            <X size={12} /> Clear
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-noir/40">
        <Link2 size={12} /> Or paste URL /uploads path
      </div>
      <input
        className={fieldClass}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or /uploads/…"
      />

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {value ? (
        <img
          src={resolveImg(value)}
          alt=""
          className={`w-full max-w-xs sm:max-w-sm ${aspect} object-cover rounded-xl border border-champagne/15`}
        />
      ) : (
        <div
          className={`w-full max-w-xs ${aspect} rounded-xl border border-dashed border-champagne/30 bg-stone-50 flex items-center justify-center text-xs text-noir/35 px-3 text-center`}
        >
          Upload {hint.split("·")[0].trim()}
        </div>
      )}
    </div>
  );
}

/**
 * Multi-image list (one URL per line) with Multer append upload.
 */
export function MultiImageFieldInput({
  label,
  fieldKey,
  value = "",
  onChange,
  used = "cms-home",
  entityKey = "",
  dimensionsHint = "",
  previewAspect = "",
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const hint =
    dimensionsHint ||
    resolutionFor(fieldKey, entityKey) ||
    "1200 × 1600 px (3:4 portrait) · under 2 MB each";
  const aspect = previewAspect || aspectFor(fieldKey) || "aspect-[3/4]";

  const lines = String(value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const res = await uploadFile(file, {
          used: `${used}:${fieldKey || label}`,
          name: file.name,
          portal: "admin",
        });
        const url = res.url || res.absoluteUrl;
        if (url) urls.push(url);
      }
      if (!urls.length) throw new Error("Upload succeeded but no URL returned");
      onChange([...lines, ...urls].join("\n"));
    } catch (err) {
      setError(err.message || "Upload failed — login as admin first");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx) => {
    onChange(lines.filter((_, i) => i !== idx).join("\n"));
  };

  return (
    <div className="md:col-span-2 space-y-3">
      <label className={labelClass}>
        {label}
        {fieldKey ? (
          <span className="ml-2 normal-case tracking-normal text-noir/25 font-mono text-[9px]">
            {fieldKey}
          </span>
        ) : null}
      </label>
      <p className="text-xs text-noir/55 -mt-1 leading-relaxed">
        Required resolution: <strong className="text-noir/80">{hint}</strong>
        {fieldKey === "images" || entityKey === "products" ? (
          <span className="text-noir/45"> · First image is the card cover.</span>
        ) : null}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-noir/40">
          <Upload size={12} /> Upload images
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <OutlineButton
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="!py-2 !px-3"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload size={14} /> Choose images
            </>
          )}
        </OutlineButton>
      </div>

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-noir/40">
        <Link2 size={12} /> Or paste URLs /uploads/… (one per line)
      </div>
      <textarea
        rows={4}
        className={fieldClass}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"https://…\n/uploads/…"}
      />

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {lines.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {lines.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative ${aspect} rounded-lg overflow-hidden border border-champagne/15 bg-stone-100`}
            >
              <img
                src={resolveImg(src)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] uppercase tracking-widest2 bg-noir/80 text-champagne px-1.5 py-0.5">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-noir/70 text-ivory hover:bg-rose-600"
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function isImageFieldKey(key) {
  const k = String(key || "").toLowerCase();
  if (k === "instagramimagestext") return "multi";
  if (
    k.endsWith("image") ||
    k.endsWith("img") ||
    k.includes("imageurl") ||
    k.includes("bgimage") ||
    k.endsWith("bg")
  )
    return "single";
  return false;
}
