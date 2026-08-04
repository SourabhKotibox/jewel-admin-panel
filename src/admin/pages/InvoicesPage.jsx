import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import CrudPage from "../components/CrudPage";
import { api } from "../../api/client";
import { exportInvoicePdf } from "../../utils/pdfExport";
import useSettingsStore from "../../store/useSettingsStore";
import notify from "../../utils/toast";
import { OutlineButton } from "../components/AdminUI";

/** Invoices list + download full PDF using linked order details */
export default function InvoicesPage() {
  const business = useSettingsStore((s) => s.business);
  const commerce = useSettingsStore((s) => s.commerce);
  const [busy, setBusy] = useState(false);

  const downloadAllRecent = async () => {
    setBusy(true);
    try {
      const [invs, orders] = await Promise.all([
        api("/invoices", { portal: "admin" }),
        api("/orders", { portal: "admin" }),
      ]);
      const orderMap = Object.fromEntries(
        (Array.isArray(orders) ? orders : []).map((o) => [o.orderNumber || o.id, o])
      );
      const list = Array.isArray(invs) ? invs.slice(0, 5) : [];
      if (!list.length) {
        notify.info("No invoices to export");
        return;
      }
      for (const inv of list) {
        const order = orderMap[inv.orderId] || {
          orderNumber: inv.orderId,
          customer: inv.customer,
          total: inv.amount,
          date: inv.date,
          status: inv.status,
          items: [],
        };
        exportInvoicePdf(order, { business, commerce, invoice: inv });
      }
      notify.success(`Downloaded ${list.length} invoice PDF(s)`);
    } catch (err) {
      notify.error(err.message || "Export failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // noop — CrudPage loads list
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-noir/50">
          Invoices are created automatically on each sale. Open an order for a single PDF, or
          export the latest invoices below.
        </p>
        <OutlineButton type="button" onClick={downloadAllRecent} disabled={busy}>
          <FileDown size={14} />
          {busy ? "Exporting…" : "PDF · latest 5 invoices"}
        </OutlineButton>
      </div>
      <CrudPage entityKey="invoices" />
    </div>
  );
}
