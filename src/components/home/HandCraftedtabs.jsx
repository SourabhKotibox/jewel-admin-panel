import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IMG } from "../../data/images";
import SectionHeading from "../ui/SectionHeading";

const tabs = {
  Necklaces: {
    img: IMG.handcraftedNecklace,
    links: [
      { name: "U Necklaces", slug: "u-necklaces" },
      { name: "Chokers", slug: "chokers" },
      { name: "Long Necklaces", slug: "long-necklaces" },
    ],
  },
  Earrings: {
    img: IMG.handcraftedEarring,
    links: [
      { name: "Polki Chandbalis", slug: "polki-chandbali-earrings" },
      { name: "Tops", slug: "tops" },
      { name: "Long Earrings", slug: "long-earrings" },
    ],
  },
  Minimals: {
    img: IMG.handcraftedMinimal,
    links: [
      { name: "Minimal Pendants", slug: "minimal-pendant" },
      { name: "Minimal Rings", slug: "minimal-rings-1" },
      { name: "Minimal Earrings", slug: "minimals-earring" },
    ],
  },
};

export default function HandcraftedTabs() {
  const [active, setActive] = useState("Necklaces");

  return (
    <section className="container-luxe py-16 md:py-20">
      <SectionHeading eyebrow="Curated Edit" title="Handcrafted For You" center />

      <div className="flex justify-center gap-5 sm:gap-8 md:gap-12 mt-10 border-b border-champagne/20 px-4 overflow-x-auto">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative pb-4 text-xs sm:text-sm uppercase tracking-widest2 whitespace-nowrap transition-colors${
              active === tab ? "text-noir" : "text-noir/40"
            }`}
          >
            {tab}
            {active === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="grid md:grid-cols-2 gap-8 mt-10 items-center"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img src={tabs[active].img} alt={active} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {tabs[active].links.map((l) => (
              <Link
                key={l.slug}
                to={"/shop"}
                className="flex items-center justify-between border-b border-champagne/15 pb-4 group"
              >
                <span className="heading-display text-xl text-noir group-hover:text-champagne-dark transition-colors">
                  {l.name}
                </span>
                <span className="text-champagne-dark text-sm">→</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}