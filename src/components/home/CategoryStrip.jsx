import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IMG } from "../../data/images";

const categories = [
  { name: "Necklaces", slug: "all-necklaces", img: IMG.catNecklace },
  { name: "Earrings", slug: "polki-earrings", img: IMG.catEarrings },
  { name: "Bracelets", slug: "bracelets-for-women", img: IMG.catBracelet },
  { name: "Accessories", slug: "polki-accessories", img: IMG.catAccessory },
  { name: "Sets", slug: "polki-diamond-jewellery-sets", img: IMG.catSets },
];

export default function CategoryStrip() {
  return (
    <section className="container-luxe py-16 md:py-20">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <p className="eyebrow mb-2">Shop by Category</p>
          <h2 className="heading-display text-3xl md:text-4xl text-noir">Handcrafted For You</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link to={"/shop"} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/0 to-transparent" />
                <span className="absolute bottom-4 left-0 right-0 text-center text-ivory text-xs md:text-sm uppercase tracking-widest2">
                  {cat.name}
                </span>
                <div className="absolute inset-0 border border-champagne/0 group-hover:border-champagne/60 transition-colors duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}