import { useEffect, useState } from "react";
import { Save, RotateCcw, FileText, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import useCmsStore, { defaultPageContent } from "../../store/useCmsStore";
import { AdminCard, PrimaryButton, OutlineButton } from "../components/AdminUI";
import { api } from "../../api/client";
import {
  HOME_FIELD_GROUPS,
  defaultHomeFields,
  defaultHandcraftedTabs,
  defaultSectionLayout,
  cmsHomeToFields,
  extractHandcraftedTabs,
  extractSectionLayout,
  adminGroupToSectionId,
  isSectionHidden,
  normalizeSectionLayout,
} from "../data/homeCmsFields";
import { getPageCms } from "../data/pageCmsRegistry";
import { CMS_SETTINGS_KEY, toSettingsValue, fromSettingsValue } from "../data/cmsSettingsMap";
import HandcraftedTabsEditor from "../components/HandcraftedTabsEditor";
import HomeSectionPreview from "../components/HomeSectionPreview";
import GenericSectionPreview from "../components/GenericSectionPreview";
import SectionLayoutManager from "../components/SectionLayoutManager";
import ImageFieldInput, {
  MultiImageFieldInput,
  isImageFieldKey,
} from "../components/ImageFieldInput";
import RichTextEditor from "../components/RichTextEditor";
import {
  AnnouncementEditor,
  NavbarMenuEditor,
  FooterLinksEditor,
} from "../components/NavbarFooterEditor";

function isRichBodyField(key) {
  const k = String(key || "").toLowerCase();
  return (
    k.includes("body") ||
    k.endsWith("html") ||
    k.includes("richtext") ||
    (k.includes("heading") && (k.includes("text") || k.includes("copy") || k.includes("desc")))
  );
}

const fieldClass =
  "w-full bg-ivory border border-champagne/25 px-4 py-2.5 text-sm outline-none focus:border-champagne transition-colors";
const labelClass = "block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5";

function humanize(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function isLongField(key, value) {
  const k = key.toLowerCase();
  return (
    String(value).length > 80 ||
    k.includes("subtitle") ||
    k.includes("body") ||
    k.includes("text") ||
    k.includes("desc") ||
    k.includes("message") ||
    k.includes("quote") ||
    k.includes("marquee") ||
    k.includes("badges") ||
    k.includes("images") ||
    k.includes("pillars") ||
    k.includes("json") ||
    k.includes("categories")
  );
}

function TipBanner({ tip }) {
  if (tip === "locations") {
    return (
      <div className="rounded-2xl border border-champagne/20 bg-champagne/5 px-5 py-4 text-sm text-noir/70">
        <p className="font-medium text-noir mb-1">Store locations (add / remove)</p>
        <p>
          This CMS page edits titles, labels, and sections. To{" "}
          <strong>add, edit, or delete boutique locations</strong>, go to{" "}
          <Link to="/admin/stores" className="text-champagne-dark underline">
            Admin → Stores
          </Link>
          .
        </p>
      </div>
    );
  }
  if (tip === "layout") {
    return (
      <div className="rounded-2xl border border-champagne/20 bg-champagne/5 px-5 py-4 text-sm text-noir/70">
        Easy editors — no JSON. Add / remove menu items, dropdown columns, and footer links with
        simple forms (like Bagisto). Use Preview to check each section before saving.
      </div>
    );
  }
  if (tip === "collection") {
    return (
      <div className="rounded-2xl border border-champagne/20 bg-champagne/5 px-5 py-4 text-sm text-noir/70 space-y-2">
        <p>
          Products come from Admin → Products. Here you edit labels, section visibility, and each
          collection hero: <code className="text-[11px]">slug|title|description|imageUrl</code>
        </p>
        <p className="text-xs text-noir/55">
          Required hero image resolution:{" "}
          <strong className="text-noir/80">1920 × 1080 px (16:9) · under 2.5 MB</strong>
        </p>
      </div>
    );
  }
  return null;
}

export default function PageContent() {
  const pages = useCmsStore((s) => s.pages);
  const updateField = useCmsStore((s) => s.updateField);
  const updatePageFields = useCmsStore((s) => s.updatePageFields);
  const setHandcraftedTabs = useCmsStore((s) => s.setHandcraftedTabs);
  const setSectionLayout = useCmsStore((s) => s.setSectionLayout);
  const setPageSectionLayout = useCmsStore((s) => s.setPageSectionLayout);
  const resetPage = useCmsStore((s) => s.resetPage);
  const pageKeys = Object.keys(defaultPageContent);
  const [active, setActive] = useState("home");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loadingCms, setLoadingCms] = useState(false);
  const [previewOpen, setPreviewOpen] = useState({});
  const [previewProducts, setPreviewProducts] = useState([]);
  const [previewStores, setPreviewStores] = useState([]);

  const page = pages[active];
  const fields = page?.fields || {};
  const handcraftedTabs = pages.home?.handcraftedTabs || defaultHandcraftedTabs;
  const homeSectionLayout = normalizeSectionLayout(
    pages.home?.sectionLayout || defaultSectionLayout
  );
  const pageCfg = getPageCms(active);
  const activeLayout = pageCfg
    ? pageCfg.normalize(pages[active]?.sectionLayout || pageCfg.defaultSectionLayout)
    : null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCms(true);
      try {
        const settingsKey = CMS_SETTINGS_KEY[active];
        const [settings, products, storeRows] = await Promise.all([
          api("/settings/admin", { portal: "admin" }),
          active === "home"
            ? api("/products?all=1", { portal: "admin" }).catch(() => [])
            : Promise.resolve([]),
          active === "stores" ? api("/stores").catch(() => []) : Promise.resolve([]),
        ]);
        if (cancelled) return;

        if (active === "home" && settings.cmsHome) {
          updatePageFields("home", cmsHomeToFields(settings.cmsHome));
          setHandcraftedTabs(extractHandcraftedTabs(settings.cmsHome));
          setSectionLayout(extractSectionLayout(settings.cmsHome));
          setPreviewProducts(Array.isArray(products) ? products : []);
        } else if (settingsKey && settings[settingsKey]) {
          const parsed = fromSettingsValue(active, settings[settingsKey]);
          if (parsed?.fields) updatePageFields(active, parsed.fields);
          if (parsed?.sectionLayout) {
            setPageSectionLayout(active, parsed.sectionLayout);
          } else if (parsed?.raw && pageCfg?.extract) {
            setPageSectionLayout(active, pageCfg.extract(parsed.raw));
          }
        }
        if (active === "stores") {
          setPreviewStores(Array.isArray(storeRows) ? storeRows : []);
        }
      } catch {
        /* keep local */
      } finally {
        if (!cancelled) setLoadingCms(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    active,
    updatePageFields,
    setHandcraftedTabs,
    setSectionLayout,
    setPageSectionLayout,
    pageCfg,
  ]);

  const togglePreview = (groupId) => {
    setPreviewOpen((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const persistHomeCms = async (tabsOverride, layoutOverride) => {
    const nextPages = {
      ...pages,
      home: {
        ...pages.home,
        handcraftedTabs: tabsOverride ?? pages.home.handcraftedTabs ?? defaultHandcraftedTabs,
        sectionLayout: layoutOverride ?? pages.home.sectionLayout ?? defaultSectionLayout,
      },
    };
    const cmsHome = toSettingsValue("home", nextPages);
    await api("/settings", {
      method: "PUT",
      body: { key: "cmsHome", value: cmsHome },
      portal: "admin",
    });
    return cmsHome;
  };

  const save = async () => {
    setError("");
    const key = CMS_SETTINGS_KEY[active];
    if (!key) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
      return;
    }
    try {
      const value = toSettingsValue(active, pages);
      await api("/settings", {
        method: "PUT",
        body: { key, value },
        portal: "admin",
      });
    } catch (err) {
      setError(err.message || "Could not sync CMS — login as admin first");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const saveHandcraftedTabs = async (tabs) => {
    setHandcraftedTabs(tabs);
    await persistHomeCms(tabs);
  };

  const renderField = (key, value, used = "cms") => {
    const imageKind = isImageFieldKey(key);
    if (imageKind === "multi") {
      return (
        <MultiImageFieldInput
          key={key}
          label={humanize(key)}
          fieldKey={key}
          value={value ?? ""}
          onChange={(v) => updateField(active, key, v)}
          used={used}
        />
      );
    }
    if (imageKind === "single") {
      return (
        <ImageFieldInput
          key={key}
          label={humanize(key)}
          fieldKey={key}
          value={value ?? ""}
          onChange={(v) => updateField(active, key, v)}
          used={used}
        />
      );
    }

    if (isRichBodyField(key)) {
      return (
        <RichTextEditor
          key={key}
          label={`${humanize(key)} (${key})`}
          value={value ?? ""}
          onChange={(v) => updateField(active, key, v)}
        />
      );
    }

    const long = isLongField(key, value);
    const isCollectionHeroes =
      key.toLowerCase().includes("categories") ||
      key.toLowerCase().includes("heroes") ||
      key === "collectionHeroesText";
    return (
      <div key={key} className={long ? "md:col-span-2" : ""}>
        <label className={labelClass}>
          {humanize(key)}
          <span className="ml-2 normal-case tracking-normal text-noir/25 font-mono text-[9px]">
            {key}
          </span>
        </label>
        {isCollectionHeroes ? (
          <p className="text-xs text-noir/55 mb-1.5 leading-relaxed">
            Required image resolution:{" "}
            <strong className="text-noir/80">1920 × 1080 px (16:9) · under 2.5 MB</strong>
          </p>
        ) : null}
        {long ? (
          <textarea
            rows={key.toLowerCase().includes("body") || key.includes("Text") ? 4 : 3}
            className={fieldClass}
            value={value ?? ""}
            onChange={(e) => updateField(active, key, e.target.value)}
          />
        ) : (
          <input
            className={fieldClass}
            value={value ?? ""}
            onChange={(e) => updateField(active, key, e.target.value)}
          />
        )}
      </div>
    );
  };

  const sectionHeader = (group, hidden, pageLabel = "page") => (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 py-3.5 border-b border-champagne/10">
      <div className="min-w-0">
        <h3 className="font-display text-base sm:text-lg text-noir break-words">
          {group.label}
          {hidden && (
            <span className="ml-2 text-[10px] uppercase tracking-widest2 text-noir/40 font-sans font-normal">
              Hidden on {pageLabel}
            </span>
          )}
        </h3>
      </div>
      <OutlineButton
        type="button"
        onClick={() => togglePreview(group.id)}
        className="!py-1.5 !px-3 shrink-0"
      >
        {previewOpen[group.id] ? (
          <>
            <EyeOff size={14} /> Hide preview
          </>
        ) : (
          <>
            <Eye size={14} /> Preview
          </>
        )}
      </OutlineButton>
    </div>
  );

  const handleReset = () => {
    if (active === "home") {
      updatePageFields("home", { ...defaultHomeFields });
      setHandcraftedTabs(structuredClone(defaultHandcraftedTabs));
      setSectionLayout(structuredClone(defaultSectionLayout));
      return;
    }
    resetPage(active);
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <p className="eyebrow mb-1">CMS</p>
        <p className="text-sm text-noir/55 max-w-2xl">
          Every storefront page has the same Home features: edit copy, upload images, preview
          sections, and show / hide / reorder / add custom sections. Store locations: Admin → Stores.
        </p>
        {error && <p className="text-sm text-rose-600 mt-2">{error}</p>}
        {loadingCms && CMS_SETTINGS_KEY[active] && (
          <p className="text-xs text-noir/40 mt-2">Loading live content from API…</p>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6">
        <AdminCard title="Storefront Pages">
          <ul className="py-2">
            {pageKeys.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(key);
                    setPreviewOpen({});
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-colors border-l-2 ${
                    active === key
                      ? "bg-champagne/10 border-champagne text-noir"
                      : "border-transparent text-noir/60 hover:bg-stone-50 hover:text-noir"
                  }`}
                >
                  <FileText size={14} className={active === key ? "text-champagne-dark" : ""} />
                  <span className="flex-1">{pages[key].label}</span>
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>

        <div className="space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-2xl text-noir">{page.label}</h2>
              <p className="text-xs text-noir/40 mt-0.5 font-mono">{page.path}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {page.path.startsWith("/") && !page.path.includes(":") && (
                <Link to={page.path} target="_blank">
                  <OutlineButton type="button">
                    <ExternalLink size={14} /> Open live page
                  </OutlineButton>
                </Link>
              )}
              <OutlineButton type="button" onClick={handleReset}>
                <RotateCcw size={14} /> Reset
              </OutlineButton>
              <PrimaryButton type="button" onClick={save}>
                <Save size={14} />
                {saved ? "Saved to API" : "Save Content"}
              </PrimaryButton>
            </div>
          </div>

          {active === "home" ? (
            <>
              <div className="bg-white border border-champagne/15 rounded-2xl shadow-sm overflow-hidden w-full min-w-0">
                <div className="px-5 py-3.5 border-b border-champagne/10">
                  <h3 className="font-display text-lg text-noir">0 · Sections (show / hide / add)</h3>
                </div>
                <SectionLayoutManager
                  layout={homeSectionLayout}
                  onChange={setSectionLayout}
                />
              </div>

              {HOME_FIELD_GROUPS.map((group) => {
                const sectionId = adminGroupToSectionId(group.id);
                const hidden = isSectionHidden(homeSectionLayout, sectionId);
                return (
                  <div
                    key={group.id}
                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden w-full min-w-0 ${
                      hidden ? "border-stone-200 opacity-75" : "border-champagne/15"
                    }`}
                  >
                    {sectionHeader(group, hidden, "home")}

                    {group.special === "handcraftedTabs" ? (
                      <HandcraftedTabsEditor
                        tabs={handcraftedTabs}
                        onChange={setHandcraftedTabs}
                        onSaveTab={saveHandcraftedTabs}
                      />
                    ) : (
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {group.keys.map((key) =>
                          renderField(
                            key,
                            fields[key] ?? defaultHomeFields[key] ?? "",
                            "cms-home"
                          )
                        )}
                      </div>
                    )}

                    {previewOpen[group.id] && (
                      <div className="px-3 sm:px-5 pb-5 w-full min-w-0 overflow-hidden">
                        <HomeSectionPreview
                          groupId={group.id}
                          fields={fields}
                          handcraftedTabs={handcraftedTabs}
                          products={previewProducts}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : pageCfg && activeLayout ? (
            <>
              <TipBanner tip={pageCfg.tip} />

              <div className="bg-white border border-champagne/15 rounded-2xl shadow-sm overflow-hidden w-full min-w-0">
                <div className="px-5 py-3.5 border-b border-champagne/10">
                  <h3 className="font-display text-lg text-noir">0 · Sections (show / hide / add)</h3>
                </div>
                <SectionLayoutManager
                  layout={activeLayout}
                  onChange={(next) => setPageSectionLayout(active, next)}
                  builtinSections={pageCfg.builtinSections}
                  normalize={pageCfg.normalize}
                  createCustom={pageCfg.createCustom}
                />
              </div>

              {pageCfg.fieldGroups.map((group) => {
                const sectionId = pageCfg.adminGroupToSectionId(group.id);
                const hidden = pageCfg.isHidden(activeLayout, sectionId);
                const onLayoutField = (key, value) => updateField(active, key, value);
                return (
                  <div
                    key={group.id}
                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden w-full min-w-0 ${
                      hidden ? "border-stone-200 opacity-75" : "border-champagne/15"
                    }`}
                  >
                    {sectionHeader(group, hidden, page.label.toLowerCase())}

                    {active === "footer" && group.special === "announcementEditor" ? (
                      <AnnouncementEditor
                        fields={{ ...pageCfg.defaultFields, ...fields }}
                        onChangeField={onLayoutField}
                      />
                    ) : active === "footer" && group.special === "navbarEditor" ? (
                      <NavbarMenuEditor
                        fields={{ ...pageCfg.defaultFields, ...fields }}
                        onChangeField={onLayoutField}
                      />
                    ) : active === "footer" && group.special === "footerEditor" ? (
                      <FooterLinksEditor
                        fields={{ ...pageCfg.defaultFields, ...fields }}
                        onChangeField={onLayoutField}
                      />
                    ) : (
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {group.keys.map((key) =>
                          renderField(
                            key,
                            fields[key] ?? pageCfg.defaultFields[key] ?? "",
                            `cms-${active}`
                          )
                        )}
                      </div>
                    )}

                    {previewOpen[group.id] && (
                      <div className="px-3 sm:px-5 pb-5 w-full min-w-0 overflow-hidden">
                        <GenericSectionPreview
                          previewKind={pageCfg.previewKind}
                          groupId={group.id}
                          group={group}
                          fields={{ ...pageCfg.defaultFields, ...fields }}
                          stores={previewStores}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <AdminCard>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(fields).map(([key, value]) =>
                  renderField(key, value ?? "", `cms-${active}`)
                )}
              </div>
            </AdminCard>
          )}
        </div>
      </div>
    </div>
  );
}
