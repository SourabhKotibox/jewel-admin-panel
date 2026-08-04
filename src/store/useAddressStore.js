import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, getToken } from "../api/client";

const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [],
      syncing: false,

      /** Pull from API when logged in; keep local otherwise */
      syncFromApi: async () => {
        if (!getToken("user")) return;
        set({ syncing: true });
        try {
          const rows = await api("/addresses", { portal: "user" });
          if (Array.isArray(rows)) {
            set({
              addresses: rows.map((a) => ({
                id: a.id || a._id,
                label: a.label || "Home",
                name: a.name || "",
                phone: a.phone || "",
                line1: a.line1 || "",
                line2: a.line2 || "",
                city: a.city || "",
                state: a.state || "",
                pinCode: a.pinCode || "",
                isDefault: !!a.isDefault,
              })),
            });
          }
        } catch {
          /* keep local */
        } finally {
          set({ syncing: false });
        }
      },

      addAddress: async (addr) => {
        const localId = `addr-${Date.now()}`;
        const makeDefault = get().addresses.length === 0 || !!addr.isDefault;
        const row = {
          id: localId,
          label: addr.label || "Home",
          name: addr.name || "",
          phone: addr.phone || "",
          line1: addr.line1 || "",
          line2: addr.line2 || "",
          city: addr.city || "",
          state: addr.state || "",
          pinCode: addr.pinCode || "",
          isDefault: makeDefault,
        };

        if (getToken("user")) {
          try {
            const saved = await api("/addresses", {
              method: "POST",
              body: row,
              portal: "user",
            });
            row.id = saved.id || saved._id || localId;
            row.isDefault = !!saved.isDefault;
            await get().syncFromApi();
            return row.id;
          } catch {
            /* fall through to local */
          }
        }

        set((state) => ({
          addresses: [
            ...state.addresses.map((a) =>
              makeDefault ? { ...a, isDefault: false } : a
            ),
            row,
          ],
        }));
        return localId;
      },

      updateAddress: async (id, patch) => {
        if (getToken("user") && !String(id).startsWith("addr-")) {
          try {
            await api(`/addresses/${id}`, {
              method: "PUT",
              body: patch,
              portal: "user",
            });
            await get().syncFromApi();
            return;
          } catch {
            /* local */
          }
        }
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        }));
      },

      removeAddress: async (id) => {
        if (getToken("user") && !String(id).startsWith("addr-")) {
          try {
            await api(`/addresses/${id}`, { method: "DELETE", portal: "user" });
            await get().syncFromApi();
            return;
          } catch {
            /* local */
          }
        }
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      setDefault: async (id) => {
        if (getToken("user") && !String(id).startsWith("addr-")) {
          try {
            await api(`/addresses/${id}/default`, {
              method: "PUT",
              body: {},
              portal: "user",
            });
            await get().syncFromApi();
            return;
          } catch {
            /* local */
          }
        }
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },

      getDefault: () => get().addresses.find((a) => a.isDefault) || get().addresses[0],
    }),
    { name: "madhu-addresses-v2" }
  )
);

export default useAddressStore;
