import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { navMenu } from "../../data/categories";
import logo from "../../assets/images/logo.png";

export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir/50 z-[70]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-ivory z-[80] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-champagne/20">
              <img src={logo} alt="Madhu logo" className="h-12 w-auto object-contain" />
              <button onClick={onClose}><X size={22} /></button>
            </div>
            <div className="p-5 space-y-1">
              {navMenu.map((menu) => (
                <div key={menu.label} className="border-b border-champagne/10">
                  <button
                    className="w-full flex items-center justify-between py-4 text-sm uppercase tracking-wide"
                    onClick={() =>
                      menu.direct
                        ? navigate(menu.slug)
                        : setExpanded(expanded === menu.label ? null : menu.label)
                    }
                  >
                    {menu.label}
                    {!menu.direct && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${expanded === menu.label ? "rotate-90" : ""}`}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {expanded === menu.label && menu.columns && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 pb-3"
                      >
                        {menu.columns.map((col) => (
                          <div key={col.heading} className="mb-3">
                            <p className="text-xs font-semibold text-champagne-dark mb-1.5">{col.heading}</p>
                            {col.items.map((item) => (
                              <Link
                                key={item}
                                to={"/shop"}
                                onClick={onClose}
                                className="block text-sm text-noir/70 py-1.5"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}