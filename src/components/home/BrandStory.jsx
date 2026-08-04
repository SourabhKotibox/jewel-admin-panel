import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IMG } from "../../data/images";

export default function BrandStory() {
  return (
    <section className="relative bg-noir py-24 md:py-32 overflow-hidden">
      <div className="grain-overlay" />
      <img
        src={IMG.brandStory}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-noir via-noir/70 to-noir" />

      <div className="container-luxe relative text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow mb-4"
        >
          A New Chapter
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="heading-display text-4xl md:text-6xl text-ivory max-w-3xl mx-auto leading-tight"
        >
          Reinventing <span className="text-champagne-light">Tradition</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-ivory/60 max-w-lg mx-auto mt-6 text-sm md:text-base leading-relaxed"
        >
          A bold new chapter in the brand's journey — a campaign that redefines
          the face of fine jewellery by celebrating individuality as the
          rarest form of luxury.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10"
        >
          {[
            ["Necklaces", "all-necklaces"],
            ["Earrings", "all-earrings-1"],
            ["Accessories", "polki-diamond-accessories"],
          ].map(([label, slug]) => (
            <Link
              key={slug}
              to={"/shop"}
              className="text-ivory text-sm uppercase tracking-widest2 border-b border-champagne/40 pb-1 hover:text-champagne-light hover:border-champagne transition-colors"
            >
              {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}