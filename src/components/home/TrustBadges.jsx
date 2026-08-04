import { ShieldCheck, RefreshCcw, Truck, Store, Globe, Award } from "lucide-react";
import { trustBadges } from "../../data/testimonials";

const icons = [ShieldCheck, RefreshCcw, Truck, Store, Globe, Award];

export default function TrustBadges() {
  return (
    <section className="bg-stone-50 border-y border-champagne/15">
      <div className="container-luxe py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
        {trustBadges.map((badge, i) => {
          const Icon = icons[i];
          return (
            <div key={badge.title} className="flex flex-col items-center text-center gap-2">
              <Icon size={28} className="text-champagne-dark" strokeWidth={1.5} />
              <p className="text-sm font-medium text-noir">{badge.title}</p>
              <p className="text-xs text-noir/50">{badge.subtitle}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}