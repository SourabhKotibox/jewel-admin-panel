import { useEffect, useMemo } from "react";
import useCmsStore from "../store/useCmsStore";
import { api } from "../api/client";
import { getPageCms } from "../admin/data/pageCmsRegistry";
import { CMS_SETTINGS_KEY, fromSettingsValue } from "../admin/data/cmsSettingsMap";

/**
 * Load a page's CMS fields + sectionLayout from API and expose helpers.
 */
export default function useCmsPage(pageKey) {
  const fields = useCmsStore((s) => s.pages[pageKey]?.fields);
  const sectionLayout = useCmsStore((s) => s.pages[pageKey]?.sectionLayout);
  const updatePageFields = useCmsStore((s) => s.updatePageFields);
  const setPageSectionLayout = useCmsStore((s) => s.setPageSectionLayout);
  const cfg = getPageCms(pageKey);

  useEffect(() => {
    if (!cfg) return undefined;
    let cancelled = false;
    const settingsKey = CMS_SETTINGS_KEY[pageKey];
    (async () => {
      try {
        const settings = await api("/settings");
        if (cancelled || !settingsKey || !settings[settingsKey]) return;
        const parsed = fromSettingsValue(pageKey, settings[settingsKey]);
        if (parsed?.fields) updatePageFields(pageKey, parsed.fields);
        if (parsed?.sectionLayout) {
          setPageSectionLayout(pageKey, parsed.sectionLayout);
        } else if (parsed?.raw) {
          setPageSectionLayout(pageKey, cfg.extract(parsed.raw));
        }
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageKey, cfg, updatePageFields, setPageSectionLayout]);

  const mergedFields = useMemo(
    () => ({ ...(cfg?.defaultFields || {}), ...(fields || {}) }),
    [cfg, fields]
  );

  const layout = useMemo(
    () => cfg?.normalize(sectionLayout || cfg.defaultSectionLayout),
    [cfg, sectionLayout]
  );

  const isHidden = (sectionId) => (cfg && layout ? cfg.isHidden(layout, sectionId) : false);

  const customSections = useMemo(() => {
    if (!layout) return [];
    return (layout.order || [])
      .map((id) => layout.customSections.find((c) => c.id === id))
      .filter((c) => c && c.enabled !== false);
  }, [layout]);

  /** Custom blocks that should render at a given position relative to builtins */
  const renderables = useMemo(() => {
    if (!layout) return [];
    const hidden = new Set(layout.hidden || []);
    const customMap = Object.fromEntries(
      (layout.customSections || []).map((c) => [c.id, c])
    );
    return (layout.order || [])
      .filter((id) => !hidden.has(id))
      .map((id) => {
        const custom = customMap[id];
        if (custom) {
          if (custom.enabled === false) return null;
          return { type: "custom", id, data: custom };
        }
        return { type: "builtin", id };
      })
      .filter(Boolean);
  }, [layout]);

  return {
    fields: mergedFields,
    layout,
    isHidden,
    customSections,
    renderables,
    cfg,
  };
}
