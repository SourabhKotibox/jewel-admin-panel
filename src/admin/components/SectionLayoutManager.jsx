import { Plus, Eye, EyeOff, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  BUILTIN_HOME_SECTIONS,
  createCustomSection,
  normalizeSectionLayout,
} from "../data/homeCmsFields";
import { OutlineButton, PrimaryButton, fieldClass, labelClass } from "./AdminUI";
import ImageFieldInput from "./ImageFieldInput";

/**
 * Manage page section visibility (hide = soft remove), order, and custom blocks.
 * Works for Home and About via builtinSections / normalize / createCustom props.
 */
export default function SectionLayoutManager({
  layout,
  onChange,
  builtinSections = BUILTIN_HOME_SECTIONS,
  normalize = normalizeSectionLayout,
  createCustom = createCustomSection,
}) {
  const L = normalize(layout);
  const hiddenSet = new Set(L.hidden);
  const customMap = Object.fromEntries(L.customSections.map((c) => [c.id, c]));
  const builtinIds = new Set(builtinSections.map((s) => s.id));

  const patch = (next) => onChange(normalize({ ...L, ...next }));

  const hideBuiltin = (id) => {
    if (!hiddenSet.has(id)) patch({ hidden: [...L.hidden, id] });
  };

  const showBuiltin = (id) => {
    patch({ hidden: L.hidden.filter((x) => x !== id) });
  };

  const move = (id, dir) => {
    const order = [...L.order];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    patch({ order });
  };

  const addCustom = () => {
    const section = createCustom({
      title: `New Section ${L.customSections.length + 1}`,
    });
    patch({
      customSections: [...L.customSections, section],
      order: [...L.order, section.id],
    });
  };

  const updateCustom = (id, fields) => {
    patch({
      customSections: L.customSections.map((c) =>
        c.id === id ? { ...c, ...fields } : c
      ),
    });
  };

  const removeCustom = (id) => {
    patch({
      customSections: L.customSections.filter((c) => c.id !== id),
      order: L.order.filter((x) => x !== id),
    });
  };

  const restoreAll = () => patch({ hidden: [] });

  const labelFor = (id) => {
    if (customMap[id]) return customMap[id].title || "Custom section";
    return builtinSections.find((s) => s.id === id)?.label || id;
  };

  const isBuiltin = (id) => builtinIds.has(id);

  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <p className="text-sm text-noir/55 max-w-xl">
          Hide a built-in section to remove it from the live home page — content stays saved
          and you can show it again anytime. Add a <strong>custom section</strong> for new
          blocks.
        </p>
        <div className="flex flex-wrap gap-2 shrink-0">
          {L.hidden.length > 0 && (
            <OutlineButton type="button" onClick={restoreAll} className="!py-2 !px-3">
              <Eye size={14} /> Show all hidden
            </OutlineButton>
          )}
          <PrimaryButton type="button" onClick={addCustom} className="!py-2 !px-3">
            <Plus size={14} /> Add section
          </PrimaryButton>
        </div>
      </div>

      <ul className="space-y-2">
        {L.order.map((id, idx) => {
          const builtin = isBuiltin(id);
          const custom = customMap[id];
          const isHidden = builtin ? hiddenSet.has(id) : custom?.enabled === false;

          return (
            <li
              key={id}
              className={`border rounded-xl overflow-hidden ${
                isHidden
                  ? "border-stone-200 bg-stone-50/80 opacity-80"
                  : "border-champagne/20 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3">
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => move(id, -1)}
                    className="p-1.5 rounded-lg text-noir/35 hover:text-noir hover:bg-stone-100 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === L.order.length - 1}
                    onClick={() => move(id, 1)}
                    className="p-1.5 rounded-lg text-noir/35 hover:text-noir hover:bg-stone-100 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-noir truncate">
                    {labelFor(id)}
                    {isHidden && (
                      <span className="ml-2 text-[10px] uppercase tracking-widest2 text-noir/40 font-normal">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] font-mono text-noir/35 truncate">
                    {builtin ? "Built-in" : "Custom"} · {id}
                  </p>
                </div>

                {builtin ? (
                  isHidden ? (
                    <OutlineButton
                      type="button"
                      className="!py-1.5 !px-3"
                      onClick={() => showBuiltin(id)}
                    >
                      <Eye size={14} /> Show
                    </OutlineButton>
                  ) : (
                    <OutlineButton
                      type="button"
                      className="!py-1.5 !px-3"
                      onClick={() => hideBuiltin(id)}
                    >
                      <EyeOff size={14} /> Hide
                    </OutlineButton>
                  )
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <OutlineButton
                      type="button"
                      className="!py-1.5 !px-3"
                      onClick={() =>
                        updateCustom(id, { enabled: custom?.enabled === false })
                      }
                    >
                      {custom?.enabled === false ? (
                        <>
                          <Eye size={14} /> Show
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} /> Hide
                        </>
                      )}
                    </OutlineButton>
                    <OutlineButton
                      type="button"
                      className="!py-1.5 !px-3 !text-rose-600 !border-rose-200 hover:!border-rose-400"
                      onClick={() => removeCustom(id)}
                    >
                      <Trash2 size={14} /> Delete
                    </OutlineButton>
                  </div>
                )}
              </div>

              {custom && (
                <div className="px-4 pb-4 pt-1 border-t border-champagne/10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50/40">
                  <div>
                    <label className={labelClass}>Eyebrow</label>
                    <input
                      className={fieldClass}
                      value={custom.eyebrow || ""}
                      onChange={(e) => updateCustom(id, { eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={fieldClass}
                      value={custom.title || ""}
                      onChange={(e) => updateCustom(id, { title: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Body</label>
                    <textarea
                      rows={3}
                      className={fieldClass}
                      value={custom.body || ""}
                      onChange={(e) => updateCustom(id, { body: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CTA label</label>
                    <input
                      className={fieldClass}
                      value={custom.cta || ""}
                      onChange={(e) => updateCustom(id, { cta: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CTA link</label>
                    <input
                      className={fieldClass}
                      value={custom.ctaLink || ""}
                      onChange={(e) => updateCustom(id, { ctaLink: e.target.value })}
                    />
                  </div>
                  <ImageFieldInput
                    label="Section image"
                    fieldKey={`${id}-image`}
                    value={custom.image || ""}
                    onChange={(v) => updateCustom(id, { image: v })}
                    used="cms-home-custom"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
