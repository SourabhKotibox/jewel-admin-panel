import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MegaMenu({ menu }) {
  if (!menu.columns) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-0 top-full w-full bg-ivory border-t border-champagne/20 shadow-2xl"
    >
      <div className="container-luxe grid grid-cols-4 gap-10 py-10">
        <div className="col-span-3 grid grid-cols-3 gap-10">
          {menu.columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-noir font-display text-lg mb-4 pb-2 border-b border-champagne/30">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item}>
                    <Link
                      to={"/shop"}
                      className="text-sm text-noir/70 hover:text-champagne-dark transition-colors link-underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link to={"/shop"} className="relative group overflow-hidden rounded-sm">
          <div className="w-full h-56 bg-stone-200 shimmer-bg flex items-center justify-center">
            <span className="eyebrow z-10">{menu.label}</span>
          </div>
          <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/10 transition-colors" />
        </Link>
      </div>
    </motion.div>
  );
}