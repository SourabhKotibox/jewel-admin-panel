import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../api/client";

function productKey(productOrId) {
  if (productOrId == null) return "";
  if (typeof productOrId === "object") {
    return String(productOrId.id || productOrId.sku || productOrId._id || "");
  }
  return String(productOrId);
}

function snapshot(product) {
  const id = productKey(product);
  return {
    ...product,
    id,
    productId: id,
    slug: product.slug || product.sku || id,
  };
}

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      synced: false,

      toggleItem: (product) => {
        const id = productKey(product);
        if (!id) return;
        set((state) => {
          const exists = state.items.some((i) => productKey(i) === id);
          if (exists) {
            return { items: state.items.filter((i) => productKey(i) !== id) };
          }
          return { items: [...state.items, snapshot(product)] };
        });
        get().persistRemote?.();
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => productKey(i) !== productKey(id)),
        }));
        get().persistRemote?.();
      },

      isWishlisted: (id) =>
        get().items.some((i) => productKey(i) === productKey(id)),

      clear: () => set({ items: [], synced: false }),

      /** Merge local + server after login */
      syncFromServer: async () => {
        try {
          const local = get().items;
          const res = await api("/wishlist", {
            method: "PUT",
            body: { items: local, merge: true },
            portal: "user",
          });
          set({ items: (res.items || []).map(snapshot), synced: true });
        } catch {
          /* stay local if offline / not logged in */
        }
      },

      persistRemote: async () => {
        try {
          const token = localStorage.getItem("madhu_user_token");
          if (!token) return;
          await api("/wishlist", {
            method: "PUT",
            body: { items: get().items, merge: false },
            portal: "user",
          });
        } catch {
          /* ignore */
        }
      },
    }),
    { name: "madhu-wishlist-v2" }
  )
);

export default useWishlistStore;
