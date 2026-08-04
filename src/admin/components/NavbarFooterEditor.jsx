import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Link2,
  LayoutGrid,
  Megaphone,
} from "lucide-react";
import {
  parseNavMenu,
  serializeNavMenu,
  parseLinkLines,
  serializeLinkLines,
  defaultLayoutFields,
} from "../data/layoutCmsFields";
import { OutlineButton, PrimaryButton, fieldClass, labelClass } from "./AdminUI";
import ImageFieldInput from "./ImageFieldInput";

const COMMON_PAGES = [
  { label: "Home", path: "/" },
  { label: "All Jewellery", path: "/shop" },
  { label: "Necklaces", path: "/shop?category=Necklaces" },
  { label: "Earrings", path: "/shop?category=Earrings" },
  { label: "Bracelets", path: "/shop?category=Bracelets" },
  { label: "Bridal", path: "/shop?bridal=1" },
  { label: "Diamond", path: "/shop?diamond=1" },
  { label: "Polki", path: "/shop?polki=1" },
  { label: "Ready to Ship", path: "/shop?stock=1" },
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
  { label: "Stores", path: "/stores" },
  { label: "Cart", path: "/cart" },
  { label: "Wishlist", path: "/wishlist" },
  { label: "Account", path: "/account" },
];

function MoveButtons({ onUp, onDown, disableUp, disableDown }) {
  return (
    <div className="flex gap-0.5">
      <button
        type="button"
        onClick={onUp}
        disabled={disableUp}
        className="p-1.5 text-noir/40 hover:text-noir disabled:opacity-25"
        aria-label="Move up"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={disableDown}
        className="p-1.5 text-noir/40 hover:text-noir disabled:opacity-25"
        aria-label="Move down"
      >
        <ChevronDown size={14} />
      </button>
    </div>
  );
}

