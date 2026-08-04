/** Display labels for product attribute codes (storefront) */
export const ATTR_LABELS = {
  metal_type: "Metal",
  metal_purity: "Purity",
  finish: "Finish",
  gemstone_type: "Gemstone",
  stone_origin: "Stone origin",
  center_shape: "Stone shape",
  carat_weight: "Center carat",
  total_carat: "Total carat",
  diamond_color: "Color",
  diamond_clarity: "Clarity",
  diamond_cut: "Cut",
  certification: "Certification",
  setting_type: "Setting",
  occasion: "Occasion",
  gender: "Gender",
  gross_weight: "Gross weight (g)",
  net_weight: "Net weight (g)",
  ring_size: "Ring size",
  ring_style: "Ring style",
  band_width: "Band width (mm)",
  necklace_length: "Necklace length",
  chain_type: "Chain type",
  clasp_type: "Clasp",
  earring_type: "Earring type",
  earring_back: "Earring back",
  earring_size: "Earring size",
  bracelet_size: "Bracelet size",
  bracelet_style: "Bracelet style",
  pendant_height: "Pendant height (mm)",
  bail_type: "Bail",
  set_pieces: "Pieces in set",
  accessory_type: "Accessory type",
};

export function formatAttrLabel(code) {
  if (ATTR_LABELS[code]) return ATTR_LABELS[code];
  return String(code || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Preferred order on PDP specs */
export const ATTR_ORDER = [
  "metal_type",
  "metal_purity",
  "gemstone_type",
  "stone_origin",
  "center_shape",
  "carat_weight",
  "total_carat",
  "diamond_color",
  "diamond_clarity",
  "diamond_cut",
  "certification",
  "setting_type",
  "ring_style",
  "ring_size",
  "necklace_length",
  "chain_type",
  "earring_type",
  "earring_size",
  "bracelet_style",
  "bracelet_size",
  "accessory_type",
  "occasion",
  "gross_weight",
  "net_weight",
];

export function orderedSpecEntries(attrs = {}) {
  const entries = Object.entries(attrs).filter(([, v]) => v != null && String(v).trim() !== "");
  const rank = (k) => {
    const i = ATTR_ORDER.indexOf(k);
    return i === -1 ? 999 : i;
  };
  return entries.sort((a, b) => rank(a[0]) - rank(b[0]));
}
