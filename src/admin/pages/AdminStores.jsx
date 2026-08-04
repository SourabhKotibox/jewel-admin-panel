import { Link } from "react-router-dom";
import CrudPage from "../components/CrudPage";

export default function AdminStores() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-champagne/20 bg-champagne/5 px-5 py-4 text-sm text-noir/70">
        <p className="font-medium text-noir mb-1">Manage boutique locations here</p>
        <p>
          Use <strong>Add Store</strong> to create a new boutique, the pencil icon to edit, or the
          trash icon to remove. Removals delete the store from the database and it disappears from
          the live <code className="text-[11px]">/stores</code> page. Page headings and CTA copy are
          edited under{" "}
          <Link to="/admin/page-content" className="text-champagne-dark underline">
            CMS → Page Content → Stores
          </Link>
          .
        </p>
      </div>
      <CrudPage entityKey="stores" />
    </div>
  );
}