function moveItem(list, index, dir) {
  const next = [...list];
  const j = index + dir;
  if (j < 0 || j >= next.length) return list;
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

/** Rotating top-bar messages — add / edit / remove */
export function AnnouncementEditor({ fields, onChangeField }) {
  const messages = [fields.announcement1, fields.announcement2, fields.announcement3]
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  const sync = (list) => {
    onChangeField("announcement1", list[0] || "");
    onChangeField("announcement2", list[1] || "");
    onChangeField("announcement3", list[2] || "");
  };

  return (
    <div className="p-5 space-y-4">
      <p className="text-sm text-noir/55">
        Messages rotate in the black bar at the top of the website. Keep them short.
      </p>
      {messages.length === 0 && (
        <p className="text-xs text-noir/40 italic">No messages yet — add one below.</p>
      )}
      <ul className="space-y-3">
        {messages.map((msg, i) => (
          <li
            key={i}
            className="flex gap-2 items-start bg-stone-50 border border-champagne/15 rounded-xl p-3"
          >
            <Megaphone size={16} className="text-champagne-dark mt-2.5 shrink-0" />
            <input
              className={fieldClass}
              value={msg}
              placeholder="e.g. Free shipping on orders above ₹2,00,000"
              onChange={(e) => {
                const next = [...messages];
                next[i] = e.target.value;
                sync(next);
              }}
            />
            <MoveButtons
              onUp={() => sync(moveItem(messages, i, -1))}
              onDown={() => sync(moveItem(messages, i, 1))}
              disableUp={i === 0}
              disableDown={i === messages.length - 1}
            />
            <button
              type="button"
              onClick={() => sync(messages.filter((_, j) => j !== i))}
              className="p-2 text-rose-500/70 hover:text-rose-600"
              aria-label="Remove"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      {messages.length < 3 && (
        <OutlineButton
          type="button"
          onClick={() => sync([...messages, "New announcement message"])}
        >
          <Plus size={14} /> Add message
        </OutlineButton>
      )}
      {messages.length >= 3 && (
        <p className="text-[11px] text-noir/40">Maximum 3 rotating messages.</p>
      )}
    </div>
  );
}

/** Visual navbar / mega-menu builder (Bagisto-style) */
export function NavbarMenuEditor({ fields, onChangeField }) {
  const menu = parseNavMenu(fields.navMenuJson || defaultLayoutFields.navMenuJson);
  const [openIdx, setOpenIdx] = useState(0);

  const commit = (next) => onChangeField("navMenuJson", serializeNavMenu(next));

  const updateItem = (idx, patch) => {
    commit(menu.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  };

  const addMenu = () => {
    const next = [
      ...menu,
      {
        label: "New Menu",
        slug: "all-jewellery",
        direct: false,
        featuredImage: "",
        columns: [{ heading: "Shop", items: ["New Link"] }],
      },
    ];
    commit(next);
    setOpenIdx(next.length - 1);
  };

  const removeMenu = (idx) => {
    const next = menu.filter((_, i) => i !== idx);
    commit(next);
    setOpenIdx(Math.max(0, idx - 1));
  };

  return (
    <div className="p-5 space-y-5">
      <div className="rounded-xl border border-champagne/25 bg-champagne/5 px-4 py-3.5 text-sm text-noir/70">
        <p className="font-medium text-noir mb-1.5">How to add sub-links (3 steps)</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm">
          <li>
            Click a top menu below (e.g. <strong>Jewellery</strong>) to open it.
          </li>
          <li>
            Set Link type to <strong>Dropdown mega-menu</strong> (not Simple page link).
          </li>
          <li>
            Under <strong>Sub-links</strong>, click <strong>Add sub-link</strong> and type the name
            (e.g. Polki Chokers).
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Search box placeholder</label>
          <input
            className={fieldClass}
            value={fields.searchPlaceholder ?? ""}
            onChange={(e) => onChangeField("searchPlaceholder", e.target.value)}
            placeholder="Search our site..."
          />
        </div>
        <div>
          <label className={labelClass}>Mega-menu label (e.g. Discover)</label>
          <input
            className={fieldClass}
            value={fields.megaDiscoverLabel ?? ""}
            onChange={(e) => onChangeField("megaDiscoverLabel", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Collection word after menu name</label>
          <input
            className={fieldClass}
            value={fields.megaCollectionSuffix ?? ""}
            onChange={(e) => onChangeField("megaCollectionSuffix", e.target.value)}
            placeholder="Collection"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-champagne/10">
        <div>
          <p className="font-medium text-noir text-sm">Top navbar menus</p>
          <p className="text-xs text-noir/45 mt-0.5">
            These names appear in the website header. Open one to edit its sub-links.
          </p>
        </div>
        <PrimaryButton type="button" onClick={addMenu}>
          <Plus size={14} /> Add top menu
        </PrimaryButton>
      </div>

      <div className="space-y-3">
        {menu.map((item, idx) => {
          const open = openIdx === idx;
          return (
            <div
              key={`${item.label}-${idx}`}
              className="border border-champagne/20 rounded-2xl overflow-hidden bg-white"
            >
              <div className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-stone-50/80">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? -1 : idx)}
                  className="flex-1 flex items-center gap-2 text-left min-w-0"
                >
                  <ChevronRight
                    size={16}
                    className={`text-noir/40 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
                  />
                  <LayoutGrid size={16} className="text-champagne-dark shrink-0" />
                  <span className="font-medium text-noir truncate">{item.label || "Untitled"}</span>
                  <span className="text-[10px] uppercase tracking-widest2 text-noir/35 shrink-0">
                    {item.direct
                      ? "Simple link"
                      : `${(item.columns || []).reduce((n, c) => n + (c.items?.length || 0), 0)} sub-links`}
                  </span>
                </button>
                <MoveButtons
                  onUp={() => {
                    commit(moveItem(menu, idx, -1));
                    setOpenIdx(Math.max(0, idx - 1));
                  }}
                  onDown={() => {
                    commit(moveItem(menu, idx, 1));
                    setOpenIdx(Math.min(menu.length - 1, idx + 1));
                  }}
                  disableUp={idx === 0}
                  disableDown={idx === menu.length - 1}
                />
                <button
                  type="button"
                  onClick={() => removeMenu(idx)}
                  className="p-2 text-rose-500/70 hover:text-rose-600"
                  aria-label="Delete menu"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {open && (
                <div className="p-4 sm:p-5 space-y-5 border-t border-champagne/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Menu name (shown in navbar)</label>
                      <input
                        className={fieldClass}
                        value={item.label || ""}
                        onChange={(e) => updateItem(idx, { label: e.target.value })}
                        placeholder="Jewellery"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Link type</label>
                      <select
                        className={fieldClass}
                        value={item.direct ? "direct" : "dropdown"}
                        onChange={(e) => {
                          const direct = e.target.value === "direct";
                          updateItem(idx, {
                            direct,
                            columns: direct
                              ? undefined
                              : item.columns?.length
                                ? item.columns
                                : [{ heading: "Shop", items: [] }],
                          });
                        }}
                      >
                        <option value="dropdown">Dropdown mega-menu</option>
                        <option value="direct">Simple page link</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        {item.direct
                          ? "Page URL"
                          : "Main collection slug (opens when clicking featured image)"}
                      </label>
                      <input
                        className={fieldClass}
                        value={item.slug || ""}
                        onChange={(e) => updateItem(idx, { slug: e.target.value })}
                        placeholder={item.direct ? "/stores" : "all-jewellery"}
                      />
                      <p className="text-[11px] text-noir/40 mt-1">
                        {item.direct
                          ? "Example: /stores or /about"
                          : "Example: bridal-jewellery → /shop?bridal=1"}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {COMMON_PAGES.slice(0, 8).map((p) => (
                          <button
                            key={p.path}
                            type="button"
                            onClick={() =>
                              updateItem(idx, {
                                slug: p.path,
                                label: item.label || p.label,
                                direct: item.direct || p.path.startsWith("/shop") || !p.path.includes("?"),
                              })
                            }
                            className="text-[10px] px-2 py-1 rounded-full border border-champagne/25 text-noir/55 hover:border-champagne hover:text-noir"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!item.direct && (
                    <>
                      <ImageFieldInput
                        label="Featured image (mega-menu side image)"
                        fieldKey="featuredImage"
                        value={item.featuredImage || ""}
                        onChange={(v) => updateItem(idx, { featuredImage: v })}
                        used="cms-layout"
                      />

                      <div className="rounded-2xl border-2 border-dashed border-champagne/40 bg-champagne/5 p-4 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-noir">Sub-links (dropdown)</p>
                            <p className="text-xs text-noir/50 mt-1 max-w-lg">
                              Group sub-links into columns (like Necklaces / Earrings). Each
                              sub-link name opens a collection page on the website.
                            </p>
                          </div>
                          <PrimaryButton
                            type="button"
                            onClick={() =>
                              updateItem(idx, {
                                columns: [
                                  ...(item.columns || []),
                                  { heading: "New group", items: ["New sub-link"] },
                                ],
                              })
                            }
                          >
                            <Plus size={14} /> Add group
                          </PrimaryButton>
                        </div>

                        {(item.columns || []).length === 0 && (
                          <p className="text-sm text-noir/45 italic">
                            No sub-links yet. Click <strong>Add group</strong>, then{" "}
                            <strong>Add sub-link</strong>.
                          </p>
                        )}

                        {(item.columns || []).map((col, cIdx) => (
                          <div
                            key={cIdx}
                            className="rounded-xl border border-champagne/25 bg-white p-4 space-y-3 shadow-sm"
                          >
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="text-[10px] uppercase tracking-widest2 text-champagne-dark shrink-0">
                                Group {cIdx + 1}
                              </span>
                              <input
                                className={`${fieldClass} flex-1 min-w-[140px]`}
                                value={col.heading || ""}
                                onChange={(e) => {
                                  const columns = [...(item.columns || [])];
                                  columns[cIdx] = { ...columns[cIdx], heading: e.target.value };
                                  updateItem(idx, { columns });
                                }}
                                placeholder="Group title — e.g. Necklaces"
                              />
                              <MoveButtons
                                onUp={() =>
                                  updateItem(idx, {
                                    columns: moveItem(item.columns || [], cIdx, -1),
                                  })
                                }
                                onDown={() =>
                                  updateItem(idx, {
                                    columns: moveItem(item.columns || [], cIdx, 1),
                                  })
                                }
                                disableUp={cIdx === 0}
                                disableDown={cIdx === (item.columns || []).length - 1}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateItem(idx, {
                                    columns: (item.columns || []).filter((_, i) => i !== cIdx),
                                  })
                                }
                                className="p-2 text-rose-500/70"
                                title="Remove group"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="pl-0 sm:pl-3 border-l-0 sm:border-l-2 border-champagne/30 space-y-2">
                              <p className="text-[10px] uppercase tracking-widest2 text-noir/45">
                                Sub-links under “{col.heading || "this group"}”
                              </p>
                              <ul className="space-y-2">
                                {(col.items || []).map((linkName, lIdx) => (
                                  <li
                                    key={lIdx}
                                    className="flex gap-2 items-center bg-stone-50 rounded-lg px-2 py-1.5"
                                  >
                                    <Link2 size={14} className="text-champagne-dark shrink-0" />
                                    <input
                                      className={fieldClass}
                                      value={linkName}
                                      onChange={(e) => {
                                        const columns = [...(item.columns || [])];
                                        const items = [...(columns[cIdx].items || [])];
                                        items[lIdx] = e.target.value;
                                        columns[cIdx] = { ...columns[cIdx], items };
                                        updateItem(idx, { columns });
                                      }}
                                      placeholder="Sub-link name — e.g. Polki Chokers"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const columns = [...(item.columns || [])];
                                        columns[cIdx] = {
                                          ...columns[cIdx],
                                          items: (columns[cIdx].items || []).filter(
                                            (_, i) => i !== lIdx
                                          ),
                                        };
                                        updateItem(idx, { columns });
                                      }}
                                      className="p-2 text-rose-500/70"
                                      title="Remove sub-link"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                              {(col.items || []).length === 0 && (
                                <p className="text-xs text-noir/40 italic">
                                  Empty — add a sub-link below.
                                </p>
                              )}
                              <PrimaryButton
                                type="button"
                                onClick={() => {
                                  const columns = [...(item.columns || [])];
                                  columns[cIdx] = {
                                    ...columns[cIdx],
                                    items: [...(columns[cIdx].items || []), ""],
                                  };
                                  updateItem(idx, { columns });
                                }}
                              >
                                <Plus size={14} /> Add sub-link
                              </PrimaryButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {item.direct && (
                    <p className="text-sm text-noir/50 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                      This is a <strong>simple page link</strong> — it has no sub-links. Change Link
                      type to <strong>Dropdown mega-menu</strong> if you want sub-links under it.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** One footer column: heading + rows of Label / URL */
function FooterLinkColumn({
  title,
  headingKey,
  linksKey,
  fields,
  onChangeField,
}) {
  const links = parseLinkLines(fields[linksKey] || "");

  const commit = (next) => onChangeField(linksKey, serializeLinkLines(next));

  return (
    <div className="rounded-2xl border border-champagne/15 bg-white overflow-hidden min-w-0">
      <div className="px-4 py-3 bg-stone-50 border-b border-champagne/10">
        <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">{title}</p>
        <input
          className={`${fieldClass} w-full min-w-0`}
          value={fields[headingKey] ?? ""}
          onChange={(e) => onChangeField(headingKey, e.target.value)}
          placeholder="Column heading"
        />
      </div>
      <div className="p-4 space-y-3">
        {links.length === 0 && (
          <p className="text-xs text-noir/40 italic">No links — click Add link below.</p>
        )}
        {links.map((link, i) => (
          <div
            key={i}
            className="rounded-xl border border-champagne/15 bg-stone-50/80 p-3 space-y-2.5 min-w-0"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0 space-y-2.5">
                <div className="min-w-0">
                  <label className={labelClass}>Link text</label>
                  <input
                    className={`${fieldClass} w-full min-w-0`}
                    value={link.label}
                    onChange={(e) => {
                      const next = [...links];
                      next[i] = { ...next[i], label: e.target.value };
                      commit(next);
                    }}
                    placeholder="e.g. Necklaces"
                  />
                </div>
                <div className="min-w-0">
                  <label className={labelClass}>URL</label>
                  <input
                    className={`${fieldClass} w-full min-w-0`}
                    value={link.path}
                    onChange={(e) => {
                      const next = [...links];
                      next[i] = { ...next[i], path: e.target.value };
                      commit(next);
                    }}
                    placeholder="/shop"
                    list={`footer-pages-${linksKey}`}
                  />
                  <datalist id={`footer-pages-${linksKey}`}>
                    {COMMON_PAGES.map((p) => (
                      <option key={p.path} value={p.path}>
                        {p.label}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5 pt-5 shrink-0">
                <MoveButtons
                  onUp={() => commit(moveItem(links, i, -1))}
                  onDown={() => commit(moveItem(links, i, 1))}
                  disableUp={i === 0}
                  disableDown={i === links.length - 1}
                />
                <button
                  type="button"
                  onClick={() => commit(links.filter((_, j) => j !== i))}
                  className="p-2 text-rose-500/70"
                  aria-label="Remove link"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <PrimaryButton
          type="button"
          onClick={() =>
            commit([...links, { label: "", path: "/shop" }])
          }
        >
          <Plus size={14} /> Add link
        </PrimaryButton>
      </div>
    </div>
  );
}

/** Footer columns + newsletter / copyright — form based */
export function FooterLinksEditor({ fields, onChangeField }) {
  return (
    <div className="p-5 space-y-5">
      <div className="rounded-xl border border-champagne/25 bg-champagne/5 px-4 py-3.5 text-sm text-noir/70">
        <p className="font-medium text-noir mb-1">Footer link columns</p>
        <p className="text-xs sm:text-sm">
          Scroll to the three columns below. In each column use <strong>Add link</strong>, then fill{" "}
          <strong>Link text</strong> (what visitors see) and <strong>URL</strong> (where it goes).
          Newsletter fields are at the bottom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 min-w-0">
        <FooterLinkColumn
          title="Column 1 · Shop links"
          headingKey="shopHeading"
          linksKey="shopLinksText"
          fields={fields}
          onChangeField={onChangeField}
        />
        <FooterLinkColumn
          title="Column 2 · Explore links"
          headingKey="exploreHeading"
          linksKey="exploreLinksText"
          fields={fields}
          onChangeField={onChangeField}
        />
        <FooterLinkColumn
          title="Column 3 · More links"
          headingKey="moreHeading"
          linksKey="moreLinksText"
          fields={fields}
          onChangeField={onChangeField}
        />
      </div>

      <div className="rounded-2xl border border-champagne/15 p-4 sm:p-5 space-y-4">
        <p className="text-sm font-medium text-noir">Newsletter & bottom bar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["benefitsHeading", "Benefits heading"],
            ["joinCta", "Join button text"],
            ["emailPlaceholder", "Email placeholder"],
            ["whatsappText", "WhatsApp button text"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                className={fieldClass}
                value={fields[key] ?? ""}
                onChange={(e) => onChangeField(key, e.target.value)}
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className={labelClass}>Benefits description</label>
            <textarea
              rows={2}
              className={fieldClass}
              value={fields.benefitsText ?? ""}
              onChange={(e) => onChangeField("benefitsText", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Copyright line</label>
            <input
              className={fieldClass}
              value={fields.copyright ?? ""}
              onChange={(e) => onChangeField("copyright", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
