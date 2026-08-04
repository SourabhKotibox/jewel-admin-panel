import { create } from "zustand";
import { api, ENTITY_API } from "../../api/client";
import { entityConfigs } from "../data/entityConfigs.jsx";

function initRows() {
  // Start empty — CrudPage always fetches from API. Seed is only for offline demos / schema hints.
  const map = {};
  Object.keys(entityConfigs).forEach((key) => {
    map[key] = [];
  });
  return map;
}

function normalizeList(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({
    ...r,
    id: String(r.id || r._id || r.sku || r.code || r.invoiceNumber || r.orderNumber),
  }));
}

/** Map UI role labels → API roles */
function mapStaffRole(role) {
  const map = {
    "Super Admin": "superadmin",
    "Store Manager": "manager",
    Sales: "sales",
    "Content Editor": "editor",
  };
  return map[role] || role;
}

const useCrudStore = create((set, get) => ({
  entities: initRows(),
  loading: {},
  error: null,
  hydrated: {},

  getRows: (key) => get().entities[key] || [],

  getById: (key, id) =>
    (get().entities[key] || []).find((r) => String(r.id) === String(id)),

  setRows: (key, rows) =>
    set((s) => ({
      entities: { ...s.entities, [key]: normalizeList(rows) },
      hydrated: { ...s.hydrated, [key]: true },
    })),

  fetchEntity: async (key) => {
    const path = ENTITY_API[key];
    if (!path) return get().entities[key] || [];
    set((s) => ({ loading: { ...s.loading, [key]: true }, error: null }));
    try {
      const data = await api(path, { portal: "admin" });
      const rows = normalizeList(data);
      set((s) => ({
        entities: { ...s.entities, [key]: rows },
        loading: { ...s.loading, [key]: false },
        hydrated: { ...s.hydrated, [key]: true },
      }));
      return rows;
    } catch (err) {
      // Never fall back to seed/demo rows for API-backed modules — that looked "static"
      set((s) => ({
        entities: {
          ...s.entities,
          [key]: [],
        },
        loading: { ...s.loading, [key]: false },
        error: err.message,
        hydrated: { ...s.hydrated, [key]: false },
      }));
      return [];
    }
  },

  upsert: async (key, id, data) => {
    const path = ENTITY_API[key];
    const isNew = id === "new" || !get().getById(key, id);
    let payload = { ...data };
    if (key === "taxes") {
      if (payload.rateValue === "" || payload.rateValue == null) {
        const m = String(payload.rate || "").match(/([\d.]+)/);
        payload.rateValue = m ? Number(m[1]) : 0;
      } else {
        payload.rateValue = Number(payload.rateValue) || 0;
      }
      if (!payload.rate && payload.rateValue != null) {
        payload.rate = `${payload.rateValue}%`;
      }
      payload.priority = Number(payload.priority) || 10;
      payload.inclusive = payload.inclusive === true || payload.inclusive === "true";
      if (payload.type === "Zero") {
        payload.rateValue = 0;
        payload.rate = payload.rate || "0%";
      }
    }
    if (key === "users") {
      payload = {
        ...payload,
        role: mapStaffRole(payload.role),
        isActive: payload.status !== "Draft",
      };
      if (!payload.password) delete payload.password;
    }

    try {
      if (path) {
        let saved;
        if (key === "users" && isNew) {
          saved = (
            await api("/auth/admin/register", {
              method: "POST",
              body: payload,
              portal: "admin",
            })
          ).user;
        } else if (isNew) {
          saved = await api(path, { method: "POST", body: payload, portal: "admin" });
        } else if (key === "users") {
          saved = (
            await api(`/auth/admin/users/${id}`, {
              method: "PUT",
              body: payload,
              portal: "admin",
            })
          ).user;
        } else {
          saved = await api(`${path}/${id}`, {
            method: "PUT",
            body: payload,
            portal: "admin",
          });
        }
        const row = { ...saved, id: String(saved.id || saved._id || id) };
        set((s) => {
          const rows = s.entities[key] || [];
          if (isNew) {
            return { entities: { ...s.entities, [key]: [row, ...rows] } };
          }
          return {
            entities: {
              ...s.entities,
              [key]: rows.map((r) => (String(r.id) === String(id) ? { ...r, ...row } : r)),
            },
          };
        });
        return row;
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }

    // offline local fallback
    set((s) => {
      const rows = s.entities[key] || [];
      const cfg = entityConfigs[key];
      if (isNew) {
        const newId = data.id || `${cfg?.idPrefix || key}-${Date.now()}`;
        return {
          entities: {
            ...s.entities,
            [key]: [{ ...data, id: newId }, ...rows],
          },
        };
      }
      return {
        entities: {
          ...s.entities,
          [key]: rows.map((r) =>
            String(r.id) === String(id) ? { ...r, ...data, id: r.id } : r
          ),
        },
      };
    });
  },

  remove: async (key, id) => {
    const path = ENTITY_API[key];
    try {
      if (path) {
        if (key === "users") {
          await api(`/auth/admin/users/${id}`, { method: "DELETE", portal: "admin" });
        } else {
          await api(`${path}/${id}`, { method: "DELETE", portal: "admin" });
        }
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
    set((s) => ({
      entities: {
        ...s.entities,
        [key]: (s.entities[key] || []).filter((r) => String(r.id) !== String(id)),
      },
    }));
  },
}));

export default useCrudStore;
