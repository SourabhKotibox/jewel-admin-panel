import { Palette } from "lucide-react";
import CrudPage from "../components/CrudPage";
import { AdminCard } from "../components/AdminUI";

export function DynamicPages() {
  return <CrudPage entityKey="dynamic-pages" />;
}

export function MediaLibrary() {
  return <CrudPage entityKey="media" />;
}

export function Themes() {
  return (
    <div className="animate-fade-up space-y-6 max-w-2xl">
      <AdminCard title="Active theme" subtitle="Storefront look & feel">
        <div className="p-8 text-center">
          <Palette size={40} className="text-champagne mx-auto mb-3" />
          <p className="font-display text-2xl text-noir">Noir & Champagne</p>
          <p className="text-sm text-noir/50 mt-2 leading-relaxed">
            Brand colours, fonts and section copy are edited under{" "}
            <strong className="text-noir/70">CMS → Page Content</strong> and{" "}
            <strong className="text-noir/70">Business Settings</strong> (logos). There is no
            separate theme switcher database — this brand theme is applied site-wide via CSS.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}

export function FaqsAdmin() {
  return <CrudPage entityKey="faqs" />;
}

export function BlogAdmin() {
  return <CrudPage entityKey="blog" />;
}

export function Taxes() {
  return <CrudPage entityKey="taxes" />;
}

export function Roles() {
  return <CrudPage entityKey="roles" />;
}
