import { useCallback } from "react";
import CrudPage from "../components/CrudPage";
import { api } from "../../api/client";
import useCrudStore from "../store/useCrudStore";
import notify from "../../utils/toast";

export default function Categories() {
  const toggleHidden = useCallback(async (row, entityKey) => {
    try {
      const updated = await api(`/${entityKey}/${row.id}/hidden`, {
        method: "PATCH",
        portal: "admin",
      });
      const rows = useCrudStore.getState().getRows(entityKey).map((r) =>
        String(r.id) === String(row.id) ? { ...r, ...updated } : r
      );
      useCrudStore.getState().setRows(entityKey, rows);
      notify.success(updated.hidden ? "Category hidden from storefront" : "Category visible on storefront");
    } catch (err) {
      notify.error(err.message || "Failed to update visibility");
    }
  }, []);

  return <CrudPage entityKey="categories" extraActions={toggleHidden} />;
}
