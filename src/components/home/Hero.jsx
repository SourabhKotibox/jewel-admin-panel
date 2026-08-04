import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMG } from "../../data/images";

export default function Hero() {
  return (
    <section className="relative w-full bg-noir overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[92vh]">
        {/* Text column */}
        <div className="relative flex flex-col justify-center px-6 md:px-14 lg:px-16 py-16 md:py-24 order-2 lg:order-1">
          <div className="grain-overlay" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-5"
          >
            The Madhu Bridal Trunk Show
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] text-ivory leading-[1.05] max-w-xl"          >
            Heritage,
            <br />
            <span className="text-champagne-light">Reimagined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-ivory/60 mt-6 max-w-md text-[15px] leading-relaxed"
          >
            A travelling showcase of our most exclusive handcrafted bridal
            creations — rare Polki masterpieces available only during the
            Trunk Show.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10"          >
            <Link to="/shop?bridal=1" className="btn-gold">
              Explore the Show
            </Link>
            <Link
              to="/shop"
              className="group flex items-center gap-2 text-ivory text-sm uppercase tracking-widest2"
            >
              Shop All
              <ArrowRight size={16} className="text-champagne group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-6 sm:gap-10 mt-12 md:mt-16 pt-8 border-t border-champagne/15"
          >
            {[
              ["12+", "Stores in India"],
              ["2000+", "Unique Designs"],
              ["100K+", "Units Sold"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="heading-display text-2xl text-champagne-light">{num}</p>
                <p className="text-[11px] uppercase tracking-wide text-ivory/40 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image column */}
        <div className="relative order-1 lg:order-2 min-h-[50vh] lg:min-h-full overflow-hidden">
          <motion.img
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={IMG.heroBridal}
            alt="Madhu bridal jewellery"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-noir/10 lg:via-transparent lg:to-transparent" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-champagne/60 hidden lg:block" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-champagne/60 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}