import { useCallback } from "react";
import CrudPage from "../components/CrudPage";
import { api } from "../../api/client";
import useCrudStore from "../store/useCrudStore";
import notify from "../../utils/toast";
import { Eye, EyeOff } from "lucide-react";

export default function Categories() {
  const toggleHidden = useCallback((row, entityKey) => {
    const handleClick = async () => {
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
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-xl ${
          row.hidden
            ? "text-champagne-dark hover:bg-champagne/10"
            : "text-noir/40 hover:text-noir hover:bg-stone-100"
        }`}
        title={row.hidden ? "Unhide from storefront" : "Hide from storefront"}
      >
        {row.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    );
  }, []);

  return <CrudPage entityKey="categories" extraActions={toggleHidden} />;
}
