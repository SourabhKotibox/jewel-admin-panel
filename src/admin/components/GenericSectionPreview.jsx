import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { assetUrl } from "../../api/client";
import AboutSectionPreview from "./AboutSectionPreview";
import StoresSectionPreview from "./StoresSectionPreview";
import {
  parseNavMenu,
  parseLinkLines,
  defaultLayoutFields,
} from "../data/layoutCmsFields";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

function humanize(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function Frame({ children }) {
  const [viewport, setViewport] = useState("desktop");
  const isMobile = viewport === "mobile";
  return (
    <div className="border border-champagne/20 rounded-2xl overflow-hidden bg-stone-100/80 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-champagne/15 bg-stone-50">
        <p className="text-[10px] uppercase tracking-widest2 text-noir/45 font-medium">
          Section preview (same layout as live)
        </p>
        <div className="flex items-center gap-1 rounded-full border border-champagne/20 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest2 ${
              isMobile ? "bg-noir text-champagne" : "text-noir/50"
            }`}
          >
            <Smartphone size={12} /> Mobile
          </button>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest2 ${
              !isMobile ? "bg-noir text-champagne" : "text-noir/50"
            }`}
          >
            <Monitor size={12} /> Desktop
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-5 overflow-x-auto">
        <div
          className={`mx-auto bg-ivory shadow-sm border border-champagne/10 overflow-hidden ${
            isMobile ? "w-full max-w-[390px]" : "w-full max-w-5xl"
          }`}
        >
          {typeof children === "function" ? children(isMobile) : children}
        </div>
      </div>
    </div>
  );
}

