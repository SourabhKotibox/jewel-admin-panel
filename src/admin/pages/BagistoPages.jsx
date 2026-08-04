import CrudPage from "../components/CrudPage";
import InvoicesPage from "./InvoicesPage";

export function Invoices() {
  return <InvoicesPage />;
}

export function Shipments() {
  return <CrudPage entityKey="shipments" />;
}

export function Refunds() {
  return <CrudPage entityKey="refunds" />;
}

export function Transactions() {
  return <CrudPage entityKey="transactions" />;
}

export function Attributes() {
  return <CrudPage entityKey="attributes" />;
}

export function Inventory() {
  return <CrudPage entityKey="inventory" />;
}

export function Coupons() {
  return <CrudPage entityKey="coupons" />;
}

export function Campaigns() {
  return <CrudPage entityKey="campaigns" />;
}

export function Reviews() {
  return <CrudPage entityKey="reviews" />;
}

export function Newsletter() {
  return <CrudPage entityKey="newsletter" />;
}

export function StaticPages() {
  return <CrudPage entityKey="cms-pages" />;
}

export function AdminUsers() {
  return <CrudPage entityKey="users" />;
}
