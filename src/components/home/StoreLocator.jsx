import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import { stores } from "../../data/stores";
import { IMG } from "../../data/images";
import SectionHeading from "../ui/SectionHeading";

export default function StoreLocator() {
  return (
    <section className="container-luxe py-16 md:py-20">
      <SectionHeading
        eyebrow="Visit Us"
        title="Come Visit Our Stores"
        action={<Link to="/stores" className="link-underline text-sm">View all</Link>}
      />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map((store, i) => (
          <div key={store.city} className="group">
            <div className="aspect-[4/3] overflow-hidden rounded-sm">
              <img
                src={IMG.store[i % IMG.store.length]}
                alt={store.city}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h4 className="mt-3.5 font-display text-lg text-noir">{store.city}, {store.state}</h4>
            <p className="text-xs text-noir/60 mt-1.5 flex items-start gap-1.5">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" /> {store.address}
            </p>
            <p className="text-xs text-noir/45 mt-1.5">{store.hours}</p>
            <div className="flex items-center gap-4 mt-3">
              <a href={`tel:${store.phone}`} className="text-xs flex items-center gap-1 text-champagne-dark font-medium">
                <Phone size={13} /> {store.phone}
              </a>
              <a href={store.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs link-underline text-noir/70">
                View on Map
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}