function CollectionPreview({ groupId, fields, isMobile }) {
  if (groupId === "hero" || groupId === "categories") {
    return (
      <div
        className={`relative w-full flex items-center justify-center overflow-hidden bg-noir ${
          isMobile ? "h-[200px]" : "h-[260px]"
        }`}
      >
        {fields.defaultBgImage ? (
          <img
            src={resolveImg(fields.defaultBgImage)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne mb-2">
            {fields.eyebrow}
          </p>
          <h3 className={`font-display text-ivory ${isMobile ? "text-2xl" : "text-4xl"}`}>
            Collection title
          </h3>
          <p className="text-ivory/70 text-[10px] mt-3 max-w-md mx-auto">
            {fields.defaultDescription}
          </p>
        </div>
      </div>
    );
  }
  if (groupId === "toolbar") {
    return (
      <div className="px-5 py-4 flex flex-wrap justify-between gap-3 border-b border-champagne/15 text-xs text-noir/60">
        <span>
          {fields.showingPrefix} <strong className="text-noir">12</strong> {fields.resultsLabel}
        </span>
        <span>
          {fields.sortLabel} {fields.sortFeatured}
        </span>
      </div>
    );
  }
  return (
    <div className="px-6 py-12 text-center">
      <h3 className="font-display text-2xl text-noir mb-2">{fields.emptyTitle}</h3>
      <p className="text-sm text-noir/50">{fields.emptySubtitle}</p>
    </div>
  );
}

function FooterLinkList({ heading, linksText }) {
  const links = parseLinkLines(linksText || "");
  return (
    <div>
      <p className="text-champagne text-[10px] uppercase tracking-widest2 mb-2.5 font-semibold">
        {heading}
      </p>
      <ul className="space-y-1.5">
        {links.length === 0 ? (
          <li className="text-[11px] text-ivory/35 italic">No links yet</li>
        ) : (
          links.slice(0, 6).map((l) => (
            <li key={`${l.label}-${l.path}`} className="text-[11px] text-ivory/75">
              {l.label}
              <span className="block text-[9px] text-ivory/35 truncate">{l.path}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function ContactPreview({ groupId, fields, isMobile }) {
  if (groupId === "hero") {
    return (
      <div
        className={`relative w-full flex items-center justify-center overflow-hidden bg-noir ${
          isMobile ? "h-[200px]" : "h-[260px]"
        }`}
      >
        {fields.heroImage ? (
          <img
            src={resolveImg(fields.heroImage)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne mb-2">
            {fields.heroEyebrow}
          </p>
          <h3 className={`font-display text-ivory ${isMobile ? "text-2xl" : "text-4xl"}`}>
            {fields.heroTitle}
          </h3>
          <p className="text-ivory/70 text-[10px] mt-3 max-w-md mx-auto">{fields.heroSubtitle}</p>
        </div>
      </div>
    );
  }
  if (groupId === "info") {
    return (
      <div className="p-5 grid grid-cols-2 gap-3">
        {[
          [fields.phoneLabel, fields.phoneValue],
          [fields.emailLabel, fields.emailValue],
          [fields.addressLabel, fields.addressValue],
          [fields.hoursLabel, fields.hoursValue],
        ].map(([label, value]) => (
          <div key={label} className="border border-champagne/15 p-3">
            <p className="text-[9px] uppercase tracking-widest2 text-noir/40 mb-1">{label}</p>
            <p className="text-xs text-noir">{value}</p>
          </div>
        ))}
      </div>
    );
  }
  if (groupId === "form") {
    return (
      <div className="p-6 max-w-md mx-auto space-y-3">
        <h3 className="font-display text-2xl text-noir">{fields.formTitle}</h3>
        <p className="text-xs text-noir/50">{fields.formSubtitle}</p>
        <div className="h-9 bg-stone-100 border border-champagne/15 rounded-sm" />
        <div className="h-9 bg-stone-100 border border-champagne/15 rounded-sm" />
        <div className="h-20 bg-stone-100 border border-champagne/15 rounded-sm" />
        <div className="inline-block bg-noir text-champagne text-[10px] uppercase tracking-widest2 px-4 py-2">
          {fields.submitCta}
        </div>
      </div>
    );
  }
  return (
    <div className={`p-6 grid gap-4 items-center ${isMobile ? "" : "grid-cols-2"}`}>
      {fields.visitImage ? (
        <img
          src={resolveImg(fields.visitImage)}
          alt=""
          className="w-full h-36 object-cover rounded-sm"
        />
      ) : (
        <div className="h-36 bg-stone-100" />
      )}
      <div>
        <p className="text-[10px] uppercase tracking-widest2 text-champagne mb-1">
          {fields.visitEyebrow}
        </p>
        <h3 className="font-display text-xl text-noir mb-2">{fields.visitTitle}</h3>
        <p className="text-xs text-noir/55 mb-3">{fields.visitBody}</p>
        <span className="text-[10px] uppercase tracking-widest2 text-noir border-b border-champagne">
          {fields.visitCta}
        </span>
      </div>
    </div>
  );
}

function LayoutPreview({ groupId, fields, isMobile }) {
  if (groupId === "announcement") {
    const msgs = [fields.announcement1, fields.announcement2, fields.announcement3].filter(Boolean);
    return (
      <div className="bg-noir text-champagne text-[10px] uppercase tracking-widest2 text-center py-2.5 px-3">
        {msgs[0] || "No announcement messages"}
        {msgs.length > 1 && (
          <span className="block normal-case tracking-normal text-ivory/40 mt-1 text-[9px]">
            +{msgs.length - 1} more rotating
          </span>
        )}
      </div>
    );
  }

  if (groupId === "nav") {
    const menu = parseNavMenu(fields.navMenuJson || defaultLayoutFields.navMenuJson);
    const sample = menu.find((m) => !m.direct && m.columns?.length) || menu[0];
    return (
      <div className="bg-ivory">
        <div className="px-4 py-3 border-b border-champagne/15 flex items-center justify-between gap-3">
          <span className="font-display text-lg text-noir">Madhu</span>
          {!isMobile && (
            <nav className="flex flex-wrap items-center justify-center gap-4 flex-1 px-2">
              {menu.slice(0, 6).map((m) => (
                <span
                  key={m.label}
                  className="text-[10px] uppercase tracking-widest2 text-noir/70"
                >
                  {m.label}
                  {!m.direct && <span className="text-champagne ml-0.5">▾</span>}
                </span>
              ))}
            </nav>
          )}
          <span className="text-[10px] text-noir/40 truncate max-w-[100px]">
            {fields.searchPlaceholder}
          </span>
        </div>
        {isMobile ? (
          <ul className="divide-y divide-champagne/10">
            {menu.map((m) => (
              <li key={m.label} className="px-4 py-3">
                <p className="text-sm text-noir font-medium">{m.label}</p>
                {!m.direct && (
                  <p className="text-[10px] text-noir/40 mt-0.5">
                    {(m.columns || []).reduce((n, c) => n + (c.items?.length || 0), 0)} sub-links
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : sample && !sample.direct ? (
          <div className="px-5 py-5 grid grid-cols-4 gap-4 border-t border-champagne/10 bg-stone-50/50">
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {(sample.columns || []).slice(0, 3).map((col) => (
                <div key={col.heading}>
                  <p className="text-xs font-display text-noir mb-2 border-b border-champagne/20 pb-1">
                    {col.heading || "Column"}
                  </p>
                  <ul className="space-y-1">
                    {(col.items || []).slice(0, 5).map((item) => (
                      <li key={item} className="text-[11px] text-noir/60">
                        {item}
                      </li>
                    ))}
                    {(col.items || []).length === 0 && (
                      <li className="text-[10px] text-noir/30 italic">No sub-links</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
            <div className="relative h-28 rounded-sm overflow-hidden bg-noir">
              {sample.featuredImage ? (
                <img
                  src={resolveImg(sample.featuredImage)}
                  alt=""
                  className="w-full h-full object-cover opacity-70"
                />
              ) : null}
              <div className="absolute inset-0 flex items-end p-3">
                <span className="text-ivory text-xs font-display">{sample.label}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`bg-noir text-ivory/70 ${isMobile ? "p-5 space-y-6" : "p-8 grid gap-8 grid-cols-3"}`}
    >
      <FooterLinkList heading={fields.shopHeading} linksText={fields.shopLinksText} />
      <FooterLinkList heading={fields.exploreHeading} linksText={fields.exploreLinksText} />
      <div>
        <p className="text-champagne text-[10px] uppercase tracking-widest2 mb-2 font-semibold">
          {fields.benefitsHeading}
        </p>
        <p className="text-[11px] mb-3 leading-relaxed">{fields.benefitsText}</p>
        <p className="text-[10px] text-ivory/40">{fields.copyright}</p>
      </div>
    </div>
  );
}

function FieldPreview({ group, fields }) {
  const keys = group?.keys || [];
  return (
    <div className="p-6 space-y-4">
      {keys.map((key) => {
        const val = fields[key] ?? "";
        const isImg = /image|img|bg/i.test(key) && String(val).length > 4;
        return (
          <div key={key}>
            <p className="text-[9px] uppercase tracking-widest2 text-noir/40 mb-1">
              {humanize(key)}
            </p>
            {isImg ? (
              <img
                src={resolveImg(val)}
                alt=""
                className="w-full max-h-40 object-cover rounded-sm bg-stone-100"
              />
            ) : (
              <p className="text-sm text-noir leading-relaxed whitespace-pre-wrap">
                {val || "—"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Unified section preview for all non-Home pages.
 * About/Stores keep their dedicated previews; others use layout-aware frames.
 */
export default function GenericSectionPreview({
  previewKind,
  groupId,
  group,
  fields,
  stores = [],
}) {
  if (previewKind === "about") {
    return <AboutSectionPreview groupId={groupId} fields={fields} />;
  }
  if (previewKind === "stores") {
    return <StoresSectionPreview groupId={groupId} fields={fields} stores={stores} />;
  }

  return (
    <Frame>
      {(isMobile) => {
        if (previewKind === "collection") {
          return <CollectionPreview groupId={groupId} fields={fields} isMobile={isMobile} />;
        }
        if (previewKind === "layout") {
          return <LayoutPreview groupId={groupId} fields={fields} isMobile={isMobile} />;
        }
        if (previewKind === "contact") {
          return <ContactPreview groupId={groupId} fields={fields} isMobile={isMobile} />;
        }
        return <FieldPreview group={group} fields={fields} />;
      }}
    </Frame>
  );
}
