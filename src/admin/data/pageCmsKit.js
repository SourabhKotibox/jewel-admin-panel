/**
 * Shared CMS helpers so every storefront page can match Home features:
 * field groups, section hide/show/add/reorder, custom blocks, API shape.
 */

export function createCustomSection(partial = {}) {
  return {
    id: partial.id || `custom-${Date.now()}`,
    enabled: partial.enabled !== false,
    eyebrow: partial.eyebrow || "New Section",
    title: partial.title || "Custom Section",
    body: partial.body || "Add your content here from the admin panel.",
    image: partial.image || "",
    cta: partial.cta || "",
    ctaLink: partial.ctaLink || "/",
  };
}

export function makeSectionLayoutHelpers(builtinSections) {
  const ids = builtinSections.map((s) => s.id);
  const defaultLayout = {
    hidden: [],
    order: [...ids],
    customSections: [],
  };

  function normalize(layout) {
    const base = structuredClone(defaultLayout);
    if (!layout || typeof layout !== "object") return base;

    const hidden = Array.isArray(layout.hidden)
      ? layout.hidden.filter((id) => ids.includes(id))
      : [];

    const customSections = Array.isArray(layout.customSections)
      ? layout.customSections.map((c) => createCustomSection(c))
      : [];

    const customIds = new Set(customSections.map((c) => c.id));
    let order = Array.isArray(layout.order) ? [...layout.order] : [...ids];
    order = order.filter((id) => ids.includes(id) || customIds.has(id));
    ids.forEach((id) => {
      if (!order.includes(id)) order.push(id);
    });
    customSections.forEach((c) => {
      if (!order.includes(c.id)) order.push(c.id);
    });

    return { hidden, order, customSections };
  }

  function adminGroupToSectionId(groupId) {
    return builtinSections.find((s) => s.adminGroups.includes(groupId))?.id || groupId;
  }

  function isHidden(layout, sectionId) {
    const L = normalize(layout);
    if (String(sectionId).startsWith("custom-")) {
      const c = L.customSections.find((x) => x.id === sectionId);
      return !c || c.enabled === false;
    }
    return L.hidden.includes(sectionId);
  }

  return {
    builtinSections,
    builtinIds: ids,
    defaultLayout,
    normalize,
    extract: (cms = {}) => normalize(cms.sectionLayout),
    adminGroupToSectionId,
    isHidden,
    createCustom: createCustomSection,
  };
}

/** Attach sectionLayout onto a fields→cms converter */
export function withSectionLayout(toCmsFn, normalizeLayout) {
  return (fields, sectionLayout) => ({
    ...toCmsFn(fields),
    sectionLayout: normalizeLayout(sectionLayout),
  });
}

export function mergeFieldsFromCms(defaultFields, cms = {}) {
  const base = { ...defaultFields };
  Object.keys(base).forEach((k) => {
    if (cms[k] !== undefined && typeof cms[k] === "string") base[k] = cms[k];
  });
  return base;
}
